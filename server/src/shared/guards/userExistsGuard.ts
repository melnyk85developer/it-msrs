// import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
// import { UsersService } from "../../services/users/usersService";
// import { ErRes } from "../utils/ErRes";
// import { INTERNAL_STATUS_CODE } from "../utils/utils";

// @Injectable()
// export class UserExistsGuard implements CanActivate {
//     constructor(
//         private readonly usersService: UsersService
//     ){}

//     async canActivate(context: ExecutionContext): Promise<boolean> {
//         const request = context.switchToHttp().getRequest();
//         const userId = Number(request.body.postedByUserId);

//         const user = await this.usersService._getUserByIdService(userId);
//         console.log('UserExistsGuard: - user', user)

//         if (!user) {
//             throw new ErRes(INTERNAL_STATUS_CODE.NOT_FOUND_USERID);
//         }

//         return true;
//     }
// }
