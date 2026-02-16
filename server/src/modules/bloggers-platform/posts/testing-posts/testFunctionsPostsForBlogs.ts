import { CreatePostInputDto } from "../posts-api/posts-input-dto/posts.input-dto";
import { HTTP_STATUSES } from "src/core/utils/utils";
import { contextTests } from "test/helpers/init-settings";

export const isCreatedPostForBlog = async (
    numBlog: number,
    numPost: number,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    statusCode: number = HTTP_STATUSES.CREATED_201
) => {
    const postKey = contextTests.posts_for_blog[`createdBlog${numBlog + 1}Posts`]
    const isPostTestStore = postKey[numPost + 1]

    if (isPostTestStore === undefined || isPostTestStore === null) {
        const postData: CreatePostInputDto = {
            title,
            shortDescription,
            content,
            blogId
        };
        const { response } = await contextTests.postsTestManager.createPosts(
            postData,
            contextTests.constants.codedAuth,
            contextTests.sessions.accessTokenUser1Devices[0],
            contextTests.sessions.refreshTokenUser1Devices[0],
            statusCode
        );
        if (response.status === statusCode) {
            // console.log('TEST isCreatedPost1: - response.body 😡😡😡', response.body)
            contextTests.posts_for_blog.addPostsForBlogStateTest({
                numBlog,
                numPost,
                addPost: response.body
            })
            return response.body;
        } else {
            return response.body;
        }
    } else {
        return contextTests.posts_for_blog[`createdBlog${numBlog +1}Posts`][numPost]
        // return null
    }
}