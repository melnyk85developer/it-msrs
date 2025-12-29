import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../redux-store";
import SettingsMyProfileAPI from "../../services/settingsMyProfileAPI";
import { ISessionsProfile } from "../../types/IUser";
import { authSlice } from "../AuthReducers/authSlice";

const initialState = {
    sessions: [] as ISessionsProfile[] | null,
    error: '',
}

export const settingMyProfileSlice = createSlice({
    name: 'settingprofile',
    initialState,
    reducers: {
        sessionsReceived(state, action: PayloadAction<ISessionsProfile[] | null>){
            state.sessions = action.payload
        },
        deleteAllSessions(state, action: PayloadAction<string>){
            const deviceId = action.payload
            state.sessions = state.sessions.filter(item => item.deviceId === deviceId)
        },
        deleteSession(state, action: PayloadAction<string>){
            const deviceId = action.payload
            state.sessions = state.sessions.filter(item => item.deviceId !== deviceId)
        },
        settingMyProfileFetchingError(state, action: PayloadAction<string>){
            state.error = action.payload
        },
    }
})

export const sessionsReceivedAC = () => async (dispatch: AppDispatch) => {
    try {
        const userData = await SettingsMyProfileAPI.getSessionAPI();
        dispatch(settingMyProfileSlice.actions.sessionsReceived(userData.data.items));
        // console.log('sessionsReceivedAC: ', userData.data);
        if(userData.status === 401){
            dispatch(authSlice.actions.userIsAuth(false))
        }
        // return userData.data
    }catch(error: any){
        dispatch(settingMyProfileSlice.actions.settingMyProfileFetchingError(error.response?.data?.message));
    }
};
export const deleteSessionAC = (deviceId: string) => async (dispatch: AppDispatch) => {
    try {
        const userData = await SettingsMyProfileAPI.deleteSessionAPI(deviceId);
        console.log('deleteSessionAC: - res userData', userData)
        if(userData.status === 204){
            dispatch(settingMyProfileSlice.actions.deleteSession(deviceId));
        }else if(userData.status === 401){
            console.log('deleteSessionAC: - res userData', userData)
            dispatch(authSlice.actions.userIsAuth(false))
        }
    }catch(error: any){
        console.log('deleteSessionAC: - res catch', error)
        dispatch(authSlice.actions.userIsAuth(false))
        dispatch(settingMyProfileSlice.actions.settingMyProfileFetchingError(error.response?.data?.message));
    }
};
export const deleteAllSessionsAC = (deviceId: string) => async (dispatch: AppDispatch) => {
    try {
        const userData = await SettingsMyProfileAPI.deleteAllSessionsAPI();
        console.log('deleteAllSessionsAC: - res userData', userData)
        if(userData.status === 204){
            dispatch(settingMyProfileSlice.actions.deleteSession(deviceId));
        }
    }catch(error: any){
        dispatch(settingMyProfileSlice.actions.settingMyProfileFetchingError(error.response?.data?.message));
    }
};
export default settingMyProfileSlice.reducer