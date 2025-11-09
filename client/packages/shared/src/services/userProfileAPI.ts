import $api from "../http";
import { AxiosResponse } from "axios";
import { IProfile } from "../types/IUser";
import { IsLikesType, PostsType } from "@/types/types";

export default class UserProfileAPI {
    static getUserProfileAPI(userId: number): Promise<AxiosResponse<IProfile>> {
        return $api.get<IProfile>(`/users/${userId}`)
    }
    static addPostAPI(post: PostsType): Promise<AxiosResponse<PostsType>> {
        const formData = new FormData()
        formData.append('title', post.title)
        formData.append('content', post.content)
        formData.append('image', post.image)
        formData.append('profileId', post.profileId.toString())
        // formData.append('postedByUserId', post.postedByUserId.toString())
        return $api.post<PostsType>(`/posts/`, formData)
    }
    static updatePostAPI(post: PostsType): Promise<AxiosResponse<PostsType>> {
        let postId = post.postId
        const formData = new FormData()
        formData.append('title', post.title)
        formData.append('content', post.content)
        formData.append('image', post.image)
        formData.append('profileId', post.profileId.toString())
        // formData.append('authorizedUserId', post.authorizedUserId.toString())

        return $api.put<PostsType>(`/posts/${postId}`, formData)
    }
    static deletePostAPI(postId: number, authorizedUserId: number): Promise<AxiosResponse<PostsType>> {
        return $api.delete<PostsType>(`/posts/${postId}`, { data: { postId, authorizedUserId } });
    }
    static likesAPI(like: IsLikesType): Promise<AxiosResponse<IsLikesType>> {
        return $api.post<IsLikesType>(`/like/`, like)
    }
}