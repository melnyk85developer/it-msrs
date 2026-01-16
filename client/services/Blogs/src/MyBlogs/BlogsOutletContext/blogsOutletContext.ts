import { AboutPageBlogType, BlogType, HomePageBlogType, PostBlogType } from "@packages/shared/src/types/blogTypes"
import { Dispatch, SetStateAction } from "react"

export type BlogsOutletContext = {
    createBlog: () => void;
    updateBlog: () => void;
    
    blogId: string;
    blogs: BlogType[];
    posts: PostBlogType[];
    myCurrentBlog: BlogType | null;
    setMyCurrentBlog: Dispatch<SetStateAction<BlogType | null>>;
    addBlog: boolean;
    setModalAddBlog: Dispatch<SetStateAction<boolean>>;
    isUpdateBlog: boolean;
    setModalIsUpdateBlog: Dispatch<SetStateAction<boolean>>;
    blogName: string | null;
    setBlogName: Dispatch<SetStateAction<string | null>>;
    blogDescription: string | null;
    setBlogDescription: Dispatch<SetStateAction<string | null>>;
    websiteUrl: string | null;
    setWebsiteUrl: Dispatch<SetStateAction<string | null>>;
    homePage: HomePageBlogType,
    about: AboutPageBlogType,

    addPostBlog: boolean;
    error: string;
    isDarkTheme: string;
}