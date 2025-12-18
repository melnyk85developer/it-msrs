import { OmitType } from "@nestjs/swagger";
import { UserDocument } from "../users-domain/user.entity";

export class UserProfileViewDto {
    id: string;
    avatar: string | null;
    login: string;
    email: string;
    name: string | null;
    surname: string | null;
    createdAt: string;
    static mapToView(user: UserDocument): UserProfileViewDto {
        // console.log('UsersController: mapToView - user 😡 ', user)
        const dto = new UserProfileViewDto();
        dto.id = user._id.toString();
        dto.avatar = user.profileData.avatar;
        dto.email = user.accountData.email;
        dto.login = user.accountData.login;
        dto.name = user.profileData.name;
        dto.surname = user.profileData.surname;
        // dto.createdAt = user.accountData.createdAt;
        // console.log('UsersController: mapToView - dto 😡 ', dto)
        return dto;
    }
}