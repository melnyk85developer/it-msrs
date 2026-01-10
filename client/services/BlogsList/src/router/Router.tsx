import React, { Suspense } from "react"
import { Route, Routes } from "react-router-dom";
import { Blogs } from "@/Blogs";

const AppAllBlogs: React.FC = () => {
    return (
        <Routes>
            <Route element={
                <Suspense fallback={'Loading...'}>
                    <Blogs/>
                </Suspense>
            }/> 
        </Routes>
    )
}
export default AppAllBlogs