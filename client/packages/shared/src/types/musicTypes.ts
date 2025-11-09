export interface PlayerState {
    active: null | ITrack
    volume: number
    duration: number
    currentTime: number
    pause: boolean
    isLoading: boolean
    error: string
}

export interface IComment {
    commentId: number;
    username: string;
    text: string;
}
export interface ITrack {
    trackId: number;
    name: string;
    artist: string;
    text: string;
    listens: number;
    like: number;
    dislike: number;
    duration: string;
    picture: string;
    audio: string;
    comments: IComment[]
}
export interface TrackState {
    tracks: ITrack[]
    error: string
}