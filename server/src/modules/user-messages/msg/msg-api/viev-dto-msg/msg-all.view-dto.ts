import { MessageDocument } from "../../msg-domain/msg-entity";

export class MessagesAllViewDto {
    msgId: string;
    message: string;
    senderId: string;
    receiverId: string;
    dialogId: string;
    replyToMessageId: string | null;
    read: boolean;
    createdAt: string;
    updatedAt: string;

    static mapToMessagesAllView(msg: MessageDocument): MessagesAllViewDto {
        const dto = new MessagesAllViewDto();
        dto.msgId = msg._id.toString();
        dto.message = msg.message;
        dto.senderId = msg.senderId;
        dto.receiverId = msg.receiverId;
        dto.dialogId = msg.dialogId;
        dto.replyToMessageId = msg.replyToMessageId;
        dto.read = msg.read;
        dto.createdAt = msg.createdAt;
        dto.updatedAt = msg.updatedAt;

        return dto;
    }
}