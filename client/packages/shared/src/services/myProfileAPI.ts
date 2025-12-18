import $api from "../http";
import { AxiosResponse } from "axios";
import { IAnketaProfile, IPhoto, IPhotoAlbum, IProfile, IUpdateStatus } from "../types/IUser";
import { IsLikesType, PinPostType, PostsType } from "@/types/types";

export default class MyProfileAPI {
    static async getMyProfileAPI(userId: string): Promise<AxiosResponse<IProfile>> {
        // console.log('MyProfileAPI: getMyProfileAPI - userId 😡😡😡😡😡 ', userId)
        return $api.get<IProfile>(`/users/profile/${userId}`)
    }
    static async updateMyProfileAPI(userId: number, anketa: IAnketaProfile): Promise<AxiosResponse<IProfile>> {

        // console.log('updateMyProfileAPI - anketa', anketa)
        // const formData = new FormData()
        // formData.append('userId', anketa.userId.toString())
        // formData.append('authorizedUserId', anketa.authorizedUserId.toString())
        // formData.append('name', anketa.name)
        // formData.append('surname', anketa.surname)
        // formData.append('gender', anketa.gender)
        // formData.append('liveIn', anketa.liveIn)
        // formData.append('originallyFrom', anketa.originallyFrom)
        // formData.append('imWorkingIn', anketa.imWorkingIn)
        // formData.append('lookingForAJob', anketa.lookingForAJob.toString())
        // formData.append('lookingForAJobDescription', anketa.lookingForAJobDescription)
        // formData.append('aboutMe', anketa.aboutMe)
        // formData.append('telephone', anketa.telephone)
        // formData.append('email', anketa.email)
        // formData.append('website', anketa.website)
        // console.log('updateMyProfileAPI - formData 100', formData)

        return $api.put<IProfile>(`/users/profile/${userId}`, anketa)
    }
    static async updateAvatarMyProfileAPI(userId: number, authorizedUserId: number, avatar: File): Promise<AxiosResponse<any>> {
        // console.log('updateMyProfileAPI - avatar', userId, authorizedUserId, avatar)
        const formData = new FormData()
        formData.append('image', avatar)
        formData.append('userId', userId.toString())
        formData.append('authorizedUserId', authorizedUserId.toString())

        console.log('updateMyProfileAPI - formData avatar', formData)
        return $api.put<Object>(`/users/profile/update/avatar/${userId}`, formData)
    }
    static async updateStatusMyProfileAPI(userId: number, authorizedUserId: number, status: string): Promise<AxiosResponse<any>> {
        return $api.put<Object>(`/users/profile/update/status/${userId}`, { authorizedUserId, status })
    }
    static async deleteMyProfileAPI(userId: number): Promise<AxiosResponse<void>> {
        return $api.delete<void>(`/users/${userId}`);
    }

    static async addPostAPI(post: any): Promise<AxiosResponse<PostsType>> {
        const image = post.avatar
        // console.log('MyProfileAPI - image: ', image)
        const formData = new FormData()
        formData.append('title', post.title)
        formData.append('content', post.content)
        formData.append('image', post.image)
        formData.append('profileId', post.profileId.toString())
        // formData.append('postedByUserId', post.postedByUserId.toString())
        // console.log('MyProfileAPI - post: ', post)

        return $api.post<PostsType>(`/posts/`, formData)
    }
    static async updatePostAPI(post: PostsType): Promise<AxiosResponse<PostsType>> {
        let postId = post.postId
        const formData = new FormData()
        formData.append('title', post.title)
        formData.append('content', post.content)
        formData.append('image', post.image)
        // formData.append('pin', post.pin.toString())
        formData.append('profileId', post.profileId.toString())
        // formData.append('authorizedUserId', post.authorizedUserId.toString())
        return $api.put<PostsType>(`/posts/${postId}`, formData)
    }
    static async deletePostAPI(postId: number, authorizedUserId: number): Promise<AxiosResponse<PostsType>> {
        return $api.delete<PostsType>(`/posts/${postId}`, { data: { postId, authorizedUserId } });
    }
    static async pinPostAPI(pin: boolean, pinData: PinPostType): Promise<AxiosResponse<PinPostType>> {
        console.log('updatePinAPI - pin, pinData', pin, pinData);
        return $api.put<any>(`/posts/pined/${pin}`, pinData);
    }
    static async getPhotoByIdAPI(photoId: number): Promise<AxiosResponse<IPhoto>> {
        // console.log('MyProfileAPI - getPhotoByIdAPI: ', photoId)
        return $api.get<IPhoto>(`/users/photo/${photoId}`)
    }
    static async addPhotoAPI(userId: string, authorizedUserId: string, imgFile: File, miniature: File, albumName: string): Promise<AxiosResponse<IPhoto>> {

        // console.log('addPhotoAPI: ', image, albumName, userId, authorizedUserId)
        const formData = new FormData()
        formData.append('image', imgFile)
        formData.append('miniature', miniature)
        formData.append('userId', userId.toString())
        formData.append('authorizedUserId', authorizedUserId.toString())
        formData.append('albumName', albumName)
        // console.log('addPhotoAPI - formData: ', formData)

        return $api.post<IPhoto>(`/users/photo/${userId}`, formData)
    }
    static async addPhotoAlbumAPI(userId: number, authorizedUserId: number, albumName: string): Promise<AxiosResponse<IPhotoAlbum>> {
        const formData = new FormData()
        formData.append('userId', userId.toString())
        formData.append('authorizedUserId', authorizedUserId.toString())
        formData.append('albumName', albumName)
        return $api.post<IPhotoAlbum>(`/photo-albums/${userId}`, formData)
    }
    static async likesAPI(like: IsLikesType): Promise<AxiosResponse<IsLikesType>> {
        return $api.post<IsLikesType>(`/like/`, like)
    }
    static async sendEmailResetPasswordAPI(email: string): Promise<AxiosResponse<any>> {
        console.log('sendEmailResetPasswordAPI - req: ', email)
        return $api.post<any>(`/auth/password-recovery`, { email })
    }
    static async updatePasswordAPI(password: string, code: string): Promise<AxiosResponse<IProfile>> {
        console.log('sendEmailResetPasswordAPI - req: ', password, code)
        return $api.put<IProfile>(`/auth/new-password`, { password, code })
    }
}