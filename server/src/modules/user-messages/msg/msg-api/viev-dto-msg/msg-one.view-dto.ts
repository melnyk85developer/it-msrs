import { MessageDocument } from "../../msg-domain/msg-entity";

export class MessageOneViewDto {
    localId: string;
    msgId: string;
    message: string;
    senderId: string;
    receiverId: string;
    dialogId: string;
    replyToMessageId: string | null;
    read: boolean;
    createdAt: string;
    updatedAt: string;

    static mapToOneMessageView(msg: MessageDocument, localId: string): MessageOneViewDto {
        const dto = new MessageOneViewDto();
        // console.log('MessageOneViewDto msg: 🔥 localId', msg, localId);

        dto.localId = localId
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