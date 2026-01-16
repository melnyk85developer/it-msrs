import $api from "../http";
import { AxiosResponse } from "axios";
import { AboutPageBlogType, BlogType, CreateBlogType, CreatePostBlogType, HomePageBlogType, PostBlogType, UpdatePostBlogType } from "@/types/blogTypes";

export default class BlogsAPI {
    static getMyBlogsAPI(): Promise<AxiosResponse<any>> {
        return $api.get<BlogType[]>('/blogs/my-blogs')
    }
    static getAllBlogsAPI(): Promise<AxiosResponse<any>> {
        return $api.get<BlogType[]>('/blogs')
    }
    static getBlogByIdAPI(id: string): Promise<AxiosResponse<any>> {
        // console.log('BlogsAPI - getBlogByIdAPI 😡 id', id)
        return $api.get<BlogType>(`/blogs/${id}`)
    }
    static createBlogAPI(newBlog: CreateBlogType): Promise<AxiosResponse<any>> {
        // console.log('BlogsAPI: createBlogAPI - ', newBlog)
        const formData = new FormData()
        formData.append('name', newBlog.name)
        formData.append('description', newBlog.description)
        formData.append('websiteUrl', newBlog.websiteUrl)
        // formData.append('profileId', post.profileId.toString())
        // console.log('BlogsAPI: createBlogAPI - ', formData)
        return $api.post<BlogType>('/blogs/', newBlog)
    }
    static updateBlogAPI(id: string, newBlog: CreateBlogType): Promise<AxiosResponse<any>> {
        // console.log('BlogsAPI: updateBlogAPI - ', newBlog)
        const formData = new FormData()
        formData.append('name', newBlog.name)
        formData.append('description', newBlog.description)
        formData.append('websiteUrl', newBlog.websiteUrl)
        // formData.append('profileId', post.profileId.toString())
        console.log('BlogsAPI: updateBlogAPI - ', formData)

        return $api.put<BlogType>(`/blogs/${id}`, newBlog)
    }
    static createPageForBlogAPI(id: string, page: HomePageBlogType & AboutPageBlogType): Promise<AxiosResponse<any>> {
        console.log('BlogsAPI: createPageForBlogAPI - page, id', page, id)
        const formData = new FormData()

        formData.append('titleHome', page.titleHome)
        formData.append('subtitleHome', page.subtitleHome)
        formData.append('contentHome', page.contentHome)
        formData.append('ctaTextHome', page.ctaTextHome)
        formData.append('ctaLinkHome', page.ctaLinkHome)
        formData.append('seoDescriptionHome', page.seoDescriptionHome)

        formData.append('titleAbout', page.titleAbout)
        formData.append('subtitleAbout', page.subtitleAbout)
        formData.append('contentAbout', page.contentAbout)
        formData.append('missionAbout', page.missionAbout)
        formData.append('seoDescriptionAbout', page.seoDescriptionAbout)
        // formData.append('profileId', post.profileId.toString())
        // console.log('BlogsAPI: createBlogAPI - ', formData)

        return $api.put<BlogType>(`/blogs/home-page/${id}`, page)
    }
    static getHomePageBlogByIdAPI(id: string): Promise<AxiosResponse<any>> {
        // console.log('BlogsAPI - getHomePageBlogByIdAPI 😡 id', id)
        return $api.get<HomePageBlogType>(`/blogs/home-page/${id}`)
    }
    static getAboutPageBlogByIdAPI(id: string): Promise<AxiosResponse<any>> {
        // console.log('BlogsAPI - getAboutPageBlogByIdAPI 😡 id', id)
        return $api.get<AboutPageBlogType>(`/blogs/about-page/${id}`)
    }
    static createPostAsBlogAPI(newPostBlog: CreatePostBlogType): Promise<AxiosResponse<any>> {
        const blogId = newPostBlog.blogId
        console.log('BlogsAPI: createPostAsBlogAPI - ', newPostBlog)
        console.log('BlogsAPI: blogId - ', blogId)

        const formData = new FormData()
        formData.append('title', newPostBlog.title)
        formData.append('shortDescription', newPostBlog.shortDescription)
        formData.append('content', newPostBlog.content)
        formData.append('blogId', newPostBlog.blogId.toString())
        console.log('BlogsAPI: createPostAsBlogAPI - ', formData)

        return $api.post<PostBlogType>(`/blogs/${blogId}/posts`, newPostBlog)
    }
    static updatePostAsBlogAPI(newPostBlog: UpdatePostBlogType): Promise<AxiosResponse<any>> {
        const id = newPostBlog.id
        console.log('BlogsAPI: updatePostAsBlogAPI - ', newPostBlog)
        console.log('BlogsAPI: postId - ', id)

        const formData = new FormData()
        formData.append('title', newPostBlog.title)
        formData.append('shortDescription', newPostBlog.shortDescription)
        formData.append('content', newPostBlog.content)
        formData.append('blogId', newPostBlog.blogId.toString())
        console.log('BlogsAPI: updatePostAsBlogAPI - ', formData)

        return $api.put<PostBlogType>(`/posts/${id}`, newPostBlog)
    }
    static async deletePostAPI(id: string): Promise<AxiosResponse<PostBlogType>> {
        return $api.delete<PostBlogType>(`/posts/${id}`);
    }
    static getPostByIdForBlogAPI(id: string): Promise<AxiosResponse<any>> {
        console.log('BlogsAPI: id - ', id)
        return $api.get<PostBlogType>(`/posts/${id}`)
    }
    static getAllPostsForBlogAPI(blogId: string): Promise<AxiosResponse<any>> {
        console.log('BlogsAPI: blogId - ', blogId)
        return $api.get<PostBlogType>(`/blogs/${blogId}/posts`)
    }
}