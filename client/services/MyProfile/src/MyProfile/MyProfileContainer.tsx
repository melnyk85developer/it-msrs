import React, { useEffect, useState } from "react"
import MyProfile from "."
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import routeMain from './routes'

const MyProfileContainer: React.FC = React.memo(() => {
    const dispatch = useAppDispatch()
    const {profile, error} = useAppSelector(state => state.myProfilePage);
    const {isAuth, authorizedUser, isDarkTheme} = useAppSelector(state => state.authPage);

    return (
        <>
            <MyProfile 
                dispatch={dispatch}
                profile={profile}
                error={error}
                isAuth={isAuth}
                authorizedUser={authorizedUser}
                isDarkTheme={isDarkTheme}
            />
        </>
    )
})
export {routeMain};
export default MyProfileContainer