import { isCreatedPost1 } from './testFunctionsPosts';
import { isCreatedBlog1 } from '../../blogs/blogs-testing/testFunctionsBlogs';
import { isCreatedUser1 } from 'src/modules/user.accounts/testing-users/testFunctionsUser';
import { contextTests } from 'test/contextTests';
import { HTTP_STATUSES } from 'src/shared/utils/utils';
import { postsTestManager } from 'test/managersTests/postsTestManager';
import { CreatePostInputDto } from '../posts-api/posts-input-dto/posts.input-dto';
import { CreateBlogInputDto } from '../../blogs/blogs-api/input-dto-blogs/blogs.input-dto';
import { blogsTestManager } from 'test/managersTests/blogsTestManager';
import { UpdatePostInputDto } from '../posts-api/posts-input-dto/posts-update.input-dto';
import { Types } from 'mongoose';

export const postsE2eTest = () => {
    describe('E2E-POSTS', () => {
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
        })
        it('GET    - Ожидается статус код 200, - Ожидается пустой массив постов!', async () => {
            const { getAllPosts } = await postsTestManager.getAllPosts(
                contextTests.accessTokenUser1Device1,
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
            await postsTestManager.getPostsById(
                contextTests.invalidId,
                null,
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it.skip(`POST   - Ожидается статус код 401, - Создание поста не авторизованным пользователем! Дополнительные запросы: -> GET`, async () => {
            const data: CreatePostInputDto = {
                title: contextTests.correctTitleBlog1Post1,
                shortDescription: contextTests.shortDescriptionBlog1Post1,
                content: contextTests.contentBlog1Post1,
                blogId: "1"
            }
            await postsTestManager.createPosts(
                data,
                contextTests.expiredToken,
                contextTests.expiredToken,
                contextTests.expiredToken,
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            const { getAllPosts } = await postsTestManager.getAllPosts(
                contextTests.accessTokenUser1Device1,
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
                blogId: contextTests.invalidId
            }
            await postsTestManager.createPosts(
                data,
                contextTests.codedAuth,
                contextTests.accessTokenUser1Device1,
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const { getAllPosts } = await postsTestManager.getAllPosts(
                contextTests.accessTokenUser1Device1,
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
            // console.log('TEST: - isPost 😡 ', isPost)

            const { getAllPosts } = await postsTestManager.getAllPosts(
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST: - getAllPosts 😡 ', getAllPosts)

            expect(getAllPosts).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [contextTests.createdBlog1Post1]
                })
            )
        })
        it(`POST   - Ожидается статус код 201, - Создание еще одного поста с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            const blogData: Omit<CreateBlogInputDto, 'deletedAt' | 'updatedAt' | 'createdAt'> = {
                name: contextTests.correctBlogNsme1,
                description: contextTests.correctBlogDescription1,
                websiteUrl: contextTests.correctWebsiteUrl1
            };
            const resData = await blogsTestManager.createBlogs(
                blogData,
                contextTests.codedAuth,
                HTTP_STATUSES.CREATED_201
            );
            contextTests.createdBlog1 = resData.createdEntity;

            const data: CreatePostInputDto = {
                title: contextTests.correctTitleBlog1Post2,
                shortDescription: contextTests.shortDescriptionBlog1Post2,
                content: contextTests.contentBlog1Post2,
                blogId: contextTests.createdBlog1.id
            };
            const { createdEntity } = await postsTestManager.createPosts(data,
                contextTests.codedAuth,
                contextTests.accessTokenUser1Device1,
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.CREATED_201
            );
            contextTests.createdBlog1Post2 = createdEntity;
            const { getAllPosts } = await postsTestManager.getAllPosts(
                contextTests.accessTokenUser1Device1,
                HTTP_STATUSES.OK_200
            )
            expect(getAllPosts).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 2,
                    items: [contextTests.createdBlog1Post2, contextTests.createdBlog1Post1]
                })
            )
        })
        it(`PUT    - Ожидается статус код 400, - Обновление поста не валидными данными! Дополнительные запросы: -> GET`, async () => {
            const data: UpdatePostInputDto = {
                id: '',
                title: '',
                shortDescription: '',
                content: '',
                blogId: contextTests.invalidId,
                // blogName: contextTests.createdBlog1Post1.blogName
            };
            await postsTestManager.updatePosts(
                contextTests.createdBlog1Post1.id,
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.BAD_REQUEST_400
            );
            const { getPostsById } = await postsTestManager.getPostsById(
                contextTests.createdBlog1Post1.id,
                null,
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.OK_200
            );
            expect(getPostsById).toEqual(
                expect.objectContaining(
                    contextTests.createdBlog1Post1
                )
            )
        })
        it(`PUT    - Ожидается статус код 404, - Обновление не существующего поста!`, async () => {
            const data: UpdatePostInputDto = {
                id: contextTests.createdBlog1Post1.id,
                title: contextTests.correctTitleBlog1Post1,
                shortDescription: contextTests.shortDescriptionBlog1Post1,
                content: contextTests.contentBlog1Post1,
                blogId: contextTests.invalidId,
                // blogName: contextTests.createdBlog1Post1.blogName
            }
            await postsTestManager.updatePosts(
                contextTests.invalidId,
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.NOT_FOUND_404
            );
        })
        it(`PUT    - Ожидается статус код 204, - Обновление поста с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            const updatedPost: UpdatePostInputDto = {
                id: contextTests.createdBlog1Post1.id,
                title: contextTests.correctTitleBlog1Post3,
                shortDescription: contextTests.shortDescriptionBlog1Post3,
                content: contextTests.contentBlog1Post3,
                blogId: contextTests.createdBlog1Post1.blogId,
                // blogName: contextTests.createdBlog1Post1.blogName
            }
            await postsTestManager.updatePosts(
                contextTests.createdBlog1Post1.id,
                updatedPost,
                contextTests.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            );

            const { getPostsById } = await postsTestManager.getPostsById(
                contextTests.createdBlog1Post1.id,
                null,
                contextTests.refreshTokenUser1Device1,
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
            const { response } = await postsTestManager.getPostsById(
                contextTests.createdBlog1Post2.id,
                null,
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.OK_200
            )
            expect(response.body).toEqual(
                expect.objectContaining(
                    contextTests.createdBlog1Post2
                )
            )
        })
        it(`DELETE - Ожидается статус код 204, - Успешное удаление обоих постов! Дополнительные запросы: -> GET`, async () => {
            await postsTestManager.deletePost(
                contextTests.createdBlog1Post1.id,
                contextTests.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getPostsById: res1 } = await postsTestManager.getPostsById(
                contextTests.createdBlog1Post1.id,
                null,
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.NOT_FOUND_404
            )
            await postsTestManager.deletePost(
                contextTests.createdBlog1Post2.id,
                contextTests.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getPostsById: res2 } = await postsTestManager.getPostsById(
                contextTests.createdBlog1Post2.id,
                null,
                contextTests.refreshTokenUser1Device1,
                HTTP_STATUSES.NOT_FOUND_404
            )
            const { getAllPosts } = await postsTestManager.getAllPosts(
                contextTests.accessTokenUser1Device1,
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
                contextTests.createdBlog1Post1 = null
                contextTests.createdBlog1Post2 = null
            }
        })
        // console.log('TEST ⚙️ - getAllPosts', JSON.stringify(getAllPosts, null, 2))
    })
}
