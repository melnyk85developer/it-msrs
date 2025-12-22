import $api from "../http";
import { AxiosResponse } from "axios";
import { AuthResponse } from "../types/response/AuthResponce";

export default class AuthAPI {
    static async login(email: string, password: string): Promise<AxiosResponse<AuthResponse>> {
        return await $api.post<AuthResponse>('/auth/login', { loginOrEmail: email, password })
    }
    static async me(): Promise<AxiosResponse<{ id: string, login: string, email: string, isBot: boolean }>> {
        return await $api.get<{ id: string, login: string, email: string, isBot: boolean }>('/auth/me')
    }
    static async registration(login: string, name: string, surname: string, email: string, password: string, avatar?: any): Promise<AxiosResponse<void>> {

        const formData = new FormData()
        formData.append('login', login)
        formData.append('email', email)
        formData.append('password', password)
        formData.append('name', name)
        formData.append('surname', surname)
        formData.append('image', avatar)


        // if (name) {
        //     formData.append('name', name)
        // }
        // if (surname) {
        //     formData.append('surname', surname)
        // }
        // if (avatar) {
        //     formData.append('image', avatar)
        // }
        return await $api.post<void>('/auth/registration', formData)
    }
    static async registrationEmailResendingAPI(email: string): Promise<any> {
        // console.log('registrationEmailResendingAPI: - email', email)
        return await $api.post('/auth/registration-email-resending', { email })
    }
    static async logout(): Promise<void> {
        return await $api.post('/auth/logout')
    }
    static async refreshAPI(): Promise<AxiosResponse<AuthResponse>> {
        return await $api.post<AuthResponse>('/auth/refresh-token', { withCredentials: true })
    }
}