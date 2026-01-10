import React from "react";
import { Navigate, NavLink, useOutletContext } from "react-router-dom";
import { BlogsOutletContext } from "@/MyBlogs/BlogsOutletContext/blogsOutletContext";
import { PostBlogType } from "@packages/shared/src/types/blogTypes";
import { routeMain as routePostDetail } from '../postDetailBlog/postDetailBlog';
import classes from './styles.module.scss'

export type PropsType = {
    post: PostBlogType;
    // followingInProgress: Array<number>
    // unfollow: (userId: number) => void
    // follow: (userId: number) => void
}

const PostItem: React.FC<PropsType> = React.memo(({ post }) => {

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

    return (
        <section className={`${classes.wrapPostItemForBlog} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <div className={classes.postItem}>
                <div className={classes.postData}>
                    <div className={classes.wrapHeaderPost}>
                        <h1 className={classes.h1}>
                            {post.title}
                        </h1>
                    </div>
                    <div className={classes.wrapImgBlock}>
                        <NavLink to={routePostDetail(post.id)}>
                            <div className={classes.wrapImg}>
                                {/* <img
                                className={classes.usersAvatar}
                                src={blog.avatar !== null ? `${API_URL}/` + blog.avatar : defaultUserAvatar}
                                alt={blog.avatar}
                            /> */}
                            </div>
                        </NavLink>
                    </div>
                    <div className={classes.shortDescription}>
                        <p>{post.shortDescription}</p>
                    </div>
                    <div className={classes.postContent}>
                        <p>{post.content}</p>
                    </div>
                    <div className={classes.wrapFooterPost}>
                        <span className={classes.span}>Like{post.extendedLikesInfo.likesCount}</span>
                        <span className={classes.span}>Dislike{post.extendedLikesInfo.dislikesCount}</span>
                        {/* <span className={classes.span}>{post.extendedLikesInfo.myStatus}</span> */}
                        <span className={classes.span}>{post.extendedLikesInfo.newestLikes}</span>
                    </div>
                </div>
            </div>
        </section>
    )
})
export default PostItem;