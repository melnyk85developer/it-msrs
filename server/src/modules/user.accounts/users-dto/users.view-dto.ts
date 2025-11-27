import { OmitType } from "@nestjs/swagger";
import { UserDocument } from "../users-domain/user.entity";

export class UserViewDto {
    id: string;
    login: string;
    email: string;
    // createdAt: string;

    static mapToView(user: UserDocument): UserViewDto {
        // console.log('UsersController: mapToView - user 😡 ', user)
        const dto = new UserViewDto();

        dto.id = user._id.toString();
        dto.email = user.accountData.email;
        dto.login = user.accountData.userName;
        // dto.createdAt = user.accountData.createdAt;

        // console.log('UsersController: mapToView - dto 😡 ', dto)

        return dto;
    }
}
export class MeViewDto extends OmitType(UserViewDto, [
    // 'createdAt',
    'id',
] as const) {
    id: string;

    static mapToView(user: UserDocument): MeViewDto {
        const dto = new MeViewDto();

        dto.email = user.accountData.email;
        dto.login = user.accountData.userName;
        dto.id = user._id.toString();

        return dto;
    }
}