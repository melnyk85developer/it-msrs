import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IAnketaProfile, IPhoto, IPhotoAlbum, IProfile, IUpdateStatus, IUser } from "../../types/IUser"
import { AppDispatch, RootState } from "../redux-store";
import MyProfileAPI from "../../services/myProfileAPI";
import { IsLikesType, PinPostType, PostsType } from "@/types/types";
import MyAdminAPI from "../../services/myAdminAPI";

interface AdminState {
    bot: IUser | any;
    bots: IUser[] | any;
    ftpAvatars: {
        files: string[]
    };                 // Список имён аватарок (json-массив)
    avatars: any,
    postsImg: {
        files: string[],
        folder: string
    },
    ftpAvatarFiles: Record<string, File>; // Загруженные файлы, ключ — имя файла
    openPhoto: string;
    isLoading: boolean;
    error: string;
}
const initialState: AdminState = {
    bot: {
        posts: [] as PostsType[],
    },
    bots: [],
    ftpAvatars: {
        files: []
    },
    avatars: {
        files: [],
        folder: ''
    },
    postsImg: {
        files: [],
        folder: ''
    },
    ftpAvatarFiles: {},  // пустой объект для файлов
    openPhoto: '',
    isLoading: false,
    error: '',
}
export const myAdminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        usersFetching(state) {
            state.isLoading = true
        },
        createUsersBotsAdmin(state, action: PayloadAction<IUser>) {
            let newBot
            if (action.payload.isBot === true) { newBot = action.payload }
            state.isLoading = false
            state.error = ''
            state.bots.push(newBot)
        },
        createUserBotAdmin(state, action: PayloadAction<IUser>) {
            state.error = ''
            state.bot = action.payload
        },
        deleteUsersAdmin(state, action: PayloadAction<IUser>) {
            state.isLoading = false
            state.error = ''
            state.bots = state.bots.filter((i: { id: string; }) => i.id !== action.payload.id)
            // state.bot = action.payload
        },
        setMyBotsAdmin(state, action: PayloadAction<IUser[]>) {
            state.error = ''
            state.bots = action.payload
        },
        setFtpFilesAdmin(state, action: PayloadAction<any>) {
            if (action.payload.folder === 'avatars') {
                state.avatars.files = action.payload.files;
            }
            state.isLoading = false;
            state.error = '';
        },
        setFtpAvatarFile(state, action: PayloadAction<{ fileName: string; file: File }>) {
            state.ftpAvatarFiles[action.payload.fileName] = action.payload.file;
            state.error = '';
        },
        myAdminFetchingError(state, action: PayloadAction<string>) {
            state.isLoading = false;
            state.error = action.payload;
        },
    }
})
export const getUserMyAdminAC = () => async (dispatch: AppDispatch) => {
    try {
        const [userData] = await Promise.all([MyAdminAPI.getUsersAdminAPI()]);
        dispatch(myAdminSlice.actions.setMyBotsAdmin(userData.data));
        //   console.log('getUserMyAdminAC: ', userData.data);
    } catch (error: any) {
        dispatch(myAdminSlice.actions.myAdminFetchingError(error.response?.data?.message));
    }
};
export const createUsersMyAdmin = (user: any) => async (dispatch: AppDispatch) => {
    // console.log('createUsersMyAdmin: req', user)
    try {
        dispatch(myAdminSlice.actions.usersFetching())
        const data = await MyAdminAPI.createUsersAdminAPI(user)
        console.log('createUsersMyAdmin: res - data.data', data.data)
        dispatch(myAdminSlice.actions.createUserBotAdmin(data.data))
        dispatch(myAdminSlice.actions.createUsersBotsAdmin(data.data))
        return data.data
    } catch (error: any) {
        dispatch(myAdminSlice.actions.myAdminFetchingError(error.message))
    }
}
export const deleteUserMyAdmin = (userId: any) => async (dispatch: AppDispatch) => {
    try {
        dispatch(myAdminSlice.actions.usersFetching())
        const data = await MyAdminAPI.deleteUsersAdminAPI(userId)
        // console.log('deleteUsersMyAdmin: res - ', data.data)
        dispatch(myAdminSlice.actions.deleteUsersAdmin(data.data))
    } catch (e: any) {
        dispatch(myAdminSlice.actions.myAdminFetchingError(e.message))
    }
}
export const getFtpFilesAdminAC = (folder: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(myAdminSlice.actions.usersFetching());
        const res = await MyAdminAPI.getFtpFilesAPI(folder);
        // console.log('getFtpFilesAdminAC: - res', res.data)
        dispatch(myAdminSlice.actions.setFtpFilesAdmin({ folder, files: res.data}));
    } catch (error: any) {
        dispatch(myAdminSlice.actions.myAdminFetchingError(error.message ?? 'Ошибка при загрузке списка файлов'));
    }
};

export const fetchAvatarFile = (fileName: string, folder: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(myAdminSlice.actions.usersFetching());
        const res = await MyAdminAPI.getFtpAvatarFileAPI(fileName, folder);
        // console.log('fetchAvatarFile: - res', res)
        // res.data будет Blob
        const file = new File([res.data], fileName, { type: res.data.type });
        return file;
    } catch (error: any) {
        dispatch(myAdminSlice.actions.myAdminFetchingError(error.message ?? 'Ошибка загрузки файла аватара'));
        return null;
    }
};
export default myAdminSlice.reducer