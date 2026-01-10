import axios from "axios";
import { AuthResponse } from "../types/response/AuthResponce";
import { systemSuccessMsgServerAC } from "../store/AuthReducers/authSlice";
import { useAppDispatch } from "../components/hooks/redux";

export const API_URL = `http://localhost:5006`
// const dispatch = useAppDispatch();

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
    validateStatus: (status) => {
        // console.log('Проверка статуса:', status); 
        // Ловим статус только от 200 до 299
        return status >= 200 && status < 300;
    }
})
$api.interceptors.request.use((config) => {
    // console.log('localStorage: token - ', `Bearer ${localStorage.getItem('token')}`)
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})
$api.interceptors.response.use((config) => {
    // const systemMsgServer = decodeURIComponent(config.headers['x-service-message'])
    // console.log('HTTPInterceptors: systemMsgServer: - ', systemMsgServer)
    // dispatch(systemSuccessMsgServerAC(systemMsgServer))
    return config;
}, async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && originalRequest && !originalRequest._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}/auth/refresh-token`, { withCredentials: true });
            localStorage.setItem('token', response.data.accessToken);
            return $api(originalRequest);
        } catch (error) {
            console.error('НЕ АВТОРИЗОВАН!', error);
        }
    }
    return Promise.reject(error);
});
export default $api
