import $api from "../http";
import { AxiosResponse } from "axios";
import { IUser } from "../types/IUser";
import { AuthResponse } from "@/types/response/AuthResponce";

export default class UsersAPI {
    static getUsersAPI(): Promise<AxiosResponse<IUser[]>> {
        return $api.get<IUser[]>('/users')
    }
}