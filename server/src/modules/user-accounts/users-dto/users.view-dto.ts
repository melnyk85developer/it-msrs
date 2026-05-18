import { OmitType } from "@nestjs/swagger";
import { UserDocument } from "../users-domain/user.entity";

export class UserViewDto {
    id: string;
    avatar: string | null;
    login: string;
    email: string;
    // name: string | null
    // surname: string | null
    // isBot: boolean
    createdAt: string;
    static mapToView(user: UserDocument): UserViewDto {
        // console.log('UsersController: mapToView - user 😡 ', user)
        const dto = new UserViewDto();
        dto.id = user._id.toString();
        dto.avatar = user.profileData.avatar;
        dto.email = user.accountData.email;
        dto.login = user.accountData.login;
        // dto.name = user.profileData.name;
        // dto.surname = user.profileData.surname;
        // dto.isBot = user.systemUserData.isBot;
        dto.createdAt = user.createdAt;
        // console.log('UsersController: mapToView - dto 😡 ', dto)
        return dto;
    }
}