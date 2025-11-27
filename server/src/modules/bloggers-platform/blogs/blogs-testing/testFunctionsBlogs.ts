import { HTTP_STATUSES } from "src/core/utils/utils";
import { contextTests } from "test/helpers/init-settings";

export const isCreatedBlog = async (numBlog: number, name: string, description: string, websiteUrl: string, statusCode: number = HTTP_STATUSES.CREATED_201) => {
    if (contextTests.blogs.createdBlogs[numBlog] === undefined || contextTests.blogs.createdBlogs[numBlog] === null) {
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
        if (response.status === HTTP_STATUSES.CREATED_201) {
            // console.log('isCreatedBlog: bodyBlog 😡', bodyBlog)
            // Добавляем в тест-сторе Blog после удачного посещения createBlogs!
            contextTests.blogs.addBlogStateTest({ numBlog, addBlog: bodyBlog })
            return response.body;
        } else {
            return response.body;
        }
    } else {
        return null
    }
}