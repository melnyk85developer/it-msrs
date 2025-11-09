import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../redux-store";
import { ITrack } from "@/types/musicTypes";
import musicAPI from "../../services/musicAPI";

const initialState = {
    track: {} as ITrack,
    error: '',
    newListen: null as number | null,
    newComment: {
        trackId: null as number | null,
        commentId: null as number | null,
    },
    clickTrackId: null as number | null,
    onDoubleClickId: null as number | null,
    activeTrackId: null as number | null,
    setStatePlayPauseTrack: '' as string,

    itemPauseTrackId: null as number | null,
    itemPlayTrackId: null as number | null,
    isLoading: false,
}

export const trackSlice = createSlice({
    name: 'tarck',
    initialState,
    reducers: {
        trackFetching(state){
            state.isLoading = true
        },
        setTrack(state, action: PayloadAction<ITrack>){
            state.isLoading = false
            state.error = ''
            state.track = action.payload
        },
        postTrack(state, action: PayloadAction<ITrack>){
            state.isLoading = false
            state.error = ''
            state.track = action.payload
        },
        deleteTrack(state, action: PayloadAction<ITrack>){
            state.isLoading = false
            state.error = ''
            state.track = action.payload
        },
        listensTrack(state, action: PayloadAction<any>){
            state.isLoading = false
            state.error = ''
            state.newListen = action.payload
        },
        commentTrack(state, action: PayloadAction<any>){
            state.isLoading = false
            state.error = ''
            state.newComment = action.payload
        },
        onDubleClickId(state, action: PayloadAction<number>){
            state.isLoading = false
            state.error = ''
            state.onDoubleClickId = action.payload
        },
        clickTrack(state, action: PayloadAction<any>){
            state.isLoading = false
            state.error = ''
            state.clickTrackId = action.payload
        },
        activeTrackId(state, action: PayloadAction<any>){
            state.isLoading = false
            state.error = ''
            state.activeTrackId = action.payload
        },
        setStatePlayPauseTrack(state, action: PayloadAction<any>){
            state.isLoading = false
            state.error = ''
            state.setStatePlayPauseTrack = action.payload
        },
        itemPauseTrackId(state, action: PayloadAction<any>){
            state.isLoading = false
            state.error = ''
            state.itemPauseTrackId = action.payload
        },
        itemPlayTrackId(state, action: PayloadAction<any>){
            state.isLoading = false
            state.error = ''
            state.itemPlayTrackId = action.payload
        },
        setTrackError(state, action: PayloadAction<string>){
            state.isLoading = false
            state.error = action.payload
        },
    }
})
export const getTrackAC = (trackId: number) => async (dispatch: AppDispatch) => {
    const data = await musicAPI.getTrackAPI(trackId);
    try {
        dispatch(trackSlice.actions.setTrack(data.data));
    } catch (e) {
        dispatch(trackSlice.actions.setTrackError('Проитзошла ошибка при загрузке трека!'));
    }
}
export const postTrackAC = (nameTrack: string, text: string, artist: string, picture: any, audio: any, duration: string) => async (dispatch: AppDispatch) => {
    const data = await musicAPI.postTrackAPI(nameTrack, text, artist, picture, audio, duration);
    console.log(data)
    try {
        dispatch(trackSlice.actions.postTrack(data.data));
    } catch (e) {
        dispatch(trackSlice.actions.setTrackError('Проитзошла ошибка при отправке трека!'));
    }
}
export const deleteTrackAC = (trackId: number) => async (dispatch: AppDispatch) => {
    const data = await musicAPI.deleteTrackAPI(trackId);
    console.log(data)
    try {
        dispatch(trackSlice.actions.deleteTrack(data.data));
    } catch (e) {
        dispatch(trackSlice.actions.setTrackError('Проитзошла ошибка удалении трека!'));
    }
}
export const listensTrackAC = (trackId: number) => async (dispatch: AppDispatch) => {
    const data = await musicAPI.listensTrackAPI(trackId)
    try {
        dispatch(trackSlice.actions.listensTrack(data.data));
    } catch (e) {
        dispatch(trackSlice.actions.setTrackError('Проитзошла ошибка удалении трека!'));
    }
}
export const commentTrackAC = (username: string, text: string, trackId: string) => async (dispatch: AppDispatch) => {
    const data = await musicAPI.commentTrackAPI(username, text, trackId);
    try {
        // dispatch(trackSlice.actions.commentTrack({trackId, data._id}));
    } catch (e) {
        dispatch(trackSlice.actions.setTrackError('Проитзошла ошибка комментировании трека!'));
    }
}
export const clickTrackIdAC = (trackId: number) => async (dispatch: AppDispatch) => {
    dispatch(trackSlice.actions.clickTrack(trackId)); 
}
export const onDoubleClickIdAC = (trackId: number) => async (dispatch: AppDispatch) => {
    dispatch(trackSlice.actions.onDubleClickId(trackId)); 
}
export const setNewActiveTrackIdAC = (trackId: number) => async (dispatch: AppDispatch) => {
    dispatch(trackSlice.actions.activeTrackId(trackId));
}
export const setStatePlayPauseTrackIdAC = (isPlay: string) => async (dispatch: AppDispatch) => {
    dispatch(trackSlice.actions.setStatePlayPauseTrack(isPlay));
}
export const setItemPauseTrackIdAC = (trackId: number) => async (dispatch: AppDispatch) => {
    dispatch(trackSlice.actions.itemPauseTrackId(trackId));
}
export const setItemPlayTrackIdAC = (trackId: number) => async (dispatch: AppDispatch) => {
    dispatch(trackSlice.actions.itemPlayTrackId(trackId)); 
}
export default trackSlice.reducer