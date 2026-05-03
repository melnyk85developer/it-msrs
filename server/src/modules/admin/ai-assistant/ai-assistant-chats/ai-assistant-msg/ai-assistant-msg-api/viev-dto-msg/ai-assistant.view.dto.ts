import { UserDocument } from "src/modules/user-accounts/users-domain/user.entity";

export class AiAssistantViewDto {
    userId: string;
    name: string | null;
    avatar: string | null;
    lastSeen: string | null;
    provider1: string | null;
    model1: string | null;
    provider2: string | null;
    model2: string | null;
    node: string | null;
    
    static mapToView(
        data: UserDocument): AiAssistantViewDto {
        const dto = new AiAssistantViewDto();

        dto.userId = data._id.toString();
        dto.name = data.profileData.name;
        dto.avatar = data.profileData.avatar;
        dto.lastSeen = data.lastSeen;
        dto.provider1 = data.systemUserData.provider1;
        dto.model1 = data.systemUserData.model1;
        dto.provider2 = data.systemUserData.provider2;
        dto.model2 = data.systemUserData.model2;
        dto.node = data.systemUserData.node;
        return dto;
    }
}