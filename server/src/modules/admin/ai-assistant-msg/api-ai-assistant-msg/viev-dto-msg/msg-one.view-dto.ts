import { AiAssistantMessageDocument } from "../../ai-assistant-domain/ai-assistant.entity";

export class AiAssistantMessageOneViewDto {
    localId: string;
    msgId: string;
    prompt: string;
    senderId: string;
    receiverId: string;
    dialogId: string;
    createdAt: string;
    updatedAt: string;

    static mapToOneAiAssistantMessageView(msg: AiAssistantMessageDocument, localId: string): AiAssistantMessageOneViewDto {
        const dto = new AiAssistantMessageOneViewDto();
        // console.log('MessageOneViewDto msg: 🔥 localId', msg, localId);

        dto.localId = localId
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