import { DialogDocument } from "../../dialog/dialog-domain/dialog-entity";
import { MessagesAllViewDto } from "../msg-api/viev-dto-msg/msg-all.view-dto";
import { Message, MessageDocument } from "../msg-domain/msg-entity";

export const isMessageDeletedForUser = (meta: any[], userId: string) => {
    if (!Array.isArray(meta)) return false;
    return meta.some(entry => entry.userId === userId);
};

export const queryMaperUserMessage = (message: MessageDocument, userId: string): MessageDocument | null => {
    if (isMessageDeletedForUser(message.meta, userId)) return null;
    return message;
};

export const queryMaperArrUserMessages = (messages: any[], userId: string) => {
    // console.log('queryMaperArrUserMessages: - messages', messages)

    return messages
        .map(msg => queryMaperUserMessage(msg, userId))
        .filter(Boolean); // убирает null
};

// DialogMaper

export const isDialogDeletedForUser = (meta: any[], userId: string) => {
    if (!Array.isArray(meta)) return false;
    return meta.some(entry => entry.userId === userId);
};

// export const queryMaperUserDialog = (dialog: DialogDocument, userId: string): DialogDocument | null => {
//     if (isDialogDeletedForUser(dialog.meta, userId)) return null;
//     return dialog;
// };

// export const queryMaperArrUserDialogs = (dialogs: DialogDocument[], userId: string): DialogDocument[] => {
//     // console.log('queryMaperArrUserMessages: - messages', messages)

//     return dialogs
//         .map(dialog => queryMaperUserDialog(dialog, userId))
//         .filter(Boolean); // убирает null
// };
