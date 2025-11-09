import $api from "../http";
import { AxiosResponse } from "axios";
import { IUser } from "../types/IUser";
import { ITrack } from "@/types/musicTypes";

export default class musicAPI {
    static async postTrackAPI(nameTrack: string, text: string, artist: string, picture: any, audio: any, duration: string): Promise<AxiosResponse<ITrack>> {
        
        const formData = new FormData()

        formData.append('name', nameTrack)
        formData.append('text', text)
        formData.append('artist', artist)
        formData.append('picture', picture)
        formData.append('audio', audio)
        formData.append('duration', duration)

        return await $api.post<ITrack>(`/track/`, formData)
    }
    static async getTracksAPI(): Promise<AxiosResponse<ITrack[]>> {
        const tracks = await $api.get<ITrack[]>('/tracks')
        console.log('getTracksAPI', tracks)
        return tracks
    }
    static async getTrackAPI(trackId: number): Promise<AxiosResponse<ITrack>> {
        return await $api.get<ITrack>(`/track/${trackId}`)
    }
    static async deleteTrackAPI(trackId: number): Promise<AxiosResponse<ITrack>> {
        return await $api.get<ITrack>(`/track/${trackId}`)
    }
    static async listensTrackAPI(trackId: number): Promise<AxiosResponse<ITrack>> {
        return await $api.get<ITrack>(`/track/${trackId}`)
    }
    static async commentTrackAPI(username: string, text: string, trackId: string): Promise<AxiosResponse<ITrack>> {
        return await $api.get<ITrack>(`/track/${trackId}`, {params: {username, text, trackId}})
    }
    static async searchTracksAPI(query: string): Promise<AxiosResponse<string>> {
        return await $api.get<string>('/tracks')
    }
}