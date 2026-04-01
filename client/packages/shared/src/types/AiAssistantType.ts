export type ModelProviderType = {
    id: string;
    name: string;
    version: string;
}
export type GoogleProviderType = {
    free: ModelProviderType[];
    paid: ModelProviderType[];
}
export type OpenAIProviderType = {
    free: ModelProviderType[];
    paid: ModelProviderType[];
}
export type OllamaLocalProviderType = {
    free: ModelProviderType[];
    paid: ModelProviderType[];
    localPC: {
        name: string[];
        node: string;
    };
}
export type AIProvidersType = {
    google: GoogleProviderType
    openai: OpenAIProviderType
    ollama: OllamaLocalProviderType
}
export type AiAssistantInterlocutor = {
    profileId: string;
    avatar: string;
    lastSeen: string;
    login: string;
    name: string;
    surname: string;
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
    dialogId?: string;
    provider?: string;
    model?: string;
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