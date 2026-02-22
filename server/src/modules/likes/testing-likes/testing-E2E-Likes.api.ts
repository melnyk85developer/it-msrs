import { contextTests } from 'test/helpers/init-settings';
import { HTTP_STATUSES } from 'src/core/utils/utils';
import { isCreatedComment } from 'src/modules/comments/testing-comments/testFunctionsComments';
import { isCreatedUser } from 'src/modules/user-accounts/testing-users/testFunctionsUser';
import { isLoginUser } from 'src/modules/auth/auth-testing/testFunctionsAuth';
import { isCreatedBlog } from 'src/modules/bloggers-platform/blogs/blogs-testing/testFunctionsBlogs';
import { isCreatedPostForBlog } from 'src/modules/bloggers-platform/posts/testing-posts/testFunctionsPostsForBlogs';
import { isCreatedCommentLike, isCreatedPostLike } from './testFunctionsLikes';

export const likesE2eTest = () => {
    describe('E2E-LIKES', () => {
        beforeAll(async () => {
            const isUser1 = await isCreatedUser(
                0,
                contextTests.users.correctUserNames[0],
                contextTests.users.correctUserEmails[0],
                contextTests.users.correctUserPasswords[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // console.log('TEST usersE2eTest - isUser1: ', isUser1)
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
            // console.log('TEST: - blogsE2eTest: isLogin1.status 😡', isLogin1.authData)
            const isBlog1 = await isCreatedBlog(
                0,
                contextTests.blogs.correctBlogNames[0],
                contextTests.blogs.correctBlogDescriptions[0],
                contextTests.blogs.correctWebsiteUrls[0],
                HTTP_STATUSES.CREATED_201
            )
            // console.log('TEST: - isBlog1 😡 ', isBlog1)
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
            const isComment1 = await isCreatedComment(
                0,
                0,
                0,
                contextTests.comments.contentForComments[0],
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.CREATED_201
            )
        })
        it(`PUT    - Ожидается статус код 404, - Лайк не существующиму посту! Дополнительные запросы: -> GET`, async () => {
            const { getPostsById } = await contextTests.postsTestManager.getPostsById(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getPostsById).toMatchObject(
                {
                    ...contextTests.posts_for_blog.createdBlog1Posts[0],
                    extendedLikesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: 'None',
                        newestLikes: []
                    },
                }
            );
            await contextTests.likesTestManager.createPostLike(
                contextTests.constants.invalidId,
                {
                    likeStatus: 'Like'
                },
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`PUT    - Ожидается статус код 400, - Не валидные данные для обновления лайк-статуса поста! Дополнительные запросы: -> GET`, async () => {
            const { getPostsById } = await contextTests.postsTestManager.getPostsById(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getPostsById).toMatchObject(
                {
                    ...contextTests.posts_for_blog.createdBlog1Posts[0],
                    extendedLikesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: 'None',
                        newestLikes: []
                    },
                }
            );
            for (let i = 0; contextTests.constants.incorectData.length > i; i++) {
                await contextTests.likesTestManager.createPostLike(
                    contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                    {
                        likeStatus: contextTests.constants.incorectData[i]
                    },
                    contextTests.sessions.accessTokenUser1Devices[0],
                    contextTests.sessions.refreshTokenUser1Devices[0],
                    HTTP_STATUSES.BAD_REQUEST_400
                )
            }
            const { getPostsById: res2 } = await contextTests.postsTestManager.getPostsById(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(res2).toMatchObject(
                {
                    ...contextTests.posts_for_blog.createdBlog1Posts[0],
                    extendedLikesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: 'None',
                        newestLikes: []
                    },
                }
            );
        })
        it(`PUT    - Ожидается статус код 401, - Не стоит обновлять данные поста лайк-статуса без авторизации! Дополнительные запросы: -> GET`, async () => {
            const { getPostsById } = await contextTests.postsTestManager.getPostsById(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getPostsById).toMatchObject(
                {
                    ...contextTests.posts_for_blog.createdBlog1Posts[0],
                    extendedLikesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: 'None',
                        newestLikes: []
                    },
                }
            );
            await contextTests.likesTestManager.createPostLike(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                {
                    likeStatus: 'Like'
                },
                contextTests.constants.invalidToken,
                contextTests.constants.invalidToken,
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            const { getPostsById: res2 } = await contextTests.postsTestManager.getPostsById(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(res2).toMatchObject({
                ...contextTests.posts_for_blog.createdBlog1Posts[0],
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                    newestLikes: []
                },
            });
        })
        it(`PUT    - Ожидается статус код 204, - Успешное создание лайка для поста! Дополнительные запросы: -> GET`, async () => {
            const { getPostsById } = await contextTests.postsTestManager.getPostsById(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getPostsById).toMatchObject({
                ...contextTests.posts_for_blog.createdBlog1Posts[0],
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                    newestLikes: []
                },
            });
            await contextTests.likesTestManager.createPostLike(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                {
                    likeStatus: 'Like'
                },
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getPostsById: res2 } = await contextTests.postsTestManager.getPostsById(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST - getPostsById 😡', getPostsById)

            expect(res2).toMatchObject({
                ...contextTests.posts_for_blog.createdBlog1Posts[0],
                extendedLikesInfo: {
                    likesCount: 1,
                    dislikesCount: 0,
                    myStatus: 'Like',
                    newestLikes: [
                        {
                            addedAt: expect.any(String),
                            userId: contextTests.users.createdUsers[0]!.id,
                            login: contextTests.users.createdUsers[0]!.login
                        }
                    ]
                },
            });
        })

        it(`PUT    - Ожидается статус код 204, - Успешное выключение лайка поста! Дополнительные запросы: -> GET`, async () => {
            const { getPostsById } = await contextTests.postsTestManager.getPostsById(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getPostsById).toMatchObject({
                ...contextTests.posts_for_blog.createdBlog1Posts[0],
                extendedLikesInfo: {
                    likesCount: 1,
                    dislikesCount: 0,
                    myStatus: 'Like',
                    newestLikes: [
                        {
                            addedAt: expect.any(String),
                            userId: contextTests.users.createdUsers[0]!.id,
                            login: contextTests.users.createdUsers[0]!.login
                        }
                    ]
                },
            });
            await contextTests.likesTestManager.createPostLike(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                {
                    likeStatus: 'None'
                },
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getPostsById: res3 } = await contextTests.postsTestManager.getPostsById(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST - res3 😡', res3)
            expect(res3).toMatchObject({
                ...contextTests.posts_for_blog.createdBlog1Posts[0],
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                    newestLikes: []
                },
            });
        })
        it(`PUT    - Ожидается статус код 204, - Успешное создание дизлайка поста! Дополнительные запросы: -> GET`, async () => {
            const { getPostsById } = await contextTests.postsTestManager.getPostsById(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getPostsById).toMatchObject({
                ...contextTests.posts_for_blog.createdBlog1Posts[0],
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                    newestLikes: []
                },
            });
            await contextTests.likesTestManager.createPostLike(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                {
                    likeStatus: 'Dislike'
                },
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getPostsById: res2 } = await contextTests.postsTestManager.getPostsById(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(res2).toMatchObject({
                ...contextTests.posts_for_blog.createdBlog1Posts[0],
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 1,
                    myStatus: 'Dislike',
                    newestLikes: []
                },
            });
        })
        it(`PUT    - Ожидается статус код 204, - Успешное выключение дизлайка поста! Дополнительные запросы: -> GET`, async () => {
            const { getPostsById: res2 } = await contextTests.postsTestManager.getPostsById(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(res2).toMatchObject({
                ...contextTests.posts_for_blog.createdBlog1Posts[0],
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 1,
                    myStatus: 'Dislike',
                    newestLikes: []
                },
            });
            await contextTests.likesTestManager.createPostLike(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                {
                    likeStatus: 'None'
                },
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getPostsById: res3 } = await contextTests.postsTestManager.getPostsById(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(res3).toMatchObject({
                ...contextTests.posts_for_blog.createdBlog1Posts[0],
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                    newestLikes: []
                },
            });
        })
        it(`PUT    - Ожидается статус код 204, - Успешное создание и переключение лайка на дизлайк поста! Дополнительные запросы: -> GET`, async () => {
            const { getPostsById } = await contextTests.postsTestManager.getPostsById(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getPostsById).toMatchObject({
                ...contextTests.posts_for_blog.createdBlog1Posts[0],
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                    newestLikes: []
                },
            });
            await contextTests.likesTestManager.createPostLike(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                {
                    likeStatus: 'Like'
                },
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getPostsById: res2 } = await contextTests.postsTestManager.getPostsById(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(res2).toMatchObject({
                ...contextTests.posts_for_blog.createdBlog1Posts[0],
                extendedLikesInfo: {
                    likesCount: 1,
                    dislikesCount: 0,
                    myStatus: 'Like',
                    newestLikes: [
                        {
                            addedAt: expect.any(String),
                            userId: contextTests.users.createdUsers[0]!.id,
                            login: contextTests.users.createdUsers[0]!.login
                        }
                    ]
                },
            });
            await contextTests.likesTestManager.createPostLike(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                {
                    likeStatus: 'Dislike'
                },
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getPostsById: res3 } = await contextTests.postsTestManager.getPostsById(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(res3).toMatchObject({
                ...contextTests.posts_for_blog.createdBlog1Posts[0],
                extendedLikesInfo: {
                    likesCount: 0,
                    dislikesCount: 1,
                    myStatus: 'Dislike',
                    newestLikes: []
                },
            });
            // console.log('TEST 😡 - getPostsById: ', getPostsById)
        })
        it(`PUT    - Ожидается статус код 204, - Успешное создание трех лайков поста разными пользователями! Дополнительные запросы: -> GET`, async () => {
            const isUser2 = await isCreatedUser(
                1,
                contextTests.users.correctUserNames[1],
                contextTests.users.correctUserEmails[1],
                contextTests.users.correctUserPasswords[1],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // console.log('TEST usersE2eTest - isUser1: ', isUser1)
            const isLogin2 = await isLoginUser(
                1,
                0,
                contextTests.sessions.accessTokenUser2Devices[0],
                contextTests.sessions.refreshTokenUser2Devices[0],
                contextTests.users.correctUserEmails[1],
                contextTests.users.correctUserPasswords[1],
                contextTests.sessions.userAgent[2],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST: - blogsE2eTest: isLogin1.status 😡', isLogin1.authData)
            const isUser3 = await isCreatedUser(
                2,
                contextTests.users.correctUserNames[2],
                contextTests.users.correctUserEmails[2],
                contextTests.users.correctUserPasswords[2],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // console.log('TEST usersE2eTest - isUser1: ', isUser1)
            const isLogin3 = await isLoginUser(
                2,
                0,
                contextTests.sessions.accessTokenUser3Devices[0],
                contextTests.sessions.refreshTokenUser3Devices[0],
                contextTests.users.correctUserEmails[2],
                contextTests.users.correctUserPasswords[2],
                contextTests.sessions.userAgent[3],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST: - blogsE2eTest: isLogin1.status 😡', isLogin1.authData)
            const isUser4 = await isCreatedUser(
                3,
                contextTests.users.correctUserNames[3],
                contextTests.users.correctUserEmails[3],
                contextTests.users.correctUserPasswords[3],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // console.log('TEST usersE2eTest - isUser1: ', isUser1)
            const isLogin4 = await isLoginUser(
                3,
                0,
                contextTests.sessions.accessTokenUser4Devices[0],
                contextTests.sessions.refreshTokenUser4Devices[0],
                contextTests.users.correctUserEmails[3],
                contextTests.users.correctUserPasswords[3],
                contextTests.sessions.userAgent[4],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST: - blogsE2eTest: isLogin1.status 😡', isLogin1.authData)
            const { getAllPostsByIdBlog } = await contextTests.postsTestManager.getAllPostsByIdBlog(
                contextTests.blogs.createdBlogs[0]!.id,
                contextTests.constants.codedAuth,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST: - getAllPostsByIdBlog.items 😡 ', getAllPostsByIdBlog.items)
            // console.log('TEST: - items 😡 ', contextTests.posts_for_blog.total_number_of_posts_for_blog_1_in_tests)

            expect(getAllPostsByIdBlog.items.length).toBe(contextTests.posts_for_blog.total_number_of_posts_for_blog_1_in_tests)
            // 1️⃣ Проверяем мета
            expect(getAllPostsByIdBlog).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: contextTests.posts_for_blog.total_number_of_posts_for_blog_1_in_tests,
                })
            )
            // 2️⃣ Находим нужный пост
            const target = getAllPostsByIdBlog.items.find(
                p => p.id === contextTests.posts_for_blog.createdBlog1Posts[0]!.id
            )
            // 3️⃣ Проверяем его содержимое
            expect(target).toEqual(
                expect.objectContaining({
                    ...contextTests.posts_for_blog.createdBlog1Posts[0],
                    extendedLikesInfo: {
                        likesCount: 0,
                        dislikesCount: 1,
                        myStatus: 'Dislike',
                        newestLikes: []
                    }
                })
            )
            await isCreatedPostLike(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                'Like',
                contextTests.sessions.accessTokenUser4Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            await isCreatedPostLike(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                'Like',
                contextTests.sessions.accessTokenUser2Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            await isCreatedPostLike(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                'Dislike',
                contextTests.sessions.accessTokenUser3Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            await isCreatedPostLike(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                'Like',
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getAllPostsByIdBlog: res2 } = await contextTests.postsTestManager.getAllPostsByIdBlog(
                contextTests.blogs.createdBlogs[0]!.id,
                contextTests.constants.codedAuth,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(res2.items[0].extendedLikesInfo.newestLikes.length).toBe(3)
            // 1️⃣ мета
            expect(res2).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: contextTests.posts_for_blog.total_number_of_posts_for_blog_1_in_tests,
                })
            )
            // 2️⃣ нужный пост
            const target2 = res2.items.find(
                p => p.id === contextTests.posts_for_blog.createdBlog1Posts[0]!.id
            )
            expect(target2).toBeDefined()
            // 3️⃣ newestLikes длина
            expect(target2!.extendedLikesInfo.newestLikes.length).toBe(3)
            // 4️⃣ содержимое поста
            expect(target2).toEqual(
                expect.objectContaining({
                    ...contextTests.posts_for_blog.createdBlog1Posts[0],
                    extendedLikesInfo: {
                        likesCount: 3,
                        dislikesCount: 1,
                        myStatus: 'Like',
                        newestLikes: expect.arrayContaining([
                            expect.objectContaining({
                                addedAt: expect.any(String),
                                userId: contextTests.users.createdUsers[0]!.id,
                                login: contextTests.users.createdUsers[0]!.login,
                            }),
                            expect.objectContaining({
                                addedAt: expect.any(String),
                                userId: contextTests.users.createdUsers[1]!.id,
                                login: contextTests.users.createdUsers[1]!.login,
                            }),
                            expect.objectContaining({
                                addedAt: expect.any(String),
                                userId: contextTests.users.createdUsers[3]!.id,
                                login: contextTests.users.createdUsers[3]!.login,
                            }),
                        ]),
                    },
                })
            )
            await isCreatedPostLike(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                'Dislike',
                contextTests.sessions.accessTokenUser2Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            await isCreatedPostLike(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                'Like',
                contextTests.sessions.accessTokenUser3Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getAllPostsByIdBlog: res4 } = await contextTests.postsTestManager.getAllPostsByIdBlog(
                contextTests.blogs.createdBlogs[0]!.id,
                contextTests.constants.codedAuth,
                contextTests.sessions.accessTokenUser2Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(res4.items.length)
                .toBe(contextTests.posts_for_blog.total_number_of_posts_for_blog_1_in_tests)

            expect(res4).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: contextTests.posts_for_blog.total_number_of_posts_for_blog_1_in_tests,
                })
            )

            const target3 = res4.items.find(
                p => p.id === contextTests.posts_for_blog.createdBlog1Posts[0]!.id
            )

            expect(target3).toEqual(
                expect.objectContaining({
                    ...contextTests.posts_for_blog.createdBlog1Posts[0],
                    extendedLikesInfo: {
                        likesCount: 3,
                        dislikesCount: 1,
                        myStatus: 'None',
                        newestLikes: [
                            {
                                addedAt: expect.any(String),
                                userId: contextTests.users.createdUsers[2]!.id,
                                login: contextTests.users.createdUsers[2]!.login
                            },
                            {
                                addedAt: expect.any(String),
                                userId: contextTests.users.createdUsers[0]!.id,
                                login: contextTests.users.createdUsers[0]!.login
                            },
                            {
                                addedAt: expect.any(String),
                                userId: contextTests.users.createdUsers[3]!.id,
                                login: contextTests.users.createdUsers[3]!.login
                            },
                        ]
                    },
                })
            )

            await isCreatedPostLike(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                'Like',
                contextTests.sessions.accessTokenUser2Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            await isCreatedPostLike(
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                'Dislike',
                contextTests.sessions.accessTokenUser3Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getAllPostsByIdBlog: res5 } = await contextTests.postsTestManager.getAllPostsByIdBlog(
                contextTests.blogs.createdBlogs[0]!.id,
                contextTests.constants.codedAuth,
                contextTests.sessions.accessTokenUser2Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(res5.items.length)
                .toBe(contextTests.posts_for_blog.total_number_of_posts_for_blog_1_in_tests)

            expect(res5).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: contextTests.posts_for_blog.total_number_of_posts_for_blog_1_in_tests,
                })
            )

            const target4 = res5.items.find(
                p => p.id === contextTests.posts_for_blog.createdBlog1Posts[0]!.id
            )

            expect(target4!.extendedLikesInfo.newestLikes.length).toBe(3)

            expect(target4).toEqual(
                expect.objectContaining({
                    ...contextTests.posts_for_blog.createdBlog1Posts[0],
                    extendedLikesInfo: {
                        likesCount: 3,
                        dislikesCount: 1,
                        myStatus: 'None',
                        newestLikes: [
                            {
                                addedAt: expect.any(String),
                                userId: contextTests.users.createdUsers[1]!.id,
                                login: contextTests.users.createdUsers[1]!.login
                            },
                            {
                                addedAt: expect.any(String),
                                userId: contextTests.users.createdUsers[0]!.id,
                                login: contextTests.users.createdUsers[0]!.login
                            },

                            {
                                addedAt: expect.any(String),
                                userId: contextTests.users.createdUsers[3]!.id,
                                login: contextTests.users.createdUsers[3]!.login
                            },
                        ]
                    },
                })
            )

        })

        it(`PUT    - Ожидается статус код 404, - Дизлайк не существующиму комментарию! Дополнительные запросы: -> GET`, async () => {
            const { getCommentById: get1 } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(get1).toMatchObject({
                ...contextTests.comments.createdBlog1Post1Comments[0],
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                },
            });
            await isCreatedCommentLike(
                contextTests.constants.invalidId,
                'Dislike',
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
            const { getCommentById: get2 } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(get2).toMatchObject({
                ...contextTests.comments.createdBlog1Post1Comments[0],
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                }
            });
        })

        it(`PUT    - Ожидается статус код 400, - Не валидные данные для обновления лайк-статуса комментария! Дополнительные запросы: -> GET`, async () => {
            const { getCommentById: get1 } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(get1).toMatchObject({
                ...contextTests.comments.createdBlog1Post1Comments[0],
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                },
            });
            for (let i = 0; contextTests.constants.incorectData.length > i; i++) {
                await isCreatedCommentLike(
                    contextTests.comments.createdBlog1Post1Comments[0]!.id,
                    contextTests.constants.incorectData[i],
                    contextTests.sessions.accessTokenUser1Devices[0],
                    HTTP_STATUSES.BAD_REQUEST_400
                )
            }
            const { getCommentById: get2 } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(get2).toMatchObject({
                ...contextTests.comments.createdBlog1Post1Comments[0],
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                },
            });
        })
        it(`PUT    - Ожидается статус код 401, - Не стоит обновлять данные комментария лайк-статуса без авторизации! Дополнительные запросы: -> GET`, async () => {
            const { getCommentById: get1 } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(get1).toMatchObject({
                ...contextTests.comments.createdBlog1Post1Comments[0],
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                },
            });
            await isCreatedCommentLike(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                'Dislike',
                contextTests.constants.invalidToken,
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            const { getCommentById: get2 } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(get2).toMatchObject({
                ...contextTests.comments.createdBlog1Post1Comments[0],
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                },
            });
        })

        it(`PUT    - Ожидается статус код 204, - Успешное создание лайка комментария! Дополнительные запросы: -> GET`, async () => {
            const { getCommentById: get1 } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(get1).toMatchObject({
                ...contextTests.comments.createdBlog1Post1Comments[0],
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                },
            });
            await isCreatedCommentLike(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                'Like',
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getCommentById } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getCommentById).toMatchObject({
                ...contextTests.comments.createdBlog1Post1Comments[0],
                likesInfo: {
                    likesCount: 1,
                    dislikesCount: 0,
                    myStatus: 'Like',
                },
            });
        })
        it(`PUT    - Ожидается статус код 204, - Успешное выключение лайка комментария! Дополнительные запросы: -> GET`, async () => {
            const { getCommentById: get1 } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(get1).toMatchObject({
                ...contextTests.comments.createdBlog1Post1Comments[0],
                likesInfo: {
                    likesCount: 1,
                    dislikesCount: 0,
                    myStatus: 'Like',
                },
            });
            await isCreatedCommentLike(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                'Like',
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getCommentById } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getCommentById).toMatchObject({
                ...contextTests.comments.createdBlog1Post1Comments[0],
                likesInfo: {
                    likesCount: 1,
                    dislikesCount: 0,
                    myStatus: 'Like',
                },
            });
            await isCreatedCommentLike(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                'None',
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getCommentById: res } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(res).toMatchObject({
                ...contextTests.comments.createdBlog1Post1Comments[0],
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                },
            });
        })
        it(`PUT    - Ожидается статус код 204, - Успешное создание дизлайка комментария! Дополнительные запросы: -> GET`, async () => {
            const { getCommentById: get1 } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(get1).toMatchObject({
                ...contextTests.comments.createdBlog1Post1Comments[0],
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                },
            });
            await isCreatedCommentLike(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                'Dislike',
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getCommentById } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getCommentById).toMatchObject({
                ...contextTests.comments.createdBlog1Post1Comments[0],
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 1,
                    myStatus: 'Dislike',
                },
            });
        })
        it(`PUT    - Ожидается статус код 204, - Успешное выключение дизлайка комментария! Дополнительные запросы: -> GET`, async () => {
            const { getCommentById: get1 } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(get1).toMatchObject({
                ...contextTests.comments.createdBlog1Post1Comments[0],
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 1,
                    myStatus: 'Dislike',
                },
            });
            await isCreatedCommentLike(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                'Dislike',
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getCommentById } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getCommentById).toMatchObject({
                ...contextTests.comments.createdBlog1Post1Comments[0],
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 1,
                    myStatus: 'Dislike',
                },
            });
            await isCreatedCommentLike(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                'None',
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getCommentById: res } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(res).toMatchObject({
                ...contextTests.comments.createdBlog1Post1Comments[0],
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                },
            });
        })
        it(`PUT    - Ожидается статус код 204, - Успешное создание и переключение лайка на дизлайк комментария! Дополнительные запросы: -> GET`, async () => {
            const { getCommentById: get1 } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(get1).toMatchObject({
                ...contextTests.comments.createdBlog1Post1Comments[0],
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: 'None',
                },
            });
            await isCreatedCommentLike(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                'Like',
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getCommentById } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getCommentById).toMatchObject({
                ...contextTests.comments.createdBlog1Post1Comments[0],
                likesInfo: {
                    likesCount: 1,
                    dislikesCount: 0,
                    myStatus: 'Like',
                },
            });
            await isCreatedCommentLike(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                'Dislike',
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getCommentById: get2 } = await contextTests.commentsTestManager.getCommentById(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(get2).toMatchObject({
                ...contextTests.comments.createdBlog1Post1Comments[0],
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 1,
                    myStatus: 'Dislike',
                },
            });
        })

        it(`PUT    - Ожидается статус код 204, - Успешное создание трех лайков комментария разными пользователями! Дополнительные запросы: -> GET`, async () => {
            const isUser2 = await isCreatedUser(
                1,
                contextTests.users.correctUserNames[1],
                contextTests.users.correctUserEmails[1],
                contextTests.users.correctUserPasswords[1],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // console.log('TEST usersE2eTest - isUser1: ', isUser1)
            const isLogin2 = await isLoginUser(
                1,
                0,
                contextTests.sessions.accessTokenUser2Devices[0],
                contextTests.sessions.refreshTokenUser2Devices[0],
                contextTests.users.correctUserEmails[1],
                contextTests.users.correctUserPasswords[1],
                contextTests.sessions.userAgent[2],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST: - blogsE2eTest: isLogin1.status 😡', isLogin1.authData)
            const isUser3 = await isCreatedUser(
                2,
                contextTests.users.correctUserNames[2],
                contextTests.users.correctUserEmails[2],
                contextTests.users.correctUserPasswords[2],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // console.log('TEST usersE2eTest - isUser1: ', isUser1)
            const isLogin3 = await isLoginUser(
                2,
                0,
                contextTests.sessions.accessTokenUser3Devices[0],
                contextTests.sessions.refreshTokenUser3Devices[0],
                contextTests.users.correctUserEmails[2],
                contextTests.users.correctUserPasswords[2],
                contextTests.sessions.userAgent[3],
                HTTP_STATUSES.OK_200
            )
            const { getAllComments } = await contextTests.commentsTestManager.getAllComments(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                HTTP_STATUSES.OK_200
            )
            expect(getAllComments.items.length).toBe(contextTests.comments.total_number_of_comments_for_blog_1_post_1_in_tests)
            expect(getAllComments).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [
                        {
                            ...contextTests.comments.createdBlog1Post1Comments[0],
                            likesInfo: {
                                likesCount: 0,
                                dislikesCount: 1,
                                myStatus: "Dislike"
                            }
                        }
                    ]
                })
            )
            await isCreatedCommentLike(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                'Like',
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            await isCreatedCommentLike(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                'Dislike',
                contextTests.sessions.accessTokenUser2Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            await isCreatedCommentLike(
                contextTests.comments.createdBlog1Post1Comments[0]!.id,
                'Like',
                contextTests.sessions.accessTokenUser3Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getAllComments: res2 } = await contextTests.commentsTestManager.getAllComments(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                HTTP_STATUSES.OK_200
            )
            expect(res2.items.length).toBe(contextTests.comments.total_number_of_comments_for_blog_1_post_1_in_tests)
            expect(res2).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [
                        {
                            ...contextTests.comments.createdBlog1Post1Comments[0],
                            likesInfo: {
                                likesCount: 2,
                                dislikesCount: 1,
                                myStatus: "Like"
                            }
                        }
                    ]
                })
            )
            const isComment2 = await isCreatedComment(
                0,
                0,
                1,
                contextTests.comments.contentForComments[1],
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.CREATED_201
            )
            // console.log('TEST - isComment2 😡 ', isComment2)
            // console.log('TEST - contextTests.comments.createdBlog1Post1Comments[1] 😡 ', contextTests.comments.createdBlog1Post1Comments[1])

            await isCreatedCommentLike(
                contextTests.comments.createdBlog1Post1Comments[1]!.id,
                'Dislike',
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )

            await isCreatedCommentLike(
                contextTests.comments.createdBlog1Post1Comments[1]!.id,
                'Dislike',
                contextTests.sessions.accessTokenUser2Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            await isCreatedCommentLike(
                contextTests.comments.createdBlog1Post1Comments[1]!.id,
                'Dislike',
                contextTests.sessions.accessTokenUser3Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const isComment3 = await isCreatedComment(
                0,
                0,
                2,
                contextTests.comments.contentForComments[2],
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.CREATED_201
            )

            await isCreatedCommentLike(
                contextTests.comments.createdBlog1Post1Comments[2]!.id,
                'Dislike',
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            await isCreatedCommentLike(
                contextTests.comments.createdBlog1Post1Comments[2]!.id,
                'Like',
                contextTests.sessions.accessTokenUser2Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            await isCreatedCommentLike(
                contextTests.comments.createdBlog1Post1Comments[2]!.id,
                'None',
                contextTests.sessions.accessTokenUser3Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getAllComments: res3 } = await contextTests.commentsTestManager.getAllComments(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
                HTTP_STATUSES.OK_200
            )
            expect(res3.items.length).toBe(contextTests.comments.total_number_of_comments_for_blog_1_post_1_in_tests)
            expect(res3).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 3,
                    items: [
                        {
                            ...contextTests.comments.createdBlog1Post1Comments[2],
                            likesInfo: {
                                likesCount: 1,
                                dislikesCount: 1,
                                myStatus: "Dislike"
                            }
                        },
                        {
                            ...contextTests.comments.createdBlog1Post1Comments[1],
                            likesInfo: {
                                likesCount: 0,
                                dislikesCount: 3,
                                myStatus: "Dislike"
                            }
                        },
                        {
                            ...contextTests.comments.createdBlog1Post1Comments[0],
                            likesInfo: {
                                likesCount: 2,
                                dislikesCount: 1,
                                myStatus: "Like"
                            }
                        },
                    ]
                })
            )
        })
        // console.log('TEST ⚙️ - getAllComments', JSON.stringify(res3, null, 2))
    })
}