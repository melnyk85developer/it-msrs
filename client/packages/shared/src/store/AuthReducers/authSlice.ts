import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../types/IUser"
import { AppDispatch } from "../redux-store";
import AuthAPI from "../../services/authAPI";

interface AuthState {
    authorizedUser: IUser;
    isAuth: boolean;
    isDarkTheme: string;
    isLoadingAuthUser: boolean;
    successfulRegistration: string;
    error: string;
    systemMsg: string;
}

const initialState: AuthState = {
    authorizedUser: {} as IUser,
    isAuth: false,
    isDarkTheme: localStorage.getItem("isDarkTheme"),
    isLoadingAuthUser: false,
    successfulRegistration: '',
    error: '',
    systemMsg: ''
}

export const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userIsLoading(state, action) {
            state.isLoadingAuthUser = action.payload
        },
        userIsAuth(state, action) {
            state.error = ''
            state.isAuth = action.payload
        },
        setIsDark(state, action) {
            state.error = ''
            state.isDarkTheme = action.payload
        },
        userFetchingSuccess(state, action: PayloadAction<IUser>) {
            state.error = ''
            state.authorizedUser = action.payload
        },
        successfulRegistration(state, action: PayloadAction<string>) {
            state.successfulRegistration = action.payload
        },
        userFetchingError(state, action: PayloadAction<string>) {
            state.error = action.payload
        },
        userFetchingSuccessMsgServer(state, action: PayloadAction<string>) {
            state.systemMsg = action.payload
        },
    }
})
export const isDarkThemeAC = (theme: string) => async (dispatch: AppDispatch) => {
    localStorage.setItem("isDarkTheme", theme)
    dispatch(authSlice.actions.setIsDark(theme))
}
export const registrationAC = (login: string, name: string, surname: string, email: string, password: string, avatar?: any) => async (dispatch: AppDispatch) => {
    // console.log(name, surname, email, password, avatar)
    try {
        const data = await AuthAPI.registration(login, name, surname, email, password, avatar)
        console.log('registrationAC: - ', data)

        // localStorage.setItem('token', data.data.accessToken)
        // dispatch(authSlice.actions.userFetchingSuccess(data.data))
        // dispatch(authSlice.actions.userIsAuth(true))
    } catch (error: any) {
        console.log('registrationAC: - ERROR', error.response?.data?.message)
        dispatch(authSlice.actions.userFetchingError(error.response?.data?.message))
        return error.response?.data?.message
        // dispatch(authSlice.actions.userIsAuth(false)); 
    }
}
export const loginAC = (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
        const data = await AuthAPI.login(email, password)
        console.log('loginAC: - data', data)
        localStorage.setItem('token', data.data.accessToken)
        const responce = await AuthAPI.me()
        console.log('loginAC: - responce.data', responce.data)
        dispatch(authSlice.actions.userFetchingSuccess(responce.data))
        dispatch(authSlice.actions.userIsAuth(true))
        return data.data
    } catch (error: any) {
        console.log('loginAC: - error', error)
        dispatch(authSlice.actions.userFetchingError(error.data?.data?.message))
        dispatch(authSlice.actions.userIsAuth(false))
    }
}
export const successfulRegistrationAC = (email: string) => (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.successfulRegistration(email))
}
export const registrationEmailResendingAC = (email: string) => async (dispatch: AppDispatch) => {
    // console.log('registrationEmailResendingAC: - email', email)
    try {
        const data = await AuthAPI.registrationEmailResendingAPI(email)
        // console.log('registrationEmailResendingAC: - res', data)
        // localStorage.setItem('token', data.data.accessToken)
        // dispatch(authSlice.actions.userFetchingSuccess(data.data.user))
        // dispatch(authSlice.actions.userIsAuth(true))
        return data.data
    } catch (error: any) {
        console.log('registrationEmailResendingAC: - res error', error.response.data)
        dispatch(authSlice.actions.userFetchingError(error.response?.data?.message))
        // dispatch(authSlice.actions.userIsAuth(false))
        return error.response?.data?.message
    }
}
export const logoutAC = () => async (dispatch: AppDispatch) => {
    try {
        const data = await AuthAPI.logout()
        console.log('logoutAC: - data', data)
        localStorage.removeItem('token')
        dispatch(authSlice.actions.userFetchingSuccess({} as IUser))
        dispatch(authSlice.actions.userIsAuth(false))
    } catch (error: any) {
        dispatch(authSlice.actions.userFetchingError(error.data?.data?.message))
    }
}
export const checkAuthAC = () => async (dispatch: AppDispatch) => {
    dispatch(authSlice.actions.userIsLoading(true))
    try {
        const response = await AuthAPI.refreshAPI()
        // console.log('checkAuthAC: - data', response)
        localStorage.setItem('token', response.data.accessToken)
        const responce = await AuthAPI.me()
        // console.log('checkAuthAC: - responce.data', responce.data)
        dispatch(authSlice.actions.userFetchingSuccess(responce.data))
        dispatch(authSlice.actions.userIsAuth(true))

    } catch (error: any) {
        console.error(error)
        dispatch(authSlice.actions.userFetchingError(error.data?.data?.message))
        dispatch(authSlice.actions.userIsAuth(false))
    } finally {
        dispatch(authSlice.actions.userIsLoading(false))
    }
}
export const systemSuccessMsgServerAC = (msg: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(authSlice.actions.userFetchingSuccessMsgServer(msg))
        dispatch(authSlice.actions.userIsAuth(false))
    } catch (error: any) {
        dispatch(authSlice.actions.userFetchingError(error.data?.data?.message))
    }
}
export default authSlice.reducer