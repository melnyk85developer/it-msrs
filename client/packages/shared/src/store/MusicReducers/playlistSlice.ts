import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../redux-store";
import { ITrack } from "@/types/musicTypes";
import musicAPI from "../../services/musicAPI";

const initialState = {
    tracks: [] as Array<ITrack>,
    isLoading: false,
    error: '',
}
export const playlistSlice = createSlice({
    name: 'playlist',
    initialState,
    reducers: {
        trackFetching(state){
            state.isLoading = true
        },
        setTracks(state, action: PayloadAction<ITrack[]>){
            state.isLoading = false
            state.error = ''
            state.tracks = action.payload
        },
        playlistError(state, action: PayloadAction<string>){
            state.isLoading = false
            state.error = action.payload
        },
    }
})
export const getPlaylistAC = () => async (dispatch: AppDispatch) => {
    const data = await musicAPI.getTracksAPI();
    try {
        dispatch(playlistSlice.actions.setTracks(data.data));
    } catch (e) {
        dispatch(playlistSlice.actions.playlistError('Проитзошла ошибка при загрузке плейлиста!'));
    }
}
export const searchTracksAC = (query: string) => async (dispatch: AppDispatch) => {
    const data = await musicAPI.searchTracksAPI(query);
    try {
        dispatch(playlistSlice.actions.playlistError(data.data));
    } catch (e) {
        dispatch(playlistSlice.actions.playlistError('Проитзошла ошибка при поиске трека!'));
    }
}


export default playlistSlice.reducer