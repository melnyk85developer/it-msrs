import $api from "../http";
import { AxiosResponse } from "axios";
import { IUser } from "../types/IUser";
import { AuthResponse } from "@/types/response/AuthResponce";

export default class MyAdminAPI {
    static getUsersAdminAPI(): Promise<AxiosResponse<IUser[]>> {
        return $api.get<IUser[]>('/users')
    }
    static createUsersAdminAPI(user: any): Promise<AxiosResponse<any>> {
        const { name, surname, email, password, isBot, avatar } = user
        // console.log('createUsersAPI: - isBot', isBot)

        const formData = new FormData()
        formData.append('name', name)
        formData.append('surname', surname)
        formData.append('email', email)
        formData.append('password', password)
        formData.append('isBot', isBot)
        formData.append('image', avatar)

        return $api.post<AuthResponse>('/users/', formData)
    }
    static deleteUsersAdminAPI(userId: number): Promise<AxiosResponse<any>> {
        return $api.delete<any>(`/users/${userId}`)
    }
    static getFtpFilesAPI(folder: string): Promise<AxiosResponse<{files: string[], folder: string}>> {
        // Получаем список имён файлов в папке, JSON массив строк
        return $api.get<any>(`/admin/static/ftp/img/${folder}`);
    }

    static getFtpAvatarFileAPI(fileName: string, folder: string): Promise<AxiosResponse<Blob>> {
        // console.log('getFtpAvatarFileAPI: - fileName 😡', fileName)
        return $api.get<Blob>(`/admin/static/ftp/${folder}`, { params: { fileName }, responseType: 'blob' });
    }
}