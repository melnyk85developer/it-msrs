import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HTTP_STATUSES, HttpStatusType } from 'src/core/utils/utils';
import { SETTINGS } from 'src/core/settings';
import { BlogViewDto } from 'src/modules/bloggers-platform/blogs/blogs-api/view-dto-blogs/blogs.view-dto';
import { PaginatedViewDto } from 'src/core/dto/base.paginated.viev-dto';

export class BlogsTestManager {
    constructor(private app: INestApplication) { }

    async getAllBlogs(
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201
    ): Promise<{ response: any, getBlogs: PaginatedViewDto<BlogViewDto[]> }> {
        const response = await request(this.app.getHttpServer())
            .get(SETTINGS.RouterPath.blogs)
            .set('User-Agent', 'TestDevice/1.0')
            .expect(expectedStatusCode)
        // console.log('blogsTestManager: getAllBlogs response.body 😡', response.body)
        let getBlogs: any
        return { getBlogs: response.body, response: response }
    }
    async getBlogsById(
        blogId: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201
    ) {
        const response = await request(this.app.getHttpServer())
            .get(`${SETTINGS.RouterPath.blogs}/${blogId}`)
            // .set('User-Agent', 'TestDevice/1.0')
            .expect(expectedStatusCode)
        // console.log('TEST: - getBlogsById: - response.body', response.body)
        const getBlog: any = null
        return { response: response, getBlog: response.body }
    }
    async createBlogs(
        data: { name: string | null, description: string | null, websiteUrl: string | null },
        codedAuth: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201
    ) {
        // console.log('blogsTestManager: createBlogs data 😡', data)
        const response = await request(this.app.getHttpServer())
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
    }
    async updateBlogs(
        data: any,
        codedAuth: string | undefined = undefined,
        blogId: string | null,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204
    ) {
        // console.log('blogsTestManager: updateBlogs data 😡', data)
        const response = await request(this.app.getHttpServer())
            .put(`${SETTINGS.RouterPath.blogs}/${blogId}`)
            .set('User-Agent', 'TestDevice/1.0')
            // .set('Authorization', `Bearer ${accessToken}`)
            .set('Authorization', `Basic ${codedAuth}`)
            .send(data)
            .expect(expectedStatusCode)
    }
    async deleteBlogs(
        id: string,
        codedAuth: string | undefined = undefined,
        // accessToken: string | undefined = undefined,
        expectedStatusCode: HttpStatusType = HTTP_STATUSES.CREATED_201
    ) {
        // console.log('deleteBlogs: - accessToken', blogId, accessToken)
        const response = await request(this.app.getHttpServer())
            .delete(`${SETTINGS.RouterPath.blogs}/${id}`)
            .set('User-Agent', 'TestDevice/1.0')
            // .set('Authorization', `Bearer ${accessToken}`)
            .set('Authorization', `Basic ${codedAuth}`)
            .expect(expectedStatusCode)
    }
}