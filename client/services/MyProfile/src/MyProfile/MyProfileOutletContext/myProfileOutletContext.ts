import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { AboutPageBlogType, BlogType, HomePageBlogType, PostBlogType } from "@packages/shared/src/types/blogTypes"
import { IProfile, IUser } from "@packages/shared/src/types/IUser";
import { PostsType } from "@packages/shared/src/types/types";
import { Dispatch, SetStateAction } from "react"

export type MyProfileOutletContext = {
    dispatch: AppDispatch;
    isAuth: boolean;
    authorizedUser: IUser;
    profile: IProfile;
    posts: PostsType[]
    error: string;
    isDarkTheme: string
}