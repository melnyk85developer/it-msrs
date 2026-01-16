import { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import MyProfileContainer from "../MyProfile/MyProfileContainer";
import MyProfile from "../MyProfile";
import { routeMain as routeMyProfile } from '../MyProfile/MyProfileContainer';

const AppProfile = () => {
    return (
        <Routes>
            <Route path="/" element={<MyProfileContainer />}>
                {/* <Route index element={<Navigate to={routeMyProfile()} />} /> */}

                <Route index element={
                    <Suspense fallback={'Loading...'}>
                        <MyProfile />
                    </Suspense>
                } />
                {/* <Route path="posts">
                    <Route index element={
                        <Suspense fallback={'Loading...'}>
                            <PostListBlog />
                        </Suspense>
                    } />
                    <Route path=":postId" element={
                        <Suspense fallback={'Loading...'}>
                            <PostDetailBlog />
                        </Suspense>
                    } />
                </Route>

                <Route path="about" element={
                    <Suspense fallback={'Loading...'}>
                        <About />
                    </Suspense>
                } /> */}
            </Route>
        </Routes>
    )
}
export default AppProfile