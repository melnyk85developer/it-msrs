import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import { add } from "date-fns";
import { UsersRepository } from '../users-infrastructure/users.repository';
import { CryptoService } from './crypto.service';
import { UserContextDto } from '../users-guards/dto/user-context.dto';
import { UAParser } from 'ua-parser-js';
import geoip, { Lookup } from 'geoip-lite';
import { SessionService } from 'src/modules/usersSessions/sessions-application/sessions.service';
import { TokenService } from 'src/modules/tokens/token-service';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { UsersService } from './users.service';
import { SessionsRepository } from 'src/modules/usersSessions/sessions-infrastructure/session.repository';
import { User } from '../users-domain/user.entity';
import { mailResendingEmailMessageHTMLDocument } from 'src/core/service/mailResending/mailResendingEmailMessage.HTML';
import { ConfirmationRepository } from 'src/modules/confirmationsCodes/confirmations-infrastructure/confirmationRepository';
import { EmailService } from 'src/modules/notifications/email.service';

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
        private myConfirmationRepository: ConfirmationRepository,
        private cryptoService: CryptoService,
        private sessionService: SessionService,
        private tokenService: TokenService,
        private emailService: EmailService,
    ) { }

    async loginService(ip: string, userAgent: string, userId: string, refreshToken: string | null) {
        // console.log('AuthService → login: userId 👍', userId);
        // console.log('loginService: - ', ip, userAgent, refreshToken)
        // const user = await this.usersRepository.findUserByIdOrNotFoundFail(userId);
        const user = await this.usersRepository.findUserByIdOrNotFoundFail(userId);
        const roleValues = user.roles.map(role => role.value);
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
            user.isBanned,
            user.bannReason as string,
        );
        // console.log('loginService: - isLogin RES', isLogin)
        const isUpdateLastSeen = await this.usersService.updateLastSeenUserService(userId)
        // console.log('loginService: - isUpdateLastSeen RES', isUpdateLastSeen)
        return {
            accessToken: isLogin.accessToken,
            refreshToken: isLogin.refreshToken
        };
    }
    async validateUserService(login: string, password: string): Promise<UserContextDto | null> {
        // console.log('AuthService → validateUser: login, password 👍', login, password);
        const user = await this.usersRepository.findByLoginOrEmail(login);
        if (!user) {
            return null;
        }
        const isPasswordValid = await this.cryptoService.comparePasswords({
            password,
            hash: user.accountData.passwordHash,
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
            const roleValues = user.roles.map(role => role.value);

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
                user.isBanned,
                user.bannReason as string,
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
    async registrationEmailResendingService(email: any): Promise<{ status: number, expirationDate: string }> {
        const confirmationCode = uuid.v4()
        const getUser = await this.usersService._getUserByEmailService(email)
        console.log('registrationEmailResendingController: - getUser 😡😡😡', getUser)
        if (!getUser) {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND_USER)
        }
        const confir = getUser.confirmation.filter((i) => i.field === 'registration')
        if (confir) {
            let block = getUser.confirmation.filter((i) => i.isBlocked === true && i.field === 'registration')
            if (block.length) {
                for (let i = 0; block.length > i; i++) {
                    const confirmation = getUser.confirmation[i]
                    if (new Date < confirmation.expirationDate && block[i].field === 'registration' && block[i].isBlocked === true) {
                        console.log('AuthService: - block', block)
                        console.log('AuthService registrationEmailResendingService: - Блокировка не пустила - время не прошло в регистрация!', confirmation.expirationDate)
                        throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_FUNCTION_BLOCKED, confirmation.expirationDate.toISOString())
                    } else {
                        const confirmation = getUser.confirmation[i]
                        if (new Date > confirmation.expirationDate && getUser.confirmation[i].field === 'registration') {
                            console.log('AuthService registrationEmailResendingService: - Блокировку удаляем - время закончилось в регистрация!', confirmation.expirationDate)
                            const deleteBlock = block[i]
                            await this.myConfirmationRepository.deleteConfirmationIdRepository(deleteBlock.id);
                        }
                    }
                }
            }
            const confirmation = getUser.confirmation.filter((c) => c.field === 'registration' && c.isBlocked === false)
            if (confirmation) {
                for (let i = 0; confirmation.length > i; i++) {
                    if (new Date < confirmation[i].expirationDate) {
                        console.log('UsersService ressetPasswordService: - 3 минуты не прошло!', confirmation[i].expirationDate)
                        throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_TIME_HASNT_PASSED_YET, confirmation[i].expirationDate.toISOString())
                    }
                }
            }

            if (confir.length > 3) {
                console.log('AuthService registrationEmailResendingService: - confir.length', getUser.confirmation.length)
                const confirTime = confir.filter((i) => {
                    const expirationDate = new Date(i.expirationDate).getTime();
                    const fifteenMinutesAgo = Date.now() - 18 * 60 * 1000; // 18 минут назад
                    return expirationDate > fifteenMinutesAgo; // проверка, что время не прошло 18 минут
                })
                console.log('AuthService registrationEmailResendingService: - confirTime.length', confirTime.length);
                // Если за последние 18 минут было более 5 запросов, блокируем
                if (confirTime.length >= 5 && confir[confir.length - 1].isBlocked === false) {
                    console.log('AuthService registrationEmailResendingService: - Блокировка registration!', confirTime.length);
                    const clearConfir = getUser.confirmation.filter((i) => i.isBlocked === false && i.field === 'registration')
                    for (let i = 0; clearConfir.length > i; i++) {
                        await this.myConfirmationRepository.deleteConfirmationIdRepository(clearConfir[i].id);
                    }
                    const expirationDate = await this.myConfirmationRepository.createConfirmationRepository({
                        confirmationCode: confirmationCode,
                        expirationDate: add(new Date(), {
                            minutes: 40
                        }),
                        isBlocked: true,
                        field: 'registration',
                        userId: getUser.userId,
                    })
                    throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_A_LOT_OF_REQUESTS_TRY_AGAIN_LATER, expirationDate.expirationDate.toISOString())
                }
            }

            const nameProjekt = `<span style="color: #FEA930; font-size: 18px;">Web</span><span style="color: #15c; font-size: 18px;">Mars</span>`
            const from = `${process.env.PROJEKT_NAME}<${process.env.SMTP_USER}>`
            const to = email
            const subject = `Повторный запрос на активацию аккаунта в проекте ${process.env.PROJEKT_NAME}`
            const text = confirmationCode
            const html = mailResendingEmailMessageHTMLDocument(nameProjekt, to, text, `${process.env.API_URL}/auth/registration-confirmation/${confirmationCode}`)
// emailService
            const isSend = this.mailService.sendMail(from, to, subject, text, html)
                .catch(() => console.log('Ошибка отправки сообщения на E-Mail'))

            const expirationDate = await this.myConfirmationRepository.createConfirmationRepository({
                confirmationCode: confirmationCode,
                expirationDate: add(new Date(), {
                    minutes: 3
                }),
                isBlocked: false,
                field: 'registration',
                userId: getUser.userId,
            })

            if (isSend) {
                console.log('AuthService registrationEmailResendingService: - isSendEmail res 200', expirationDate.expirationDate.toISOString())
                throw new DomainException(INTERNAL_STATUS_CODE.SUCCESS_RESENT_MESSAGE_CONFIRMATION_CODE, expirationDate.expirationDate.toISOString())
            } else {
                throw new DomainException(INTERNAL_STATUS_CODE.UNPROCESSABLE_ENTITY)
            }
        } else {
            throw new DomainException(INTERNAL_STATUS_CODE.NOT_FOUND)
        }
    }
}