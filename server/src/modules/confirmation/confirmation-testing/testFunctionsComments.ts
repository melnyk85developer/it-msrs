import { CreateCommentInputDto } from "src/modules/bloggers-platform/comments/comments-api/comments-input-dto/comments.input-dto";
import { HTTP_STATUSES } from "src/shared/utils/utils";
import { contextTests } from "test/contextTests";
import { commetsTestManager } from "test/managersTests/commentsTestManager";


export const isCreatedComment1 = async (content: string, postId: string, statusCode: number = HTTP_STATUSES.CREATED_201) => {
    if (!contextTests.createdBlog1Post1Comment1) {
            const commentData: CreateCommentInputDto = {
                content,
                postId
            };
            const { createdComment, response } = await commetsTestManager.createComment(
                contextTests.createdBlog1Post1.id,
                commentData,
                contextTests.accessTokenUser1Device1,
                statusCode
            )
            contextTests.createdBlog1Post1Comment1 = createdComment

        if (response.status === statusCode) {
            contextTests.total_number_of_comments_in_tests++
            return contextTests.createdBlog1Post1Comment1
        } else {
            return response.body;
        }
    } else {
        return null
    }
}
export const isCreatedComment2 = async (content: string, postId: string, statusCode: number = HTTP_STATUSES.CREATED_201) => {
    if (!contextTests.createdBlog1Post1Comment2) {
            const commentData: CreateCommentInputDto = {
                content,
                postId
            };
            const { createdComment, response } = await commetsTestManager.createComment(
                contextTests.createdBlog1Post1.id,
                commentData,
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.CREATED_201
            )
            contextTests.createdBlog1Post1Comment2 = createdComment

        if (response.status === statusCode) {
            contextTests.total_number_of_comments_in_tests++
            return contextTests.createdBlog1Post1Comment2
        } else {
            return response.body;
        }
    } else {
        return null
    }
}
export const isCreatedComment3 = async (content: string, postId: string, statusCode: number = HTTP_STATUSES.CREATED_201) => {
    if (!contextTests.createdBlog1Post1Comment3) {
            const commentData: CreateCommentInputDto = {
                content,
                postId
            };
            const { createdComment, response } = await commetsTestManager.createComment(
                contextTests.createdBlog1Post1.id,
                commentData,
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.CREATED_201
            )
            contextTests.createdBlog1Post1Comment3 = createdComment

        if (response.status === statusCode) {
            contextTests.total_number_of_comments_in_tests++
            return contextTests.createdBlog1Post1Comment3
        } else {
            return response.body;
        }
    } else {
        return null
    }
}