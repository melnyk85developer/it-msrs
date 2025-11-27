import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HTTP_STATUSES, HttpStatusType } from 'src/core/utils/utils';
import { SETTINGS } from 'src/core/settings';

export class LikesTestManager {
    constructor(private app: INestApplication) { }

    async createPostLike(
        postId: string,
        likeStatus: any,
        accessToken: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204
    ) {
        // console.log('LikesTestManager: createLike - accessToken', accessToken)
        // console.log('LikesTestManager: createLike - commentId, likeStatus', commentId, likeStatus)

        const response = await request(this.app.getHttpServer())
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
    }
    async createCommentLike(
        commentId: string,
        likeStatus: any,
        // codedAuth: string,
        accessToken: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204
    ) {
        // console.log('LikesTestManager: createLike - accessToken', accessToken)
        // console.log('LikesTestManager: createLike - commentId, likeStatus', commentId, likeStatus)

        const response = await request(this.app.getHttpServer())
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