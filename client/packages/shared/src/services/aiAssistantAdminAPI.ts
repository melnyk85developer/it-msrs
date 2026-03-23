import { AxiosResponse } from "axios";
import $api from "../http";
import { MessagesType } from "@/types/types";
import { MsgAiAssistantType } from "@/types/AiAssistantType";

export default class AiAssistantAdminAPI {
    static async getAiAssistantInterlocutorAPI(): Promise<AxiosResponse<any>> {
        return $api.get<any[]>('/admin/ai-interlocutors')
    }
    static async getDialogAPI(receiverId: string) {
        return $api.get(`/admin/ai-messages/dialog/${receiverId}`)
    }

    static async addNewPromptAPI(message: MsgAiAssistantType): Promise<AxiosResponse<{userPrompt: MsgAiAssistantType, assistantResponse: MsgAiAssistantType}>> {
        console.log('addNewPromptAPI: - message1', message)
        const formData = new FormData();
        formData.append('localId', `${message.localId}`);
        formData.append('prompt', `${message.prompt}`);
        formData.append('senderId', `${message.senderId}`);
        formData.append('receiverId', `${message.receiverId}`);

        // formData.append('createdAt', `${message.createdAt}`);
        // prompt.attachments?.forEach(att => {
        //     if (att instanceof File || att instanceof Blob) {
        //         formData.append('attachments[]', att, (att as File).name);
        //     } else {
        //         formData.append('attachments[]', att);
        //     }
        // });
        console.log('addNewPromptAPI: - message2', message)

        return await $api.post<{userPrompt: MsgAiAssistantType, assistantResponse: MsgAiAssistantType}>('/admin/ai-assistant/orchestrate', message);
        // return await $api.post<MsgAiAssistantType>('/admin/ai-assistant/orchestrate', formData);
    }
    static async updateMessageAPI(message: MsgAiAssistantType): Promise<AxiosResponse<MsgAiAssistantType>> {
        // console.log('updateMessageAPI: - message', message)
        const formData = new FormData();
        formData.append('localId', `${message.localId}`);
        formData.append('msgId', `${message.msgId}`);
        formData.append('prompt', `${message.prompt}`);
        formData.append('senderId', `${message.senderId}`);
        formData.append('receiverId', `${message.receiverId}`);
        // formData.append('dialogId', `${message.dialogId}`);

        // formData.append('createdAt', `${message.createdAt}`);
        // message.attachments?.forEach(att => {
        //     if (att instanceof File || att instanceof Blob) {
        //         formData.append('attachments[]', att, (att as File).name);
        //     } else {
        //         formData.append('attachments[]', att);
        //     }
        // });
        return await $api.put<MsgAiAssistantType>('/messages/', formData);
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