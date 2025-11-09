import { isCreatedBlog1 } from "src/modules/bloggers-platform/blogs/blogs-testing/testFunctionsBlogs"
import { UpdateCommentInputDto } from "src/modules/bloggers-platform/comments/comments-api/comments-input-dto/comments-update.input-dto"
import { CreateCommentInputDto } from "src/modules/bloggers-platform/comments/comments-api/comments-input-dto/comments.input-dto"
import { isCreatedPost1 } from "src/modules/bloggers-platform/posts/testing-posts/testFunctionsPosts"
import { HTTP_STATUSES } from "src/shared/utils/utils"
import { contextTests } from "test/contextTests"
import { commetsTestManager } from "test/managersTests/commentsTestManager"

export const commentsE2eTest = () => {
    describe('E2E-COMMENTS', () => {
        beforeAll(async () => {
            // const isUser = await isCreatedUser1(
            //     contextTests.correctUserName1,
            //     contextTests.correctUserEmail1,
            //     contextTests.correctUserPassword1,
            //     HTTP_STATUSES.NO_CONTENT_204
            // )
            // const isLogin = await isLoginUser1(
            //     contextTests.accessTokenUser1Device1,
            //     contextTests.refreshTokenUser1Device1,
            //     contextTests.correctUserEmail1,
            //     contextTests.correctUserPassword1,
            //     contextTests.userAgent[0],
            //     HTTP_STATUSES.OK_200
            // )
            const isBlog = await isCreatedBlog1(
                contextTests.correctBlogNsme1,
                contextTests.correctBlogDescription1,
                contextTests.correctWebsiteUrl1,
                HTTP_STATUSES.CREATED_201
            )
            const isPost = await isCreatedPost1(
                contextTests.correctTitleBlog1Post1,
                contextTests.shortDescriptionBlog1Post1,
                contextTests.contentBlog1Post1,
                contextTests.createdBlog1.id,
                HTTP_STATUSES.CREATED_201
            )
        })
        it('GET    - Ожидается статус код 200, - Ожидается пустой массив комментариев!', async () => {
            const { getAllComments } = await commetsTestManager.getAllComments(
                contextTests.accessTokenUser1Device1,
                contextTests.createdBlog1Post1.id,
                HTTP_STATUSES.OK_200
            )
            expect(getAllComments).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
            )
        })
        it('GET    - Ожидается статус код 404, - Запрос не существующего комментария!', async () => {
            await commetsTestManager.getCommentById(
                contextTests.invalidId,
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it.skip(`POST   - Ожидается статус код 401, - Создание комментария не авторизованным пользователем! Дополнительные запросы: -> GET`, async () => {
            const dataComment: CreateCommentInputDto = {
                content: contextTests.contentBlog1Post1Comment1,
                postId: contextTests.createdBlog1Post1.id
            }
            const { createdComment } = await commetsTestManager.createComment(
                contextTests.createdBlog1Post1.id,
                dataComment,
                contextTests.invalidToken,
                HTTP_STATUSES.UNAUTHORIZED_401
            );
            contextTests.createdBlog1Post1Comment1 = createdComment;
            const { getAllComments } = await commetsTestManager.getAllComments(
                contextTests.accessTokenUser1Device1,
                contextTests.createdBlog1Post1.id,
                HTTP_STATUSES.OK_200
            )
            expect(getAllComments).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                }))
        })
        it(`POST   - Ожидается статус код 400, - Создание комментария не валидными данными! Дополнительные запросы: -> GET`, async () => {
            await commetsTestManager.createComment(
                contextTests.createdBlog1Post1.id,
                {
                    content: '',
                    postId: ''
                },
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const { getAllComments } = await commetsTestManager.getAllComments(
                contextTests.accessTokenUser1Device1,
                contextTests.createdBlog1Post1.id,
                HTTP_STATUSES.OK_200
            )
            expect(getAllComments).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
            )
        })
        it(`POST   - Ожидается статус код 201, - Создание комментария с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            const data: CreateCommentInputDto = {
                content: contextTests.contentBlog1Post1Comment1,
                postId: contextTests.createdBlog1Post1.id
            };
            const { createdComment } = await commetsTestManager.createComment(
                contextTests.createdBlog1Post1.id,
                data,
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.CREATED_201
            )
            contextTests.createdBlog1Post1Comment1 = createdComment
            // console.log('TEST:  - contextTests.createdBlog1Post1Comment1 😡 ', contextTests.createdBlog1Post1Comment1)

            const { getAllComments } = await commetsTestManager.getAllComments(
                contextTests.accessTokenUser1Device1,
                contextTests.createdBlog1Post1.id,
                HTTP_STATUSES.OK_200
            )
            expect(getAllComments).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [contextTests.createdBlog1Post1Comment1]
                })
            )
        })
        it(`POST   - Ожидается статус код 201, - Создание ещё одного комментария с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            const data: CreateCommentInputDto = {
                content: contextTests.contentBlog1Post1Comment2,
                postId: contextTests.createdBlog1Post1.id
            }
            const { createdComment } = await commetsTestManager.createComment(
                contextTests.createdBlog1Post1.id,
                data,
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.CREATED_201
            )
            contextTests.createdBlog1Post1Comment2 = createdComment
            const { getAllComments } = await commetsTestManager.getAllComments(
                contextTests.accessTokenUser1Device1,
                contextTests.createdBlog1Post1.id,
                HTTP_STATUSES.OK_200
            )
            expect(getAllComments).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 2,
                    items: [contextTests.createdBlog1Post1Comment2, contextTests.createdBlog1Post1Comment1]
                })
            )
        })
        it(`PUT    - Ожидается статус код 400, - Обновление комметнатрия не валидными данными! Дополнительные запросы: -> GET`, async () => {
            const data: UpdateCommentInputDto = {
                id: contextTests.createdBlog1Post1Comment1.id,
                content: '',
                postId: ''
            }
            await commetsTestManager.updateComment(
                contextTests.createdBlog1Post1Comment1.id,
                data,
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.BAD_REQUEST_400
            );
            const { getCommentById } = await commetsTestManager.getCommentById(
                contextTests.createdBlog1Post1Comment1.id,
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.OK_200
            );
            expect(getCommentById).toEqual(
                expect.objectContaining(contextTests.createdBlog1Post1Comment1)
            )
        })
        it(`PUT    - Ожидается статус код 404, - Обновление не существующего комментария!`, async () => {
            const data: UpdateCommentInputDto = {
                id: contextTests.createdBlog1Post1Comment1.id,
                content: contextTests.contentBlog1Post1Comment1,
                postId: contextTests.createdBlog1Post1.id
            }
            await commetsTestManager.updateComment(
                contextTests.invalidId,
                data,
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.NOT_FOUND_404
            );
        })
        it(`PUT    - Ожидается статус код 204, - Обновление комментария с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            const updatedComment: UpdateCommentInputDto = {
                id: contextTests.invalidId,
                content: contextTests.contentBlog1Post1Comment1,
                postId: contextTests.createdBlog1Post1.id
            }
            await commetsTestManager.updateComment(
                contextTests.createdBlog1Post1Comment1.id,
                updatedComment,
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.NO_CONTENT_204
            );
            const { getCommentById } = await commetsTestManager.getCommentById(
                contextTests.createdBlog1Post1Comment1.id,
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.OK_200
            )
            expect(getCommentById).toEqual(
                expect.objectContaining({
                    ...contextTests.createdBlog1Post1Comment1,
                    content: updatedComment.content
                })
            )
            const { response } = await commetsTestManager.getCommentById(
                contextTests.createdBlog1Post1Comment2.id,
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.OK_200
            )
            expect(response.body).toEqual(
                expect.objectContaining(contextTests.createdBlog1Post1Comment2)
            )
        })
        it(`DELETE - Ожидается статус код 204, - Успешное удаление обоих комметариев! Дополнительные запросы: -> GET`, async () => {
            await commetsTestManager.deleteComment(
                contextTests.createdBlog1Post1Comment1.id,
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getCommentById: res1 } = await commetsTestManager.getCommentById(
                contextTests.createdBlog1Post1Comment1.id,
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.NOT_FOUND_404
            )
            await commetsTestManager.deleteComment(
                contextTests.createdBlog1Post1Comment2.id,
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getCommentById: res2 } = await commetsTestManager.getCommentById(
                contextTests.createdBlog1Post1Comment2.id,
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.NOT_FOUND_404
            )
            const { getAllComments } = await commetsTestManager.getAllComments(
                contextTests.accessTokenUser1Device1,
                contextTests.createdBlog1Post1.id,
                HTTP_STATUSES.OK_200
            )
            expect(getAllComments).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
            )
            if (res1 && res2) {
                contextTests.createdBlog1Post1Comment1 = null
            }
        })
    })
}

