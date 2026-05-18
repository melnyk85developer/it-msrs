import { OmitType } from "@nestjs/swagger";
import { UserDocument } from "../../user-accounts/users-domain/user.entity";

export class MeViewDto {
    userId: string;
    login: string;
    email: string;
    avatar?: string | null;
    name?: string | null
    surname?: string | null
    isBot?: boolean
    createdAt?: string;
    static mapToView(user: UserDocument): MeViewDto {
        // console.log('UsersController: mapToView - user 😡 ', user)
        const dto = new MeViewDto();
        dto.userId = user._id.toString();
        dto.email = user.accountData.email;
        dto.login = user.accountData.login;
        dto.avatar = user.profileData.avatar;
        dto.name = user.profileData.name;
        dto.surname = user.profileData.surname;
        dto.isBot = user.systemUserData.isBot;
        // dto.createdAt = user.createdAt;
        // console.log('UsersController: mapToView - dto 😡 ', dto)
        return dto;
    }
}