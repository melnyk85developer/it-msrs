import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../types/IUser"
import { AppDispatch } from "../redux-store";
import { loginAC } from "../AuthReducers/authSlice";

type StateType = {
    initialized: boolean,
}

const initialState: StateType = {
    initialized: false,
}

export const initializeAppContentSlice = createSlice({
    name: 'initializeAppContent',
    initialState,
    reducers: {
        initializeAppContent(state, action){
            state.initialized = action.payload
        }
    }
})
export const initializeAppContentAC = () => async (dispatch: AppDispatch) => {

    // const promise = dispatch(loginAC())
    
    // Promise.all([promise]).then(() => {
    //     dispatch(initializeAppContentSlice.actions.initializeAppContent(true))
    // })
}

export default initializeAppContentSlice.reducer