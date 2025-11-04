// import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
// import { TokenService } from "../../services/tokens/token-service";
// import { UsersService } from "../../services/users/usersService";
// import { UsersMessagesRepository } from "../../services/usersMessages/usersMessagesRepository/usersMessagesRepository";
// import { UsersSessionsRepository } from "../../services/usersSessions/usersSessionsRepository/usersSessionsRepository";
// import { ErRes } from "../utils/ErRes";
// import { INTERNAL_STATUS_CODE } from "../utils/utils";

// @Injectable()
// export class AuthAccessGuard implements CanActivate {
//     constructor(
//         private usersSessionsRepository: UsersSessionsRepository,
//         private tokenService: TokenService,
//         private usersService: UsersService,
//         private usersMessagesRepository: UsersMessagesRepository,
//     ) { }

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const req = context.switchToHttp().getRequest()
//         const authorizationHeader = req.headers.authorization
//         // console.log('AuthAccessGuard: - authorizationHeader', authorizationHeader)

//         if (!authorizationHeader) {
//             throw new ErRes(INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_ACCESS_TOKEN)
//         }
//         const bearer = authorizationHeader.split(' ')[0]
//         const accessToken = authorizationHeader.split(' ')[1]
//         if (bearer !== 'Bearer' || !accessToken) {
//             throw new ErRes(INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_ACCESS_TOKEN)
//         }
//         const decodedToken = this.tokenService.decodeAccessToken(accessToken) as { iat?: number, userId?: string };
//         // Проверяем, что хотя бы `iat` и `userId` есть
//         if (!decodedToken?.iat || !decodedToken?.userId) {
//             throw new ErRes(INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_ACCESS_TOKEN);
//         }
//         // Сначала проверяем по базе
//         const sessionExists = await this.usersSessionsRepository._getSessionsByCreationDateRepository(
//             Number(decodedToken.userId),
//             decodedToken.iat
//         );
//         if (!sessionExists) {
//             throw new ErRes(INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_ACCESS_TOKEN);
//         }
//         // Только теперь проверяем валидность токена (вдруг уже протух)
//         const userData = this.tokenService.validateAccessToken(accessToken);
//         if (!userData) {
//             throw new ErRes(INTERNAL_STATUS_CODE.UNAUTHORIZED_INVALID_ACCESS_TOKEN);
//         }
//         // console.log('AuthAccessGuard: - sessionExists', sessionExists)
//         const isUpdateLastSeen = await this.usersService.updateLastSeenService(Number(decodedToken.userId))
//         const user = await this.usersService._getUserByIdService(Number(decodedToken.userId));

//         if (isUpdateLastSeen && user) {
//             // console.log('AuthAccessGuard: - 😎 OK', user)
//             req.user = user
//             return true
//         } else {
//             throw new ErRes(INTERNAL_STATUS_CODE.ERROR_UPDATE_LAST_SEEN)
//         }
//     }
// }