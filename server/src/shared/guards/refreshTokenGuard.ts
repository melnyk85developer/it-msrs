// import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
// import { TokenService } from "../../services/tokens/token-service";
// import { ErRes } from "../utils/ErRes";
// import { INTERNAL_STATUS_CODE } from "../utils/utils";

// @Injectable()
// export class AuthRefreshGuard implements CanActivate {
//     constructor(private tokenService: TokenService) { }

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const req = context.switchToHttp().getRequest()
//         const refreshToken = req.cookies['refreshToken']
//         // console.log('AuthRefreshGuard: - refreshToken', refreshToken)

//         if (!refreshToken) {
//             throw new ErRes(INTERNAL_STATUS_CODE.UNAUTHORIZED_NO_REFRESH_TOKEN)
//         }
//         const isBkackList = await this.tokenService.getTokenBlackList(refreshToken)
//         if (isBkackList) {
//             // console.log('AuthRefreshGuard: - isBkackList', isBkackList)
//             throw new ErRes(INTERNAL_STATUS_CODE.UNAUTHORIZED_REFRESH_TOKEN_BLACK_LIST)
//         }
//         const userData = this.tokenService.validateRefreshToken(refreshToken)
//         // console.log('AuthRefreshGuard: - userData', userData)
//         if (!userData) throw new ErRes(
//             INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_REFRESH_TOKEN
//         )
//         req.user = userData
//         return true
//     }

// }