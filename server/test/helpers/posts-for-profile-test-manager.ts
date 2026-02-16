import request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { HttpStatusType } from 'src/core/utils/utils';
import { SETTINGS } from 'src/core/settings';
import { CreatePostForProfileInputDto } from 'src/modules/posts-for-profile/posts-for-profile-api/posts-for-profile-input-dto/posts.input-dto';

export class PostsForProfileTestManager {
    constructor(private app: INestApplication) { }

    async getAllPostsForProfile(
        accessToken: string,
        refreshToken: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HttpStatus.OK
    ) {
        // console.log('TEST: - accessToken 😡', accessToken)
        // console.log('TEST: - refreshToken 😡', refreshToken)
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.posts_for_profile}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(expectedStatusCode);
        let getEntity
        if (expectedStatusCode === HttpStatus.OK) {
            getEntity = response.body
        }
        // console.log('TEST: - response.body 😡', response.body)
        return { response: response, getEntity: getEntity }
    }
    async getPostByIdForProfile(
        postId: string,
        expectedStatusCode: HttpStatusType = HttpStatus.OK
    ) {
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.posts_for_profile}/${postId}`)
            .expect(expectedStatusCode);

        let getPostById
        if (expectedStatusCode === HttpStatus.OK) {
            getPostById = response.body
        }
        return { response: response, getPostById: getPostById }
    }
    async createPostForProfile(
        data: CreatePostForProfileInputDto,
        accessToken: string,
        refreshToken: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HttpStatus.CREATED
    ) {
        // console.log('PostsForProfileTestManager: - data 😡', data)
        const response = await request(this.app.getHttpServer())
            .post(SETTINGS.RouterPath.posts_for_profile)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .send(data)
            .expect(expectedStatusCode);

        // console.log('PostsForProfileTestManager: createPostController - response.body 😡 ', response.body)

        if (expectedStatusCode === HttpStatus.CREATED) {
            expect(response.body).toEqual(
                expect.objectContaining(data)
            )
        }
        return { response: response, createdPost: response.body }
    }
    async updatePostForProfile(
        postId: string,
        accessToken: string,
        refreshToken: string | undefined = undefined,
        data: any,
        expectedStatusCode: HttpStatusType = HttpStatus.OK
    ) {
        // console.log('TEST: - accessToken 😡', accessToken)
        // console.log('TEST: - refreshToken 😡', refreshToken)
        const response = await request(this.app.getHttpServer())
            .put(`${SETTINGS.RouterPath.posts_for_profile}/${postId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .send(data)
            .expect(expectedStatusCode);
        let updateEntity
        if (expectedStatusCode === HttpStatus.OK) {
            updateEntity = response.body
        }
        if (expectedStatusCode === HttpStatus.BAD_REQUEST) {
            updateEntity = []
        }
        return { response: response, updatedEntity: updateEntity }
    }
    async deletePostForProfile(
        postId: string,
        accessToken: string,
        refreshToken: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HttpStatus.OK
    ) {
        // console.log('TEST: - accessToken 😡', accessToken)
        // console.log('TEST: - refreshToken 😡', refreshToken)
        const response = await request(this.app.getHttpServer())
            .delete(`${SETTINGS.RouterPath.posts_for_profile}/${postId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(expectedStatusCode);
        let getEntity
        if (expectedStatusCode === HttpStatus.OK) {
            getEntity = response.body
        }
        return { response: response, getEntity: getEntity }
    }
}