import React, { Suspense } from "react"
import { Route, Routes } from "react-router-dom";
import { Shop } from "@/Shops";

const AppUserShop: React.FC = () => {
    return (
        <Routes>
            <Route element={
                <Suspense fallback={'Loading...'}>
                    <Shop/>
                </Suspense>
            }/> 
        </Routes>
    )
}
export default AppUserShop