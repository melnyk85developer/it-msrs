import React from "react"
import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import MyAdminContainer from "../AdminPanel";
import AdminShopsContainer, { routeMain as routeAdminShopsContainer } from "../AdminPanel/pages/AdminShops/adminShopsContainer";
import BotsContainer, { routeMain as routeAdminBotsContainer } from "../AdminPanel/pages/Bots/botsContainer";
import AdminHome from "../AdminPanel/pages";
import AdminAiAssistantContainer from "../AdminPanel/pages/AI-Assistant-General/ai-assistant-general-container";

const AppMyAdminRout = () => {
    return (
        <Routes>
            <Route path="/" element={<MyAdminContainer />}>
                <Route index element={
                    <Suspense fallback={'Loading...'}>
                        <AdminHome />
                    </Suspense>
                } />
                <Route path="ai-assistant/:userId" element={
                    <Suspense fallback={'Loading...'}>
                        <AdminAiAssistantContainer />
                    </Suspense>
                }>
                    <Route
                        path="dialog/:dialogId"
                        element={null} // 👈 важно: ничего не рендерим, просто меняем URL
                    />
                </Route>
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