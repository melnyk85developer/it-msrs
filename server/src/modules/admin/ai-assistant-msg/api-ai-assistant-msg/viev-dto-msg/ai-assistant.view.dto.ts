import { UserDocument } from "src/modules/user-accounts/users-domain/user.entity";

export class AiAssistantViewDto {
    userId: string;
    name: string | null;
    avatar: string | null;
    static mapToView(
        data: UserDocument): AiAssistantViewDto {
        const dto = new AiAssistantViewDto();

        dto.userId = data._id.toString();
        dto.name = data.profileData.name;
        dto.avatar = data.profileData.avatar;
        return dto;
    }
}