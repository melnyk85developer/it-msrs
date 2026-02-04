import { HTTP_STATUSES } from "src/core/utils/utils"
import { isLoginUser } from "src/modules/auth/auth-testing/testFunctionsAuth"
import { contextTests } from "test/helpers/init-settings"
import { isCreatedBlog } from "./testFunctionsBlogs"
import { isCreatedUser } from "src/modules/user-accounts/testing-users/testFunctionsUser"

export const blogsE2eTest = () => {
    describe('E2E-BLOGS', () => {
        beforeAll(async () => {
            const isUser1 = await isCreatedUser(
                0,
                contextTests.users.correctUserNames[0],
                contextTests.users.correctUserEmails[0],
                contextTests.users.correctUserPasswords[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // console.log('TEST: - blogsE2eTest: isUser1 😡', isUser1)
            const isLogin1 = await isLoginUser(
                0,
                0,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                contextTests.users.correctUserEmails[0],
                contextTests.users.correctUserPasswords[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST: - blogsE2eTest: isLogin.status 😡', isLogin.authData)
        })
        it('GET    - Ожидается статус код 200, - Получаем пустой массив блогов!', async () => {
            const { getBlogs } = await contextTests.blogsTestManager.getAllBlogs(HTTP_STATUSES.OK_200)
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
            await contextTests.blogsTestManager.createBlogs(
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.constants.codedAuth,
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const { getBlogs } = await contextTests.blogsTestManager.getAllBlogs(
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
            await contextTests.blogsTestManager.getBlogsById(contextTests.constants.invalidId, HTTP_STATUSES.NOT_FOUND_404)
        })
        it(`POST   - Ожидается статус код 401, - Создание блога без авторизации! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                name: contextTests.blogs.correctBlogNames[0],
                description: contextTests.blogs.correctBlogDescriptions[0],
                websiteUrl: contextTests.blogs.correctWebsiteUrls[0]
            }
            await contextTests.blogsTestManager.createBlogs(
                data,
                '',
                contextTests.constants.expiredToken,
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            const { getBlogs } = await contextTests.blogsTestManager.getAllBlogs(
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
            const isBlog1 = await isCreatedBlog(
                0,
                contextTests.blogs.correctBlogNames[0],
                contextTests.blogs.correctBlogDescriptions[0],
                contextTests.blogs.correctWebsiteUrls[0],
                HTTP_STATUSES.CREATED_201
            )
            // console.log('TEST: contextTests.createdBlogs 😡 ', contextTests.blogs.createdBlogs)
            // console.log('TEST: isBlog1 😡 ', isBlog1)
            const { getBlogs } = await contextTests.blogsTestManager.getAllBlogs(
                HTTP_STATUSES.OK_200
            )
            expect(getBlogs).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [contextTests.blogs.createdBlogs[0]]
                })
            )
        })
        it(`POST   - Ожидается статус код 201, - Создание еще одного блога с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            const isBlog1 = await isCreatedBlog(
                1,
                contextTests.blogs.correctBlogNames[1],
                contextTests.blogs.correctBlogDescriptions[1],
                contextTests.blogs.correctWebsiteUrls[1],
                HTTP_STATUSES.CREATED_201
            )
            // console.log('TEST: isBlog1 😡 ', isBlog1)
            // console.log('TEST: contextTests.createdBlog2 😡 ', contextTests.blogs.createdBlogs)
            const { getBlogs } = await contextTests.blogsTestManager.getAllBlogs(HTTP_STATUSES.OK_200)
            expect(getBlogs).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 2,
                    items: [contextTests.blogs.createdBlogs[1], contextTests.blogs.createdBlogs[0]]
                })
            )
        })
        it(`PUT    - Ожидается статус код 400, - Обновление блога не валидными данными! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                name: '',
                description: '',
                websiteUrl: ''
            }
            await contextTests.blogsTestManager.updateBlogs(
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.constants.codedAuth,
                contextTests.blogs.createdBlogs[0]!.id,
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const { getBlog } = await contextTests.blogsTestManager.getBlogsById(
                contextTests.blogs.createdBlogs[0]!.id,
                HTTP_STATUSES.OK_200
            )
            expect(getBlog).toEqual(expect.objectContaining(contextTests.blogs.createdBlogs[0]))
        })
        it(`PUT    - Ожидается статус код 404, - Обновление не существующего блога! Дополнительные запросы: -> GET`, async () => {
            const data = {
                name: contextTests.blogs.correctBlogNames[2],
                description: contextTests.blogs.correctBlogDescriptions[2],
                websiteUrl: contextTests.blogs.correctWebsiteUrls[2]
            }
            await contextTests.blogsTestManager.updateBlogs(
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.constants.codedAuth,
                contextTests.constants.invalidId,
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`PUT    - Ожидается статус код 204, - Обновление блога с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                name: contextTests.blogs.correctBlogNames[3],
                description: contextTests.blogs.correctBlogDescriptions[3],
                websiteUrl: contextTests.blogs.correctWebsiteUrls[3]
            }
            await contextTests.blogsTestManager.updateBlogs(
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.constants.codedAuth,
                contextTests.blogs.createdBlogs[0]!.id,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getBlog } = await contextTests.blogsTestManager.getBlogsById(
                contextTests.blogs.createdBlogs[0]!.id,
                HTTP_STATUSES.OK_200
            )
            expect(getBlog).toEqual(
                expect.objectContaining({
                    name: data.name,
                    description: data.description,
                    websiteUrl: data.websiteUrl
                })
            )
            const { response } = await contextTests.blogsTestManager.getBlogsById(
                contextTests.blogs.createdBlogs[1]!.id,
                HTTP_STATUSES.OK_200
            )
            expect(response.body).toEqual(
                expect.objectContaining(
                    contextTests.blogs.createdBlogs[1]
                )
            )
        })
        it(`DELETE - Ожидается статус код 204, - Удаление двух блогов! Дополнительные запросы: -> GET`, async () => {
            await contextTests.blogsTestManager.deleteBlogs(
                contextTests.blogs.createdBlogs[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.constants.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getBlog: res1 } = await contextTests.blogsTestManager.getBlogsById(
                contextTests.blogs.createdBlogs[0]!.id,
                HTTP_STATUSES.NOT_FOUND_404
            )
            await contextTests.blogsTestManager.deleteBlogs(
                contextTests.blogs.createdBlogs[1]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.constants.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getBlog: res2 } = await contextTests.blogsTestManager.getBlogsById(
                contextTests.blogs.createdBlogs[1]!.id,
                HTTP_STATUSES.NOT_FOUND_404
            )
            const { getBlogs } = await contextTests.blogsTestManager.getAllBlogs(HTTP_STATUSES.OK_200)
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
                // Удаляем в тест-сторе все Blogs после удачного посещения deleteBlogs!
                contextTests.blogs.deleteAllBlogsStateTest()
            }
        })
    })
}