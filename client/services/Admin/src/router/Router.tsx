import React from "react"
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import MyAdminContainer from "../AdminPanel";
import AdminShopsContainer, { routeMain as routeAdminShopsContainer } from "../AdminPanel/pages/AdminShops/adminShopsContainer";
import BotsContainer, { routeMain as routeAdminBotsContainer } from "../AdminPanel/pages/Bots/botsContainer";
import AdminHome from "../AdminPanel/pages";
import AdminAiAssistantContainer from "../AdminPanel/pages/AI-Assistant-General/ai-assistant-general-container";
import AdminAiAssistant from "../AdminPanel/pages/AI-Assistant-General/ai-assistant";
import NoMessages from "../AdminPanel/pages/AI-Assistant-General/NoMessage/NoMessage";

const AppMyAdminRout = () => {
    return (
        <Routes>
            <Route path="/" element={<MyAdminContainer />}>
                <Route index element={
                    <Suspense fallback={'Loading...'}>
                        <AdminHome />
                    </Suspense>
                } />
                <Route path="ai-assistant/ai-messages" element={
                    <Suspense fallback={'Loading...'}>
                        <AdminAiAssistantContainer />
                    </Suspense>
                } />
                <Route path="ai-assistant/:userId" element={
                    <Suspense fallback={'Loading...'}>
                        <AdminAiAssistant />
                    </Suspense>
                } />
                {/* <Route path="ai-assistant-dialog/:dialogId" element={
                    <Suspense fallback={'Loading...'}>
                        <AdminAiAssistant />
                    </Suspense>
                } /> */}
                <Route path="adminshops" element={
                    <Suspense fallback={'Loading...'}>
                        <AdminShopsContainer />
                    </Suspense>
                } />
                <Route path="bots" element={
                    <Suspense fallback={'Loading...'}>
                        <BotsContainer />
                    </Suspense>
                } />
            </Route>
        </Routes >
    )
}
export default AppMyAdminRout