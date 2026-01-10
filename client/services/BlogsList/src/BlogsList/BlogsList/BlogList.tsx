import React from "react";
import BlogItem from "../BlogItem/BlogItem";
import { BlogType } from "@packages/shared/src/types/blogTypes";

export type PropsType = {
    blogs: Array<BlogType>
    // followingInProgress: Array<number>
    // unfollow: (userId: number) => void
    // follow: (userId: number) => void
}

const BlogsList: React.FC<PropsType> = React.memo((props) => {

    return (
        <div className="wrapFriendsList">
            {props.blogs.map( (blog) => (
                <BlogItem 
                    key={blog.id}
                    blog={blog}

                    // followingInProgress={props.followingInProgress} 
                    // follow={props.follow}
                    // unfollow={props.unfollow}
                />
            ))}
        </div> 
    )
})
export default BlogsList;