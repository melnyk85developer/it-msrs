import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../redux-store";
import { ChatType, Interlocutor, MessagesType, PostsType } from "@/types/types";
import { AiAssistantInterlocutor, CreateMsgAiAssistantType, MsgAiAssistantType } from "@/types/AiAssistantType";
import AiAssistantAdminAPI from "../../services/aiAssistantAdminAPI";

interface AIAssistantAdminState {
    currentInterlocutor: AiAssistantInterlocutor;
    currentChat: ChatType;
    lastMessage: MsgAiAssistantType;
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
    currentInterlocutor: {} as AiAssistantInterlocutor,
    currentChat: {} as ChatType,
    lastMessage: {} as MsgAiAssistantType,
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
        // meagseUpdating(state, action: PayloadAction<any>) {
        //     state.error = ''
        //     state.isSpiner = true
        //     state.updatingMessages.push(action.payload);
        // },
        // stopMeagseUpdating(state, action: PayloadAction<any>) {
        //     state.error = ''
        //     state.updatingMessages = state.updatingMessages.filter(
        //         msgId => msgId !== action.payload.msgId
        //     );
        //     state.isSpiner = false
        // },
        // meagsesIsSpiner(state, action: PayloadAction<boolean>) {
        //     state.error = ''
        //     state.isSpiner = action.payload
        // },
        setCurrentInterlocutor(state, action: PayloadAction<AiAssistantInterlocutor>) {
            state.error = ''
            state.currentInterlocutor = action.payload
            state.isLoading = false
        },

        // removeChat(state) {
        //     state.error = ''
        //     state.currentChat = {}
        //     state.isLoading = false
        // },
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
        setMessagesCurrentChat(state, action: PayloadAction<MsgAiAssistantType[]>) {
            state.error = ''
            state.prompts = action.payload
            state.isSending = false
        },
        addNewPrompt(state, action: PayloadAction<MsgAiAssistantType>) {
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
        addResponseMsgFromTheAI(state, action: PayloadAction<MsgAiAssistantType>) {
            state.error = ''
            // Если сообщение уже было добавлено временно (с localId), обновим его
            const index = state.prompts.findIndex(m => m.localId === action.payload.localId);
            if (index !== -1) {
                // console.log('addResponceMessage: - IF action.payload', action.payload)
                state.prompts[index] = {
                    ...state.prompts[index],
                    ...action.payload
                };
                state.sendingMessages = state.sendingMessages.filter(localId => localId !== action.payload.localId);
            } else {
                // console.log('addResponceMessage: - ELSE action.payload', action.payload)
                state.prompts.push(action.payload)
            }
            state.isSending = false
            // console.log('addResponseMsgFromTheAI: - messages', state.messages)

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
            console.log('removeMessage: - action.payload', action.payload)
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
        setFilter(state, action: PayloadAction<{ term: string, friend: string }>) {
            state.error = ''
            state.filter = action.payload
            state.isSending = false
        },
        setUsersTotalCount(state, action: PayloadAction<number>) {
            state.error = ''
            state.totalAiAssistantMessageCount = action.payload
        },
        usersFetchingError(state, action: PayloadAction<string>) {
            state.error = action.payload
            state.isSending = false
        },
    }
})
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
export const getDialogAiAssistantMessagesAC = (receiverId: string) => async (dispatch: AppDispatch) => {
    // console.log('getDialogMessagesAC: - REQ senderId, receiverId', senderId, receiverId)
    try {
        const response = await AiAssistantAdminAPI.getDialogAPI(receiverId)
        console.log('getDialogAiAssistantMessagesAC: - RES data', response.data)
        dispatch(myAIAssistantAdminSlice.actions.setMessagesCurrentChat(response.data.allMsg))
        dispatch(myAIAssistantAdminSlice.actions.setCurrentChat(response.data.currentChat))
        dispatch(myAIAssistantAdminSlice.actions.setCurrentInterlocutor(response.data.interlocutor))


        // const allMsg = response.data.allMsg
        // console.log('getDialogAiAssistantMessagesAC: - RES allMsg', allMsg)
        // const chat = response.data.currentChat
        // // console.log('getDialogMessagesAC: - RES chat', chat)
        // const currentInterlocutor = response.data.interlocutor
        // // console.log('getDialogMessagesAC: - RES currentInterlocutor', currentInterlocutor)
        // if (response.data) {
        //     if (allMsg.length) {
        //         dispatch(myAIAssistantAdminSlice.actions.setMessagesCurrentChat(response.data.allMsg))
        //     }else{
        //         dispatch(myAIAssistantAdminSlice.actions.setMessagesCurrentChat([]))
        //     }
        //     if (chat) {
        //         dispatch(myAIAssistantAdminSlice.actions.setCurrentChat(chat))
        //     }
        //     if (currentInterlocutor) {
        //         dispatch(myAIAssistantAdminSlice.actions.setCurrentInterlocutor(currentInterlocutor))
        //     }
        // }
    } catch (error: any) {
        dispatch(myAIAssistantAdminSlice.actions.usersFetchingError(error.message))
    }
}
export const sendNewPromptAC = (message: MsgAiAssistantType) => async (dispatch: AppDispatch) => {
    console.log('sendNewPromptAC message: - req', message)
    try {
        dispatch(myAIAssistantAdminSlice.actions.addNewPrompt(message))
        const response = await AiAssistantAdminAPI.addNewPromptAPI(message)
        console.log('sendNewPromptAC response.data: - ', response.data)
        dispatch(myAIAssistantAdminSlice.actions.addResponseMsgFromTheAI(response.data.userPrompt))
        dispatch(myAIAssistantAdminSlice.actions.addResponseMsgFromTheAI(response.data.assistantResponse))
        return response.data
    } catch (error: any) {
        dispatch(myAIAssistantAdminSlice.actions.usersFetchingError(error.message))
    }
}
// export const updateMessageAC = (newMsg: MsgAiAssistantType, oldMsg: MsgAiAssistantType) => async (dispatch: AppDispatch) => {
//     // console.log('updateMessageAC newMsg: - req', newMsg)
//     try {
//         dispatch(myAIAssistantAdminSlice.actions.updateMessage(newMsg));
//         const response = await AiAssistantAdminAPI.updateMessageAPI(newMsg);
//         if (response.status === 200) {
//             // console.log('updateMessageAC message: - IF status', response.status);
//             // console.log('updateMessageAC message: - IF ', response.data);
//             dispatch(myAIAssistantAdminSlice.actions.stopMeagseUpdating(response.data));
//         } else {
//             // console.log('updateMessageAC message: - ELSE ', response.data);
//             dispatch(myAIAssistantAdminSlice.actions.updateMessage(oldMsg));
//             dispatch(myAIAssistantAdminSlice.actions.stopMeagseUpdating(oldMsg));
//         }
//         return response.status
//     } catch (error: any) {
//         dispatch(myAIAssistantAdminSlice.actions.usersFetchingError(error.message));
//     }
// }
// export const deleteMessageAC = (msgId: string, deleteOption: string) => async (dispatch: AppDispatch) => {
//     try {
//         dispatch(myAIAssistantAdminSlice.actions.meagseIsDeleting(msgId));
//         const response = await AiAssistantAdminAPI.deleteMessageAPI(msgId, deleteOption);
//         return response.status
//     } catch (error: any) {
//         dispatch(myAIAssistantAdminSlice.actions.usersFetchingError(error.message))
//     }
// }
// export const deleteAllMessagesAC = (senderId: string, receiverId: string, deleteOption: string) => async (dispatch: AppDispatch) => {
//     try {
//         // dispatch(messagesSlice.actions.meagsesIsDeleting(msgId));
//         const response = await AiAssistantAdminAPI.deleteAllMessagesAPI(senderId, receiverId, deleteOption);
//         if (response.status === 204) {
//             console.log('deleteAllMessagesAC: response.status - ', response.status)
//             dispatch(myAIAssistantAdminSlice.actions.clearChat())
//         }
//         return response.status
//     } catch (error: any) {
//         dispatch(myAIAssistantAdminSlice.actions.usersFetchingError(error.message))
//     }
// }
// export const deleteDialogAC = (dialogId: string, senderId: string, receiverId: string) => async (dispatch: AppDispatch) => {
//     // console.log('deleteDialogAC: senderId, receiverId - ', senderId, receiverId)
//     try {
//         // dispatch(messagesSlice.actions.meagsesIsDeleting(msgId));
//         const response = await AiAssistantAdminAPI.deleteDialogAPI(dialogId, senderId, receiverId);
//         if (response.status === 204) {
//             dispatch(myAIAssistantAdminSlice.actions.removeChat())
//         }
//         return response.status
//     } catch (error: any) {
//         dispatch(myAIAssistantAdminSlice.actions.usersFetchingError(error.message))
//     }
// }
// export const clearMessageStateAC = (msgId: string) => async (dispatch: AppDispatch) => {
//     // console.log('clearMessageStateAC smsId', msgId)
//     dispatch(myAIAssistantAdminSlice.actions.removeMessage(msgId));
// }
export default myAIAssistantAdminSlice.reducer