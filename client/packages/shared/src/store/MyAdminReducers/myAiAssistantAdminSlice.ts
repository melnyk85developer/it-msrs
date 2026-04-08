import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../redux-store";
import { ChatType } from "@/types/types";
import { AiAssistantInterlocutor, AIProvidersType, CreateMsgAiAssistantType, DesignatedProviderForAIAssistantsType, GoogleProviderType, ModelProviderType, MsgAiAssistantType, OllamaLocalProviderType, OpenAIProviderType, RulesForAIAssistantsType } from "@/types/AiAssistantType";
import AiAssistantAdminAPI from "../../services/aiAssistantAdminAPI";

interface AIAssistantAdminState {
    systemPromptsForTerminators: RulesForAIAssistantsType[];
    providers: AIProvidersType;
    goole_provider_ai: GoogleProviderType;
    openai_provider_ai: OpenAIProviderType;
    ollama_local_provider_ai: OllamaLocalProviderType;

    currentInterlocutor: AiAssistantInterlocutor;
    currentChat: ChatType | null;
    lastMessage: CreateMsgAiAssistantType | MsgAiAssistantType;
    interlocutors: AiAssistantInterlocutor[];
    prompts: MsgAiAssistantType[];

    pageSize: number;
    totalAiAssistantMessageCount: number;
    currentPage: number;
    isFetching: boolean;
    isSending: boolean;
    isDeleting: Boolean;
    isSpiner: boolean;
    sendingMessages: string[];
    updatingMessages: string[];
    deletingMessages: string[];
    isLoading: Boolean;
    filter: any;
    error: string;
}
const initialState: AIAssistantAdminState = {
    systemPromptsForTerminators: [] as RulesForAIAssistantsType[],
    providers: {} as AIProvidersType,
    goole_provider_ai: {} as GoogleProviderType,
    openai_provider_ai: {} as OpenAIProviderType,
    ollama_local_provider_ai: {} as OllamaLocalProviderType,

    currentInterlocutor: {} as AiAssistantInterlocutor,
    currentChat: {} as ChatType,
    lastMessage: {} as CreateMsgAiAssistantType,
    interlocutors: [] as Array<AiAssistantInterlocutor>,
    prompts: [],

    pageSize: 100,
    totalAiAssistantMessageCount: 0,
    currentPage: 1,
    isFetching: true,
    isSending: false,
    isDeleting: false,
    isSpiner: false,
    isLoading: false,

    filter: {
        term: '',
        friend: undefined as undefined | boolean
    },
    sendingMessages: [] as string[],
    updatingMessages: [] as string[],
    deletingMessages: [] as string[],
    error: '',
}

const deduplicateMessages = (messages: MsgAiAssistantType[]) => {
    const seen = new Set<string>();

    return messages.filter(message => {
        const key = message.msgId || message.localId;

        if (!key || seen.has(key)) {
            return false;
        }

        seen.add(key);
        return true;
    });
}

export const myAIAssistantAdminSlice = createSlice({
    name: 'adminAiAssistant',
    initialState,
    reducers: {
        meagsesIsLoading(state) {
            state.isLoading = true
        },
        meagsesIsSending(state) {
            state.isSending = true
        },
        meagseUpdating(state, action: PayloadAction<any>) {
            state.error = ''
            state.isSpiner = true
            state.updatingMessages.push(action.payload);
        },
        stopMeagseUpdating(state, action: PayloadAction<any>) {
            state.error = ''
            state.updatingMessages = state.updatingMessages.filter(
                msgId => msgId !== action.payload.msgId
            );
            state.isSpiner = false
        },
        meagsesIsSpiner(state, action: PayloadAction<boolean>) {
            state.error = ''
            state.isSpiner = action.payload
        },
        setRulesForAIAssistants(state, action: PayloadAction<RulesForAIAssistantsType[]>) {
            // console.log('setRulesForAIAssistants: - action.payload', action.payload)
            state.error = ''
            state.systemPromptsForTerminators = action.payload
            state.isLoading = false
        },
        setAIProviders(state, action: PayloadAction<AIProvidersType>) {
            // console.log('setAIProviders: - action.payload', action.payload)
            state.error = ''
            // state.providers = action.payload
            state.goole_provider_ai = action.payload.google
            state.openai_provider_ai = action.payload.openai
            state.ollama_local_provider_ai = action.payload.ollama
            state.providers = action.payload
            state.isLoading = false
        },
        setCurrentInterlocutor(state, action: PayloadAction<AiAssistantInterlocutor>) {
            // console.log('setCurrentInterlocutor: - action.payload', action.payload)
            state.error = ''
            state.currentInterlocutor = action.payload
            state.isLoading = false
        },
        removeChat(state) {
            state.error = ''
            state.currentChat = {} as ChatType
            state.isLoading = false
        },
        setAllAiAssistantInterlocutors(state, action: PayloadAction<AiAssistantInterlocutor[]>) {
            state.error = ''
            state.interlocutors = action.payload
            state.isLoading = false
        },
        setCurrentChat(state, action: PayloadAction<ChatType>) {
            state.error = ''
            state.currentChat = action.payload
            state.isLoading = false
        },
        // В редьюсеры твоего слайса:
        setMessagesCurrentChat(state, action: PayloadAction<MsgAiAssistantType[]>) {
            state.prompts = deduplicateMessages(action.payload);
            state.isSending = false;
        },
        addOlderMessages(state, action: PayloadAction<MsgAiAssistantType[]>) {
            const newArray = deduplicateMessages([...action.payload, ...state.prompts]);
            state.prompts = newArray.slice(0, 40); // Окно 40
            state.isSending = false;
        },
        addNewerMessages(state, action: PayloadAction<MsgAiAssistantType[]>) {
            const newArray = deduplicateMessages([...state.prompts, ...action.payload]);
            state.prompts = newArray.slice(-40); // Окно 40
            state.isSending = false;
        },
        addNewPrompt(state, action: PayloadAction<MsgAiAssistantType | CreateMsgAiAssistantType>) {
            // console.log('addNewPrompt: - action.payload', action.payload)
            state.error = ''
            state.sendingMessages.push(action.payload.localId);
            // console.log('addNewPrompt: - state.sendingMessages', state.sendingMessages)
            // console.log('addNewPrompt: - state.prompts1', state.prompts)
            state.prompts.push(action.payload)
            state.lastMessage = action.payload
            // console.log('addNewPrompt: - state.prompts2', state.prompts)
            state.isSending = true

        },
        // Обновляем только сообщение юзера (меняем localId на данные с бэка)
        updateUserPrompt(state, action: PayloadAction<MsgAiAssistantType>) {
            if (action.payload.localId) {
                const index = state.prompts.findIndex(m => m.localId === action.payload.localId);
                if (index !== -1) {
                    state.prompts[index] = {
                        ...state.prompts[index],
                        ...action.payload
                    };
                    // Убираем из лоадинга
                    state.sendingMessages = state.sendingMessages.filter(localId => localId !== action.payload.localId);
                }
            }
        },
        // Тупо пушим ответ ассистента в самый конец
        addAssistantResponse(state, action: PayloadAction<MsgAiAssistantType>) {
            state.error = '';
            state.prompts.push(action.payload);
            state.isSending = false;
        },
        updateMessage(state, action: PayloadAction<MsgAiAssistantType>) {
            // console.log('updateMessage: - action.payload', action.payload)
            state.error = ''
            state.isSpiner = true
            state.updatingMessages.push(action.payload.msgId);
            const index = state.prompts.findIndex(m => m.msgId === action.payload.msgId);
            if (index !== -1) {
                // console.log('updateResponceMessage: - IF action.payload', action.payload)
                state.prompts[index] = {
                    ...state.prompts[index],
                    ...action.payload
                };
            } else {
                // console.log('updateResponceMessage: - ELSE action.payload', action.payload)
                state.prompts.push(action.payload)
            }
        },
        meagseIsDeleting(state, action: PayloadAction<any>) {
            // console.log('meagsesIsDeleting: - action.payload', action.payload)
            state.deletingMessages.push(action.payload.msgId);
            state.isDeleting = true
        },
        removeMessage(state, action: PayloadAction<string>) {
            // console.log('removeMessage: - action.payload', action.payload)
            state.prompts = state.prompts.filter(m => m.msgId !== action.payload);
            state.deletingMessages = state.deletingMessages.filter(msgId => msgId !== action.payload);
            state.isDeleting = false;
        },
        clearChat(state) {
            state.prompts = []
            state.isDeleting = false;
        },

        setCurrentPage(state, action: PayloadAction<number>) {
            state.error = ''
            state.currentPage = action.payload
            state.isSending = false
        },
        setAssistantsTotalCount(state, action: PayloadAction<number>) {
            state.error = ''
            state.totalAiAssistantMessageCount = action.payload
        },
        setFilter(state, action: PayloadAction<{ term: string, friend: string }>) {
            state.error = ''
            state.filter = action.payload
            state.isSending = false
        },
        usersFetchingError(state, action: PayloadAction<string>) {
            state.error = action.payload
            state.isSending = false
        },
    }
})
export const getAllSystemPromptsAiAssistantsAC = () => async (dispatch: AppDispatch) => {
    try {
        const response = await AiAssistantAdminAPI.getSystemPromptsAiAssistantsAPI()
        // console.log('getRulesAiAssistantsAC: - RES', response)
        dispatch(myAIAssistantAdminSlice.actions.setRulesForAIAssistants(response.data))
    } catch (error: any) {
        dispatch(myAIAssistantAdminSlice.actions.usersFetchingError(error.message))
    }
}
export const createSystemPromptAiAssistantsAC = (addRules: RulesForAIAssistantsType) => async (dispatch: AppDispatch) => {
    try {
        const response = await AiAssistantAdminAPI.addRulesAiAssistantsAPI(addRules)
        console.log('createRulesAiAssistantsAC: - RES', response)
        dispatch(myAIAssistantAdminSlice.actions.setRulesForAIAssistants(response.data))
    } catch (error: any) {
        dispatch(myAIAssistantAdminSlice.actions.usersFetchingError(error.message))
    }
}
export const updateSystemPromptForAiAssistantsAC = (addRules: RulesForAIAssistantsType) => async (dispatch: AppDispatch) => {
    try {
        const response = await AiAssistantAdminAPI.addRulesAiAssistantsAPI(addRules)
        // console.log('createRulesAiAssistantsAC: - RES', response)
        dispatch(myAIAssistantAdminSlice.actions.setRulesForAIAssistants(response.data))
    } catch (error: any) {
        dispatch(myAIAssistantAdminSlice.actions.usersFetchingError(error.message))
    }
}
export const saveDesignatedProviderAndModelAC = (aiProvider: DesignatedProviderForAIAssistantsType) => async (dispatch: AppDispatch) => {
    try {
        const response = await AiAssistantAdminAPI.saveDesignatedProviderAndModelAPI(aiProvider)
        console.log('createRulesAiAssistantsAC: - RES', response)
        dispatch(myAIAssistantAdminSlice.actions.setRulesForAIAssistants(response.data))
    } catch (error: any) {
        dispatch(myAIAssistantAdminSlice.actions.usersFetchingError(error.message))
    }
}
export const getAiProvidersAndModelsAC = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(myAIAssistantAdminSlice.actions.meagsesIsSending())
        const response = await AiAssistantAdminAPI.getAiProvidersAndModelsAPI()
        // console.log('getAiProvidersAndModelsAC: - RES', response.data)
        dispatch(myAIAssistantAdminSlice.actions.setAIProviders(response.data))
    } catch (error: any) {
        dispatch(myAIAssistantAdminSlice.actions.usersFetchingError(error.message))
    }
}
export const getAiAssistantInterlocutorAC = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(myAIAssistantAdminSlice.actions.meagsesIsSending())
        const response = await AiAssistantAdminAPI.getAiAssistantInterlocutorAPI()
        // console.log('getInterlocutorAC: - RES', response.data)
        dispatch(myAIAssistantAdminSlice.actions.setAllAiAssistantInterlocutors(response.data.items))
        // console.log('getInterlocutorAC: - RES', response.data.items)
    } catch (error: any) {
        dispatch(myAIAssistantAdminSlice.actions.usersFetchingError(error.message))
    }
}
export const getDialogAiAssistantMessagesAC = (receiverId: string, params: { pageSize: number; pageNumber: number }, type: 'init' | 'older' | 'newer' = 'init') => async (dispatch: AppDispatch) => {
    // console.log('getDialogAiAssistantMessagesAC: - receiverId, params', receiverId, params)

    try {
        const response = await AiAssistantAdminAPI.getDialogByReceiverIdAPI(receiverId, params);
        // console.log('getDialogAiAssistantMessagesAC: - response.data.items', response.data.items)

        if (response.data && response.data.items) {
            const { allMsg, currentChat, interlocutor } = response.data.items;
            // console.log('getDialogAiAssistantMessagesAC: - response.data.items', response.data.items)
            // console.log('getDialogAiAssistantMessagesAC: - totalCount', response.data.totalCount)

            // 🔥 Сохраняем общее кол-во сообщений в твой существующий стейт
            if (response.data.totalCount !== undefined) {
                dispatch(myAIAssistantAdminSlice.actions.setAssistantsTotalCount(response.data.totalCount));
            }

            // Логика сообщений
            if (allMsg.length) {
                if (type === 'older') {
                    dispatch(myAIAssistantAdminSlice.actions.addOlderMessages(allMsg));
                } else if (type === 'newer') {
                    dispatch(myAIAssistantAdminSlice.actions.addNewerMessages(allMsg));
                } else {
                    dispatch(myAIAssistantAdminSlice.actions.setMessagesCurrentChat(allMsg));
                }
            } else {
                dispatch(myAIAssistantAdminSlice.actions.setMessagesCurrentChat([]));
            }

            if (currentChat) {
                dispatch(myAIAssistantAdminSlice.actions.setCurrentChat(currentChat));
            } else {
                dispatch(myAIAssistantAdminSlice.actions.setCurrentChat({} as ChatType));
            }
            if (interlocutor) {
                dispatch(myAIAssistantAdminSlice.actions.setCurrentInterlocutor(interlocutor));
            } else {
                dispatch(myAIAssistantAdminSlice.actions.setCurrentInterlocutor({} as AiAssistantInterlocutor));
            }
        }
    } catch (error: any) {
        dispatch(myAIAssistantAdminSlice.actions.usersFetchingError(error.message));
    }
};
export const sendNewPromptAC = (message: MsgAiAssistantType) => async (dispatch: AppDispatch) => {
    // console.log('sendNewPromptAC message: - req', message)
    try {
        dispatch(myAIAssistantAdminSlice.actions.addNewPrompt(message))
        const response = await AiAssistantAdminAPI.addNewPromptAPI(message)
        // console.log('sendNewPromptAC response.data: - ', response.data)
        dispatch(myAIAssistantAdminSlice.actions.updateUserPrompt(response.data.userPrompt))
        dispatch(myAIAssistantAdminSlice.actions.addAssistantResponse(response.data.assistantResponse))
        return response.data
    } catch (error: any) {
        dispatch(myAIAssistantAdminSlice.actions.usersFetchingError(error.message))
    }
}

export const updateAiAssistantMessageAC = (newMsg: MsgAiAssistantType, oldMsg: MsgAiAssistantType) => async (dispatch: AppDispatch) => {
    // console.log('updateMessageAC newMsg: - req', newMsg)
    try {
        dispatch(myAIAssistantAdminSlice.actions.updateMessage(newMsg));
        const response = await AiAssistantAdminAPI.updateAiAssistantMessageAPI(newMsg);
        if (response.status === 200) {
            // console.log('updateMessageAC message: - IF status', response.status);
            // console.log('updateMessageAC message: - IF ', response.data);
            dispatch(myAIAssistantAdminSlice.actions.stopMeagseUpdating(response.data));
        } else {
            // console.log('updateMessageAC message: - ELSE ', response.data);
            dispatch(myAIAssistantAdminSlice.actions.updateMessage(oldMsg));
            dispatch(myAIAssistantAdminSlice.actions.stopMeagseUpdating(oldMsg));
        }
        return response.status
    } catch (error: any) {
        dispatch(myAIAssistantAdminSlice.actions.usersFetchingError(error.message));
    }
}
export const deleteAiAssistantMessageAC = (msgId: string, deleteOption: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(myAIAssistantAdminSlice.actions.meagseIsDeleting(msgId));
        const response = await AiAssistantAdminAPI.deleteAiAssistantMessageAPI(msgId, deleteOption);
        return response.status
    } catch (error: any) {
        dispatch(myAIAssistantAdminSlice.actions.usersFetchingError(error.message))
    }
}
export const deleteAiAssistantAllMessagesAC = (senderId: string, receiverId: string, deleteOption: string) => async (dispatch: AppDispatch) => {
    try {
        // console.log('deleteAiAssistantAllMessagesAC: senderId, receiverId, deleteOption - ', senderId, receiverId, deleteOption)
        const response = await AiAssistantAdminAPI.deleteAiAssistantAllMessagesAPI(senderId, receiverId, deleteOption);
        if (response.status === 204) {
            // console.log('deleteAiAssistantAllMessagesAC: response.status - ', response.status)
            dispatch(myAIAssistantAdminSlice.actions.clearChat())
        }
        return response.status
    } catch (error: any) {
        dispatch(myAIAssistantAdminSlice.actions.usersFetchingError(error.message))
    }
}
export const deleteAiAssistantDialogAC = (dialogId: string, senderId: string, receiverId: string) => async (dispatch: AppDispatch) => {
    // console.log('deleteDialogAC: senderId, receiverId - ', senderId, receiverId)
    try {
        const response = await AiAssistantAdminAPI.deleteAiAssistantDialogAPI(dialogId, senderId, receiverId);
        if (response.status === 204) {
            // console.log('deleteDialogAC: response.status - ', response.status)
            dispatch(myAIAssistantAdminSlice.actions.removeChat())
        }
        return response.status
    } catch (error: any) {
        dispatch(myAIAssistantAdminSlice.actions.usersFetchingError(error.message))
    }
}
export const clearAiAssistantMessageStateAC = (msgId: string) => async (dispatch: AppDispatch) => {
    // console.log('clearMessageStateAC smsId', msgId)
    dispatch(myAIAssistantAdminSlice.actions.removeMessage(msgId));
}
export default myAIAssistantAdminSlice.reducer
