import React, { useEffect } from "react";
import { BlogType } from "@packages/shared/src/types/blogTypes";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { getBlogByIdAC } from "@packages/shared/src/store/BlogsReducers/blogsSlice";
import classes from './styles.module.scss'
import routeMain from "./routes";

const PostDetailBlog: React.FC = React.memo(() => {
    return (<h1>PostDetailBlog</h1>)
})
export { routeMain };
export default PostDetailBlog;