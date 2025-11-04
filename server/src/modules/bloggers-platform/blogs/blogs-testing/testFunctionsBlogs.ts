import { HTTP_STATUSES } from "src/shared/utils/utils";
import { contextTests } from "test/contextTests";
import { blogsTestManager } from "test/managersTests/blogsTestManager";

export const isCreatedBlog1 = async (name: string, description: string, websiteUrl: string, statusCode: number = HTTP_STATUSES.CREATED_201) => {
    if (!contextTests.createdBlog1) {
            const blogData = {
                name,
                description,
                websiteUrl
            };
            const { bodyBlog, response } = await blogsTestManager.createBlogs(
                blogData,
                contextTests.codedAuth,
                HTTP_STATUSES.CREATED_201
            );
            contextTests.createdBlog1 = bodyBlog

        if (response.status === statusCode) {
            return contextTests.createdBlog1
        } else {
            return response.body;
        }
    } else {
        return null
    }
}
export const isCreatedBlog2 = async (name: string, description: string, websiteUrl: string, statusCode: number = HTTP_STATUSES.CREATED_201) => {
    if (!contextTests.createdBlog2) {
            const blogData = {
                name,
                description,
                websiteUrl
            };
            const { bodyBlog, response } = await blogsTestManager.createBlogs(
                blogData,
                contextTests.codedAuth,
                HTTP_STATUSES.CREATED_201
            );
            contextTests.createdBlog2 = bodyBlog

        if (response.status === statusCode) {
            return contextTests.createdBlog2
        } else {
            return response.body;
        }
    } else {
        return null
    }
}
export const isCreatedBlog3 = async (name: string, description: string, websiteUrl: string, statusCode: number = HTTP_STATUSES.CREATED_201) => {
    if (!contextTests.createdBlog3) {
            const blogData = {
                name,
                description,
                websiteUrl
            };
            const { bodyBlog, response } = await blogsTestManager.createBlogs(
                blogData,
                contextTests.codedAuth,
                HTTP_STATUSES.CREATED_201
            );
            contextTests.createdBlog3 = bodyBlog

        if (response.status === statusCode) {
            return contextTests.createdBlog3
        } else {
            return response.body;
        }
    } else {
        return null
    }
}