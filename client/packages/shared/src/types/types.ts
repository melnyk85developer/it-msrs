export type ProfileType = {
    userId: string | number | null | undefined
    lookingForAJob: boolean
    lookingForAJobDescription: string
    fullName: string
    contacts: ContactsType
    photos: PhotosType
    aboutMe: string
}
export type ContactsType = {
    github: string
    vk: string
    facebook: string
    instagram: string
    twitter: string
    website: string
    youtube: string
    mainLink: string
}
export type PhotosType = {
    small: string | null
    large: string | null
}
export type PostsType = {
    authorPost: AuthorPostType
    postId: number
    image: any
    title: string
    content: string | null
    pin: boolean
    likes: IsLikesType[];
    profileId: number
    postedByUserId: number
    createdAt: string
    updatedAt: string
    // authorizedUserId?: number
}
export type PinPostType = {
    pin: boolean
    postId: number
    authorizedUserId: number
}
export type AuthorPostType = {
    avatar: string;
    name: string;
    surname: string
}
export type IsLikesType = {
    isLike: boolean | any
    postId: number | any
    userId: number | any
}
export type UserType = {
    id: number
    name: string
    surname: string
    status: string
    photos: PhotosType
    followed: boolean
}
export type FriendsType = {
    id: number
    name: string
    surname: string
    status: string
    photos: PhotosType
    followed: boolean
}
export type MiniUserType = {
    userId: number;
    avatar: string;
    name: string;
    surname: string;
    email: string;
}
export type MessagesType = {
    localId: number;
    msgId: number;
    message: string;
    senderId: number;
    receiverId: number;
    createdAt: string;
    read: boolean;
    dialogId: number;
    replyToMessageId?: number;
    attachments: any[];
}
export type Interlocutor = {
    userId: number;
    avatar: string;
    name: string;
    surname: string;
    chat: ChatType;
    lastMessage: MessagesType;
}
export type ChatType = {
    dialogId: number;
    userAId: number;
    userBId: number;
    createdAt: string;
    updatedAt: string;
}

