import { isCreatedPost } from './testFunctionsPosts';
import { isCreatedBlog } from '../../blogs/blogs-testing/testFunctionsBlogs';
import { HTTP_STATUSES } from 'src/core/utils/utils';
import { CreatePostInputDto } from '../posts-api/posts-input-dto/posts.input-dto';
import { CreateBlogInputDto } from '../../blogs/blogs-api/input-dto-blogs/blogs.input-dto';
import { UpdatePostInputDto } from '../posts-api/posts-input-dto/posts-update.input-dto';
import { contextTests } from 'test/helpers/init-settings';
import { isLoginUser } from 'src/modules/auth/auth-testing/testFunctionsAuth';
import { Types } from 'mongoose';
import { isCreatedUser } from 'src/modules/user.accounts/testing-users/testFunctionsUser';

export const postsE2eTest = () => {
    describe('E2E-POSTS', () => {
        beforeAll(async () => {
            const isUser1 = await isCreatedUser(
                0,
                contextTests.users.correctUserNames[0],
                contextTests.users.correctUserEmails[0],
                contextTests.users.correctUserPasswords[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // console.log('postsE2eTest: isUser1 😡 ', isUser1)
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
            const isBlog1 = await isCreatedBlog(
                0,
                contextTests.blogs.correctBlogNames[0],
                contextTests.blogs.correctBlogDescriptions[0],
                contextTests.blogs.correctWebsiteUrls[0],
                HTTP_STATUSES.CREATED_201
            )
            // console.log('TEST: - isBlog1 😡 ', isBlog1)
        })
        it('GET    - Ожидается статус код 200, - Ожидается пустой массив постов!', async () => {
            const { getAllPosts } = await contextTests.postsTestManager.getAllPosts(
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getAllPosts).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
            )
        })
        it('GET    - Ожидается статус код 404, - Запрос не существующего поста!', async () => {
            await contextTests.postsTestManager.getPostsById(
                contextTests.constants.invalidId,
                null,
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`POST   - Ожидается статус код 401, - Создание поста не авторизованным пользователем! Дополнительные запросы: -> GET`, async () => {
            const data: CreatePostInputDto = {
                title: contextTests.posts.correctTitleBlog1Posts[0],
                shortDescription: contextTests.posts.shortDescriptionBlog1Posts[0],
                content: contextTests.posts.contentBlog1Posts[0],
                blogId: String(new Types.ObjectId())
            }
            await contextTests.postsTestManager.createPosts(
                data,
                contextTests.constants.expiredToken,
                contextTests.constants.expiredToken,
                contextTests.constants.expiredToken,
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            const { getAllPosts } = await contextTests.postsTestManager.getAllPosts(
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getAllPosts).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
            )
        })
        it(`POST   - Ожидается статус код 400, - Создание поста не валидными данными! Дополнительные запросы: -> GET`, async () => {
            const data: CreatePostInputDto = {
                title: '',
                shortDescription: '',
                content: '',
                blogId: contextTests.constants.invalidId
            }
            await contextTests.postsTestManager.createPosts(
                data,
                contextTests.constants.codedAuth,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const { getAllPosts } = await contextTests.postsTestManager.getAllPosts(
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getAllPosts).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
            )
        })
        it(`POST   - Ожидается статус код 201, - Создание поста с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            const isBlog2 = await isCreatedBlog(
                0,
                contextTests.blogs.correctBlogNames[0],
                contextTests.blogs.correctBlogDescriptions[0],
                contextTests.blogs.correctWebsiteUrls[0],
                HTTP_STATUSES.CREATED_201
            )
            // console.log('TEST: - isBlog2 😡 ', isBlog2)
            const isPost = await isCreatedPost(
                0,
                0,
                contextTests.posts.correctTitleBlog1Posts[0],
                contextTests.posts.shortDescriptionBlog1Posts[0],
                contextTests.posts.contentBlog1Posts[0],
                contextTests.blogs.createdBlogs[0]!.id,
                HTTP_STATUSES.CREATED_201
            )
            // console.log('TEST: - isPost 😡 ', isPost)
            const { getAllPosts } = await contextTests.postsTestManager.getAllPosts(
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST: - getAllPosts 😡 ', getAllPosts)

            expect(getAllPosts).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [contextTests.posts.createdBlog1Posts[0]]
                })
            )
        })
        it(`POST   - Ожидается статус код 201, - Создание еще одного поста с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            const isBlog2 = await isCreatedBlog(
                0,
                contextTests.blogs.correctBlogNames[0],
                contextTests.blogs.correctBlogDescriptions[0],
                contextTests.blogs.correctWebsiteUrls[0],
                HTTP_STATUSES.CREATED_201
            )
            // console.log('TEST: - isBlog2 😡 ', isBlog2)
            const isPost = await isCreatedPost(
                0,
                1,
                contextTests.posts.correctTitleBlog1Posts[1],
                contextTests.posts.shortDescriptionBlog1Posts[1],
                contextTests.posts.contentBlog1Posts[1],
                contextTests.blogs.createdBlogs[0]!.id,
                HTTP_STATUSES.CREATED_201
            )
            // console.log('TEST: - isPost 😡 ', isPost)
            const { getAllPosts } = await contextTests.postsTestManager.getAllPosts(
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getAllPosts).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 2,
                    items: [contextTests.posts.createdBlog1Posts[1], contextTests.posts.createdBlog1Posts[0]]
                })
            )
        })
        it(`PUT    - Ожидается статус код 400, - Обновление поста не валидными данными! Дополнительные запросы: -> GET`, async () => {
            const data: UpdatePostInputDto = {
                id: '',
                title: '',
                shortDescription: '',
                content: '',
                blogId: contextTests.constants.invalidId,
                // blogName: contextTests.createdBlog1Post1.blogName
            };
            await contextTests.postsTestManager.updatePosts(
                0,
                0,
                contextTests.posts.createdBlog1Posts[0]!.id,
                data,
                contextTests.constants.codedAuth,
                HTTP_STATUSES.BAD_REQUEST_400
            );
            const { getPostsById } = await contextTests.postsTestManager.getPostsById(
                contextTests.posts.createdBlog1Posts[0]!.id,
                null,
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            );
            expect(getPostsById).toEqual(
                expect.objectContaining(
                    contextTests.posts.createdBlog1Posts[0]
                )
            )
        })
        it(`PUT    - Ожидается статус код 404, - Обновление не существующего поста!`, async () => {
            const data: UpdatePostInputDto = {
                id: contextTests.posts.createdBlog1Posts[0]!.id,
                title: contextTests.posts.correctTitleBlog1Posts[0],
                shortDescription: contextTests.posts.shortDescriptionBlog1Posts[0],
                content: contextTests.posts.contentBlog1Posts[0],
                blogId: contextTests.constants.invalidId,
                // blogName: contextTests.createdBlog1Post1.blogName
            }
            await contextTests.postsTestManager.updatePosts(
                0,
                0,
                contextTests.constants.invalidId,
                data,
                contextTests.constants.codedAuth,
                HTTP_STATUSES.NOT_FOUND_404
            );
        })
        it(`PUT    - Ожидается статус код 204, - Обновление поста с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            const updatedPost: UpdatePostInputDto = {
                id: contextTests.posts.createdBlog1Posts[0]!.id,
                title: contextTests.posts.correctTitleBlog1Posts[2],
                shortDescription: contextTests.posts.shortDescriptionBlog1Posts[2],
                content: contextTests.posts.contentBlog1Posts[2],
                blogId: contextTests.posts.createdBlog1Posts[0]!.blogId,
                // blogName: contextTests.createdBlog1Post1.blogName
            }
            await contextTests.postsTestManager.updatePosts(
                0,
                0,
                contextTests.posts.createdBlog1Posts[0]!.id,
                updatedPost,
                contextTests.constants.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            );

            const { getPostsById } = await contextTests.postsTestManager.getPostsById(
                contextTests.posts.createdBlog1Posts[0]!.id,
                null,
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getPostsById).toEqual(
                expect.objectContaining({
                    title: updatedPost.title,
                    shortDescription: updatedPost.shortDescription,
                    content: updatedPost.content,
                    blogId: updatedPost.blogId
                })
            )
            const { response } = await contextTests.postsTestManager.getPostsById(
                contextTests.posts.createdBlog1Posts[1]!.id,
                null,
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(response.body).toEqual(
                expect.objectContaining(
                    contextTests.posts.createdBlog1Posts[1]
                )
            )
        })
        it(`DELETE - Ожидается статус код 204, - Успешное удаление обоих постов! Дополнительные запросы: -> GET`, async () => {
            await contextTests.postsTestManager.deletePost(
                contextTests.posts.createdBlog1Posts[0]!.id,
                contextTests.constants.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getPostsById: res1 } = await contextTests.postsTestManager.getPostsById(
                contextTests.posts.createdBlog1Posts[0]!.id,
                null,
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
            await contextTests.postsTestManager.deletePost(
                contextTests.posts.createdBlog1Posts[1]!.id,
                contextTests.constants.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getPostsById: res2 } = await contextTests.postsTestManager.getPostsById(
                contextTests.posts.createdBlog1Posts[1]!.id,
                null,
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
            const { getAllPosts } = await contextTests.postsTestManager.getAllPosts(
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getAllPosts).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                }))

            if (res1 && res2) {
                contextTests.posts.deleteAllPostsStateTest({numBlog: 0})
            }
        })
        // console.log('TEST ⚙️ - getAllPosts', JSON.stringify(getAllPosts, null, 2))
    })
}
