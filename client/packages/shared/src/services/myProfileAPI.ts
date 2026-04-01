import $api from "../http";
import { AxiosResponse } from "axios";
import { IAnketaProfile, IPhoto, IPhotoAlbum, IProfile, IUpdateStatus } from "../types/IUser";
import { CreatePostsType, IsLikesType, PinPostType, PostsType, UpdatePostType } from "@/types/types";

export default class MyProfileAPI {
    static async getMyProfileAPI(userId: string): Promise<AxiosResponse<IProfile>> {
        // console.log('MyProfileAPI: getMyProfileAPI - userId 😡😡😡😡😡 ', userId)
        return $api.get<IProfile>(`/users/profile/${userId}`)
    }
    static async updateMyProfileAPI(userId: string, anketa: IAnketaProfile): Promise<AxiosResponse<IProfile>> {

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

        // console.log('updateMyProfileAPI - formData avatar', formData)
        return $api.put<Object>(`/users/profile/update/avatar/${userId}`, formData)
    }
    static async updateStatusMyProfileAPI(userId: string, authorizedUserId: string, status: string): Promise<AxiosResponse<any>> {
        return $api.put<Object>(`/users/profile/update/status/${userId}`, { authorizedUserId, status })
    }
    static async deleteMyProfileAPI(userId: number): Promise<AxiosResponse<void>> {
        return $api.delete<void>(`/users/${userId}`);
    }

    static async getAllPostsForProfileAPI(): Promise<AxiosResponse<any>> {
        // console.log('MyProfileAPI: getPostsForProfileAPI - 😡😡😡😡😡 ')
        return $api.get<any>(`/posts-for-profile`)
    }
    static async getPostByIdForProfileAPI(postId: string): Promise<AxiosResponse<any>> {
        // console.log('MyProfileAPI: getPostsForProfileAPI - 😡😡😡😡😡 ')
        return $api.get<any>(`/posts-for-profile/${postId}`)
    }
    static async addPostAPI(post: CreatePostsType): Promise<AxiosResponse<PostsType>> {
        // console.log('MyProfileAPI - image: ', image)
        const formData = new FormData()
        formData.append('title', post.title)
        formData.append('content', post.content)
        formData.append('image', post.image)
        formData.append('profileId', post.profileId.toString())
        // formData.append('postedByUserId', post.postedByUserId.toString())
        // console.log('MyProfileAPI - addPostAPI post: ', post)
        return $api.post<PostsType>(`/posts-for-profile`, formData)
    }
    static async updatePostAPI(post: UpdatePostType): Promise<AxiosResponse<any>> {

        // console.log('MyProfileAPI - updatePostAPI post: ', post)
        const formData = new FormData()
        formData.append('title', post.title)
        formData.append('content', post.content)
        formData.append('image', post.image)
        formData.append('profileId', post.profileId.toString())

        return $api.put<any>(`/posts-for-profile/${post.postId}`, formData)
    }
    static async deletePostAPI(postId: string, authorizedUserId: string): Promise<AxiosResponse<PostsType>> {
        return $api.delete<PostsType>(`/posts-for-profile/${postId}`, {
            data: { postId, authorizedUserId }
        });
    }

    static async pinPostAPI(pin: boolean, pinData: PinPostType): Promise<AxiosResponse<PinPostType>> {
        // console.log('updatePinAPI - pin, pinData', pin, pinData);
        return $api.put<any>(`/posts/pined/${pin}`, pinData);
    }

    static async getAllPhotoMiniatureForCarouselAPI(userId: string): Promise<AxiosResponse<any>> {
        console.log('MyProfileAPI: getAllPhotoMiniatureForCarouselAPI - 😡😡😡😡😡 ')
        return $api.get<any>(`/photos/all/${userId}`);
    }
    static async getPhotoByIdForCarouselAPI(photoId: string): Promise<AxiosResponse<IPhoto>> {
        // console.log('MyProfileAPI - getPhotoByIdForCarouselAPI: ', photoId)
        return $api.get<IPhoto>(`/photos/${photoId}`);
    }

    static async getAllPhotoAlbumsByUserIdAPI(userId: string): Promise<AxiosResponse<any>> {
        // console.log('MyProfileAPI: getAllPhotoAlbumsAPI - 😡😡😡😡😡 ')
        return $api.get<any>(`/photo-albums/all/${userId}`);
    }
    static async getPhotoAlbumByIdAPI(albumId: string): Promise<AxiosResponse<any>> {
        // console.log('MyProfileAPI: getAllPhotoAlbumsAPI - 😡😡😡😡😡 ')
        return $api.get<any>(`/photos/${albumId}`);
    }

    static async getAllPhotosByUserIdAPI(userId: string): Promise<AxiosResponse<any>> {
        // console.log('MyProfileAPI: getAllPhotosByUserIdAPI - 😡😡😡😡😡 ')
        return $api.get<any>(`/photos/all/${userId}`);
    }
    static async getPhotoByIdAPI(photoId: string): Promise<AxiosResponse<any>> {
        console.log('MyProfileAPI: getPhotoByIdAPI - 😡😡😡😡😡 ')
        return $api.get<any>(`/photos/${photoId}`);
    }

    static async addPhotoAPI(userId: string, imgFile: File, miniature: File, albumName: string, albumId?: string): Promise<AxiosResponse<IPhoto>> {

        // console.log('addPhotoAPI: ', userId, imgFile, albumName, albumId)

        const formData = new FormData()
        formData.append('image', imgFile)
        formData.append('miniature', miniature)
        formData.append('userId', userId.toString())
        formData.append('albumName', albumName)
        // formData.append('albumId', albumId.toString())
        // console.log('addPhotoAPI - formData: ', formData)

        return $api.post<IPhoto>(`/photos`, formData)
    }
    static async addPhotoAlbumAPI(userId: string, albumName: string, albumCoverFile: File): Promise<AxiosResponse<IPhotoAlbum>> {
        // console.log('addPhotoAPI: userId, albumName - ', userId, albumName)

        const formData = new FormData()
        formData.append('userId', userId.toString())
        formData.append('albumName', albumName)
        formData.append('albumCoverFile', albumCoverFile)

        return $api.post<IPhotoAlbum>(`/photo-albums`, formData);
    }

    static async likesAPI(like: IsLikesType): Promise<AxiosResponse<IsLikesType>> {
        return $api.post<IsLikesType>(`/like/`, like)
    }
    static async sendEmailResetPasswordAPI(email: string): Promise<AxiosResponse<any>> {
        // console.log('sendEmailResetPasswordAPI - req: ', email)
        return $api.post<any>(`/auth/password-recovery`, { email })
    }
    static async updatePasswordAPI(password: string, code: string): Promise<AxiosResponse<IProfile>> {
        // console.log('sendEmailResetPasswordAPI - req: ', password, code)
        return $api.put<IProfile>(`/auth/new-password`, { password, code })
    }
}