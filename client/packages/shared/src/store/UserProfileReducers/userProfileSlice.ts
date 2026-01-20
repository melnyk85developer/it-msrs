import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IPhoto, IPhotoAlbum, IProfile, IUser } from "../../types/IUser"
import { AppDispatch, RootState } from "../redux-store";
import UserProfileAPI from "../../services/userProfileAPI";
import { IsLikesType, PostsType } from "@/types/types";

interface ProfileState {
    profile: IProfile;
    posts: PostsType[];
    photoAlbums: IPhotoAlbum[];
    photos: IPhoto[];
    openPhoto: string;
    error: string;
}
const initialState: ProfileState = {
    profile: null as IProfile,
    posts: [] as PostsType[],
    photoAlbums: [] as IPhotoAlbum[],
    photos: [] as IPhoto[],
    openPhoto: '',
    error: '',
}
export const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {
        setUserProfile(state, action: PayloadAction<IProfile>) {
            state.error = ''
            state.profile = action.payload
        },
        setPostsForProfile(state, action: PayloadAction<PostsType[]>) {
            state.error = ''
            state.posts = action.payload
        },
        addPost(state, action: PayloadAction<PostsType>) {
            state.error = '';
            // Добавление нового поста в массив существующих постов профиля
            state.posts.push(action.payload);
        },
        updatePost(state, action: PayloadAction<PostsType>) {
            state.error = '';
            // Обновление поста в массиве существующих постов профиля
            const { postId, title, content, image } = action.payload;
            const updatepost = state.posts.find(post => post.postId === postId);
            if (updatepost) {
                updatepost.title = title,
                    updatepost.content = content,
                    updatepost.image = image
            }
        },
        deletePost(state, action: PayloadAction<string>) {
            const postIdToDelete = action.payload;
            state.posts = state.posts.filter(post => post.postId !== postIdToDelete);
        },
        addLikeToPost(state, action: PayloadAction<{ postId: string, like: IsLikesType }>) {
            state.error = '';
            const { postId, like } = action.payload;
            // Найти пост в массиве по идентификатору postId
            const postIndex = state.posts.findIndex(post => post.postId === postId);
            // Если пост найден, добавить лайк к нему
            if (postIndex !== -1) {
                state.posts[postIndex].likes.push(like);
            }
        },
        updatePostLikes(state, action: PayloadAction<{ postId: string, isLike: IsLikesType[] }>) {
            const { postId, isLike } = action.payload;
            const post = state.posts.find(post => post.postId === postId);
            if (post) {
                post.likes = isLike;
            }
        },
        userProfileFetchingError(state, action: PayloadAction<string>) {
            state.error = action.payload
        },
    }
})
export const userProfileAC = (userId: number) => async (dispatch: AppDispatch) => {
    try {
        const data = await UserProfileAPI.getUserProfileAPI(userId)
        // console.log(data.data)
        dispatch(userProfileSlice.actions.setUserProfile(data.data))
    } catch (e: any) {
        dispatch(userProfileSlice.actions.userProfileFetchingError(e.response?.data?.message))
    }
}
export const addPostUserProfileAC = (post: PostsType) => async (dispatch: AppDispatch) => {
    try {
        const data = await UserProfileAPI.addPostAPI(post)
        const likes = [] as Array<IsLikesType>
        const newPost: PostsType = { ...data.data, likes }
        // console.log('addPostAC - post', data.data)
        dispatch(userProfileSlice.actions.addPost(newPost))
    } catch (e: any) {
        dispatch(userProfileSlice.actions.userProfileFetchingError(e.response?.data?.message))
    }
}
export const updatePostUserProfileAC = (post: PostsType) => async (dispatch: AppDispatch) => {
    // console.log('updatePostMyProfileAC - post req', post)
    try {
        const data = await UserProfileAPI.updatePostAPI(post);
        dispatch(userProfileSlice.actions.updatePost(data.data))
    } catch (e: any) {
        dispatch(userProfileSlice.actions.userProfileFetchingError(e.response?.data?.message))
    }
}
export const deletePostUserProfileAC = (postId: string, authorizedUserId: number) => async (dispatch: AppDispatch) => {
    try {
        const data = await UserProfileAPI.deletePostAPI(postId, authorizedUserId)
        // console.log('deletePostMyProfileAC - post', data.data)
        // dispatch(myProfileSlice.actions.deletePost(postId));

        // Добавляем задержку в 1 секунду перед вызовом dispatch
        setTimeout(() => {
            // Если удаление прошло успешно, вызываем диспетчер для удаления поста
            dispatch(userProfileSlice.actions.deletePost(postId));
        }, 2000);

    } catch (e: any) {
        dispatch(userProfileSlice.actions.userProfileFetchingError(e.response?.data?.message))
    }
}
export const addLikeToPostAC = (like: IsLikesType) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
        const state = getState();
        let posts = state.userProfilePage.posts;
        // Находим пост, к которому относится лайк
        const post = posts.find(post => post.postId === like.postId);

        if (!post) {
            console.log('Нет такого поста!');
            return;
        }
        // Находим лайк пользователя в посте
        const userLikeIndex = post.likes.findIndex(userLike => userLike.userId === like.userId);

        if (userLikeIndex !== -1) {
            const existingUserAction = post.likes[userLikeIndex];
            if (existingUserAction.isLike === like.isLike) {
                console.log('Пользователь уже выполнил это действие');
                return;
            }
        }
        // Если лайка пользователя еще нет или действие отличается, отправляем запрос на сервер
        const data = await UserProfileAPI.likesAPI(like);
        const { postId } = data.data;

        const updatedLikes = [...post.likes];
        updatedLikes[userLikeIndex] = { ...like };

        if (userLikeIndex === -1) {
            console.log('Первый лайк');
            // Если лайка пользователя еще нет, добавляем его
            const { postId } = data.data;
            const newLike = data.data;
            return dispatch(userProfileSlice.actions.addLikeToPost({ postId, like: newLike }));
        }
        posts = posts.map(post => post.postId === postId ? { ...post, likes: updatedLikes } : post)

        dispatch(userProfileSlice.actions.setPostsForProfile(posts));
    } catch (error) {
        dispatch(userProfileSlice.actions.userProfileFetchingError(error.response?.data?.message))
    }
}
export default userProfileSlice.reducer