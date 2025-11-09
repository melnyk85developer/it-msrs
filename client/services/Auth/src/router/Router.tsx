import AuthContainer from "@/AuthContainer";
import RegistrationContainer, { routeMain as routeRegistration } from "@/pages/Auth";
import { IUser } from "@packages/shared/src/types/IUser";
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const routeAuth = () => "/auth/*";

const AppAuthRouter: React.FC = () => {

    return (
        <Routes>
            <Route index element={<AuthContainer />}/>
            {/* <Route path={routeRegistration()} element={<RegistrationContainer />} /> */}
        </Routes>
    )
}
export {routeAuth}
export default AppAuthRouter