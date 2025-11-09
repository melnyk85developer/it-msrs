import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../types/IUser"
import { AppDispatch } from "../redux-store";
import UsersAPI from "../../services/usersAPI";

interface UserState {
    users: IUser[];
    isLoading: boolean;
    error: string;
}

const initialState: UserState = {
    users: [],
    isLoading: false,
    error: '',
}

export const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        usersFetching(state){
            state.isLoading = true
        },
        usersFetchingSuccess(state, action: PayloadAction<IUser[]>){
            state.isLoading = false
            state.error = ''
            state.users = action.payload
        },
        usersFetchingError(state, action: PayloadAction<string>){
            state.isLoading = false
            state.error = action.payload
        },
    }
})

export const getUsersAC = () => async (dispatch: AppDispatch) => {
    try{
        dispatch(usersSlice.actions.usersFetching())
        const data = await UsersAPI.getUsersAPI()
        // console.log(data.data)
        dispatch(usersSlice.actions.usersFetchingSuccess(data.data))
    }catch(e: any){
        dispatch(usersSlice.actions.usersFetchingError(e.message))
    }
}




export default usersSlice.reducer