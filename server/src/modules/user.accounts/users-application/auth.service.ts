import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
        private cryptoService: CryptoService,
        private sessionService: SessionService,
        private tokenService: TokenService,
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
        console.log('🔥🔥 AuthService: logoutService - refreshTokenPayload:', refreshTokenPayload);
        const isToken = await this.tokenService.getTokenBlackList(refreshTokenPayload.userId)
        if (isToken) {
            console.log('🔥🔥 AuthService: logoutService - isToken:', isToken);
            throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST)
        }
        const isSave = await this.tokenService.saveTokenBlackList(refreshTokenPayload.userId, refreshToken)

        const devices = await this.sessionsRepository.findAllSessionsByUserIdOrNotFoundFail(refreshTokenPayload.id);
        if (isSave && devices) {
            console.log('🔥🔥 AuthService: logoutService - devices:', devices);
            console.log('🔥🔥 AuthService: logoutService - isSave:', isSave);

            const isDelete = await this.sessionsRepository.deleteSession(refreshTokenPayload.userId, refreshTokenPayload.deviceId);
            if (isDelete.acknowledged) {
                console.log('🔥🔥 AuthService: logoutService - isDelete.acknowledged:', isDelete.acknowledged);
                return isDelete.acknowledged
            } else {
                throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST)
            }
        } else {
            throw new DomainException(INTERNAL_STATUS_CODE.BAD_REQUEST_ERROR_WHEN_ADDING_A_TOKEN_TO_THE_BLACKLIST)
        }
    }
}