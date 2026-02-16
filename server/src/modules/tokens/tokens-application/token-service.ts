import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';
import { TokenRepository } from '../tokens-infrastructure/token.repository';

@Injectable()
export class TokenService {
    constructor(
        private jwtService: JwtService,
    ) { }
    generateTokens(payload: any, remember: boolean): { accessToken: string; refreshToken: string } {
        const { id, deviceId, roles, banned, bannReason } = payload
        // console.log('TokenService: payload', payload)
        console.log('TokenService: remember', remember)
        const accessToken = this.jwtService.sign({ id }, { expiresIn: '15m', secret: process.env.JWT_ACCESS_SECRET });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: remember === true ? '30d' : '1d', secret: process.env.JWT_REFRESH_SECRET });
        // console.log('TokenService: accessToken, refreshToken', accessToken, refreshToken)
        return { accessToken, refreshToken }
    }

    validateAccessToken(token: string): any {
        // Проверка формата JWT токена
        if (typeof token !== 'string' || !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(token)) {
            throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT)
        }
        if (!token || token.length < 10) {
            throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_ACCESS_TOKEN_LENGHT)
        }
        try {
            return this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_SECRET })
        } catch (error) {
            // throw new ErRes(-100, `Произошла ошибка в базе данных при валидации validateAccessToken ${error}`)
            // console.error('Ошибка JWT валидации:', error);
            throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_ACCESS_TOKEN)
        }
    }
    decodeAccessToken(token: string): any {
        // Проверка на формат JWT (просто для защиты от мусора)
        if (typeof token !== 'string' || !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(token)) {
            throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_ACCESS_TOKEN_FORMAT)
        }
        if (!token || token.length < 10) {
            throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_ACCESS_TOKEN_LENGHT)
        }
        return this.jwtService.decode(token);
    }
    validateRefreshToken(refreshToken: string): any {
        if (typeof refreshToken !== 'string' || !refreshToken) {
            throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_NO_REFRESH_TOKEN)
        }

        if (!refreshToken || refreshToken.length < 10) {
            throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_LENGHT)
        }

        // Проверка формата JWT токена
        if (typeof refreshToken !== 'string' || !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(refreshToken)) {
            throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT)
        }
        try {
            return this.jwtService.verify(refreshToken, { secret: process.env.JWT_REFRESH_SECRET });
        } catch (error) {
            throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN, `Произошла ошибка в jwtService при валидации validateRefreshToken ${error}`)
        }
    }
    decodeRefreshToken(refreshToken: string): any {
        if (typeof refreshToken !== 'string' || !refreshToken) {
            throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_NO_REFRESH_TOKEN)
        }
        if (refreshToken.length < 10) {
            throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_LENGHT)
        }
        // Проверка формата JWT токена (base64url.base64url.base64url)
        if (!/^[\w-]+\.[\w-]+\.[\w-]+$/.test(refreshToken)) {
            throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_WRONG_REFRESH_TOKEN_FORMAT)
        }
        return this.jwtService.decode(refreshToken);
    }
}
