import React from "react";
import Auth from "./pages/Auth";
import { useAppSelector } from "@packages/shared/src/components/hooks/redux";
import routeMain  from './../src/pages/Auth/route';

const AuthContainer: React.FC = () => {
    const {isDarkTheme, authorizedUser, isAuth, isLoadingAuthUser} = useAppSelector(state => state.authPage)
    
    return (
        <Auth
            isAuth={isAuth}
            isDarkTheme={isDarkTheme}
            authorizedUser={authorizedUser}
            isLoadingAuthUser={isLoadingAuthUser}
        />
    )
}
export { routeMain };
export default AuthContainer