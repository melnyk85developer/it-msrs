import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IAnketaProfile, IPhoto, IPhotoAlbum, IProfile, IUpdateStatus, IUser } from "../../types/IUser"
import { AppDispatch, RootState } from "../redux-store";
import MyProfileAPI from "../../services/myProfileAPI";
import { IsLikesType, PinPostType, PostsType } from "@/types/types";
import { authSlice } from "../AuthReducers/authSlice";

interface ProfileState {
    profile: IProfile;
    openPhoto: string;
    error: string;
}
const initialState: ProfileState = {
    profile: {
        posts: [] as PostsType[],
    } as IProfile,
    openPhoto: '',
    error: '',
}
export const myProfileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setMyProfile(state, action: PayloadAction<IProfile>){
            state.error = ''
            state.profile = action.payload
        },
        setUpdateMyProfile(state, action: PayloadAction<IProfile>){
            state.error = ''
            state.profile = action.payload
        },
        setUpdateAvatarMyProfile(state, action: PayloadAction<string>){
            state.error = ''
            state.profile.avatar = action.payload
        },
        setUpdateStatusMyProfile(state, action: PayloadAction<string>){
            state.error = ''
            state.profile.status = action.payload
        },
        addPost(state, action: PayloadAction<PostsType>){
            state.error = '';
            // Добавление нового поста в массив существующих постов профиля
            state.profile.posts.push(action.payload);
        },
        openPhoto(state, action: PayloadAction<any>){
            state.error = '';
            state.openPhoto = action.payload
        },
        addNewPhoto(state, action: PayloadAction<IPhoto>){
            state.error = '';
            const { albumId, userId  } = action.payload
            // Найти photoAlbums в массиве по идентификатору albumId
            const photoAlbumsIndexId = state.profile.photoAlbums.findIndex(album => album.albumId === albumId);
            // Если пост найден, добавить лайк к нему
            if(photoAlbumsIndexId !== -1) {
                state.profile.photoAlbums[photoAlbumsIndexId].photos.push(action.payload);
            }else{
                const photoAlbumsIndexName = state.profile.photoAlbums.findIndex(album => album.albumName === "defaultAlbum");
                if(photoAlbumsIndexName === -1){
                    state.profile.photoAlbums.push({
                        albumId: null,
                        albumName: "defaultAlbum",
                        createdAt: null,
                        photos: [action.payload],
                        updatedAt: null,
                        userId
    
                    })
                }
                if(photoAlbumsIndexName !== -1){
                    state.profile.photoAlbums[photoAlbumsIndexName].photos.push(action.payload);
                }
            }
        },
        addNewPhotoAlbum(state, action: PayloadAction<IPhotoAlbum>){
            state.error = '';
            state.profile.photoAlbums.push(action.payload);
        },
        updatePost(state, action: PayloadAction<PostsType>){
            state.error = '';
            // Обновление поста в массиве существующих постов профиля
            const { postId, title, content, image } = action.payload;
            const updatepost = state.profile.posts.find(post => post.postId === postId);
            if (updatepost) {
                updatepost.title = title,
                updatepost.content = content,
                updatepost.image = image
            }
        },
        pinPost(state, action: PayloadAction<PostsType[]>){
            state.error = '';
            state.profile.posts = action.payload
        },
        deletePost(state, action: PayloadAction<number>) {
            state.error = '';
            const postIdToDelete = action.payload;
            state.profile.posts = state.profile.posts.filter(post => post.postId !== postIdToDelete);
        },
        addLikeToPost(state, action: PayloadAction<{ postId: number, like: IsLikesType }>) {
            state.error = '';
            const { postId, like } = action.payload;
            // Найти пост в массиве по идентификатору postId
            const postIndex = state.profile.posts.findIndex(post => post.postId === postId);
            // Если пост найден, добавить лайк к нему
            if (postIndex !== -1) {
                state.profile.posts[postIndex].likes.push(like);
            }
        },
        updatePostLikes(state, action: PayloadAction<{ postId: number, isLike: IsLikesType[] }>) {
            state.error = '';
            const { postId, isLike } = action.payload;
            const post = state.profile.posts.find(post => post.postId === postId);
            if (post) {
                post.likes = isLike;
            }
        },
        myProfileFetchingError(state, action: PayloadAction<string>){
            state.error = action.payload
        },
    }
})
export const myProfileAC = (userId: number) => async (dispatch: AppDispatch) => {
    try {
      const [userData] = await Promise.all([MyProfileAPI.getMyProfileAPI(userId)]);
      dispatch(myProfileSlice.actions.setMyProfile(userData.data));
    } catch (error: any) {
        if(error.response?.status === 401){
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message));
    }
};
export const sendEmailResetPasswordMyProfileAC = (email: string) => async (dispatch: AppDispatch) => {
    try{
        const data = await MyProfileAPI.sendEmailResetPasswordAPI(email)
        // console.log('sendEmailResetPasswordMyProfileAC: - data res', data.data)
        dispatch(myProfileSlice.actions.myProfileFetchingError(''))
        return data.data
    }catch(e: any){
        // console.log('sendEmailResetPasswordMyProfileAC: - e', e.response)
        dispatch(myProfileSlice.actions.myProfileFetchingError(e.response?.data?.message))
    }
}
export const updatePasswordAC = (password: string, code: string) => async (dispatch: AppDispatch) => {
    try{
        const data = await MyProfileAPI.updatePasswordAPI(password, code);
        // console.log('updatePasswordAC: - password res', data.data)
        return data.data
        // dispatch(myProfileSlice.actions.setUpdateMyProfile(data.data))
    }catch(e: any){
        dispatch(myProfileSlice.actions.myProfileFetchingError(e.response?.data?.message))
    }
}
export const updateMyProfileAC = (anketa: IAnketaProfile) => async (dispatch: AppDispatch) => {
    const { userId } = anketa
    try{
        const data = await MyProfileAPI.updateMyProfileAPI(userId, anketa);
        dispatch(myProfileSlice.actions.setUpdateMyProfile(data.data))
    }catch(error: any){
        if(error.response?.status === 401){
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}
export const updateAvatarMyProfileAC = (userId: number, authorizedUserId: number, avatar: File) => async (dispatch: AppDispatch) => {
    try{
        const data = await MyProfileAPI.updateAvatarMyProfileAPI(userId, authorizedUserId, avatar);
        dispatch(myProfileSlice.actions.setUpdateAvatarMyProfile(data.data.newAvatar))
    }catch(error: any){
        if(error.response?.status === 401){
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}
export const updateStatusMyProfileAC = (userId: number, authorizedUserId: number, status: string) => async (dispatch: AppDispatch) => { 
    try{
        const data = await MyProfileAPI.updateStatusMyProfileAPI(userId, authorizedUserId, status);
        dispatch(myProfileSlice.actions.setUpdateStatusMyProfile(data.data.newStatus))
    }catch(error: any){
        if(error.response?.status === 401){
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}
export const deleteMyProfileAC = (userId: number) => async (dispatch: AppDispatch) => {
    try{
        const data = await MyProfileAPI.deleteMyProfileAPI(userId)
        return data.data
    }catch(error: any){
        if(error.response?.status === 401){
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}
export const addPostMyProfileAC = (post: PostsType) => async (dispatch: AppDispatch) => {
    // console.log('addPostAC - req: ', post)
    try{
        const data = await MyProfileAPI.addPostAPI(post)
        const likes = [] as Array<IsLikesType>
        const newPost: PostsType = {...data.data,likes}
        // console.log('addPostAC - res: ', data.data)
        dispatch(myProfileSlice.actions.addPost(newPost))
    }catch(error: any){
        if(error.response?.status === 401){
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}
export const setPhotoCarouselMyProfileAC = (photoId: number) => async (dispatch: AppDispatch) => {
    // console.log('setPhotoCarouselMyProfileAC res photoId: ', photoId)
    try{
        const res = await MyProfileAPI.getPhotoByIdAPI(photoId)
        // console.log('res setPhotoCarouselMyProfileAC: ', res.data.image)
        dispatch(myProfileSlice.actions.openPhoto(res.data.image))
    }catch(error: any){
        if(error.response?.status === 401){
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}
export const addPhotoMyProfileAC = (userId: number, authorizedUserId: number, image: File, miniature: File, albumName: string) => async (dispatch: AppDispatch) => {
    try{
        const res = await MyProfileAPI.addPhotoAPI(userId, authorizedUserId, image, miniature, albumName)
        // console.log('addPhotoMyProfileAC res', res.data)
        dispatch(myProfileSlice.actions.addNewPhoto(res.data))
    }catch(error: any){
        if(error.response?.status === 401){
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}
export const addPhotoAlbumMyProfileAC = (userId: number, authorizedUserId: number, albumName: string) => async (dispatch: AppDispatch) => {
    try{
        const data = await MyProfileAPI.addPhotoAlbumAPI(userId, authorizedUserId, albumName)
        dispatch(myProfileSlice.actions.addNewPhotoAlbum(data.data))
    }catch(error: any){
        if(error.response?.status === 401){
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}
export const updatePostMyProfileAC = (post: PostsType) => async (dispatch: AppDispatch) => {
    // console.log('updatePostMyProfileAC - post req', post)
    try{
        const data = await MyProfileAPI.updatePostAPI(post);
        dispatch(myProfileSlice.actions.updatePost(data.data))
    }catch(error: any){
        if(error.response?.status === 401){
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}
export const deletePostMyProfileAC = (postId: number, authorizedUserId: number) => async (dispatch: AppDispatch) => {
    try{
        const data = await MyProfileAPI.deletePostAPI(postId, authorizedUserId)
        // console.log('deletePostMyProfileAC - post', data.data)
        // Добавляем задержку в 1 секунду перед вызовом dispatch
        setTimeout(() => {
            // Если удаление прошло успешно, вызываем диспетчер для удаления поста
            dispatch(myProfileSlice.actions.deletePost(postId));
        }, 2000);

    }catch(error: any){
        if(error.response?.status === 401){
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message))
    }
}
export const addLikeToPostAC = (like: IsLikesType) => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
        const state = getState();
        const profile = state.myProfilePage.profile;
        // Находим пост, к которому относится лайк
        const post = profile.posts.find(post => post.postId === like.postId);

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
        const updatedProfile = {
            ...profile,
            posts: profile.posts.map(post => post.postId === postId ? { ...post, likes: updatedLikes } : post)
        }
        dispatch(myProfileSlice.actions.setMyProfile(updatedProfile));
    }catch(error){
        if(error.response?.status === 401){
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
        const posts = state.myProfilePage.profile.posts;
    
        // Создаем копию массива постов для безопасной работы с ним
        let updatedPosts = [...posts];
    
        const index = updatedPosts.findIndex(post => post.postId === postId);
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
    }catch(error: any){
        if(error.response?.status === 401){
            dispatch(authSlice.actions.userIsAuth(false))
        }
        dispatch(myProfileSlice.actions.myProfileFetchingError(error.response?.data?.message));
    }
}
export default myProfileSlice.reducer