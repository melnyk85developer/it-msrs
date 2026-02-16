import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { UsersRepository } from '../../user-accounts/users-infrastructure/users.repository';
import { CryptoService } from '../../user-accounts/users-application/crypto.service';
import { UserContextDto } from '../../user-accounts/users-guards/dto/user-context.dto';
import { UAParser } from 'ua-parser-js';
import geoip, { Lookup } from 'geoip-lite';

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
        private usersRepository: UsersRepository,
        private cryptoService: CryptoService,
    ) { }
    // async registrationService(dto: Omit<CreateUserDto, 'createdAt' | 'updatedAt' | 'deletedAt'>, avatar: Multer.File | null) {
    //     // console.log('registrationUserService - dto 😡😡', dto)
    //     // console.log('AuthService: registrationService - avatar 👽 😡 👽', avatar)
    //     const confirmationCode = uuid.v4()
    //     const date = new Date()
    //     const fileName = avatar ? await this.filesService.createAvatarFile(avatar) : null;
    //     // console.log('FilesService: createFile - fileName 👽 😡 👽', fileName)
    //     const createdUserId = await this.usersService.createUserService(dto, fileName);
    //     const user = await this.usersRepository.findUserByIdOrNotFoundFail(createdUserId);
    //     // console.log('registrationUserService: - user 😡 ', user)
    //     await this.usersRepository.save(user);

    //     const from = `IT-INCUBATOR PROJECT<${process.env.SMTP_USER}>`
    //     const to = user.accountData.email
    //     const subject = `Активация аккаунта на сайте ${process.env.PROJEKT_NAME}`
    //     const text = confirmationCode
    //     const html =
    //         `<div>
    //                 <h1>Для активации аккаунта на сайте ${process.env.PROJEKT_NAME} перейдите по ссылке</h1>
    //                 <h2>${confirmationCode}</h2>
    //                 <p>
    //                     To finish registration please follow the link below:
    //                     <a href="${process.env.API_URL}/auth/registration-confirmation?code=${confirmationCode}">Подтвердить регистрацию</a>
    //                 </p>
    //                 <button>
    //                     <a href="${process.env.API_URL}/auth/registration-confirmation?code=${confirmationCode}">Подтвердить регистрацию</a>
    //                 </button>
    //             </div>`

    //     // <a href="${process.env.API_URL}/auth/confirm-email?code=${confirmationCode}">Подтвердить регистрацию</a>

    //     const isSendEmail = this.emailService.sendConfirmationEmail(
    //         from,
    //         to,
    //         subject,
    //         text,
    //         html
    //     )
    //         .catch(() => console.log(`
    //             Упс, что-то пошло не так во время отправки сообщения на E-Mail: ${to}. Возможно сервис отправки 
    //             писем перегружен, просим Вас повторить запрос чуть позже.`))

    //     const isCreateConfirmation = await this.confirmationsCodesService.createConfirmationsCodesService(
    //         {
    //             confirmationCode: confirmationCode,
    //             isBlocked: false,
    //             isCooldown: true,
    //             add: date.toISOString(),
    //             minutes: 3,
    //             userId: user.id,
    //             field: 'registration'
    //         }
    //     )
    //     if (isCreateConfirmation) {
    //         // console.log('registrationUserService: - isSendEmail 😡 ', isSendEmail)
    //         // console.log('registrationUserService: - isCreateConfirmation 😡 ', isCreateConfirmation)
    //         // console.log('registrationUserService: - return user._id.toString(); 😡 ', user._id.toString())
    //         // return user._id.toString()
    //         return {
    //             done: true,
    //             data: { id: user._id.toString(), code: confirmationCode },
    //             code: INTERNAL_STATUS_CODE.SUCCESS,
    //             serviceMessage: `Сообщение успешно отправлено на E-Mail: ${to}. Проверьте почту и следуйте дальнейшим инструкциям в письме.`
    //         };
    //     } else {
    //         throw new DomainException(INTERNAL_STATUS_CODE.UNPROCESSABLE_ENTITY)
    //     }
    // }
    // async loginService(ip: string, userAgent: string, userId: string, remember: boolean, refreshToken: string | null) {
    //     // console.log('AuthService → login: userId 👍', userId);
    //     // console.log('loginService: - ', ip, userAgent, refreshToken)
    //     // const user = await this.usersRepository.findUserByIdOrNotFoundFail(userId);
    //     const user = await this.usersRepository.findUserByIdOrNotFoundFail(userId);
    //     const roleValues = user.systemUserData.roles.map(role => role.value);
    //     // console.log('loginService: - user', user)
    //     // console.log('loginService: - roleValues', roleValues)
    //     const isParse = await this._myParserService(ip, userAgent)
    //     const isLogin = await this.sessionService.createSessionService({
    //         userId,
    //         ip,
    //         osName: isParse.osName as string,
    //         osVersion: isParse.osVersion as string,
    //         browserName: isParse.browserName as string,
    //         browserVersion: isParse.browserVersion as string,
    //         device: isParse.device as string,
    //         country: isParse.country as string,
    //         city: isParse.city as string
    //     },
    //         remember,
    //         refreshToken as string,
    //         roleValues,
    //         user.systemUserData.isBanned,
    //         user.systemUserData.bannReason as string,
    //     );
    //     // console.log('loginService: - isLogin RES', isLogin)
    //     const isUpdateLastSeen = await this.usersService.updateLastSeenUserService(userId)
    //     // console.log('loginService: - isUpdateLastSeen RES', isUpdateLastSeen)
    //     return {
    //         accessToken: isLogin.accessToken,
    //         refreshToken: isLogin.refreshToken
    //     };
    // }
    // async refreshService(ip: string, userAgent: string, refreshTokenPayload: any, refreshToken: string): Promise<any> {
    //     const isSessionExpired = (expirationDate: number): boolean => {
    //         const currentDate = Date.now() / 1000;
    //         return expirationDate < currentDate;
    //     };
    //     // console.log('🔥🔥 refreshService - refreshTokenPayload:', refreshTokenPayload);
    //     // console.log('🔥🔥 refreshService - refreshToken:', refreshToken);
    //     const user = await this.usersRepository.findUserByIdOrNotFoundFail(refreshTokenPayload.id);
    //     const devices = await this.sessionsRepository.findAllSessionsByUserIdOrNotFoundFail(refreshTokenPayload.id);
    //     // console.log('🔥🔥 refreshService - devices:', devices);
    //     const device = devices.find(d => d.deviceId === refreshTokenPayload.deviceId)
    //     // console.log('🔥🔥 refreshService - device:', device);
    //     if (!device) {
    //         throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_SESSION_ID)
    //     }
    //     // if(userAgent !== device){
    //     //     console.error('Нарушена безопасность: userAgent !== device !!! Это означает, что произошла смена устройства при обновлении токена!')
    //     // }
    //     const noExpSession = !isSessionExpired(Number(device.expirationDate))
    //     // console.log('🔥🔥 refreshService - noExpSession:', noExpSession);
    //     // console.log('refreshTokenOrSessionService: - device.lastActiveDate IF', Number(device.lastActiveDate) === Number(userData.iat))

    //     if (noExpSession && Number(device.lastActiveDate) === Number(refreshTokenPayload.iat)) {
    //         const isParse = await this._myParserService(ip, userAgent)
    //         const roleValues = user.systemUserData.roles.map(role => role.value);

    //         const isUpdatedSession = await this.sessionService.updateSessionService({
    //             userId: user.id,
    //             ip,
    //             browserName: isParse.browserName,
    //             browserVersion: isParse.browserVersion,
    //             osName: isParse.osName,
    //             osVersion: isParse.osVersion,
    //             country: isParse.country,
    //             city: isParse.city,
    //             device: isParse.device,
    //             deviceId: refreshTokenPayload.deviceId,
    //             remember: device.remember,
    //         },
    //             refreshToken as string,
    //             roleValues,
    //             user.systemUserData.isBanned,
    //             user.systemUserData.bannReason as string,
    //         );
    //         // console.log('🔥🔥 refreshService - isUpdatedSession:', isUpdatedSession);
    //         const isUpdateLastSeen = await this.usersService.updateLastSeenUserService(user.id)
    //         return { accessToken: isUpdatedSession.accessToken, refreshToken: isUpdatedSession.refreshToken }
    //     } else {
    //         throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN)
    //     }
    // }
    // async logoutService(refreshToken: string, refreshTokenPayload: any): Promise<any> {
    //     // console.log('🔥🔥 AuthService: logoutService - refreshTokenPayload:', refreshTokenPayload);
    //     const isToken = await this.tokenService.getTokenBlackList(refreshTokenPayload.id)
    //     if (isToken) {
    //         // console.log('🔥🔥 AuthService: logoutService - isToken:', isToken);
    //         throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST)
    //     }
    //     const isSave = await this.tokenService.saveTokenBlackList(refreshTokenPayload.id, refreshToken)
    //     if (isSave) {
    //         // console.log('🔥🔥 AuthService: logoutService - isSave:', isSave);

    //         const isDelete = await this.sessionsRepository.deleteSession(
    //             String(refreshTokenPayload.id),
    //             String(refreshTokenPayload.deviceId)
    //         );
    //         if (isDelete.acknowledged) {
    //             // console.log('🔥🔥 AuthService: logoutService - isDelete.acknowledged:', isDelete.acknowledged);
    //             return isDelete.acknowledged
    //         } else {
    //             throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST)
    //         }
    //     } else {
    //         throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST)
    //     }
    // }

    // async registrationEmailResendingService(email: string): Promise<{ done: boolean, data: { expirationISO: string, code: string } | null, code: number, serviceMessage: string }> {
    //     const confirmationCode = uuid.v4()
    //     const date = new Date().toISOString()
    //     const getUser = await this.usersService._getUserByEmailService(email)

    //     if (!getUser) {
    //         // console.log('registrationEmailResendingService: - getUser 😡😡😡', getUser)
    //         throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_INCORECT_E_MAIL)
    //     }
    //     if (getUser && getUser.systemUserData.isEmailConfirmed === true) {
    //         // console.log('registrationEmailResendingService: - getUser 😡😡😡', getUser.systemUserData.isEmailConfirmed)
    //         throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_THE_CONFIRMATION_EMAIL_ALREADY_CONFIRMED)
    //     }
    //     await this.isBlockedEmailResendingService.isBlockedResending({
    //         getUser,
    //         field: 'registration',
    //         date,
    //         confirmationCode,
    //         blockMinutes: 40,
    //         cooldownMinutes: 3,
    //         windowMinutes: 18,
    //         maxRequests: 5
    //     })

    //     const expirationDate = await this.confirmationsCodesService.createConfirmationsCodesService({
    //         confirmationCode: confirmationCode,
    //         isBlocked: false,
    //         isCooldown: true,
    //         add: date,
    //         minutes: 3,
    //         userId: getUser.id,
    //         field: 'registration'
    //     })

    //     const nameProjekt = `<span style="color: #FEA930; font-size: 18px;">Web</span><span style="color: #15c; font-size: 18px;">Mars</span>`
    //     const from = `${process.env.PROJEKT_NAME}<${process.env.SMTP_USER}>`
    //     const to = email
    //     const subject = `Повторный запрос на активацию аккаунта в проекте ${process.env.PROJEKT_NAME}`
    //     const text = confirmationCode
    //     const html = `<div>
    //                     <h1>Повторный запрос на активацию аккаунта ${process.env.PROJEKT_NAME} перейдите по ссылке</h1>
    //                     <h2>${confirmationCode}</h2>
    //                     <p>
    //                         To finish registration please follow the link below:
    //                         <a href="${process.env.API_URL}/auth/registration-confirmation?code=${confirmationCode}">Сбросить пароль</a>
    //                     </p>
    //                     <button>
    //                         <a href="${process.env.API_URL}/auth/registration-confirmation?code=${confirmationCode}">Сбросить пароль</a>
    //                     </button>
    //                 </div>`

    //     // const html = mailResendingEmailMessageHTMLDocument(
    //     //     nameProjekt,
    //     //     to,
    //     //     text,
    //     //     `${process.env.API_URL}/auth/registration-confirmation/${confirmationCode}`
    //     // )
    //     const isSendEmail = this.emailService.sendConfirmationEmail(
    //         from,
    //         to,
    //         subject,
    //         text,
    //         html
    //     )
    //         .catch(() => console.log(`
    //             Упс, что-то пошло не так во время отправки сообщения на E-Mail: ${email}. Возможно сервис отправки 
    //             писем перегружен, просим Вас повторить запрос чуть позже.`))


    //     if (expirationDate) {
    //         // console.log('AuthService registrationEmailResendingService: - isSendEmail res', isSendEmail)
    //         // console.log('AuthService registrationEmailResendingService: - expirationDate res', expirationDate.expirationDate)
    //         const expirationISO = new Date(expirationDate.expirationDate).toISOString();
    //         return {
    //             done: true,
    //             data: { expirationISO: expirationISO, code: confirmationCode },
    //             code: INTERNAL_STATUS_CODE.SUCCESS,
    //             serviceMessage: `Сообщение успешно отправлено на E-Mail: ${email}. Проверьте почту и следуйте дальнейшим инструкциям в письме. ${expirationISO}`
    //         };
    //     } else {
    //         throw new DomainException(INTERNAL_STATUS_CODE.UNPROCESSABLE_ENTITY)
    //     }
    // }
    // async confirmationCodeRegistrationService(confirmationCode: string): Promise<any> {
    //     // console.log('UsersService confirmationCode: - сonfirmation', confirmationCode)
    //     const isConfirmationCode = await this.confirmationRepository.findByCodeConfirmationRepository(confirmationCode)
    //     // console.log('UsersService confirmationCode: - isConfirmationCode', isConfirmationCode)

    //     if (isConfirmationCode) {
    //         if (new Date().toISOString() > isConfirmationCode.expirationDate) {
    //             // console.log('UsersService confirmationCode: - EXPIRATION', isConfirmationCode.expirationDate)
    //             throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_EXPIRATION_TIME_PASSED)
    //         } else {
    //             const updatedConfirmed = await this.usersService.makeUpdatedConfirmedAccount(isConfirmationCode.userId)
    //             if (updatedConfirmed) {
    //                 return {
    //                     done: true,
    //                     data: updatedConfirmed,
    //                     code: INTERNAL_STATUS_CODE.SUCCESS,
    //                     serviceMessage: ``
    //                 };
    //             } else {
    //                 throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST, `Что-то пошло не так при обновлении isEmailConfirmed!`)
    //             }
    //         }
    //     } else {
    //         throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_CONFIRMATION_CODE)
    //     }
    // }


    // async passwordRecoverySendEmailService(email: string): Promise<{ done: boolean, data: { code: string; expirationISO: string; } | null, code: number, serviceMessage: string }> {
    //     return await this.usersService.ressetPasswordService(email)
    // }
    // async ressetPasswordService(password: string, code: string): Promise<{ done: boolean; data: string; code: number; serviceMessage: string; }> {
    //     return await this.usersService.updatePasswordService(password, code)
    // }

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