import React, { useEffect } from "react";
import { BlogsOutletContext } from "@/MyBlogs/BlogsOutletContext/blogsOutletContext";
import { Navigate, useOutletContext } from "react-router-dom";
import { routeMain as routeBlog } from '../../BlogsContainer';
import { useAppDispatch } from "@packages/shared/src/components/hooks/redux";
import { getAllPostsForBlogAC } from "@packages/shared/src/store/BlogsReducers/blogsSlice";
import routeMain from "./routes";
import classes from './styles.module.scss'
import PostItem from "./PostItem/postItem";

const PostListBlog: React.FC = React.memo(() => {
    const dispatch = useAppDispatch()

    const {
        blogId,
        blogs,
        posts,
        myCurrentBlog,
        setMyCurrentBlog,
        addBlog,
        setModalAddBlog,
        isUpdateBlog,
        setModalIsUpdateBlog,
        blogName,
        setBlogName,
        blogDescription,
        setBlogDescription,
        websiteUrl,
        setWebsiteUrl,
        createBlog,
        updateBlog,
        error,
        isDarkTheme
    } = useOutletContext<BlogsOutletContext>();

    useEffect(() => {
        if (myCurrentBlog && blogId !== ':blogId') {
            dispatch(getAllPostsForBlogAC(blogId))
        }
    }, []);

    // console.log('PostListBlog: - myCurrentBlog', myCurrentBlog)
    console.log('PostListBlog: - posts', posts)

    return (
        <div>
            {
                myCurrentBlog && blogId === ':blogId'
                    ?
                    <Navigate to={routeBlog(myCurrentBlog.id)} />
                    :
                    <section className={classes.sectionContentBlog}>
                        {
                            posts.length
                                ?
                                posts.map((post) => (
                                    <PostItem
                                        key={post.id}
                                        post={post}
                                    />
                                ))
                                :
                                <div className={classes.blockOfNoBlogs}>
                                    <h1>В данный момент у Вас нет ни одного поста в нашем блоге!</h1>
                                    <h2>Для создания поста перейдите в правое верхнее меню и создайте пост.</h2>
                                </div>
                        }
                    </section>
            }
        </div>
    )
})
export { routeMain };
export default PostListBlog;