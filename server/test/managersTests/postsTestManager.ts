import { HTTP_STATUSES, HttpStatusType } from "src/shared/utils/utils";
import { getRequest } from "./authTestManager";
import { SETTINGS } from "src/shared/settings";
import { CreatePostInputDto } from "src/modules/bloggers-platform/posts/posts-api/posts-input-dto/posts.input-dto";

export const postsTestManager = {
    async getAllPosts(
        accessToken: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200
    ) {
        const response = await getRequest()
            .get(SETTINGS.RouterPath.posts)
            // .set('User-Agent', 'TestDevice/1.0')
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(expectedStatusCode)

        // console.log('TEST ⚙️ - postsTestManager: getAllPosts', response.body)

        return { response: response, getAllPosts: response.body }
    },
    async getPostsById(
        id: string | null,
        accessToken: string | null,
        refreshToken: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
        // console.log('postsTestManager: - postId', postId)
        // console.log('postsTestManager: - accessToken', accessToken)

        const response = await getRequest()
            .get(`${SETTINGS.RouterPath.posts}/${id}`)
            // .set('User-Agent', 'TestDevice/1.0')
            .set('Authorization', `Bearer ${accessToken}`)
            .set('Cookie', `refreshToken=${refreshToken}`)
            .expect(expectedStatusCode)

        let getPostsById;

        // console.log('postsTestManager: - getPostsById', response.body)

        return { response: response, getPostsById: response.body }
    },
    async getAllPostsByIdBlog(
        codedAuth: string | undefined = undefined,
        // accessToken: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.OK_200) {

        const response = await getRequest()
            .get(SETTINGS.RouterPath.posts)
            // .set('User-Agent', 'TestDevice/1.0')
            // .set('Authorization', `Bearer ${accessToken}`)
            .set('Authorization', `Basic ${codedAuth}`)
            .expect(expectedStatusCode)

        return { response: response, getAllPostsByIdBlog: response.body }
    },
    async createPosts(
        data: CreatePostInputDto,
        codedAuth: string | null,
        accessToken: string | null,
        refreshToken: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        // console.log('postsTestManager: - createPosts - data 😡 ', data)
        const response = await getRequest()
            .post(SETTINGS.RouterPath.posts)
            // .set('User-Agent', 'TestDevice/1.0')
            .set('Authorization', `Basic ${codedAuth}`)
            // .set('Authorization', `Bearer ${accessToken}`)
            // .set('Cookie', `refreshToken=${refreshToken}`)
            .send(data)
            .expect(expectedStatusCode)

        let createdEntity;
        // console.log('postsTestManager: - createPosts - esponse.body 😡 ', response.body)

        if (expectedStatusCode === HTTP_STATUSES.UNAUTHORIZED_401) {
            expect(expectedStatusCode)
        }

        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdEntity = response.body;
            expect(createdEntity).toEqual({
                id: expect.any(String),
                title: data.title,
                shortDescription: data.shortDescription,
                content: data.content,
                blogId: data.blogId,
                blogName: expect.any(String),
                createdAt: expect.any(String),
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: expect.any(String),
                    newestLikes: []
                },
            });
        }

        return { response: response, createdEntity: createdEntity }
    },
    async updatePosts(
        id: string,
        data: any,
        codedAuth: string | undefined = undefined,
        // accessToken: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        // console.log('postsTestManager: updatePosts: - id, data', id, data)
        const response = await getRequest()
            .put(`${SETTINGS.RouterPath.posts}/${id}`)
            // .set('User-Agent', 'TestDevice/1.0')
            // .set('Authorization', `Bearer ${accessToken}`)
            .set('Authorization', `Basic ${codedAuth}`)
            .send(data)
            .expect(expectedStatusCode)

        return { response: response, updatePosts: response.body }
    },
    async deletePost(
        postId: string,
        codedAuth: string | undefined = undefined,
        // accessToken: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {

        const response = await getRequest()
            .delete(`${SETTINGS.RouterPath.posts}/${postId}`)
            // .set('User-Agent', 'TestDevice/1.0')
            // .set('Authorization', `Bearer ${accessToken}`)
            .set('Authorization', `Basic ${codedAuth}`)
            .expect(expectedStatusCode)

        let deletedPost;

        return { response: response, deletedPost: deletedPost }
    },
    async createPostLike(
        postId: string,
        likeStatus: any,
        // codedAuth: string,
        accessToken: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {
        // console.log('postsTestManager: createLike - accessToken', accessToken)
        // console.log('postsTestManager: createLike - postId, likeStatus', postId, likeStatus)

        const response = await getRequest()
            .put(`${SETTINGS.RouterPath.posts}/${postId}/like-status`)
            // .set('Authorization', `Basic ${codedAuth}`)
            // .set('User-Agent', 'TestDevice/1.0')
            .set('Authorization', `Bearer ${accessToken}`)
            .send(likeStatus)
            .expect(expectedStatusCode)

        let createdLikeStatus;
        // console.log('postsTestManager: createLike - response.status 😡', response.status)

        if (expectedStatusCode === HTTP_STATUSES.UNAUTHORIZED_401) {
            expect(expectedStatusCode)
        }
        return { response: response, createdLikeStatus: createdLikeStatus }
    }
}
// cookies: string[] = [],  // Куки передаются сюда вместо авторизации
// .set('Cookie', cookies)  // Устанавливаем куки для запроса