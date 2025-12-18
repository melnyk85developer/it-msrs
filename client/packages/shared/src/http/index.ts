import axios from "axios";
import { AuthResponse } from "../types/response/AuthResponce";

export const API_URL = `http://localhost:5006`

// const $api = axios.create({
//     withCredentials: true,
//     baseURL: API_URL
// })

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
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})

$api.interceptors.response.use((config) => {
    return config;
}, async function(error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && originalRequest && !originalRequest._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/auth/refresh-token`, { withCredentials: true });
            localStorage.setItem('token', response.data.accessToken);
            return $api(originalRequest);
        } catch (error) {
            console.error('НЕ АВТОРИЗОВАН!', error);
        }
    }
    return Promise.reject(error);
});
export default $api
