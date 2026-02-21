import { Dialog } from "src/modules/user-messages/dialog/dialog-domain/dialog-entity";
import { Message } from "../../msg-domain/msg-entity";

export class InterlocutorViewDto {
    userId: string;
    name: string;
    surname: string;
    // avatar: string | null;
    chat: {
        dialogId: string;
        userAId: string;
        userBId: string;
        createdAt: string;
        updatedAt: string;
    };
    lastMessage: {
        msgId: string;
        dialogId: string;
        message: string;
        senderId: string;
        receiverId: string;
        read: boolean;
        createdAt: string;
        updatedAt: string;
        replyToMessageId: string | null;
        attachments: any[]
    }; // MessageViewDto если есть

    static mapToView(data: {
        userId: string;
        name: string;
        surname: string;
        avatar: string | null;
        chat: Dialog;
        lastMessage: Message;
    }): InterlocutorViewDto {
        const dto = new InterlocutorViewDto();

        dto.userId = data.userId;
        dto.name = data.name;
        dto.surname = data.surname;
        // dto.avatar = data.avatar;
        dto.chat = {
            dialogId: data.chat.id.toString(),
            userAId: data.chat.userBId,
            userBId: data.chat.userBId,
            createdAt: data.chat.createdAt,
            updatedAt: data.chat.updatedAt
        };
        dto.lastMessage = {
            msgId: data.lastMessage.id,
            dialogId: data.lastMessage.dialogId,
            message: data.lastMessage.message,
            senderId: data.lastMessage.senderId,
            receiverId: data.lastMessage.receiverId,
            read: data.lastMessage.read,
            createdAt: data.lastMessage.createdAt,
            updatedAt: data.lastMessage.updatedAt,
            replyToMessageId: data.lastMessage.replyToMessageId,
            attachments: data.lastMessage.attachments
        };

        return dto;
    }
}