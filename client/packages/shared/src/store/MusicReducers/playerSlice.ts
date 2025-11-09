import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../redux-store";
import { ITrack, PlayerState } from "../../types/musicTypes";

const initialState: PlayerState = {
    active: null,
    pause: true,
    volume: 70,
    currentTime: 0,
    duration: 0,
    isLoading: false,
    error: ''
    // onDoubleClick: '' as string
}

export const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        usersFetching(state){
            state.isLoading = true
        },
        pause(state, action: PayloadAction<ITrack[]>){
            state.isLoading = false
            state.error = ''
            state.pause = true
        },
        play(state, action: PayloadAction<ITrack[]>){
            state.isLoading = false
            state.error = ''
            state.pause = false
        },
        setCurrentTime(state, action: PayloadAction<any>){
            state.isLoading = false
            state.error = ''
            state.currentTime = action.payload
        },
        setVolume(state, action: PayloadAction<any>){
            state.isLoading = false
            state.error = ''
            state.volume = action.payload
        },
        setDuration(state, action: PayloadAction<any>){
            state.isLoading = false
            state.error = ''
            state.duration = action.payload
        },
        setActive(state, action: PayloadAction<ITrack>){
            state.isLoading = false
            state.error = ''
            state.active = action.payload
        },
        playerError(state, action: PayloadAction<string>){
            state.isLoading = false
            state.error = action.payload
        },
    }
})

export const playTrackAC = () => async (dispatch: AppDispatch) => {
    dispatch(playerSlice.actions.play());
}
export const pauseTrackAC = () => async (dispatch: AppDispatch) => {
    dispatch(playerSlice.actions.pause());
}
export const setActiveTrackAC = (payload: ITrack) => async (dispatch: AppDispatch) => {
    dispatch(playerSlice.actions.setActive(payload));
}
export const setDurationTrackAC = (payload: any) => async (dispatch: AppDispatch) => {
    dispatch(playerSlice.actions.setDuration(payload));
}
export const setCurrentTimeTrackAC = (payload: any) => async (dispatch: AppDispatch) => {
    dispatch(playerSlice.actions.setCurrentTime(payload));
}
export const setVolumeTrackAC = (payload: any) => async (dispatch: AppDispatch) => {
    dispatch(playerSlice.actions.setVolume(payload));
}
export default playerSlice.reducer