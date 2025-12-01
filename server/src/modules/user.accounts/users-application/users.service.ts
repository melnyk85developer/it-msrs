import { BadRequestException, Injectable } from '@nestjs/common';
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

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private UserModel: UserModelType,
        private usersRepository: UsersRepository,
        private emailService: EmailService,
        private myConfirmationRepository: ConfirmationRepository,
        private cryptoService: CryptoService,
    ) { }

    async registrationService(dto: Omit<CreateUserDto, 'createdAt' | 'updatedAt' | 'deletedAt'>) {
        // console.log('registrationUserService - dto 😡😡', dto)
        const createdUserId = await this.createUserService(dto);

        const user = await this.usersRepository.findUserByIdOrNotFoundFail(
            String(createdUserId),
        );
        // console.log('registrationUserService: - user 😡 ', user)
        const confirmationCode = uuid.v4()
        // user.setConfirmationCode(confirmationCode);

        await this.usersRepository.save(user);

        // console.log('registrationUserService: confirmationCode - user 😡 ', user)
        this.emailService.sendConfirmationEmail(
            user.accountData.email,
            confirmationCode
        ).catch(console.error);

        return user._id.toString();
    }
    async createUserService(dto: Omit<CreateUserDto, 'createdAt' | 'updatedAt' | 'deletedAt'>, confirmationCode?: string): Promise<string | number> {
        const { email, login, password } = dto
        // console.log('createUserService - email, login, password 😡 ', email, login, password)
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
        let role: any
        if (!isUsers.length) {
            role = { value: "ADMIN", description: "Администратор" }
        } else {
            role = { value: "USER", description: "Пользователь" }
        }
        const user = await this.UserModel.createUserInstance({
            ...dto,
            passwordHash,
            role
        });
        await this.usersRepository.save(user);
        return user._id.toString();
    }
    async updateUserService(id: string, dto: Omit<UpdateUserDto, 'deletedAt' | 'updatedAt'>): Promise<string> {
        const user = await this.usersRepository.findUserByIdOrNotFoundFail(id);
        user.updateAccountData(dto);
        await this.usersRepository.save(user);
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
    async confirmationCodeRegistrationService(confirmationCode: string): Promise<any> {
        const myAConfirmation = await this.myConfirmationRepository.findByCodeConfirmationRepository(confirmationCode)
        const user = await this.usersRepository.findUserByIdOrNotFoundFail(String(myAConfirmation.userId));

        const isUser = await this._getUserByIdService(myAConfirmation.userId)
        if (isUser) {
            if (isUser.confirmation.length) {
                const confirmation = isUser.confirmation[isUser.confirmation.length - 1]
                if (new Date > confirmation.expirationDate) {
                    console.log('UsersService confirmationCode: - EXPIRATION', confirmation.expirationDate)
                    throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_EXPIRATION_TIME_PASSED)
                } else {
                    return await this.usersRepository.activateProfileByUserIdRepository(myAConfirmation.userId)
                }
            }
        }
    }
    async _getUserByIdService(userId: number): Promise<User | null> {
        const getUser = await this.usersRepository._getUserByIdRepository(userId)
        // console.log('_getUserByIdService: - ', getUser)
        if (getUser) {
            return getUser
        } else {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_USER)
        }
    }
    async _getUserByEmailService(email: string): Promise<User | any> {
        return await this.usersRepository._getUserByEmailRepository(email)
    }
}