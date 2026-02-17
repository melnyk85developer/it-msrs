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
    if (!contextTests.comments.createdBlog1Post1Comments.length) {
        const commentData: CreateCommentInputDto = {
            content,
            postId
        };
        const { createdComment, response } = await contextTests.commentsTestManager.createComment(
            numBlog,
            numPost,
            numComment,
            contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
            commentData,
            accessToken,
            statusCode
        )

        if (response.status === statusCode) {
            // contextTests.comments.total_number_of_comments_in_tests++
            // return contextTests.comments.createdBlog1Post1Comments.push(createdComment)
            return createdComment;
        } else {
            return response.body;
        }
    } else {
        return null
    }
}