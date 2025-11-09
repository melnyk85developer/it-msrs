import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../types/IUser"
import { AppDispatch } from "../redux-store";
import { Interlocutor, MessagesType } from "@/types/types";
import UserMessageAPI from "../../services/userMessagesAPI";

interface IMessageState {
    currentInterlocutor: Interlocutor;
    currentChat: any;
    lastMessage: MessagesType;
    interlocutors: Interlocutor[];
    messages: MessagesType[];

    pageSize: number;
    totalUsersMessageCount: number;
    currentPage: number;
    isFetching: boolean;
    isSending: boolean;
    isDeleting: Boolean;
    isSpiner: boolean;
    sendingMessages: number[];
    updatingMessages: number[];
    deletingMessages: number[];
    isLoading: Boolean;
    filter: any;
    error: string;
}

const initialState: IMessageState = {
    currentInterlocutor: {} as Interlocutor,
    currentChat: {},
    lastMessage: {} as MessagesType,
    interlocutors: [] as Array<Interlocutor>,
    messages: [] as Array<MessagesType | any>,

    pageSize: 100,
    totalUsersMessageCount: 0,
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
    sendingMessages: [] as number[],
    updatingMessages: [] as number[],
    deletingMessages: [] as number[],
    error: '',
}

export const messagesSlice = createSlice({
    name: 'messages',
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
        setCurrentInterlocutor(state, action: PayloadAction<Interlocutor>) {
            state.error = ''
            state.currentInterlocutor = action.payload
            state.isLoading = false
        },
        setCurrentChat(state, action: PayloadAction<IUser>) {
            state.error = ''
            state.currentChat = action.payload
            state.isLoading = false
        },
        removeChat(state) {
            state.error = ''
            state.currentChat = {}
            state.isLoading = false
        },
        setAllInterlocutors(state, action: PayloadAction<Interlocutor[]>) {
            state.error = ''
            state.interlocutors = action.payload
            state.isLoading = false
        },
        setMessagesCurrentChat(state, action: PayloadAction<MessagesType[]>) {
            state.error = ''
            state.messages = action.payload
            state.isSending = false
        },
        addMessage(state, action: PayloadAction<MessagesType>) {
            // console.log('addMessage: - action.payload', action.payload)
            state.error = ''
            state.sendingMessages.push(action.payload.localId);
            state.messages.push(action.payload)
            state.lastMessage = action.payload
            state.isSending = true
        },
        addResponceMessage(state, action: PayloadAction<MessagesType>) {
            state.error = ''
            // Если сообщение уже было добавлено временно (с localId), обновим его
            const index = state.messages.findIndex(m => m.localId === action.payload.localId);
            if (index !== -1) {
                // console.log('addResponceMessage: - IF action.payload', action.payload)

                state.messages[index] = {
                    ...state.messages[index],
                    ...action.payload
                };
                state.sendingMessages = state.sendingMessages.filter(localId => localId !== action.payload.localId);
            } else {
                // console.log('addResponceMessage: - ELSE action.payload', action.payload)
                state.messages.push(action.payload)
            }
            state.isSending = false
        },
        updateMessage(state, action: PayloadAction<MessagesType>) {
            // console.log('updateMessage: - action.payload', action.payload)
            state.error = ''
            state.isSpiner = true
            state.updatingMessages.push(action.payload.msgId);
            const index = state.messages.findIndex(m => m.msgId === action.payload.msgId);
            if (index !== -1) {
                console.log('updateResponceMessage: - IF action.payload', action.payload)
                state.messages[index] = {
                    ...state.messages[index],
                    ...action.payload
                };
            } else {
                console.log('updateResponceMessage: - ELSE action.payload', action.payload)
                state.messages.push(action.payload)
            }
        },
        updateRead(state, action: PayloadAction<{ msgId: number, read: boolean }>) {
            // console.log('updateMessage: - action.payload', action.payload)
            state.error = ''
            state.isSpiner = true

            const index = state.messages.findIndex(m => m.msgId === action.payload.msgId);
            if (index !== -1) {
                // console.log('updateResponceMessage: - IF action.payload', action.payload)
                state.messages[index].read = action.payload.read;
            }
        },
        meagseIsDeleting(state, action: PayloadAction<any>) {
            // console.log('meagsesIsDeleting: - action.payload', action.payload)
            state.deletingMessages.push(action.payload.msgId);
            state.isDeleting = true
        },
        removeMessage(state, action: PayloadAction<number>) {
            console.log('removeMessage: - action.payload', action.payload)
            state.messages = state.messages.filter(m => m.msgId !== action.payload);
            state.deletingMessages = state.deletingMessages.filter(msgId => msgId !== action.payload);
            state.isDeleting = false;
        },
        clearChat(state) {
            state.messages = []
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
            state.totalUsersMessageCount = action.payload
        },
        usersFetchingError(state, action: PayloadAction<string>) {
            state.error = action.payload
            state.isSending = false
        },
    }
})
export const getInterlocutorAC = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(messagesSlice.actions.meagsesIsSending())
        const response = await UserMessageAPI.getInterlocutorAPI()
        dispatch(messagesSlice.actions.setAllInterlocutors(response.data))
        // console.log('getInterlocutorAC: - RES', response.data)
    } catch (error: any) {
        dispatch(messagesSlice.actions.usersFetchingError(error.message))
    }
}
export const getDialogMessagesAC = (dialogId: number, senderId: number, receiverId: number) => async (dispatch: AppDispatch) => {
    // console.log('getDialogMessagesAC: - REQ senderId, receiverId', senderId, receiverId)
    try {
        const response = await UserMessageAPI.getDialogAPI(dialogId, senderId, receiverId)
        // console.log('getDialogMessagesAC: - RES', response.data)
        dispatch(messagesSlice.actions.setMessagesCurrentChat(response.data.allMsg))
        dispatch(messagesSlice.actions.setCurrentChat(response.data.currentChat))
        dispatch(messagesSlice.actions.setCurrentInterlocutor(response.data.interlocutor))
    } catch (error: any) {
        dispatch(messagesSlice.actions.usersFetchingError(error.message))
    }
}
export const sendMessageAC = (message: MessagesType) => async (dispatch: AppDispatch) => {
    // console.log('sendMessageAC message: - req', message)
    try {
        dispatch(messagesSlice.actions.addMessage(message))
        const response = await UserMessageAPI.createUserMessageAPI(message)
        dispatch(messagesSlice.actions.addResponceMessage(response.data))
        // console.log('sendMessageAC response.data: - ', response.data)
        return response.data
    } catch (error: any) {
        dispatch(messagesSlice.actions.usersFetchingError(error.message))
    }
}
export const updateMessageAC = (newMsg: MessagesType, oldMsg: MessagesType) => async (dispatch: AppDispatch) => {
    console.log('updateMessageAC newMsg: - req', newMsg)
    try {
        dispatch(messagesSlice.actions.updateMessage(newMsg));
        const response = await UserMessageAPI.updateMessageAPI(newMsg);
        if (response.status === 200) {
            // console.log('updateMessageAC message: - IF status', response.status);
            // console.log('updateMessageAC message: - IF ', response.data);
            dispatch(messagesSlice.actions.stopMeagseUpdating(response.data));
        } else {
            // console.log('updateMessageAC message: - ELSE ', response.data);
            dispatch(messagesSlice.actions.updateMessage(oldMsg));
            dispatch(messagesSlice.actions.stopMeagseUpdating(oldMsg));
        }
        return response.status
    } catch (error: any) {
        dispatch(messagesSlice.actions.usersFetchingError(error.message));
    }
}
export const updateReadAC = (msgId: number, read: boolean) => async (dispatch: AppDispatch) => {
    // console.log('updateReadAC: - msgId, read - REQ', msgId, read)
    try {
        const response = await UserMessageAPI.updateReadAPI(msgId, read);
        if (response.status === 200) {
            // console.log('updateMessageAC message: - IF status', response.status);
            // console.log('updateMessageAC message: - IF ', response.data);
            dispatch(messagesSlice.actions.updateRead(response.data));
        } else {
            // console.log('updateMessageAC message: - ELSE ', response.data);
            dispatch(messagesSlice.actions.updateRead({
                msgId: Number(msgId),
                read: false,
            }));
        }
        return response.status
    } catch (error: any) {
        dispatch(messagesSlice.actions.usersFetchingError(error.message));
    }
}
export const deleteMessageAC = (msgId: number, deleteOption: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(messagesSlice.actions.meagseIsDeleting(msgId));
        const response = await UserMessageAPI.deleteMessageAPI(msgId, deleteOption);
        return response.status
    } catch (error: any) {
        dispatch(messagesSlice.actions.usersFetchingError(error.message))
    }
}
export const deleteAllMessagesAC = (senderId: number, receiverId: number, deleteOption: string) => async (dispatch: AppDispatch) => {
    try {
        // dispatch(messagesSlice.actions.meagsesIsDeleting(msgId));
        const response = await UserMessageAPI.deleteAllMessagesAPI(senderId, receiverId, deleteOption);
        if (response.status === 204) {
            // console.log('deleteAllMessagesAC: response.status - ', response.status)
            dispatch(messagesSlice.actions.clearChat())
        }
        return response.status
    } catch (error: any) {
        dispatch(messagesSlice.actions.usersFetchingError(error.message))
    }
}
export const deleteDialogAC = (dialogId: number, senderId: number, receiverId: number) => async (dispatch: AppDispatch) => {
    // console.log('deleteDialogAC: senderId, receiverId - ', senderId, receiverId)
    try {
        // dispatch(messagesSlice.actions.meagsesIsDeleting(msgId));
        const response = await UserMessageAPI.deleteDialogAPI(dialogId, senderId, receiverId);
        if (response.status === 204) {
            dispatch(messagesSlice.actions.removeChat())
        }
        return response.status
    } catch (error: any) {
        dispatch(messagesSlice.actions.usersFetchingError(error.message))
    }
}
export const clearMessageStateAC = (msgId: number) => async (dispatch: AppDispatch) => {
    // console.log('clearMessageStateAC smsId', msgId)
    dispatch(messagesSlice.actions.removeMessage(msgId));
}
export default messagesSlice.reducer