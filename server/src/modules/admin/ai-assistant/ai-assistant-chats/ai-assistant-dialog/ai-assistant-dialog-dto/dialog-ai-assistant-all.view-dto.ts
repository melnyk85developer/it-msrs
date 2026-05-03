import { DialogAiAssistantDocument } from "../ai-assistant-dialog-domain/ai-assistant-dialog-entity";

export class DialogsAiAssistantAllViewDto {
    msgId: string;
    message: string;
    senderId: string;
    receiverId: string;
    dialogId: string;
    createdAt: string;
    updatedAt: string;

    static mapToDialogsAiAssistantAllView(msg: DialogAiAssistantDocument): DialogsAiAssistantAllViewDto {
        const dto = new DialogsAiAssistantAllViewDto();
        dto.msgId = msg._id.toString();
        dto.createdAt = msg.createdAt;
        dto.updatedAt = msg.updatedAt;
        return dto;
    }
}