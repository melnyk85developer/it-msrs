import { AxiosResponse } from "axios";
import { MessagesType } from "@/types/types";
import $api from "../http";

export default class UserMessageAPI {
    static async getInterlocutorAPI(): Promise<AxiosResponse<any>> {
        return $api.get<any[]>('/messages/interlocutors')
    }
    static async getDialogAPI(dialogId: number, senderId: number, receiverId: number): Promise<AxiosResponse<any>> {
        // console.log('getDialogAPI: - dialogId', dialogId)
        return $api.get<any[]>(`/messages/dialog/${dialogId}`, { params: { senderId, receiverId } })
    }
    static async createUserMessageAPI(message: MessagesType): Promise<AxiosResponse<MessagesType>> {
        // console.log('createUserMessageAPI: - message', message)

        const formData = new FormData();
        formData.append('localId', `${message.localId}`);
        formData.append('message', `${message.message}`);
        formData.append('senderId', `${Number(message.senderId)}`);
        formData.append('receiverId', `${Number(message.receiverId)}`);
        formData.append('read', `${Boolean(message.read)}`);
        formData.append('createdAt', `${message.createdAt}`);
        formData.append('replyToMessageId', `${Number(message.replyToMessageId)}`);

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
        formData.append('senderId', `${Number(message.senderId)}`);
        formData.append('receiverId', `${Number(message.receiverId)}`);
        formData.append('read', `${Boolean(message.read)}`);
        formData.append('createdAt', `${message.createdAt}`);
        formData.append('replyToMessageId', `${Number(message.replyToMessageId)}`);

        message.attachments?.forEach(att => {
            if (att instanceof File || att instanceof Blob) {
                formData.append('attachments[]', att, (att as File).name);
            } else {
                formData.append('attachments[]', att);
            }
        });
        return await $api.put<MessagesType>('/messages/', formData);
    }
    static async updateReadAPI(msgId: number, read: boolean): Promise<AxiosResponse<MessagesType>> {
        return await $api.put<MessagesType>('/messages/read', {msgId, read});
    }
    static async deleteMessageAPI(msgId: number, deleteOption: string): Promise<AxiosResponse<any>> {
        // console.log('deleteMessageAPI deleteOption', deleteOption)
        return await $api.delete<any>(`/messages/${msgId}`, { params: { deleteOption } })
    }
    static async deleteAllMessagesAPI(senderId: number, receiverId: number, deleteOption: string): Promise<AxiosResponse<any>> {
        console.log('deleteAllMessageAPI: deleteOption - ', deleteOption)
        return await $api.delete<any>('/messages/all', { params: { senderId, receiverId, deleteOption } })
    }
    static async deleteDialogAPI(dialogId: number, senderId: number, receiverId: number): Promise<AxiosResponse<any>> {
        // console.log('deleteDialogAPI: dialogId, senderId, receiverId - ', dialogId, senderId, receiverId)
        return await $api.delete<any>(`/messages/dialog/${dialogId}`, { params: { senderId, receiverId } })
    }
}