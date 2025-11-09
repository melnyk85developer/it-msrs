import { Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import MessageContainer from "../messageContainer";
import Dialog, { routeMain as routeDialog } from "../index";
import StartMessage from "../StartMessage/startMessage";

const AppMessages = () => {
    return (
        <Routes>
            <Route path="/" element={<MessageContainer />}>
                <Route index element={
                    <Suspense fallback={'Loading...'}>
                        <StartMessage />
                    </Suspense>
                } />
                <Route path="dialog/:dialogId" element={
                    <Suspense fallback={'Loading...'}>
                        <Dialog />
                    </Suspense>
                } />
            </Route>

        </Routes>
    )
}

export default AppMessages