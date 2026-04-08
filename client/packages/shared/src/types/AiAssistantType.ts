export type RulesForAIAssistantsType = {
    titleRules: string;
    contentRules: string;
}
export type DesignatedProviderForAIAssistantsType = {
    id: string;
    provider1: string;
    model1: string;
    provider2: string;
    model2: string;
    systemPrompts: string[]
}
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
    google: GoogleProviderType;
    openai: OpenAIProviderType;
    ollama: OllamaLocalProviderType;
}
export type AiAssistantInterlocutor = {
    userId: string;
    avatar: string;
    lastSeen: string;
    name: string;
    chat: ChatType;
    provider1?: string | null;
    model1?: string | null;
    provider2?: string | null;
    model2?: string | null;
}
export type CreateMsgAiAssistantType = {
    localId: string;
    msgId?: string;
    prompt: string;
    senderId: string;
    receiverId: string;
    dialogId?: undefined;
    createdAt: string;
    updatedAt: string;
    attachments?: any[];
}
export type MsgAiAssistantType = {
    localId: string;
    msgId?: string;
    prompt: string;
    senderId: string;
    receiverId: string;
    dialogId?: string;
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