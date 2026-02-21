import { HTTP_STATUSES } from "src/core/utils/utils"
import { contextTests } from "test/helpers/init-settings"

export const isCreatedPostLike = async (
    postId: string, 
    likeStatus: string, 
    accessToken: string | null, 
    statusCode: number = HTTP_STATUSES.CREATED_201
) => {
    const { response } = await contextTests.postsTestManager.createPostLike(
        postId,
        {
            likeStatus
        },
        accessToken,
        statusCode
    )
    return response.status
}

export const isCreatedCommentLike = async (
    commentId: string, 
    likeStatus: string, 
    accessToken: string | null, 
    statusCode: number = HTTP_STATUSES.CREATED_201
) => {
    const { response } = await contextTests.likesTestManager.createCommentLike(
        commentId,
        {
            likeStatus
        },
        accessToken,
        statusCode
    )
    return response.status
}