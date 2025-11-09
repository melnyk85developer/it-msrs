import $api from "../http";
import { AxiosResponse } from "axios";
import { AuthResponse } from "../types/response/AuthResponce";

export default class AuthAPI {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return await $api.post<AuthResponse>('/auth/login', {email, password})
    }
    static async registration(name: string, surname: string, email: string, password: string, avatar?: any): Promise<AxiosResponse<AuthResponse>> {

        const formData = new FormData()
        formData.append('name', name)
        formData.append('surname', surname)
        formData.append('email', email)
        formData.append('password', password)
        formData.append('image', avatar)

        return await $api.post<AuthResponse>('/auth/registration', formData)
    }
    static async registrationEmailResendingAPI(email: string): Promise<any> {
        // console.log('registrationEmailResendingAPI: - email', email)
        return await $api.post('/auth/registration-email-resending', { email })
    }
    static async logout(): Promise<void> {
        return await $api.post('/auth/logout')
    }
    static async refreshAPI(): Promise<AxiosResponse<AuthResponse>> {
        return await $api.post<AuthResponse>('/auth/refresh', {withCredentials: true})
    }
}