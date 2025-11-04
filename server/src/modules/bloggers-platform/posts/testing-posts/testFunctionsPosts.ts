import { contextTests } from "test/contextTests";
import { CreatePostInputDto } from "../posts-api/posts-input-dto/posts.input-dto";
import { postsTestManager } from "test/managersTests/postsTestManager";
import { HTTP_STATUSES } from "src/shared/utils/utils";
import { Types } from "mongoose";

export const isCreatedPost1 = async (title: string, shortDescription: string, content: string, blogId: string, statusCode: number = HTTP_STATUSES.CREATED_201) => {
    if (!contextTests.createdBlog1Post1) {
        // console.log('isCreatedUser1: - contextTests.createdUser1', contextTests.createdUser1)
        const postData: CreatePostInputDto = {
            title,
            shortDescription,
            content,
            blogId
        };
        const { response } = await postsTestManager.createPosts(
            postData,
            contextTests.codedAuth,
            contextTests.accessTokenUser1Device1,
            contextTests.refreshTokenUser1Device1,
            statusCode
        );
        if (response.status === statusCode) {
            // console.log('TEST isCreatedPost1: - response.body 😡😡😡', response.body)
            contextTests.createdBlog1Post1 = response.body;
            return contextTests.createdBlog1Post1
        } else {
            return response.body;
        }
    } else {
        return null
    }
}
export const isCreatedPost2 = async (title: string, shortDescription: string, content: string, blogId: string, statusCode: number = HTTP_STATUSES.CREATED_201) => {
    if (!contextTests.createdBlog1Post2) {
        const postData: CreatePostInputDto = {
            title,
            shortDescription,
            content,
            blogId
        };
        const { response } = await postsTestManager.createPosts(
            postData,
            contextTests.codedAuth,
            contextTests.accessTokenUser1Device1,
            contextTests.refreshTokenUser1Device1,
            statusCode
        );
        if (response.status === statusCode) {
            contextTests.createdBlog1Post2 = response.body;
            return contextTests.createdBlog1Post2
        } else {
            return response.body;
        }
    } else {
        return null
    }
}
export const isCreatedPost3 = async (title: string, shortDescription: string, content: string, blogId: string, statusCode: number = HTTP_STATUSES.CREATED_201) => {
    if (!contextTests.createdBlog1Post3) {
        const postData: CreatePostInputDto = {
            title,
            shortDescription,
            content,
            blogId
        };
        const { response } = await postsTestManager.createPosts(
            postData,
            contextTests.codedAuth,
            contextTests.accessTokenUser1Device1,
            contextTests.refreshTokenUser1Device1,
            statusCode
        );
        if (response.status === statusCode) {
            contextTests.createdBlog1Post3 = response.body;
            return contextTests.createdBlog1Post3
        } else {
            return response.body;
        }
    }
}