import { HTTP_STATUSES } from "src/core/utils/utils"
import { isCreatedBlog } from "../../bloggers-platform/blogs/blogs-testing/testFunctionsBlogs"
import { isCreatedPostForBlog } from "../../bloggers-platform/posts/testing-posts/testFunctionsPostsForBlogs"
import { CreateCommentInputDto } from "../comments-api/comments-input-dto/comments.input-dto"
import { UpdateCommentInputDto } from "../comments-api/comments-input-dto/comments-update.input-dto"
import { contextTests } from "test/helpers/init-settings"
import { isLoginUser } from "src/modules/auth/auth-testing/testFunctionsAuth"
import { isCreatedUser } from "src/modules/user-accounts/testing-users/testFunctionsUser"

export const commentsE2eTest = () => {
    describe('E2E-COMMENTS', () => {
        beforeAll(async () => {
            const isUser1 = await isCreatedUser(
                0,
                contextTests.users.correctUserNames[0],
                contextTests.users.correctUserEmails[0],
                contextTests.users.correctUserPasswords[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
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
            const isBlog = await isCreatedBlog(
                0,
                contextTests.blogs.correctBlogNames[0],
                contextTests.blogs.correctBlogDescriptions[0],
                contextTests.blogs.correctWebsiteUrls[0],
                HTTP_STATUSES.CREATED_201
            )
            const isPost = await isCreatedPostForBlog(
                0,
                0,
                contextTests.posts_for_blog.correctTitleBlog1Posts[0],
                contextTests.posts_for_blog.shortDescriptionBlog1Posts[0],
                contextTests.posts_for_blog.contentBlog1Posts[0],
                contextTests.blogs.createdBlogs[0]!.id,
                HTTP_STATUSES.CREATED_201
            )
            // console.log('TEST:  - isPost 😡 ', isPost)
        })
        it('GET    - Ожидается статус код 200, - Ожидается пустой массив комментариев!', async () => {
            const { getAllComments } = await contextTests.commentsTestManager.getAllComments(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
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
            await contextTests.commentsTestManager.getCommentById(
                contextTests.constants.invalidId,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`POST   - Ожидается статус код 401, - Создание комментария не авторизованным пользователем! Дополнительные запросы: -> GET`, async () => {
            const dataComment: CreateCommentInputDto = {
                content: contextTests.comments.contentForComments[0]
            }
            const { createdComment } = await contextTests.commentsTestManager.createComment(
                0,
                0,
                0,
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                dataComment,
                contextTests.constants.invalidToken,
                HTTP_STATUSES.UNAUTHORIZED_401
            );
            const { getAllComments } = await contextTests.commentsTestManager.getAllComments(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
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
        it(`POST   - Ожидается статус код 400, - Создание комментария не валидными данными! Дополнительные запросы: -> GET`, async () => {
            await contextTests.commentsTestManager.createComment(
                0,
                0,
                0,
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                {
                    content: ''
                },
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const { getAllComments } = await contextTests.commentsTestManager.getAllComments(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
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
                content: contextTests.comments.contentForComments[0]
            };
            const { createdComment, response } = await contextTests.commentsTestManager.createComment(
                0,
                0,
                0,
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.CREATED_201
            )
            const { getAllComments } = await contextTests.commentsTestManager.getAllComments(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                HTTP_STATUSES.OK_200
            )
            expect(getAllComments).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [contextTests.comments.createdBlog1Post1Comments[0]]
                })
            )
        })
        it(`POST   - Ожидается статус код 201, - Создание ещё одного комментария с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            const data: CreateCommentInputDto = {
                content: contextTests.comments.contentForComments[1]
            }
            const { createdComment } = await contextTests.commentsTestManager.createComment(
                0,
                0,
                1,
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.CREATED_201
            )
            const { getAllComments } = await contextTests.commentsTestManager.getAllComments(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                HTTP_STATUSES.OK_200
            )
            expect(getAllComments).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 2,
                    items: [contextTests.comments.createdBlog1Post1Comments[1], contextTests.comments.createdBlog1Post1Comments[0]]
                })
            )
        })
        it(`PUT    - Ожидается статус код 400, - Обновление комметнатрия не валидными данными! Дополнительные запросы: -> GET`, async () => {
            const data: UpdateCommentInputDto = {
                // id: contextTests.comments.createdBlog1Post1Comments[0].id,
                content: '',
                // postId: ''
            }
            await contextTests.commentsTestManager.updateComment(
                contextTests.comments.createdBlog1Post1Comments[0].id,
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.BAD_REQUEST_400
            );
            const { getCommentById } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[0].id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            );
            expect(getCommentById).toEqual(
                expect.objectContaining(contextTests.comments.createdBlog1Post1Comments[0])
            )
        })
        it(`PUT    - Ожидается статус код 404, - Обновление не существующего комментария!`, async () => {
            const data: UpdateCommentInputDto = {
                // id: contextTests.constants.invalidId,
                content: contextTests.comments.contentForComments[0],
                // postId: contextTests.posts_for_blog.createdBlog1Posts[0]!.id
            }
            await contextTests.commentsTestManager.updateComment(
                contextTests.constants.invalidId,
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NOT_FOUND_404
            );
        })
        it(`PUT    - Ожидается статус код 204, - Обновление комментария с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            const updatedComment: UpdateCommentInputDto = {
                // id: contextTests.comments.createdBlog1Post1Comments[0].id,
                content: contextTests.comments.contentForComments[0],
                // postId: contextTests.posts_for_blog.createdBlog1Posts[0]!.id
            }
            const { response: res1 } = await contextTests.commentsTestManager.updateComment(
                contextTests.comments.createdBlog1Post1Comments[0].id,
                updatedComment,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            );
            const { getCommentById, response: res2 } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[0].id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            if (res1.status === HTTP_STATUSES.OK_200 && res2.status === HTTP_STATUSES.NO_CONTENT_204) {
                // Обновляем в сторе комментарий после 
                await contextTests.comments.addCommentsStateTest({
                    numBlog: 0,
                    numPost: 0,
                    numComment: 0,
                    addComment: getCommentById
                })
            }
            expect(getCommentById).toEqual(
                expect.objectContaining({
                    ...contextTests.comments.createdBlog1Post1Comments[0],
                    content: updatedComment.content
                })
            )
            const { response } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[1].id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(response.body).toEqual(
                expect.objectContaining(contextTests.comments.createdBlog1Post1Comments[1])
            )
        })
        it(`DELETE - Ожидается статус код 204, - Успешное удаление обоих комметариев! Дополнительные запросы: -> GET`, async () => {
            await contextTests.commentsTestManager.deleteComment(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getCommentById: res1 } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
            await contextTests.commentsTestManager.deleteComment(
                contextTests.comments.createdBlog1Post1Comments[1]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getCommentById: res2 } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[1]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
            const { getAllComments } = await contextTests.commentsTestManager.getAllComments(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
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
                // Зачистка контекста и подготовки сущьностей !!!
                await contextTests.postsTestManager.deletePost(
                    contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                    contextTests.constants.codedAuth,
                    HTTP_STATUSES.NO_CONTENT_204
                )
                await contextTests.posts_for_blog.deletePostsForBlogStateTest(
                    {
                        numBlog: 0,
                        numPost: 0,
                    }
                )
                await contextTests.comments.deleteAllCommentsStateTest({
                    numBlog: 0,
                    numPost: 0,
                })
            }
        })
    })
}

