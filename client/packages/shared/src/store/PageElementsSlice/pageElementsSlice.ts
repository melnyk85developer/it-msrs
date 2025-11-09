import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../redux-store";

export const SIDEBAR_ON: string = 'ON';
export const SIDEBAR_OFF: string = 'OFF';
export const FOOTER_ON: string = 'ON';
export const FOOTER_OFF: string = 'OFF';

const initialState = {
    LeftNav: SIDEBAR_ON as string,
    LeftNavSpan: 2 as number,
    Lsidebar: SIDEBAR_ON as string,
    LsidebarSpan: 0 as number,
    ContentBlockSpan: 0 as number,
    Rsidebar: SIDEBAR_ON as string,
    RsidebarSpan: 0 as number,
    RightNav: SIDEBAR_ON as string,
    RightNavSpan: 2 as number,
    FooterState: FOOTER_ON as string,
    error: '',
}

export const pageElementsSlice = createSlice({
    name: 'page_elements',
    initialState,
    reducers: {
        myLeftNavSpan(state, action: PayloadAction<number>){
            // console.log('myLeftNavSpan: - payload', action.payload)
            state.LeftNavSpan = action.payload
        },
        myLSidebar(state, action: PayloadAction<string>){
            // console.log('myLSidebar: - payload', action.payload)
            state.Lsidebar = action.payload
        },
        myLSidebarSpan(state, action: PayloadAction<number>){
            // console.log('myLSidebarSpan: - payload', action.payload)
            state.LsidebarSpan = action.payload
        },
        myContentBlockSpan(state, action: PayloadAction<number>){
            // console.log('myContentBlockSpan: - payload', action.payload)
            state.ContentBlockSpan = action.payload
        },
        myRSidebar(state, action: PayloadAction<string>){
            // console.log('myRSidebar: - payload', action.payload)
            state.Rsidebar = action.payload
        },
        myRSidebarSpan(state, action: PayloadAction<number>){
            // console.log('myRSidebarSpan - payload', action.payload)
            state.RsidebarSpan = action.payload
        },
        myRightNavSpan(state, action: PayloadAction<number>){
            // console.log('myRightNavSpan: - payload', action.payload)
            state.LeftNavSpan = action.payload
        },
        myFooter(state, action: PayloadAction<string>){
            // console.log('myFooter: - payload', action.payload)
            state.FooterState = action.payload
        },
    }
})
export const setLeftNavAC = (span: number) => async (dispatch: AppDispatch) => {
    // console.log('setLSidebarAC: - span', span)
    dispatch(pageElementsSlice.actions.myLeftNavSpan(span));    
}
export const setLSidebarAC = (stateSidebar: string) => async (dispatch: AppDispatch) => {
    // console.log('setLSidebarAC: - stateSidebar', stateSidebar)
    dispatch(pageElementsSlice.actions.myLSidebar(stateSidebar));    
}
export const setLSidebarSpanAC = (span: number) => async (dispatch: AppDispatch) => {
    // console.log('setLSidebarSpanAC: - span', span)
    dispatch(pageElementsSlice.actions.myLSidebarSpan(span));    
}
export const setContentSpanAC = (span: number) => async (dispatch: AppDispatch) => {
    // console.log('setContentSpanAC: - span', span)
    dispatch(pageElementsSlice.actions.myContentBlockSpan(span));    
}
export const setRSidebarAC = (stateSidebar: string) => async (dispatch: AppDispatch) => {
    // console.log('setRSidebarAC: - stateSidebar', stateSidebar)
    dispatch(pageElementsSlice.actions.myRSidebar(stateSidebar));    
}
export const setRSidebarSpanAC = (span: number) => async (dispatch: AppDispatch) => {
    // console.log('setRSidebarSpanAC: - span', span)
    dispatch(pageElementsSlice.actions.myRSidebarSpan(span));    
}
export const setRightNavSpanAC = (span: number) => async (dispatch: AppDispatch) => {
    // console.log('setRSidebarAC: - span', span)
    dispatch(pageElementsSlice.actions.myRightNavSpan(span));    
}
export const setFooterAC = (stateFooter: string) => async (dispatch: AppDispatch) => {
    dispatch(pageElementsSlice.actions.myFooter(stateFooter));    
}
export default pageElementsSlice.reducer