import { Navigate, Route, Routes } from "react-router-dom";
import { Suspense } from "react";
import BlogsContainer from "../MyBlogs/BlogsContainer";
import { routeMain as routeHomePage } from '../MyBlogs/BlogPages/HomePage/homePage';
import HomePage from "../MyBlogs/BlogPages/HomePage/homePage";
import About from "../MyBlogs/BlogPages/About/about";
import PostListBlog from "../MyBlogs/BlogPages/PostListBlog/postListBlog";
import PostDetailBlog from "../MyBlogs/BlogPages/PostListBlog/postDetailBlog/postDetailBlog";

const AppBlogs = () => {
    return (
        <Routes>
            <Route path="/" element={<BlogsContainer />}>
                <Route index element={<Navigate to={routeHomePage()} />} />

                <Route path="homepage" element={
                    <Suspense fallback={'Loading...'}>
                        <HomePage />
                    </Suspense>
                } />

                <Route path="posts">
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
                } />
            </Route>
        </Routes>
    )
}
export default AppBlogs