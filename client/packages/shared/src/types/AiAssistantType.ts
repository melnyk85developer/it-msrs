export type AiAssistantInterlocutor = {
    userId: string;
    avatar: string;
    name: string;
    titleChat: string;
    chat: ChatType;
}
export type CreateMsgAiAssistantType = {
    localId: string;
    msgId: string;
    prompt: string;
    senderId: string;
    receiverId: string;
    dialogId: undefined;
    createdAt: string;
    updatedAt: string;
    attachments?: any[];
}
export type MsgAiAssistantType = {
    localId: string;
    msgId: string;
    prompt: string;
    senderId: string;
    receiverId: string;
    dialogId?: string | undefined;
    createdAt?: string;
    updatedAt?: string;
    attachments?: any[];
}
export type ChatType = {
    dialogId: string;
    userAId: string;
    userBId: string;
    createdAt: string;
    updatedAt: string;
}