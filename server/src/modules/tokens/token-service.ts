import { Injectable } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { INTERNAL_STATUS_CODE } from 'src/core/utils/utils';
import { Token, type TokenModelType } from './token-entity';
import { DomainException } from 'src/core/exceptions/domain-exceptions';
import { DomainExceptionCode } from 'src/core/exceptions/domain-exception-codes';
import { TokenRepository } from './token.repository';

@Injectable()
export class TokenService {
    constructor(
        @InjectModel(Token.name) private tokenModel: TokenModelType,
        private tokenRepository: TokenRepository,
        private jwtService: JwtService,
    ) { }
    generateTokens(payload: any): { accessToken: string; refreshToken: string } {
        const { id, deviceId, roles, banned, bannReason } = payload
        // console.log('TokenService: payload', payload)
        const accessToken = this.jwtService.sign({ id }, { expiresIn: '15m', secret: process.env.JWT_ACCESS_SECRET });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d', secret: process.env.JWT_REFRESH_SECRET });
        // console.log('TokenService: accessToken, refreshToken', accessToken, refreshToken)
        return { accessToken, refreshToken }
    }
    giveMeAccessToken(req: any) {
        const authorizationHeader = req.headers.authorization
        const bearer = authorizationHeader.split(' ')[0]
        const accessToken = authorizationHeader.split(' ')[1]
        return accessToken
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
            // throw new ErRes(-100, `Произошла ошибка в базе данных при валидации validateRefreshToken ${error}`)
            throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN)
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
    async saveTokenBlackList(userId: string, refreshToken: string): Promise<string> {
        const token = this.tokenModel.createTokenInstance(
            {
                userId: userId,
                refreshToken: refreshToken
            }
        )
        // console.log('TokenService: saveTokenBlackList - token 😡 ', token)
        await this.tokenRepository.save(token);
        return token._id.toString();
    }
    async deleteTokenBlackList(refreshToken: string): Promise<string> {
        const isToken = await this.tokenRepository.findTokenByTokenOrNotFoundFailRepository(refreshToken)
        // console.log('TokenService: deleteTokenBlackList - isToken 😡 ', isToken)

        const isDeletedToken = await this.tokenRepository.deleteTokenInBlackList(refreshToken)
        // console.log('TokenService: deleteTokenBlackList - isDeletedToken 😡 ', isDeletedToken)

        // const token = this.tokenModel.makeDeletedToken(refreshToken);

        await this.tokenRepository.save(isToken);
        return isToken._id.toString();
    }
    async getTokenBlackList(refreshToken: string): Promise<Token | null> {
        return await this.tokenModel.findOne({
            where: { refreshToken },
            raw: true
        });
    }
}
