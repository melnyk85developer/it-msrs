import { PostsType } from "./types";

export interface IUser {
    id: string;
    login: string
    avatar?: string | null;
    name?: string | null;
    surname?: string | null;
    // status: string;
    isBot: boolean
    // gender: string;
    // liveIn: string
    // originallyFrom: string;
    // imWorkingIn: string;
    // lookingForAJob: boolean;
    // lookingForAJobDescription: string;
    // aboutMe: string;
    // telephone: string;
    // website: string;
    // photoAlbums?: IPhotoAlbum[];
    email: string;
    // friends: Array<number>;
    // posts: Array<PostsType>
    // isActivated: boolean;
    // isConfirmed: boolean;
}
export interface IProfile {
    userId: number;
    avatar: string | null;
    name: string;
    surname: string;
    status: string;
    isBot: boolean
    gender: string;
    liveIn: string
    originallyFrom: string;
    imWorkingIn: string;
    lookingForAJob: boolean;
    lookingForAJobDescription: string;
    aboutMe: string;
    telephone: string;
    website: string;
    photoAlbums?: IPhotoAlbum[];
    email: string;
    friends: Array<number>;
    posts: Array<PostsType>
    isConfirmed: boolean;
    isActivated: boolean;
}
export interface IAnketaProfile {
    userId: number;
    authorizedUserId: number;
    name: string;
    surname: string;
    gender: string;
    liveIn: string
    originallyFrom: string;
    imWorkingIn: string;
    lookingForAJob: boolean;
    lookingForAJobDescription: string;
    aboutMe: string;
    telephone: string;
    website: string;
    email: string;
}
export interface IUpdateStatus {
    userId: number;
    authorizedUserId: number;
    status: string;
}
export interface IPhotoAlbum {
    albumId: number | null;
    userId: number | null;
    albumName: string;
    photos: Array<IPhoto>
    createdAt?: string | null;
    updatedAt?: string | null;
}
export interface IPhoto {
    photoId: number
    albumId: number;
    userId: number;
    image: string;
    miniature: string;
    albumName?: string;
    createdAt?: string;
    updatedAt?: string;
}
export interface ISessionsProfile {
    browserName: string;
    browserVersion: string;
    osName: string;
    osVersion: string;
    deviceId: string;
    country: string;
    city: string;
    lastActiveDate: number;
}