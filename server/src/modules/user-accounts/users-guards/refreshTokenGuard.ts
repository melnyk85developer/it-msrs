import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { DomainException } from "src/core/exceptions/domain-exceptions";
import { INTERNAL_STATUS_CODE } from "src/core/utils/utils";
import { TokenService } from "src/modules/tokens/tokens-application/token-service";
import { TokenRepository } from "src/modules/tokens/tokens-infrastructure/token.repository";

@Injectable()
export class AuthRefreshGuard implements CanActivate {
    constructor(
        private tokenService: TokenService,
        private tokenRepository: TokenRepository,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        const refreshToken = req.cookies['refreshToken']
        // console.log('AuthRefreshGuard: - refreshToken', req.cookies['refreshToken'])

        if (!refreshToken) {
            throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_NO_REFRESH_TOKEN)
        }
        const isBkackList = await this.tokenRepository.findTokenByToken(refreshToken)
        if (isBkackList) {
            // console.log('AuthRefreshGuard: - isBkackList', isBkackList)
            throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST)
        }
        const userData = this.tokenService.validateRefreshToken(refreshToken)
        // console.log('AuthRefreshGuard: - userData', userData)
        if (!userData) throw new DomainException(INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN)
        // 🛑 СОХРАНЯЕМ ПЕЙЛОАД В ОТДЕЛЬНОМ ПОЛЕ (например, req.refreshTokenPayload)
        req.refreshTokenPayload = userData;
        return true
    }

}