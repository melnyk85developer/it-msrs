import React from "react"
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import routeMain from './routes'
import UserProfile from ".";

const UserProfileContainer: React.FC = React.memo(() => {
    const dispatch = useAppDispatch()
    const {profile, error} = useAppSelector(state => state.userProfilePage)
    const {isAuth, authorizedUser, isDarkTheme} = useAppSelector(state => state.authPage)

    return (
        <UserProfile 
            dispatch={dispatch}
            profile={profile}
            error={error}
            isAuth={isAuth}
            authorizedUser={authorizedUser}
            isDarkTheme={isDarkTheme}
        />
    )
})
export {routeMain};
export default UserProfileContainer