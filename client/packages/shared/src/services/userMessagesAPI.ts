import { AxiosResponse } from "axios";
import { MessagesType } from "@/types/types";
import $api from "../http";

export default class UserMessageAPI {
    static async getInterlocutorAPI(): Promise<AxiosResponse<any>> {
        return $api.get<any[]>('/messages/interlocutors')
    }
    static async getDialogAPI(
        dialogId: string,
        params: {
            receiverId: string
            pageNumber?: number
            pageSize?: number
        }
    ) {
        return $api.get(`/messages/dialog/${dialogId}`, { params })
    }

    static async createUserMessageAPI(message: MessagesType): Promise<AxiosResponse<MessagesType>> {
        // console.log('createUserMessageAPI: - message', message)
        const formData = new FormData();
        formData.append('localId', `${message.localId}`);
        formData.append('message', `${message.message}`);
        formData.append('senderId', `${message.senderId}`);
        formData.append('receiverId', `${message.receiverId}`);
        // formData.append('read', `${message.read}`);
        if (message.replyToMessageId) {
            formData.append('replyToMessageId', message.replyToMessageId);
        }
        // formData.append('createdAt', `${message.createdAt}`);
        message.attachments?.forEach(att => {
            if (att instanceof File || att instanceof Blob) {
                formData.append('attachments[]', att, (att as File).name);
            } else {
                formData.append('attachments[]', att);
            }
        });
        return await $api.post<MessagesType>('/messages/', formData);
    }
    static async updateMessageAPI(message: MessagesType): Promise<AxiosResponse<MessagesType>> {
        // console.log('updateMessageAPI: - message', message)
        const formData = new FormData();
        formData.append('localId', `${message.localId}`);
        formData.append('msgId', `${message.msgId}`);
        formData.append('message', `${message.message}`);
        formData.append('senderId', `${message.senderId}`);
        formData.append('receiverId', `${message.receiverId}`);
        formData.append('read', `${message.read}`);
        formData.append('dialogId', `${message.dialogId}`);
        // formData.append('createdAt', `${message.createdAt}`);
        if (message.replyToMessageId) {
            formData.append('replyToMessageId', message.replyToMessageId);
        }
        // formData.append('createdAt', `${message.createdAt}`);
        message.attachments?.forEach(att => {
            if (att instanceof File || att instanceof Blob) {
                formData.append('attachments[]', att, (att as File).name);
            } else {
                formData.append('attachments[]', att);
            }
        });
        return await $api.put<MessagesType>('/messages/', formData);
    }
    static async updateReadAPI(msgId: string, read: boolean): Promise<AxiosResponse<MessagesType>> {
        return await $api.put<MessagesType>('/messages/read', { msgId, read });
    }
    static async deleteMessageAPI(msgId: string, deleteOption: string): Promise<AxiosResponse<any>> {
        // console.log('deleteMessageAPI deleteOption', deleteOption)
        return await $api.delete<any>(`/messages/${msgId}`, { params: { deleteOption } })
    }
    static async deleteAllMessagesAPI(senderId: string, receiverId: string, deleteOption: string): Promise<AxiosResponse<any>> {
        // console.log('deleteAllMessageAPI: deleteOption - ', senderId, receiverId, deleteOption)
        return await $api.delete<any>('/messages/all', { params: { senderId, receiverId, deleteOption } })
    }
    static async deleteDialogAPI(dialogId: string, senderId: string, receiverId: string): Promise<AxiosResponse<any>> {
        // console.log('deleteDialogAPI: dialogId, senderId, receiverId - ', dialogId, senderId, receiverId)
        return await $api.delete<any>(`/messages/dialog/${dialogId}`, {
            params: {
                senderId,
                receiverId
            }
        })
    }
}