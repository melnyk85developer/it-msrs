import $api from "../http";
import { AxiosResponse } from "axios";
import { ISessionsProfile } from "../types/IUser";


export default class SettingsMyProfileAPI {
    static getSessionAPI(): Promise<AxiosResponse<any>> {
        return $api.get<ISessionsProfile[]>('/security/devices')
    }
    static deleteSessionAPI(deviceId: string): Promise<AxiosResponse<number>> {
        return $api.delete<number>(`/security/devices/${deviceId}`)
    }
    static deleteAllSessionsAPI(): Promise<AxiosResponse<number>> {
        return $api.delete<number>(`/security/devices`)
    }
}