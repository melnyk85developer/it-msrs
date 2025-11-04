import { HTTP_STATUSES, HttpStatusType } from "src/shared/utils/utils";
import { SETTINGS } from "src/shared/settings";
import { getRequest } from "./authTestManager";

export const blogsTestManager = {
    async getAllBlogs(
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        const response = await getRequest()
            .get(SETTINGS.RouterPath.blogs)
            // .set('User-Agent', 'TestDevice/1.0')
            .expect(expectedStatusCode)

        let getBlogs: any
        return { response: response, getBlogs: response.body }
    },
    async getBlogsById(
        blogId: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {

        const response = await getRequest()
            .get(`${SETTINGS.RouterPath.blogs}/${blogId}`)
            // .set('User-Agent', 'TestDevice/1.0')
            .expect(expectedStatusCode)
        // console.log('TEST: - getBlogsById: - response.body', response.body)
        const getBlog: any = null
        return { response: response, getBlog: response.body }
    },
    async createBlogs(
        data: { name: string | null, description: string | null, websiteUrl: string | null },
        codedAuth: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        // console.log('blogsTestManager: createBlogs data 😡', data)
        const response = await getRequest()
            .post(SETTINGS.RouterPath.blogs)
            // .set('Authorization', `Bearer ${accessToken}`)
            // .set('User-Agent', 'TestDevice/1.0')
            .set('Authorization', `Basic ${codedAuth}`)
            .send(data)
            .expect(expectedStatusCode)
        // console.log('blogsTestManager: createBlogs response.body 😡', response.body)
        let createdEntity
        if (expectedStatusCode === HTTP_STATUSES.UNAUTHORIZED_401) {
            expect(expectedStatusCode)
        }
        if (expectedStatusCode === HTTP_STATUSES.CREATED_201) {
            createdEntity = response.body;
            expect(createdEntity)
                .toEqual(
                    {
                        id: expect.any(String),
                        name: data.name,
                        description: data.description,
                        websiteUrl: data.websiteUrl,
                        createdAt: expect.any(String),
                        isMembership: expect.any(Boolean),
                    }
                )
        }
        return { bodyBlog: response.body, createdEntity: createdEntity, response }
    },
    async updateBlogs(
        data: any,
        codedAuth: string | undefined = undefined,
        blogId: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {
        // console.log('blogsTestManager: updateBlogs data 😡', data)
        await getRequest()
            .put(`${SETTINGS.RouterPath.blogs}/${blogId}`)
            // .set('User-Agent', 'TestDevice/1.0')
            // .set('Authorization', `Bearer ${accessToken}`)
            .set('Authorization', `Basic ${codedAuth}`)
            .send(data)
            .expect(expectedStatusCode)
    },
    async deleteBlogs(
        blogId: string,
        codedAuth: string | undefined = undefined,
        // accessToken: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        // console.log('deleteBlogs: - accessToken', blogId, accessToken)

        await getRequest()
            .delete(`${SETTINGS.RouterPath.blogs}/${blogId}`)
            // .set('User-Agent', 'TestDevice/1.0')
            // .set('Authorization', `Bearer ${accessToken}`)
            .set('Authorization', `Basic ${codedAuth}`)
            .expect(expectedStatusCode)
    }
}
// cookies: string[] = [],  // Куки передаются сюда вместо авторизации,
// .set('Cookie', cookies)  // Устанавливаем куки для запроса