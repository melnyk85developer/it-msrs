import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IUser } from "../../types/IUser"
import { AppDispatch } from "../redux-store";
import BlogsAPI from "../../services/blogsAPI";
import { AboutPageBlogType, BlogType, CreateBlogType, CreatePostBlogType, HomePageBlogType, PostBlogType, UpdatePostBlogType } from "../../types/blogTypes";
import authSlice from "../AuthReducers/authSlice";

interface BlogState {
    blogs: BlogType[];
    posts: PostBlogType[];
    currentBlog: BlogType;
    homePage: HomePageBlogType;
    about: AboutPageBlogType;
    isBlogsLoading: boolean;
    isPostsLoading: boolean;
    error: string;
}

const initialState: BlogState = {
    blogs: [],
    posts: [],
    currentBlog: null,
    homePage: null,
    about: null,
    isBlogsLoading: false,
    isPostsLoading: false,
    error: '',
}

export const blogsSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        blogFetching(state) {
            state.isBlogsLoading = true
        },
        postFetching(state) {
            state.isPostsLoading = true
        },
        setMyblogs(state, action: PayloadAction<BlogType[]>) {
            state.isBlogsLoading = false
            state.error = ''
            state.blogs = action.payload
        },
        setMyblogById(state, action: PayloadAction<BlogType>) {
            state.isBlogsLoading = false
            state.error = ''
            state.currentBlog = action.payload
        },
        addPostForBlog(state, action: PayloadAction<PostBlogType>) {
            state.error = '';
            // Добавление нового поста в массив существующих постов профиля
            state.posts.push(action.payload);
        },
        setMyblogAllPosts(state, action: PayloadAction<PostBlogType[]>) {
            state.isBlogsLoading = false
            state.error = ''
            state.posts = action.payload
        },
        updatePost(state, action: PayloadAction<PostBlogType>) {
            state.error = '';
            state.posts = state.posts.map(post => post.id === action.payload.id
                ? action.payload
                : post
            );
        },
        deletePost(state, action: PayloadAction<string>) {
            state.error = '';
            const postIdToDelete = action.payload;
            state.posts = state.posts.filter(post => post.id !== postIdToDelete);
        },
        setHomePageById(state, action: PayloadAction<HomePageBlogType>) {
            state.isBlogsLoading = false
            state.error = ''
            state.homePage = action.payload
        },
        setAboutPageById(state, action: PayloadAction<AboutPageBlogType>) {
            state.isBlogsLoading = false
            state.error = ''
            state.about = action.payload
        },
        fetchingError(state, action: PayloadAction<string>) {
            state.isBlogsLoading = false
            state.isPostsLoading = false
            state.error = action.payload
        },
    }
})
export const getMyBlogsAC = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(blogsSlice.actions.blogFetching())
        const data = await BlogsAPI.getMyBlogsAPI()
        // console.log('getUsersAC: - data', data.data)
        const blogs = data.data.items
        dispatch(blogsSlice.actions.setMyblogs(blogs))
    } catch (e: any) {
        dispatch(blogsSlice.actions.fetchingError(e.message))
    }
}
export const getBlogByIdAC = (id: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(blogsSlice.actions.blogFetching())
        const data = await BlogsAPI.getBlogByIdAPI(id)
        // console.log('getUsersAC: - data', data.data)
        dispatch(blogsSlice.actions.setMyblogById(data.data))
        // return data.data
    } catch (error: any) {
        dispatch(blogsSlice.actions.fetchingError(error.message))
    }
}
export const getHomePageBlogByIdAC = (id: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(blogsSlice.actions.blogFetching())
        const data = await BlogsAPI.getHomePageBlogByIdAPI(id)
        // console.log('getHomePageBlogByIdAC: - data', data.data)
        dispatch(blogsSlice.actions.setHomePageById(data.data))
        // return data.data
    } catch (error: any) {
        dispatch(blogsSlice.actions.fetchingError(error.message))
    }
}
export const getAboutPageBlogByIdAC = (id: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(blogsSlice.actions.blogFetching())
        const data = await BlogsAPI.getAboutPageBlogByIdAPI(id)
        // console.log('getAboutPageBlogByIdAC: - data', data.data)
        dispatch(blogsSlice.actions.setAboutPageById(data.data))
        // return data.data
    } catch (error: any) {
        dispatch(blogsSlice.actions.fetchingError(error.message))
    }
}
export const createBlogAC = (newBlog: CreateBlogType) => async (dispatch: AppDispatch) => {
    // console.log('blogsSlice: createBlogAC - ', newBlog)

    try {
        dispatch(blogsSlice.actions.blogFetching())
        const data = await BlogsAPI.createBlogAPI(newBlog)
        // console.log('createBlogAC: - RES data', data.data)
        const blogs = data.data.items
        // dispatch(blogsSlice.actions.blogFetchingSuccess(blogs))
        return blogs
    } catch (error: any) {
        dispatch(blogsSlice.actions.fetchingError(error.message))
    }
}
export const updateBlogAC = (id: string, newBlog: CreateBlogType) => async (dispatch: AppDispatch) => {
    // console.log('blogsSlice: createBlogAC - ', newBlog)
    try {
        dispatch(blogsSlice.actions.blogFetching())
        const response = await BlogsAPI.updateBlogAPI(id, newBlog)
        // console.log('updateBlogAC: - RES data', response.status)
        if (response.status === 204) {
            const data = await BlogsAPI.getBlogByIdAPI(id)
            console.log('getUsersAC: - data', data.data)
            dispatch(blogsSlice.actions.setMyblogById(data.data))
        }
    } catch (error: any) {
        dispatch(blogsSlice.actions.fetchingError(error.message))
    }
}
export const createPageForBlogAC = (id: string, page: HomePageBlogType & AboutPageBlogType) => async (dispatch: AppDispatch) => {
    // console.log('blogsSlice: createPageForBlogAC - page - ', page)

    try {
        dispatch(blogsSlice.actions.blogFetching())
        const data = await BlogsAPI.createPageForBlogAPI(id, page)
        // console.log('createPageForBlogAC: - RES data', data.data)
        const blogs = data.data.items
        // dispatch(blogsSlice.actions.blogFetchingSuccess(blogs))
        return blogs
    } catch (error: any) {
        dispatch(blogsSlice.actions.fetchingError(error.message))
    }
}

export const createPostAsBlogAC = (newPostBlog: CreatePostBlogType) => async (dispatch: AppDispatch) => {
    // console.log('blogsSlice: createBlogAC - ', newBlog)
    try {
        dispatch(blogsSlice.actions.postFetching())
        const data = await BlogsAPI.createPostAsBlogAPI(newPostBlog)
        // console.log('createBlogAC: - RES data', data.data)
        dispatch(blogsSlice.actions.addPostForBlog(data.data))
        const blogs = data.data.items
        // dispatch(blogsSlice.actions.blogFetchingSuccess(blogs))
        return blogs
    } catch (error: any) {
        dispatch(blogsSlice.actions.fetchingError(error.message))
    }
}
export const updatePostAsBlogAC = (newPostBlog: UpdatePostBlogType) => async (dispatch: AppDispatch) => {
    // console.log('blogsSlice: createBlogAC - ', newBlog)
    try {
        dispatch(blogsSlice.actions.postFetching())
        const data = await BlogsAPI.updatePostAsBlogAPI(newPostBlog)
        // console.log('updatePostAsBlogAC: - RES data', data.status)
        if (data.status === 204) {
            const data = await BlogsAPI.getPostByIdForBlogAPI(newPostBlog.id)
            dispatch(blogsSlice.actions.updatePost(data.data))
        }
        return true
    } catch (error: any) {
        dispatch(blogsSlice.actions.fetchingError(error.message))
    }
}
export const deletePostAsBlogAC = (postId: string) => async (dispatch: AppDispatch) => {
    try {
        const data = await BlogsAPI.deletePostAPI(postId)
        // console.log('deletePostAsBlogAC - status', data.status)
        // Добавляем задержку в 1 секунду перед вызовом dispatch
        if (data.status !== 204) return

        setTimeout(() => {
            // Если удаление прошло успешно, вызываем диспетчер для удаления поста
            dispatch(blogsSlice.actions.deletePost(postId));
        }, 2000);

    } catch (error: any) {
        dispatch(blogsSlice.actions.fetchingError(error.message))
    }
}
export const getAllPostsForBlogAC = (blogId: string) => async (dispatch: AppDispatch) => {
    // console.log('blogsSlice: createBlogAC - ', newBlog)
    try {
        dispatch(blogsSlice.actions.postFetching())
        const data = await BlogsAPI.getAllPostsForBlogAPI(blogId)
        const posts = data.data.items
        // console.log('getAllPostsForBlogAC: - RES data', data.data)
        dispatch(blogsSlice.actions.setMyblogAllPosts(posts))
    } catch (error: any) {
        dispatch(blogsSlice.actions.fetchingError(error.message))
    }
}
export default blogsSlice.reducer