import { isCreatedUser1 } from "src/modules/user.accounts/testing-users/testFunctionsUser"
import { HTTP_STATUSES } from "src/shared/utils/utils"
import { contextTests } from "test/contextTests"
import { blogsTestManager } from "test/managersTests/blogsTestManager"

export const blogsE2eTest = () => {
    describe('E2E-BLOGS', () => {
        beforeAll(async () => {
            // const isUser = await isCreatedUser1(
            //     contextTests.correctUserName1,
            //     contextTests.correctUserEmail1,
            //     contextTests.correctUserPassword1,
            //     HTTP_STATUSES.NO_CONTENT_204
            // )
            // console.log('TEST: - blogsE2eTest: isUser 😡', isUser)
            // const isLogin = await isLoginUser1(
            //     contextTests.accessTokenUser1Device1,
            //     contextTests.refreshTokenUser1Device1,
            //     contextTests.correctUserEmail1,
            //     contextTests.correctUserPassword1,
            //     contextTests.userAgent[0],
            //     HTTP_STATUSES.OK_200
            // )
            // console.log('TEST: - blogsE2eTest: isLogin.status 😡', isLogin.authData)
        })
        it('GET    - Ожидается статус код 200, - Получаем пустой массив блогов!', async () => {
            const { getBlogs } = await blogsTestManager.getAllBlogs(HTTP_STATUSES.OK_200)
            // console.log('TEST: - : getBlogs 😡', getBlogs)
            expect(getBlogs).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
            )
        })
        it(`POST   - Ожидается статус код 400, - Создание блога с не валидными данными! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                name: '',
                description: '',
                websiteUrl: ''
            }
            await blogsTestManager.createBlogs(
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const { getBlogs } = await blogsTestManager.getAllBlogs(
                HTTP_STATUSES.OK_200
            )
            expect(getBlogs).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
            )
        })
        it('GET    - Ожидается статус код 404, - Запрос не существующего блога!', async () => {
            await blogsTestManager.getBlogsById(contextTests.invalidId, HTTP_STATUSES.NOT_FOUND_404)
        })
        it.skip(`POST   - Ожидается статус код 401, - Создание блога без авторизации! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                name: contextTests.correctBlogNsme1,
                description: contextTests.correctBlogDescription1,
                websiteUrl: contextTests.correctWebsiteUrl1
            }
            await blogsTestManager.createBlogs(
                data,
                contextTests.expiredToken,
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            const { getBlogs } = await blogsTestManager.getAllBlogs(
                HTTP_STATUSES.OK_200
            )
            expect(getBlogs).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
            )
        })
        it(`POST   - Ожидается статус код 201, - Создание блога с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                name: contextTests.correctBlogNsme1,
                description: contextTests.correctBlogDescription1,
                websiteUrl: contextTests.correctWebsiteUrl1
            }
            const { createdEntity } = await blogsTestManager.createBlogs(
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.CREATED_201
            )
            contextTests.createdBlog1 = createdEntity;
            // console.log('TEST: contextTests.createdBlog1 😡 ', contextTests.createdBlog1)
            const { getBlogs } = await blogsTestManager.getAllBlogs(
                HTTP_STATUSES.OK_200
            )
            expect(getBlogs).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [contextTests.createdBlog1]
                })
            )
        })
        it(`POST   - Ожидается статус код 201, - Создание еще одного блога с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                name: contextTests.correctBlogNsme2,
                description: contextTests.correctBlogDescription2,
                websiteUrl: contextTests.correctWebsiteUrl2
            }
            const { createdEntity } = await blogsTestManager.createBlogs(
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.CREATED_201
            )
            contextTests.createdBlog2 = createdEntity;
            // console.log('TEST: contextTests.createdBlog2 😡 ', contextTests.createdBlog2)
            const { getBlogs } = await blogsTestManager.getAllBlogs(HTTP_STATUSES.OK_200)
            expect(getBlogs).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 2,
                    items: [contextTests.createdBlog2, contextTests.createdBlog1]
                })
            )
        })
        it(`PUT    - Ожидается статус код 400, - Обновление блога не валидными данными! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                name: '',
                description: '',
                websiteUrl: ''
            }
            await blogsTestManager.updateBlogs(
                data,
                contextTests.codedAuth,
                contextTests.createdBlog1.id,
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const { getBlog } = await blogsTestManager.getBlogsById(
                contextTests.createdBlog1.id,
                HTTP_STATUSES.OK_200
            )
            expect(getBlog).toEqual(expect.objectContaining(contextTests.createdBlog1))
        })
        it(`PUT    - Ожидается статус код 404, - Обновление не существующего блога! Дополнительные запросы: -> GET`, async () => {
            const data = {
                name: contextTests.correctBlogNsme3,
                description: contextTests.correctBlogDescription3,
                websiteUrl: contextTests.correctWebsiteUrl3
            }
            await blogsTestManager.updateBlogs(
                data,
                contextTests.codedAuth,
                contextTests.invalidId,
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`PUT    - Ожидается статус код 204, - Обновление блога с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                name: contextTests.correctBlogNsme4,
                description: contextTests.correctBlogDescription4,
                websiteUrl: contextTests.correctWebsiteUrl4
            }
            await blogsTestManager.updateBlogs(
                data,
                contextTests.codedAuth,
                contextTests.createdBlog1.id,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getBlog } = await blogsTestManager.getBlogsById(
                contextTests.createdBlog1.id,
                HTTP_STATUSES.OK_200
            )
            expect(getBlog).toEqual(
                expect.objectContaining({
                    name: data.name,
                    description: data.description,
                    websiteUrl: data.websiteUrl
                })
            )
            const { response } = await blogsTestManager.getBlogsById(
                contextTests.createdBlog2.id,
                HTTP_STATUSES.OK_200
            )
            expect(response.body).toEqual(
                expect.objectContaining(
                    contextTests.createdBlog2
                )
            )
        })
        it(`DELETE    - Ожидается статус код 204, - Удаление двух блогов! Дополнительные запросы: -> GET`, async () => {
            await blogsTestManager.deleteBlogs(
                contextTests.createdBlog1.id,
                contextTests.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getBlog: res1 } = await blogsTestManager.getBlogsById(
                contextTests.createdBlog1.id,
                HTTP_STATUSES.NOT_FOUND_404
            )
            await blogsTestManager.deleteBlogs(
                contextTests.createdBlog2.id,
                contextTests.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getBlog: res2 } = await blogsTestManager.getBlogsById(
                contextTests.createdBlog2.id,
                HTTP_STATUSES.NOT_FOUND_404
            )
            const { getBlogs } = await blogsTestManager.getAllBlogs(HTTP_STATUSES.OK_200)
            expect(getBlogs).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
            )
            if (res1 && res2) {
                contextTests.createdBlog1 = null
            }
        })
    })
}