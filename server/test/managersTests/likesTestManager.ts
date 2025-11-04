import { HTTP_STATUSES, HttpStatusType } from "src/shared/utils/utils";
import { getRequest } from "./authTestManager";
import { SETTINGS } from "src/shared/settings";

export const likesTestManager = {
    async createPostLike(
        postId: string,
        likeStatus: any,
        accessToken: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {
        // console.log('LikesTestManager: createLike - accessToken', accessToken)
        // console.log('LikesTestManager: createLike - commentId, likeStatus', commentId, likeStatus)

        const response = await getRequest()
            .put(`${SETTINGS.RouterPath.posts}/${postId}/like-status`)
            // .set('User-Agent', 'TestDevice/1.0')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(likeStatus)
            .expect(expectedStatusCode)

        let createdLikeStatus;
        // console.log('LikesTestManager: createComment - response.status 😡', response.status)

        if (expectedStatusCode === HTTP_STATUSES.UNAUTHORIZED_401) {
            expect(expectedStatusCode)
        }
        return { response: response, createdLikeStatus: createdLikeStatus }
    },
    async createCommentLike(
        commentId: string,
        likeStatus: any,
        // codedAuth: string,
        accessToken: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {
        // console.log('LikesTestManager: createLike - accessToken', accessToken)
        // console.log('LikesTestManager: createLike - commentId, likeStatus', commentId, likeStatus)

        const response = await getRequest()
            .put(`${SETTINGS.RouterPath.comments}/${commentId}/like-status`)
            // .set('Authorization', `Basic ${codedAuth}`)
            // .set('User-Agent', 'TestDevice/1.0')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(likeStatus)
            .expect(expectedStatusCode)

        let createdLikeStatus;
        // console.log('LikesTestManager: createComment - response.status 😡', response.status)

        if (expectedStatusCode === HTTP_STATUSES.UNAUTHORIZED_401) {
            expect(expectedStatusCode)
        }
        return { response: response, createdLikeStatus: createdLikeStatus }
    }
}