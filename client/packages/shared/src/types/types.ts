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
export type CreatePostsType = {
    image: any
    title: string
    content: string | null
    profileId: string
}
export type UpdatePostType = {
    postId: string;
    image: File;
    title: string
    content: string | null
    profileId: string
    createdAt?: string
    updatedAt?: string
}
export type PostsType = {
    postId: string;
    authorPost: AuthorPostType
    extendedLikesInfo: {
        dislikesCount: number;
        likesCount: number;
        myStatus: "None" | "Like" | "Dislike"
    },
    // postId: string
    image: string;
    title: string
    content: string | null
    pin?: boolean
    likes: IsLikesType[];
    profileId: string
    // postedByUserId: number
    createdAt: string
    updatedAt: string
    // authorizedUserId?: number
}
export type PinPostType = {
    pin: boolean;
    postId: string;
    authorizedUserId: string;
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
    id: string;
    name: string
    surname: string
    status: string
    photos: PhotosType
    followed: boolean
}
export type FriendsType = {
    id: string
    name: string
    surname: string
    status: string
    photos: PhotosType
    followed: boolean
}
export type MiniUserType = {
    userId: string;
    avatar: string;
    name: string;
    surname: string;
    email: string;
}
export type MessagesType = {
    localId: string;
    msgId: string;
    message: string;
    senderId: string;
    receiverId: string;
    createdAt: string;
    read: boolean;
    dialogId: string;
    replyToMessageId: string | null;
    attachments: any[];
}
export type Interlocutor = {
    userId: string;
    avatar: string;
    name: string;
    surname: string;
    chat: ChatType;
    lastMessage: MessagesType;
}
export type ChatType = {
    dialogId: string;
    userAId: string;
    userBId: string;
    createdAt: string;
    updatedAt: string;
}

