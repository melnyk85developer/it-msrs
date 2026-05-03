import { AiAssistantMessageDocument } from "../ai-assistant-msg/ai-assistant-msg-domain/ai-assistant-msg.entity";


export const isMessageDeletedForUser = (meta: any[], userId: string) => {
    if (!Array.isArray(meta)) return false;
    return meta.some(entry => entry.userId === userId);
};

export const queryMaperUserMessage = (message: AiAssistantMessageDocument, userId: string): AiAssistantMessageDocument | null => {
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

export const isDialogAiAssistantDeletedForUser = (meta: any[], userId: string) => {
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
