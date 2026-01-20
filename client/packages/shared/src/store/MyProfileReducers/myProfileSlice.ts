import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IAnketaProfile, IPhoto, IPhotoAlbum, IProfile, IUpdateStatus, IUser } from "../../types/IUser"
import { AppDispatch, RootState } from "../redux-store";
import MyProfileAPI from "../../services/myProfileAPI";
import { CreatePostsType, IsLikesType, PinPostType, PostsType, UpdatePostType } from "../../types/types";
import { authSlice, systemSuccessMsgServerAC } from "../AuthReducers/authSlice";

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
export const myProfileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setMyProfile(state, action: PayloadAction<IProfile>) {
            state.error = ''
            state.profile = action.payload
        },
        setUpdateMyProfile(state, action: PayloadAction<IProfile>) {
            state.error = ''
            state.profile = action.payload
        },
        setUpdateAvatarMyProfile(state, action: PayloadAction<string>) {
            state.error = ''
            state.profile.avatar = action.payload
        },
        setUpdateStatusMyProfile(state, action: PayloadAction<string>) {
            state.error = ''
            state.profile.status = action.payload
        },
        setPostsForProfile(state, action: PayloadAction<PostsType[]>) {
            state.error = ''
            state.posts = action.payload
        },
        addPostForProfile(state, action: PayloadAction<PostsType>) {
            state.error = '';
            // Добавление нового поста в массив существующих постов профиля
            state.posts.push(action.payload);
        },
        setPhotoAlbums(state, action: PayloadAction<IPhotoAlbum[]>) {
            state.error = ''
            state.photoAlbums = action.payload
        },
        setPhotos(state, action: PayloadAction<IPhoto[]>) {
            state.error = ''
            state.photos = action.payload
        },
        openPhoto(state, action: PayloadAction<any>) {
            state.error = '';
            state.openPhoto = action.payload
        },
        addNewPhoto(state, action: PayloadAction<IPhoto>) {
            state.error = '';
            const { albumId, userId } = action.payload
            // Найти photoAlbums в массиве по идентификатору albumId
            const photoAlbumsIndexId = state.photoAlbums.findIndex(album => album.albumId === albumId);
            // Если пост найден, добавить лайк к нему
            if (photoAlbumsIndexId !== -1) {
                state.photoAlbums[photoAlbumsIndexId].photos.push(action.payload);
            } else {
                const photoAlbumsIndexName = state.photoAlbums.findIndex(album => album.albumName === "defaultAlbum");
                if (photoAlbumsIndexName === -1) {
                    state.photoAlbums.push({
                        albumId: null,
                        albumName: "defaultAlbum",
                        createdAt: null,
                        photos: [action.payload],
                        updatedAt: null,
                        userId

                    })
                }
                if (photoAlbumsIndexName !== -1) {
                    state.photoAlbums[photoAlbumsIndexName].photos.push(action.payload);
                }
            }
        },
        addNewPhotoAlbum(state, action: PayloadAction<IPhotoAlbum>) {
            state.error = '';
            state.photoAlbums.push(action.payload);
        },
        updatePost(state, action: PayloadAction<PostsType>) {
            state.error = '';
            state.posts = state.posts.map(post => post.postId === action.payload.postId
                ? action.payload
                : post
            );
        },
        pinPost(state, action: PayloadAction<PostsType[]>) {
            state.error = '';
            state.posts = action.payload
        },
        deletePost(state, action: PayloadAction<string>) {
            state.error = '';
            const postIdToDelete = action.payload;
            console.log('myProfileSlice: deletePost - postIdToDelete 😡 ', postIdToDelete)
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
            state.error = '';
            const { postId, isLike } = action.payload;
            const post = state.posts.find(post => post.postId === postId);
            if (post) {
                post.likes = isLike;
            }
        },
        myProfileFetchingError(state, action: PayloadAction<string>) {
            state.error = action.payload
        },
    }
})
export const myProfileAC = (userId: string) => async (dispatch: AppDispatch) => {
    // console.log('myProfileAC: - userId 😡😡😡😡😡 ', userId)
    try {
        const [userData] = await Promise.all([
            MyProfileAPI.getMyProfileAPI(userId)
        ]);
        // console.log('myProfileAC: - userData 😡😡😡😡😡 ', userData)
        dispatch(myProfileSlice.actions.setMyProfile(userData.data));
    } catch (error: any) {
        if (error.response?.status === 401) {
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message));
    }
};
export const sendEmailResetPasswordMyProfileAC = (email: string) => async (dispatch: AppDispatch) => {
    try {
        const response = await MyProfileAPI.sendEmailResetPasswordAPI(email)
        const systemMsgServer = decodeURIComponent(response.headers['x-service-message'])
        // console.log('sendEmailResetPasswordMyProfileAC: systemMsgServer: - ', systemMsgServer)
        dispatch(systemSuccessMsgServerAC(systemMsgServer))

        // console.log('sendEmailResetPasswordMyProfileAC: - status res', response.status)
        // console.log('sendEmailResetPasswordMyProfileAC: - data res', response.data)
        dispatch(myProfileSlice.actions.myProfileFetchingError(''))
        return systemMsgServer
    } catch (error: any) {
        // console.log('sendEmailResetPasswordMyProfileAC: - e', e.response)
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}
export const updatePasswordAC = (password: string, code: string) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyProfileAPI.updatePasswordAPI(password, code);
        // console.log('updatePasswordAC: - password res', data.data)
        return data.data
        // dispatch(myProfileSlice.actions.setUpdateMyProfile(data.data))
    } catch (e: any) {
        dispatch(myProfileSlice.actions.myProfileFetchingError(e.response?.data?.message))
    }
}
export const updateMyProfileAC = (anketa: IAnketaProfile) => async (dispatch: AppDispatch) => {
    const { userId } = anketa
    try {
        const data = await MyProfileAPI.updateMyProfileAPI(userId, anketa);
        dispatch(myProfileSlice.actions.setUpdateMyProfile(data.data))
    } catch (error: any) {
        if (error.response?.status === 401) {
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}
export const updateAvatarMyProfileAC = (userId: number, authorizedUserId: number, avatar: File) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyProfileAPI.updateAvatarMyProfileAPI(userId, authorizedUserId, avatar);
        dispatch(myProfileSlice.actions.setUpdateAvatarMyProfile(data.data.newAvatar))
    } catch (error: any) {
        if (error.response?.status === 401) {
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}
export const updateStatusMyProfileAC = (userId: number, authorizedUserId: number, status: string) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyProfileAPI.updateStatusMyProfileAPI(userId, authorizedUserId, status);
        dispatch(myProfileSlice.actions.setUpdateStatusMyProfile(data.data.newStatus))
    } catch (error: any) {
        if (error.response?.status === 401) {
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}
export const deleteMyProfileAC = (userId: number) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyProfileAPI.deleteMyProfileAPI(userId)
        return data.data
    } catch (error: any) {
        if (error.response?.status === 401) {
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}

export const getAllPostsForProfileAC = () => async (dispatch: AppDispatch) => {
    // console.log('getPostForProfileAC - req: ')
    try {
        const data = await MyProfileAPI.getAllPostsForProfileAPI()
        // console.log('getPostForProfileAC - res: ', data.data)
        dispatch(myProfileSlice.actions.setPostsForProfile(data.data.items))
    } catch (error: any) {
        if (error.response?.status === 401) {
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}
export const addPostMyProfileAC = (post: CreatePostsType) => async (dispatch: AppDispatch) => {
    // console.log('addPostAC - req: ', post)
    try {
        const data = await MyProfileAPI.addPostAPI(post)

        const likes = [] as Array<IsLikesType>
        const newPost: PostsType = { ...data.data, likes }
        // console.log('addPostAC - res: ', data.data)
        dispatch(myProfileSlice.actions.addPostForProfile(newPost))
    } catch (error: any) {
        if (error.response?.status === 401) {
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}
export const updatePostMyProfileAC = (post: UpdatePostType) => async (dispatch: AppDispatch) => {
    // console.log('updatePostMyProfileAC - post req', post)
    try {
        const data = await MyProfileAPI.updatePostAPI(post);
        // console.log('updatePostMyProfileAC - res', data.status)
        if (data.status === 204) {
            const data = await MyProfileAPI.getPostByIdForProfileAPI(post.postId)
            dispatch(myProfileSlice.actions.updatePost(data.data))
        }
        // return data.data
    } catch (error: any) {
        if (error.response?.status === 401) {
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}
export const deletePostMyProfileAC = (postId: string, authorizedUserId: string) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyProfileAPI.deletePostAPI(postId, authorizedUserId)
        // console.log('deletePostMyProfileAC - status', data.status)
        // Добавляем задержку в 1 секунду перед вызовом dispatch
        if (data.status !== 204) return

        setTimeout(() => {
            // Если удаление прошло успешно, вызываем диспетчер для удаления поста
            dispatch(myProfileSlice.actions.deletePost(postId));
        }, 2000);

    } catch (error: any) {
        if (error.response?.status === 401) {
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}

export const getAllPhotoAlbumsMyProfileAC = (userId: string) => async (dispatch: AppDispatch) => {
    // console.log('setPhotoCarouselMyProfileAC res photoId: ', photoId)
    try {
        const res = await MyProfileAPI.getAllPhotoAlbumsByUserIdAPI(userId)
        console.log('res setPhotoCarouselMyProfileAC: ', res.data.items)
        dispatch(myProfileSlice.actions.setPhotoAlbums(res.data.items))
    } catch (error: any) {
        if (error.response?.status === 401) {
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}
export const getAllMiniaturePhotosForCarouselMyProfileAC = (userId: string) => async (dispatch: AppDispatch) => {
    // console.log('getAllMiniaturePhotosForCarouselMyProfileAC res userId: ', userId)
    try {
        const res = await MyProfileAPI.getAllPhotoMiniatureForCarouselAPI(userId)
        console.log('res setPhotoCarouselMyProfileAC: ', res.data.items)
        dispatch(myProfileSlice.actions.setPhotos(res.data.items))
    } catch (error: any) {
        if (error.response?.status === 401) {
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}
export const getPhotoByIdForCarouselMyProfileAC = (photoId: string) => async (dispatch: AppDispatch) => {
    // console.log('setPhotoCarouselMyProfileAC res photoId: ', photoId)
    try {
        const res = await MyProfileAPI.getPhotoByIdForCarouselAPI(photoId)
        // console.log('res setPhotoCarouselMyProfileAC: ', res.data.image)
        dispatch(myProfileSlice.actions.openPhoto(res.data.image))
    } catch (error: any) {
        if (error.response?.status === 401) {
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}

export const getPhotoAlbumByIdMyProfileAC = (albumId: string) => async (dispatch: AppDispatch) => {
    // console.log('setPhotoCarouselMyProfileAC res photoId: ', photoId)
    try {
        const res = await MyProfileAPI.getPhotoAlbumByIdAPI(albumId)
        console.log('res setPhotoCarouselMyProfileAC: ', res.data)
        dispatch(myProfileSlice.actions.openPhoto(res.data.image))
    } catch (error: any) {
        if (error.response?.status === 401) {
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}

export const addPhotoMyProfileAC = (userId: string, image: File, miniature: File, albumName: string, albumId?: string) => async (dispatch: AppDispatch) => {
    try {
        const res = await MyProfileAPI.addPhotoAPI(userId, image, miniature, albumName, albumId)
        console.log('addPhotoMyProfileAC res', res.data)
        dispatch(myProfileSlice.actions.addNewPhoto(res.data))
    } catch (error: any) {
        if (error.response?.status === 401) {
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}
export const addPhotoAlbumMyProfileAC = (userId: string, albumName: string) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyProfileAPI.addPhotoAlbumAPI(userId, albumName)
        dispatch(myProfileSlice.actions.addNewPhotoAlbum(data.data))
    } catch (error: any) {
        if (error.response?.status === 401) {
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}

export const addLikeToPostAC = (like: IsLikesType) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
        const state = getState();
        let posts = state.myProfilePage.posts;
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
        const data = await MyProfileAPI.likesAPI(like);
        const { postId } = data.data;

        const updatedLikes = [...post.likes];
        updatedLikes[userLikeIndex] = { ...like };

        if (userLikeIndex === -1) {
            console.log('Первый лайк');
            // Если лайка пользователя еще нет, добавляем его
            const { postId } = data.data;
            const newLike = data.data;
            return dispatch(myProfileSlice.actions.addLikeToPost({ postId, like: newLike }));
        }
        posts = posts.map(post => post.postId === postId ? { ...post, likes: updatedLikes } : post)
        dispatch(myProfileSlice.actions.setPostsForProfile(posts));
        // dispatch(myProfileSlice.actions.setMyProfile(updatedProfile));
    } catch (error) {
        if (error.response?.status === 401) {
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}
export const pinPostMyProfileAC = (pinPost: PinPostType) => async (dispatch: AppDispatch, getState: () => RootState) => {
    // console.log('pinPostMyProfileAC - pinPost req', pinPost)

    try {
        const data = await MyProfileAPI.pinPostAPI(pinPost.pin, pinPost);
        const { pin, postId } = data.data;
        const state = getState();
        const posts = state.myProfilePage.posts;

        // Создаем копию массива постов для безопасной работы с ним
        let updatedPosts = [...posts];

        const index = updatedPosts.findIndex(post => post.postId === String(postId));
        if (pin && index !== -1) {
            // Если пост был закреплен (pin=true) и был найден в массиве (index не равен -1)
            const pinnedPost = updatedPosts[index];
            // Удаляем закрепленный пост из текущей позиции в массиве
            updatedPosts.splice(index, 1);
            // Добавляем закрепленный пост в конец массива
            updatedPosts.push(pinnedPost);
        } else {
            // Сортировка массива постов по дате создания в обратном порядке
            updatedPosts.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

            // Определить индексы пинованных постов
            const pinnedIndexes = updatedPosts.reduce((acc, post, index) => {
                if (post.pin) {
                    acc.push(index);
                }
                return acc;
            }, []);

            // Создать новый массив с пинованными постами
            const pinnedPosts = pinnedIndexes.map(index => updatedPosts[index]);

            // Удалить пинованные посты из основного массива
            updatedPosts = updatedPosts.filter((_, index) => !pinnedIndexes.includes(index));

            // Сначала добавить пинованные посты, а затем остальные посты в начало массива
            updatedPosts = [...pinnedPosts, ...updatedPosts];
        }

        // Обновляем состояние с учетом нового порядка постов
        dispatch(myProfileSlice.actions.pinPost(updatedPosts));
    } catch (error: any) {
        if (error.response?.status === 401) {
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message));
    }
}
export default myProfileSlice.reducer