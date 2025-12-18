import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { UsersRepository } from '../../user.accounts/users-infrastructure/users.repository';
import { CryptoService } from '../../user.accounts/users-application/crypto.service';
import { UserContextDto } from '../../user.accounts/users-guards/dto/user-context.dto';
import { UAParser } from 'ua-parser-js';
import geoip, { Lookup } from 'geoip-lite';
import { SessionService } from 'src/modules/usersSessions/sessions-application/sessions.service';
import { TokenService } from 'src/modules/tokens/tokens-application/token-service';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { UsersService } from '../../user.accounts/users-application/users.service';
import { SessionsRepository } from 'src/modules/usersSessions/sessions-infrastructure/session.repository';
import { mailResendingEmailMessageHTMLDocument } from 'src/modules/notifications/service/mailResending/mailResendingEmailMessage.HTML';
import { ConfirmationRepository } from 'src/modules/confirmationsCodes/confirmations-infrastructure/confirmationRepository';
import { EmailService } from 'src/modules/notifications/email.service';
import { CreateUserDto } from 'src/modules/user.accounts/users-dto/create-user.dto';
import { ConfirmationsCodesService } from 'src/modules/confirmationsCodes/confirmations-application/confirmations.service';
import { IsBlockedEmailResendingService } from 'src/core/utils/blocked-utilite';
import { Multer } from 'multer';
import { FilesService } from 'src/modules/files/files.service';

export type ParseDeviceNameType = {
    osName: string | null;
    osVersion: string | null;
    browserName: string | null;
    browserVersion: string | null;
    device: string | null;
    country: string | null;
    city: string | null;
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private usersRepository: UsersRepository,
        private sessionsRepository: SessionsRepository,
        private confirmationsCodesService: ConfirmationsCodesService,
        private confirmationRepository: ConfirmationRepository,
        private isBlockedEmailResendingService: IsBlockedEmailResendingService,
        private cryptoService: CryptoService,
        private sessionService: SessionService,
        private tokenService: TokenService,
        private emailService: EmailService,
        private filesService: FilesService,
    ) { }
    async registrationService(dto: Omit<CreateUserDto, 'createdAt' | 'updatedAt' | 'deletedAt'>, avatar: Multer.File | null) {
        // console.log('registrationUserService - dto 😡😡', dto)
        // console.log('AuthService: registrationService - avatar 👽 😡 👽', avatar)
        const confirmationCode = uuid.v4()
        const date = new Date()
        const fileName = avatar ? await this.filesService.createAvatarFile(avatar) : null;
        // console.log('FilesService: createFile - fileName 👽 😡 👽', fileName)
        const createdUserId = await this.usersService.createUserService(dto, fileName);
        const user = await this.usersRepository.findUserByIdOrNotFoundFail(
            String(createdUserId),
        );
        // console.log('registrationUserService: - user 😡 ', user)
        // user.setConfirmationCode(confirmationCode);

        const isConfirmation = await this.confirmationsCodesService.createConfirmationsCodesService(
            {
                confirmationCode: confirmationCode,
                isBlocked: false,
                isCooldown: true,
                add: date.toISOString(),
                minutes: 3,
                userId: user.id,
                field: 'registration'
            }
        )

        await this.usersRepository.save(user);
        const from = `IT-INCUBATOR <${process.env.SMTP_USER}>`
        const to = user.accountData.email
        const subject = `Активация аккаунта на сайте ${process.env.PROJEKT_NAME}`
        const text = confirmationCode
        const html =
            `<div>
                    <h1>Для активации аккаунта на сайте ${process.env.PROJEKT_NAME} перейдите по ссылке</h1>
                    <h2>${confirmationCode}</h2>
                    <p>
                        To finish registration please follow the link below:
                        <a href="${process.env.API_URL}/auth/confirm-email?code=${confirmationCode}">Подтвердить регистрацию</a>
                    </p>
                    <button>
                        <a href="${process.env.API_URL}/auth/confirm-email?code=${confirmationCode}">Подтвердить регистрацию</a>
                    </button>
                </div>`
        // console.log('registrationUserService: confirmationCode - user 😡 ', user)
        this.emailService.sendConfirmationEmail(from, to, subject, text, html).catch(console.error);
        return user._id.toString();
    }
    async loginService(ip: string, userAgent: string, userId: string, refreshToken: string | null) {
        // console.log('AuthService → login: userId 👍', userId);
        // console.log('loginService: - ', ip, userAgent, refreshToken)
        // const user = await this.usersRepository.findUserByIdOrNotFoundFail(userId);
        const user = await this.usersRepository.findUserByIdOrNotFoundFail(userId);
        const roleValues = user.systemUserData.roles.map(role => role.value);
        // console.log('loginService: - user', user)
        // console.log('loginService: - roleValues', roleValues)
        const isParse = await this._myParserService(ip, userAgent)
        const isLogin = await this.sessionService.createSessionService({
            userId,
            ip,
            osName: isParse.osName as string,
            osVersion: isParse.osVersion as string,
            browserName: isParse.browserName as string,
            browserVersion: isParse.browserVersion as string,
            device: isParse.device as string,
            country: isParse.country as string,
            city: isParse.city as string
        },
            refreshToken as string,
            roleValues,
            user.systemUserData.isBanned,
            user.systemUserData.bannReason as string,
        );
        // console.log('loginService: - isLogin RES', isLogin)
        const isUpdateLastSeen = await this.usersService.updateLastSeenUserService(userId)
        // console.log('loginService: - isUpdateLastSeen RES', isUpdateLastSeen)
        return {
            accessToken: isLogin.accessToken,
            refreshToken: isLogin.refreshToken
        };
    }
    async refreshService(ip: string, userAgent: string, refreshTokenPayload: any, refreshToken: string): Promise<any> {
        const isSessionExpired = (expirationDate: number): boolean => {
            const currentDate = Date.now() / 1000;
            return expirationDate < currentDate;
        };
        // console.log('🔥🔥 refreshService - refreshTokenPayload:', refreshTokenPayload);
        const user = await this.usersRepository.findUserByIdOrNotFoundFail(refreshTokenPayload.id);
        const devices = await this.sessionsRepository.findAllSessionsByUserIdOrNotFoundFail(refreshTokenPayload.id);
        // console.log('🔥🔥 refreshService - devices:', devices);
        const device = devices.find(d => d.deviceId === refreshTokenPayload.deviceId)
        // console.log('🔥🔥 refreshService - device:', device);
        if (!device) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_SESSION_ID)
        }
        // if(userAgent !== device){
        //     console.error('Нарушена безопасность: userAgent !== device !!! Это означает, что произошла смена устройства при обновлении токена!')
        // }
        const noExpSession = !isSessionExpired(Number(device.expirationDate))
        // console.log('🔥🔥 refreshService - noExpSession:', noExpSession);
        // console.log('refreshTokenOrSessionService: - device.lastActiveDate IF', Number(device.lastActiveDate) === Number(userData.iat))

        if (noExpSession && Number(device.lastActiveDate) === Number(refreshTokenPayload.iat)) {
            const isParse = await this._myParserService(ip, userAgent)
            const roleValues = user.systemUserData.roles.map(role => role.value);

            const isUpdatedSession = await this.sessionService.updateSessionService({
                userId: user.id,
                ip,
                browserName: isParse.browserName,
                browserVersion: isParse.browserVersion,
                osName: isParse.osName,
                osVersion: isParse.osVersion,
                country: isParse.country,
                city: isParse.city,
                device: isParse.device,
                deviceId: refreshTokenPayload.deviceId,
            },
                refreshToken as string,
                roleValues,
                user.systemUserData.isBanned,
                user.systemUserData.bannReason as string,
            );
            // console.log('🔥🔥 refreshService - isUpdatedSession:', isUpdatedSession);
            const isUpdateLastSeen = await this.usersService.updateLastSeenUserService(user.id)
            return { accessToken: isUpdatedSession.accessToken, refreshToken: isUpdatedSession.refreshToken }
        } else {
            throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN)
        }
    }
    async logoutService(refreshToken: string, refreshTokenPayload: any): Promise<any> {
        // console.log('🔥🔥 AuthService: logoutService - refreshTokenPayload:', refreshTokenPayload);
        const isToken = await this.tokenService.getTokenBlackList(refreshTokenPayload.id)
        if (isToken) {
            // console.log('🔥🔥 AuthService: logoutService - isToken:', isToken);
            throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST)
        }
        const isSave = await this.tokenService.saveTokenBlackList(refreshTokenPayload.id, refreshToken)
        if (isSave) {
            // console.log('🔥🔥 AuthService: logoutService - isSave:', isSave);

            const isDelete = await this.sessionsRepository.deleteSession(
                String(refreshTokenPayload.id),
                String(refreshTokenPayload.deviceId)
            );
            if (isDelete.acknowledged) {
                // console.log('🔥🔥 AuthService: logoutService - isDelete.acknowledged:', isDelete.acknowledged);
                return isDelete.acknowledged
            } else {
                throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST)
            }
        } else {
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST)
        }
    }

    async registrationEmailResendingService(email: any): Promise<{ done: boolean, data: string | null, code: number, serviceMessage: string }> {
        const confirmationCode = uuid.v4()
        const date = new Date().toISOString()
        const getUser = await this.usersService._getUserByEmailService(email)
        // console.log('registrationEmailResendingController: - getUser 😡😡😡', getUser)

        if (!getUser) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_USER)
        }
        await this.isBlockedEmailResendingService.isBlockedResending({
            getUser,
            field: 'registration',
            date,
            confirmationCode,
            blockMinutes: 40,
            cooldownMinutes: 3,
            windowMinutes: 18,
            maxRequests: 5
        })

        const nameProjekt = `<span style="color: #FEA930; font-size: 18px;">Web</span><span style="color: #15c; font-size: 18px;">Mars</span>`
        const from = `${process.env.PROJEKT_NAME}<${process.env.SMTP_USER}>`
        const to = email
        const subject = `Повторный запрос на активацию аккаунта в проекте ${process.env.PROJEKT_NAME}`
        const text = confirmationCode
        const html = mailResendingEmailMessageHTMLDocument(
            nameProjekt,
            to,
            text,
            `${process.env.API_URL}/auth/registration-confirmation/${confirmationCode}`
        )
        const isSend = this.emailService.sendConfirmationEmail(from, to, subject, text, html)
            .catch(() => console.log('Ошибка отправки сообщения на E-Mail'))
        const expirationDate = await this.confirmationsCodesService.createConfirmationsCodesService({
            confirmationCode: confirmationCode,
            isBlocked: false,
            isCooldown: true,
            add: date,
            minutes: 3,
            userId: getUser.id,
            field: 'registration'
        })
        if (expirationDate) {
            // console.log('AuthService registrationEmailResendingService: - isSendEmail res 200', expirationDate.expirationDate)
            const expirationISO = new Date(expirationDate.expirationDate).toISOString();
            return {
                done: true,
                data: expirationISO,
                code: INTERNAL_STATUS_CODE.SUCCESS,
                serviceMessage: `Сообщение успешно отправлено на E-Mail: ${email}. Проверьте почту и следуйте дальнейшим инструкциям в письме. ${expirationISO}`
            };
        } else {
            throw new DomainException(INTERNAL_STATUS_CODE.UNPROCESSABLE_ENTITY)
        }
    }
    async confirmationCodeRegistrationService(confirmationCode: string): Promise<any> {
        const сonfirmation = await this.confirmationRepository.findByCodeConfirmationRepository(confirmationCode)
        if (сonfirmation) {
            if (new Date().toISOString() > сonfirmation.expirationDate) {
                console.log('UsersService confirmationCode: - EXPIRATION', сonfirmation.expirationDate)
                throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_EXPIRATION_TIME_PASSED)
            } else {
                return await this.usersService.makeUpdatedConfirmedAccount(сonfirmation.userId)
            }
        } else {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_CONFIRMATION_CODE)
        }
    }
    async passwordRecoverySendEmailService(email: string): Promise<{ done: boolean, data: string | null, code: number, serviceMessage: string }> {
        return await this.usersService.ressetPasswordService(email)
    }
    async ressetPasswordService(email: string, code: string): Promise<any> {
        return await this.usersService.updatePasswordService(email, code)
    }
    async validateUserService(login: string, password: string): Promise<UserContextDto | null> {
        // console.log('AuthService → validateUser: login, password 👍', login, password);
        const user = await this.usersRepository.findByLoginOrEmail(login);
        if (!user) {
            return null;
        }
        const isPasswordValid = await this.cryptoService.comparePasswords({
            password,
            hash: user.passwordHash,
        });
        if (!isPasswordValid) {
            return null;
        }
        return { id: user.id.toString() };
    }
    private async _myParserService(ip: string, userAgent: string): Promise<ParseDeviceNameType> {
        const parser = new UAParser(userAgent);
        const uaResult = parser.getResult();
        const osName = uaResult.os.name || null;
        const osVersion = uaResult.os.version || null;
        const browserName = uaResult.browser.name || null;
        const browserVersion = uaResult.browser.version || null;
        const device = uaResult.device.type || null;
        const geo: Lookup | null = geoip.lookup(ip);
        const country = geo ? geo.country : null;
        const city = geo ? geo.city : null;

        return { osName, osVersion, browserName, browserVersion, device, country, city }
    }
}