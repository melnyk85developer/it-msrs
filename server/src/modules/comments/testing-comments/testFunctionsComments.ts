import { HTTP_STATUSES } from "src/core/utils/utils";
import { CreateCommentInputDto } from "../comments-api/comments-input-dto/comments.input-dto";
import { contextTests } from "test/helpers/init-settings";

export const isCreatedComment = async (
    numBlog: number,
    numPost: number,
    numComment: number,
    content: string,
    postId: string,
    accessToken: string,
    refreshToken: string,
    statusCode: number = HTTP_STATUSES.CREATED_201
) => {
    const postKey = contextTests.comments[`createdBlog${numBlog + 1}Post${numPost + 1}Comments`]
    const isCommentTestStore = postKey[numComment + 1]

    const commentData: CreateCommentInputDto = {
        content
    };
    const { createdComment, response } = await contextTests.commentsTestManager.createComment(
        numBlog,
        numPost,
        numComment,
        postId,
        commentData,
        accessToken,
        statusCode
    )

    if (response.status === statusCode) {
        // return contextTests.comments.createdBlog1Post1Comments.push(createdComment)
        return createdComment;
    } else {
        return response.body;
    }

    // if (isCommentTestStore === undefined || isCommentTestStore === null) {
    //     const commentData: CreateCommentInputDto = {
    //         content,
    //         postId
    //     };
    //     const { createdComment, response } = await contextTests.commentsTestManager.createComment(
    //         numBlog,
    //         numPost,
    //         numComment,
    //         contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
    //         commentData,
    //         accessToken,
    //         statusCode
    //     )

    //     if (response.status === statusCode) {
    //         // return contextTests.comments.createdBlog1Post1Comments.push(createdComment)
    //         return createdComment;
    //     } else {
    //         return response.body;
    //     }
    // } else {
    //     return contextTests.comments[`createdBlog${numBlog + 1}Post${numPost + 1}Comments`][numComment]
    //     // return null
    // }
}