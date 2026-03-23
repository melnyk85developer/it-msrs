import { DialogAiAssistantDocument } from "src/modules/admin/ai-assistant-dialog/ai-assistant-dialog-domain/ai-assistant-dialog-entity";

export class AiAssistantDialogViewDto {
    dialogId: string;
    userAId: string;
    userBId: string;
    createdAt: string;
    updatedAt: string;
    static mapToView(data: DialogAiAssistantDocument): AiAssistantDialogViewDto {
        const dto = new AiAssistantDialogViewDto();

        dto.dialogId = data._id.toString();
        dto.userAId = data.userAId;
        dto.userBId = data.userBId;
        dto.createdAt = data.createdAt;
        dto.updatedAt = data.updatedAt;
        return dto;
    }
}