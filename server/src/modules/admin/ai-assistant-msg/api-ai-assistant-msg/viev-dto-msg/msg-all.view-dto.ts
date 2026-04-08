import { AiAssistantMessageDocument } from "../../ai-assistant-domain/ai-assistant-msg.entity";

export class AiAssistantMessagesAllViewDto {
    msgId: string;
    prompt: string;
    senderId: string;
    receiverId: string;
    dialogId: string;
    createdAt: string;
    updatedAt: string;

    static mapToMessagesAiAssistantAllView(msg: AiAssistantMessageDocument): AiAssistantMessagesAllViewDto {
        const dto = new AiAssistantMessagesAllViewDto();
        dto.msgId = msg._id.toString();
        dto.prompt = msg.content;
        dto.senderId = msg.senderId;
        dto.receiverId = msg.receiverId;
        dto.dialogId = msg.dialogId;
        dto.createdAt = msg.createdAt;
        dto.updatedAt = msg.updatedAt;

        return dto;
    }
}