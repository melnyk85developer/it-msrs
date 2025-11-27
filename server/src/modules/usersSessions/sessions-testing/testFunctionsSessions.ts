import { HTTP_STATUSES } from "src/core/utils/utils";
import { contextTests } from "test/helpers/init-settings";

export const isCreatedBlog = async (num: number, name: string, description: string, websiteUrl: string, statusCode: number = HTTP_STATUSES.CREATED_201) => {
    if (!contextTests.blogs.createdBlogs[num]) {
        // console.log('isCreatedBlog: - contextTests.createdBlogs[num]', contextTests.createdBlogs[num])
            const blogData = {
                name,
                description,
                websiteUrl
            };
            const { bodyBlog, response } = await contextTests.blogsTestManager.createBlogs(
                blogData,
                contextTests.constants.codedAuth,
                HTTP_STATUSES.CREATED_201
            );
            contextTests.blogs.createdBlogs.push(bodyBlog)
        if (response.status === statusCode) {
            return response.body;
        } else {
            return response.body;
        }
    } else {
        return null
    }
}