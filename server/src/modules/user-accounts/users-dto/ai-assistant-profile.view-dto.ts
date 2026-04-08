import { OmitType } from "@nestjs/swagger";
import { UserDocument } from "../users-domain/user.entity";

export class AiAssistantViewDto {
    profileId: string;
    avatar: string | null;
    login: string;
    email: string;
    name: string | null;
    surname: string | null;
    lastSeen: string;
    static mapToView(user: UserDocument): AiAssistantViewDto {
        // console.log('UsersController: mapToView - user 😡 ', user)
        const dto = new AiAssistantViewDto();
        dto.profileId = user._id.toString();
        dto.avatar = user.profileData.avatar;
        dto.email = user.accountData.email;
        dto.login = user.accountData.login;
        dto.name = user.profileData.name;
        dto.surname = user.profileData.surname;
        dto.lastSeen = user.lastSeen;
        // console.log('UsersController: mapToView - dto 😡 ', dto)
        return dto;
    }
}