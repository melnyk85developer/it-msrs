import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UsersRepository } from '../users-infrastructure/users.repository';
import { User } from '../users-domain/user.entity';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { EmailService } from 'src/modules/notifications/email.service';
import { CryptoService } from './crypto.service';
import type { UserModelType } from '../users-domain/user.entity';
import * as uuid from 'uuid';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';
import { CreateUserDto, UpdateUserDto } from '../users-dto/create-user.dto';
import { ConfirmationRepository } from 'src/modules/confirmationsCodes/confirmations-infrastructure/confirmationRepository';
import { resetPasswordEmailMessageHTMLDocument } from 'src/modules/notifications/service/resetPassword/resetPasswordEmailMessage.HTML';
import { ConfirmationsCodesService } from 'src/modules/confirmationsCodes/confirmations-application/confirmations.service';
import { IsBlockedEmailResendingService } from 'src/core/utils/blocked-utilite';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private UserModel: UserModelType,
        private usersRepository: UsersRepository,
        private confirmationsCodesService: ConfirmationsCodesService,
        private confirmationRepository: ConfirmationRepository,
        private isBlockedEmailResendingService: IsBlockedEmailResendingService,
        private cryptoService: CryptoService,
        private emailService: EmailService,
    ) { }

    async createUserService(dto: Omit<CreateUserDto, 'createdAt' | 'updatedAt' | 'deletedAt'>, avatar: string | null): Promise<string | number> {
        const { email, login, password } = dto
        let role: any
        let isBot: boolean
        // console.log('createUserService - email, login, password 😡 avatar', email, login, password, avatar) 
        const isLogin = await this.usersRepository.findByLoginOrEmail(login)
        if (isLogin) {
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_TНE_LOGIN_ALREADY_EXISTS);
        }
        const isEmail = await this.usersRepository.findByLoginOrEmail(email)
        if (isEmail) {
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_TНE_EMAIL_ALREADY_EXISTS)
        }
        const passwordHash = await this.cryptoService.createPasswordHash(password);
        const isUsers = await this.usersRepository.findAllUsers()
        if (!isUsers.length) {
            role = { value: "ADMIN", description: "Администратор" }
        } else {
            role = { value: "USER", description: "Пользователь" }
        }
        if (dto.isBot) {
            isBot = dto.isBot
        } else {
            isBot = false
        }
        const user = await this.UserModel.createUserInstance({
            ...dto,
            avatar: avatar ? avatar : null,
            passwordHash,
            role,
            isBot: isBot
        });
        // console.log('createUserService - user 😡 ', user)
        await this.usersRepository.save(user);
        // console.log('createUserService - user 😡 ', user)
        return user._id.toString();
    }
    async updateUserService(id: string, dto: Omit<UpdateUserDto, 'deletedAt' | 'updatedAt'>): Promise<string> {
        // console.log('UsersService: updateUserService - id, dto 😡 ', id, dto)
        const user = await this.usersRepository.findUserByIdOrNotFoundFail(id);
        // console.log('UsersService: updateUserService - user1 😡 ', user)
        user.updateAccountData(id, dto);
        // console.log('UsersService: updateUserService - user2 😡 ', user)
        await this.usersRepository.save(user);
        // console.log('UsersService: updateUserService - user3 😡 ', user)
        return user._id.toString();
    }
    async updateLastSeenUserService(userId: string): Promise<string> {
        const user = await this.usersRepository.findUserByIdOrNotFoundFail(userId);

        const isUpdate = this.UserModel.updateLastSeen(userId);

        await this.usersRepository.save(user);
        return user._id.toString();
    }
    async deleteUserService(id: string) {
        const user = await this.usersRepository.findUserByIdOrNotFoundFail(id);
        // console.log('UsersService: deleteUserService - user 😡 ', user)
        user.makeDeletedAccount();
        await this.usersRepository.save(user);
    }
    async makeUpdatedConfirmedAccount(userId: string): Promise<any> {
        const user = await this.usersRepository.findUserByIdOrNotFoundFail(userId);
        const updateConfirmedStatusUser = await this.UserModel.makeUpdatedConfirmedAccount(userId)
        await this.usersRepository.save(user);
        return updateConfirmedStatusUser
    }
    async ressetPasswordService(email: any): Promise<{ done: boolean, data: string | null, code: number, serviceMessage: string }> {
        const confirmationCode = uuid.v4();
        const date = new Date().toISOString()
        const getUser = await this._getUserByEmailService(email);
        if (!getUser) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_USER)
        }
        await this.isBlockedEmailResendingService.isBlockedResending({
            getUser,
            field: 'password',
            date,
            confirmationCode,
            blockMinutes: 40,
            cooldownMinutes: 3,
            windowMinutes: 18,
            maxRequests: 5
        })

        const nameProjekt = `<span style="margin: -2px 0 0 0; color: #FEA930; font-size: 18px;">Web</span><span style="margin: -2px 0 0 0; color: #15c; font-size: 18px;">Mars</span>`
        const from = `${process.env.PROJEKT_NAME}<${process.env.SMTP_USER}>`
        const to = email
        const subject = `Сброс пароля на проекте ${process.env.PROJEKT_NAME}`
        const text = confirmationCode
        const html = resetPasswordEmailMessageHTMLDocument(nameProjekt, to, text, `${process.env.CLIENT_URL}/newpassword?code=${confirmationCode}`, getUser)

        const isSendEmail = this.emailService.sendConfirmationEmail(from, to, subject, text, html)
            .catch(() => console.log(`
                Упс, что-то пошло не так во время отправки сообщения на E-Mail: ${email}. Возможно сервис отправки 
                писем перегружен, просим Вас повторить запрос чуть позже.`))

        const expirationDate = await this.confirmationsCodesService.createConfirmationsCodesService({
            confirmationCode: confirmationCode,
            isBlocked: false,
            isCooldown: true,
            add: date,
            minutes: 3,
            field: 'password',
            userId: getUser.id,
        })
        if (expirationDate) {
            // console.log('UsersService ressetPasswordService: - isSendEmail res 200', expirationDate)
            const expirationISO = new Date(expirationDate.expirationDate).toISOString();
            return {
                done: true,
                data: expirationISO,
                code: INTERNAL_STATUS_CODE.SUCCESS,
                serviceMessage: `Сообщение успешно отправлено на E-Mail: ${email}. Проверьте почту и следуйте дальнейшим инструкциям в письме. ${expirationISO}`
            };
        } else {
            // console.log('UNPROCESSABLE_ENTITY: - isSendEmail', isSendEmail)
            throw new DomainException(INTERNAL_STATUS_CODE.UNPROCESSABLE_ENTITY)
        }
    }
    async updatePasswordService(password: string, code: string): Promise<string> {
        const passwordHash = await this.cryptoService.createPasswordHash(password);
        const confirmation = await this.confirmationRepository.findByCodeConfirmationRepository(code)
        if (confirmation) {
            // console.log('updatePasswordService: - passwordConfirmationByCode', passwordConfirmationByCode)
            const user = await this.usersRepository.findUserByIdOrNotFoundFail(confirmation.userId)
            if (user) {
                if (new Date().toISOString() > confirmation.expirationDate) {
                    // console.log('UsersService confirmationCode: - Код протух: ', confirmation.expirationDate)
                    throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_EXPIRATION_TIME_PASSED)
                } else {
                    user.updateUserPassword(passwordHash, confirmation.userId)
                    await this.usersRepository.save(user);
                    return user.id
                }
            } else {
                throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND)
            }
        } else {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND)
        }
    }
    async _getUserByEmailService(email: string): Promise<User | null> {
        return await this.usersRepository.findByLoginOrEmail(email)
    }
}