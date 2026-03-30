import { AxiosResponse } from "axios";
import $api from "../http";
import { MsgAiAssistantType } from "@/types/AiAssistantType";

export default class AiAssistantAdminAPI {
    static async getAiAssistantInterlocutorAPI(): Promise<AxiosResponse<any>> {
        return $api.get<any[]>('/admin/ai-interlocutors')
    }
    static async getDialogByReceiverIdAPI(receiverId: string, params: { pageSize: number; pageNumber: number }) {
        // console.log('AiAssistantAdminAPI: getDialogByReceiverIdAPI: - receiverId, params', receiverId, params)
        return $api.get(`/admin/ai-messages/dialog/${receiverId}`, { params })
    }
    static async getDialogByDialogIdAPI(dialogId: string) {
        return $api.get(`/admin/ai-messages/dialog/${dialogId}`)
    }
    static async addNewPromptAPI(message: MsgAiAssistantType): Promise<AxiosResponse<{ userPrompt: MsgAiAssistantType, assistantResponse: MsgAiAssistantType }>> {
        // console.log('addNewPromptAPI: - message1', message)
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
        // console.log('addNewPromptAPI: - message2', message)

        return await $api.post<{ userPrompt: MsgAiAssistantType, assistantResponse: MsgAiAssistantType }>('/admin/ai-assistant/orchestrate', message);
        // return await $api.post<MsgAiAssistantType>('/admin/ai-assistant/orchestrate', formData);
    }
    static async updateAiAssistantMessageAPI(message: MsgAiAssistantType): Promise<AxiosResponse<MsgAiAssistantType>> {
        // console.log('updateAiAssistantMessageAPI: - message', message)
        const formData = new FormData();
        formData.append('msgId', `${message.msgId}`);
        formData.append('prompt', `${message.prompt}`);
        formData.append('senderId', `${message.senderId}`);
        formData.append('receiverId', `${message.receiverId}`);
        formData.append('dialogId', `${message.dialogId}`);
        formData.append('createdAt', `${message.createdAt}`);

        message.attachments?.forEach(att => {
            if (att instanceof File || att instanceof Blob) {
                formData.append('attachments[]', att, (att as File).name);
            } else {
                formData.append('attachments[]', att);
            }
        });
        return await $api.put<MsgAiAssistantType>('/admin/ai-assistant/prompt', formData);
    }
    static async deleteAiAssistantMessageAPI(msgId: string, deleteOption: string): Promise<AxiosResponse<any>> {
        // console.log('deleteAiAssistantMessageAPI deleteOption', deleteOption)
        return await $api.delete<any>(`/admin/ai-assistant/prompt/${msgId}`, { params: { deleteOption } })
    }
    static async deleteAiAssistantAllMessagesAPI(senderId: string, receiverId: string, deleteOption: string): Promise<AxiosResponse<any>> {
        // console.log('deleteAiAssistantAllMessagesAPI: deleteOption - ', senderId, receiverId, deleteOption)
        return await $api.delete<any>('/admin/ai-assistant/prompts/all', { params: { senderId, receiverId, deleteOption } })
    }
    static async deleteAiAssistantDialogAPI(dialogId: string, senderId: string, receiverId: string): Promise<AxiosResponse<any>> {
        console.log('deleteDialogAPI: dialogId, senderId, receiverId - ', dialogId, senderId, receiverId)
        return await $api.delete<any>(`/admin/ai-assistant/dialog/${dialogId}`, {
            params: {
                senderId,
                receiverId
            }
        })
    }
}