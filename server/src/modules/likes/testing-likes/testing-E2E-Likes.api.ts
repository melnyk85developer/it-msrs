import { contextTests } from 'test/helpers/init-settings';
import { HTTP_STATUSES } from 'src/core/utils/utils';
import { isCreatedComment } from 'src/modules/comments/testing-comments/testFunctionsComments';
import { isCreatedUser } from 'src/modules/user-accounts/testing-users/testFunctionsUser';
import { isLoginUser } from 'src/modules/auth/auth-testing/testFunctionsAuth';
import { isCreatedBlog } from 'src/modules/bloggers-platform/blogs/blogs-testing/testFunctionsBlogs';
import { isCreatedPostForBlog } from 'src/modules/bloggers-platform/posts/testing-posts/testFunctionsPostsForBlogs';

export const likesE2eTest = () => {
    describe('E2E-LIKES', () => {
        beforeEach(async () => {
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
            console.log('TEST:  - isPost 😡 ', isPost)
            const isComment1 = await isCreatedComment(
                0,
                0,
                0,
                contextTests.comments.contentBlog1Post1Comments[0],
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
            // const { getPostsById: res2 } = await contextTests.postsTestManager.getPostsById(
            //     contextTests.posts_for_blog.createdBlog1Posts[0]!.id,
            //     contextTests.sessions.accessTokenUser1Devices[0],
            //     contextTests.sessions.refreshTokenUser1Devices[0],
            //     HTTP_STATUSES.OK_200
            // )
            // expect(res2).toMatchObject(
            //     {
            //         ...contextTests.posts_for_blog.createdBlog1Posts[0],
            //         extendedLikesInfo: {
            //             likesCount: 0,
            //             dislikesCount: 0,
            //             myStatus: 'None',
            //             newestLikes: []
            //         },
            //     }
            // );
        })
        // it(`PUT    - Ожидается статус код 401, - Не стоит обновлять данные поста лайк-статуса без авторизации! Дополнительные запросы: -> GET`, async () => {
        //     const { getPostsById } = await contextTests.postsTestManager.getPostsById(
        //         contextTests.createdBlog1Post1.id,
        //         null,
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getPostsById).toMatchObject({
        //         ...contextTests.createdBlog1Post1,
        //         extendedLikesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 0,
        //             myStatus: 'None',
        //             newestLikes: []
        //         },
        //     });
        //     await contextTests.likesTestManager.createPostLike(
        //         contextTests.createdBlog1Post1.id,
        //         {
        //             likeStatus: 'Like'
        //         },
        //         contextTests.invalidToken,
        //         HTTP_STATUSES.UNAUTHORIZED_401
        //     )
        //     const { getPostsById: res2 } = await contextTests.postsTestManager.getPostsById(
        //         contextTests.createdBlog1Post1.id,
        //         null,
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(res2).toMatchObject({
        //         ...contextTests.createdBlog1Post1,
        //         extendedLikesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 0,
        //             myStatus: 'None',
        //             newestLikes: []
        //         },
        //     });
        // })
        // it(`PUT    - Ожидается статус код 204, - Успешное создание лайка для поста! Дополнительные запросы: -> GET`, async () => {
        //     const { getPostsById } = await contextTests.postsTestManager.getPostsById(
        //         contextTests.createdBlog1Post1.id,
        //         null,
        //         contextTests.refreshTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getPostsById).toMatchObject({
        //         ...contextTests.createdBlog1Post1,
        //         extendedLikesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 0,
        //             myStatus: 'None',
        //             newestLikes: []
        //         },
        //     });
        //     await contextTests.likesTestManager.createPostLike(
        //         contextTests.createdBlog1Post1.id,
        //         {
        //             likeStatus: 'Like'
        //         },
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getPostsById: res2 } = await contextTests.postsTestManager.getPostsById(
        //         contextTests.createdBlog1Post1.id,
        //         contextTests.accessTokenUser1Device1,
        //         contextTests.refreshTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(res2).toMatchObject({
        //         ...contextTests.createdBlog1Post1,
        //         extendedLikesInfo: {
        //             likesCount: 1,
        //             dislikesCount: 0,
        //             myStatus: 'Like',
        //             newestLikes: [
        //                 {
        //                     addedAt: expect.any(String),
        //                     userId: contextTests.createdUser1.id,
        //                     login: contextTests.createdUser1.login
        //                 }
        //             ]
        //         },
        //     });
        // })

        // it(`PUT    - Ожидается статус код 204, - Успешное выключение лайка поста! Дополнительные запросы: -> GET`, async () => {
        //     const { getPostsById } = await contextTests.postsTestManager.getPostsById(
        //         contextTests.createdBlog1Post1.id,
        //         null,
        //         contextTests.refreshTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getPostsById).toMatchObject({
        //         content: contextTests.contentBlog1Post1,
        //         extendedLikesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 0,
        //             myStatus: 'None',
        //             newestLikes: []
        //         },
        //     });
        //     await contextTests.likesTestManager.createPostLike(
        //         contextTests.createdBlog1Post1.id,
        //         {
        //             likeStatus: 'Like'
        //         },
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getPostsById: res2 } = await contextTests.postsTestManager.getPostsById(
        //         contextTests.createdBlog1Post1.id,
        //         null,
        //         contextTests.refreshTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(res2).toMatchObject({
        //         content: contextTests.contentBlog1Post1,
        //         extendedLikesInfo: {
        //             likesCount: 1,
        //             dislikesCount: 0,
        //             myStatus: 'Like',
        //             newestLikes: [
        //                 {
        //                     addedAt: expect.any(String),
        //                     userId: contextTests.createdUser1.id,
        //                     login: contextTests.createdUser1.login
        //                 }
        //             ]
        //         },
        //     });
        //     await contextTests.likesTestManager.createPostLike(
        //         contextTests.createdBlog1Post1.id,
        //         {
        //             likeStatus: 'None'
        //         },
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getPostsById: res3 } = await contextTests.postsTestManager.getPostsById(
        //         contextTests.createdBlog1Post1.id,
        //         null,
        //         contextTests.refreshTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(res3).toMatchObject({
        //         content: contextTests.contentBlog1Post1,
        //         extendedLikesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 0,
        //             myStatus: 'None',
        //             newestLikes: []
        //         },
        //     });
        // })
        // it(`PUT    - Ожидается статус код 204, - Успешное создание дизлайка поста! Дополнительные запросы: -> GET`, async () => {
        //     const { getPostsById } = await contextTests.postsTestManager.getPostsById(
        //         contextTests.createdBlog1Post1.id,
        //         null,
        //         contextTests.refreshTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getPostsById).toMatchObject({
        //         content: contextTests.contentBlog1Post1,
        //         extendedLikesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 0,
        //             myStatus: 'None',
        //             newestLikes: []
        //         },
        //     });
        //     await contextTests.likesTestManager.createPostLike(
        //         contextTests.createdBlog1Post1.id,
        //         {
        //             likeStatus: 'Dislike'
        //         },
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getPostsById: res2 } = await contextTests.postsTestManager.getPostsById(
        //         contextTests.createdBlog1Post1.id,
        //         null,
        //         contextTests.refreshTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(res2).toMatchObject({
        //         content: contextTests.contentBlog1Post1,
        //         extendedLikesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 1,
        //             myStatus: 'Dislike',
        //             newestLikes: []
        //         },
        //     });
        // })
        // it(`PUT    - Ожидается статус код 204, - Успешное выключение дизлайка поста! Дополнительные запросы: -> GET`, async () => {
        //     const { getPostsById } = await contextTests.postsTestManager.getPostsById(
        //         contextTests.createdBlog1Post1.id,
        //         contextTests.accessTokenUser1Device1,
        //         null,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getPostsById).toMatchObject({
        //         content: contextTests.contentBlog1Post1,
        //         extendedLikesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 0,
        //             myStatus: 'None',
        //             newestLikes: []
        //         },
        //     });
        //     await contextTests.likesTestManager.createPostLike(
        //         contextTests.createdBlog1Post1.id,
        //         {
        //             likeStatus: 'Dislike'
        //         },
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getPostsById: res2 } = await contextTests.postsTestManager.getPostsById(
        //         contextTests.createdBlog1Post1.id,
        //         contextTests.accessTokenUser1Device1,
        //         null,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(res2).toMatchObject({
        //         content: contextTests.contentBlog1Post1,
        //         extendedLikesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 1,
        //             myStatus: 'Dislike',
        //             newestLikes: []
        //         },
        //     });
        //     await contextTests.likesTestManager.createPostLike(
        //         contextTests.createdBlog1Post1.id,
        //         {
        //             likeStatus: 'None'
        //         },
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getPostsById: res3 } = await contextTests.postsTestManager.getPostsById(
        //         contextTests.createdBlog1Post1.id,
        //         contextTests.accessTokenUser1Device1,
        //         null,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(res3).toMatchObject({
        //         content: contextTests.contentBlog1Post1,
        //         extendedLikesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 0,
        //             myStatus: 'None',
        //             newestLikes: []
        //         },
        //     });
        // })
        // it(`PUT    - Ожидается статус код 204, - Успешное создание и переключение лайка на дизлайк поста! Дополнительные запросы: -> GET`, async () => {
        //     const { getPostsById } = await contextTests.postsTestManager.getPostsById(
        //         contextTests.createdBlog1Post1.id,
        //         contextTests.accessTokenUser1Device1,
        //         null,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getPostsById).toMatchObject({
        //         content: contextTests.contentBlog1Post1,
        //         extendedLikesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 0,
        //             myStatus: 'None',
        //             newestLikes: []
        //         },
        //     });
        //     await contextTests.likesTestManager.createPostLike(
        //         contextTests.createdBlog1Post1.id,
        //         {
        //             likeStatus: 'Like'
        //         },
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getPostsById: res2 } = await contextTests.postsTestManager.getPostsById(
        //         contextTests.createdBlog1Post1.id,
        //         contextTests.accessTokenUser1Device1,
        //         null,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(res2).toMatchObject({
        //         content: contextTests.contentBlog1Post1,
        //         extendedLikesInfo: {
        //             likesCount: 1,
        //             dislikesCount: 0,
        //             myStatus: 'Like',
        //             newestLikes: [
        //                 {
        //                     addedAt: expect.any(String),
        //                     userId: contextTests.createdUser1.id,
        //                     login: contextTests.createdUser1.login
        //                 }
        //             ]
        //         },
        //     });
        //     await contextTests.likesTestManager.createPostLike(
        //         contextTests.createdBlog1Post1.id,
        //         {
        //             likeStatus: 'Dislike'
        //         },
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getPostsById: res3 } = await contextTests.postsTestManager.getPostsById(
        //         contextTests.createdBlog1Post1.id,
        //         contextTests.accessTokenUser1Device1,
        //         null,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(res3).toMatchObject({
        //         content: contextTests.contentBlog1Post1,
        //         extendedLikesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 1,
        //             myStatus: 'Dislike',
        //             newestLikes: []
        //         },
        //     });
        //     // console.log('TEST 😡 - getPostsById: ', getPostsById)
        // })
        // it(`PUT    - Ожидается статус код 204, - Успешное создание трех лайков поста разными пользователями! Дополнительные запросы: -> GET`, async () => {
        //     const isUser2 = await isCreatedUser2(
        //         contextTests.correctUserName2,
        //         contextTests.correctUserEmail2,
        //         contextTests.correctUserPassword2,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const isLogin2 = await isLoginUser2(
        //         contextTests.accessTokenUser2Device1,
        //         contextTests.refreshTokenUser2Device1,
        //         contextTests.correctUserEmail2,
        //         contextTests.correctUserPassword2,
        //         contextTests.userAgent[0],
        //         HTTP_STATUSES.OK_200
        //     )
        //     const isUser3 = await isCreatedUser3(
        //         contextTests.correctUserName3,
        //         contextTests.correctUserEmail3,
        //         contextTests.correctUserPassword3,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const isLogin3 = await isLoginUser3(
        //         contextTests.accessTokenUser3Device1,
        //         contextTests.refreshTokenUser3Device1,
        //         contextTests.correctUserEmail3,
        //         contextTests.correctUserPassword3,
        //         contextTests.userAgent[0],
        //         HTTP_STATUSES.OK_200
        //     )
        //     const isUser4 = await isCreatedUser4(
        //         contextTests.correctUserName4,
        //         contextTests.correctUserEmail4,
        //         contextTests.correctUserPassword4,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const isLogin4 = await isLoginUser4(
        //         contextTests.accessTokenUser4Device1,
        //         contextTests.refreshTokenUser4Device1,
        //         contextTests.correctUserEmail4,
        //         contextTests.correctUserPassword4,
        //         contextTests.userAgent[0],
        //         HTTP_STATUSES.OK_200
        //     )
        //     const { getAllPostsByIdBlog } = await contextTests.postsTestManager.getAllPostsByIdBlog(
        //         contextTests.codedAuth,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getAllPostsByIdBlog.items.length).toBe(1)
        //     expect(getAllPostsByIdBlog).toEqual(
        //         expect.objectContaining({
        //             pagesCount: 1,
        //             page: 1,
        //             pageSize: 10,
        //             totalCount: 1,
        //             items: [
        //                 {
        //                     ...contextTests.createdBlog1Post1,
        //                     extendedLikesInfo: {
        //                         likesCount: 0,
        //                         dislikesCount: 0,
        //                         myStatus: 'None',
        //                         newestLikes: []
        //                     },
        //                 }
        //             ]
        //         })
        //     )
        //     await isCreatedPostLike(
        //         contextTests.createdBlog1Post1.id,
        //         'Like',
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     await isCreatedPostLike(
        //         contextTests.createdBlog1Post1.id,
        //         'Like',
        //         contextTests.accessTokenUser2Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     await isCreatedPostLike(
        //         contextTests.createdBlog1Post1.id,
        //         'Dislike',
        //         contextTests.accessTokenUser3Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     await isCreatedPostLike(
        //         contextTests.createdBlog1Post1.id,
        //         'Like',
        //         contextTests.accessTokenUser4Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getAllPostsByIdBlog: res2 } = await contextTests.postsTestManager.getAllPostsByIdBlog(
        //         contextTests.codedAuth,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(res2.items[0].extendedLikesInfo.newestLikes.length).toBe(3)
        //     expect(res2).toEqual(
        //         expect.objectContaining({
        //             pagesCount: 1,
        //             page: 1,
        //             pageSize: 10,
        //             totalCount: 1,
        //             items: [
        //                 {
        //                     ...contextTests.createdBlog1Post1,
        //                     extendedLikesInfo: {
        //                         likesCount: 3,
        //                         dislikesCount: 1,
        //                         myStatus: 'None',
        //                         newestLikes: [
        //                             {
        //                                 addedAt: expect.any(String),
        //                                 login: contextTests.createdUser4.login,
        //                                 userId: contextTests.createdUser4.id,
        //                             },
        //                             {
        //                                 addedAt: expect.any(String),
        //                                 login: contextTests.createdUser2.login,
        //                                 userId: contextTests.createdUser2.id,
        //                             },
        //                             {
        //                                 addedAt: expect.any(String),
        //                                 login: contextTests.createdUser1.login,
        //                                 userId: contextTests.createdUser1.id,
        //                             },
        //                         ]
        //                     },
        //                 }
        //             ]
        //         })
        //     )
        //     await isCreatedPostLike(
        //         contextTests.createdBlog1Post1.id,
        //         'Dislike',
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     await isCreatedPostLike(
        //         contextTests.createdBlog1Post1.id,
        //         'Like',
        //         contextTests.accessTokenUser3Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getAllPostsByIdBlog: res4 } = await contextTests.postsTestManager.getAllPostsByIdBlog(
        //         contextTests.codedAuth,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(res4.items.length).toBe(1)
        //     expect(res4).toEqual(
        //         expect.objectContaining({
        //             pagesCount: 1,
        //             page: 1,
        //             pageSize: 10,
        //             totalCount: 1,
        //             items: [
        //                 {
        //                     ...contextTests.createdBlog1Post1,
        //                     extendedLikesInfo: {
        //                         likesCount: 3,
        //                         dislikesCount: 1,
        //                         myStatus: 'None',
        //                         newestLikes: [
        //                             {
        //                                 addedAt: expect.any(String),
        //                                 login: contextTests.createdUser3.login,
        //                                 userId: contextTests.createdUser3.id,
        //                             },
        //                             {
        //                                 addedAt: expect.any(String),
        //                                 login: contextTests.createdUser4.login,
        //                                 userId: contextTests.createdUser4.id,
        //                             },
        //                             {
        //                                 addedAt: expect.any(String),
        //                                 login: contextTests.createdUser2.login,
        //                                 userId: contextTests.createdUser2.id,
        //                             },
        //                         ]
        //                     },
        //                 }
        //             ]
        //         })
        //     )
        //     await isCreatedPostLike(
        //         contextTests.createdBlog1Post1.id,
        //         'Like',
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getAllPostsByIdBlog: res5 } = await contextTests.postsTestManager.getAllPostsByIdBlog(
        //         contextTests.codedAuth,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(res5.items.length).toBe(1)
        //     expect(res5.items[0].extendedLikesInfo.newestLikes.length).toBe(3)
        //     expect(res5).toEqual(
        //         expect.objectContaining({
        //             pagesCount: 1,
        //             page: 1,
        //             pageSize: 10,
        //             totalCount: 1,
        //             items: [
        //                 {
        //                     ...contextTests.createdBlog1Post1,
        //                     extendedLikesInfo: {
        //                         likesCount: 4,
        //                         dislikesCount: 0,
        //                         myStatus: 'None',
        //                         newestLikes: [
        //                             {
        //                                 addedAt: expect.any(String),
        //                                 login: contextTests.createdUser1.login,
        //                                 userId: contextTests.createdUser1.id,
        //                             },
        //                             {
        //                                 addedAt: expect.any(String),
        //                                 login: contextTests.createdUser3.login,
        //                                 userId: contextTests.createdUser3.id,
        //                             },
        //                             {
        //                                 addedAt: expect.any(String),
        //                                 login: contextTests.createdUser4.login,
        //                                 userId: contextTests.createdUser4.id,
        //                             },
        //                         ]
        //                     },
        //                 }
        //             ]
        //         })
        //     )
        // })

        // it(`PUT    - Ожидается статус код 404, - Дизлайк не существующиму комментарию! Дополнительные запросы: -> GET`, async () => {
        //     const { getCommentById: get1 } = await contextTests.commentsTestManager.getCommentById(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(get1).toMatchObject({
        //         content: contextTests.contentBlog1Post1Comment1,
        //         likesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 0,
        //             myStatus: 'None',
        //         },
        //     });
        //     await isCreatedCommentLike(
        //         contextTests.invalidId,
        //         'Dislike',
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NOT_FOUND_404
        //     )
        //     const { getCommentById: get2 } = await contextTests.commentsTestManager.getCommentById(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(get2).toMatchObject({
        //         content: contextTests.contentBlog1Post1Comment1,
        //         likesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 0,
        //             myStatus: 'None',
        //         },
        //     });
        // })
        // it(`PUT    - Ожидается статус код 400, - Не валидные данные для обновления лайк-статуса комментария! Дополнительные запросы: -> GET`, async () => {
        //     const { getCommentById: get1 } = await contextTests.commentsTestManager.getCommentById(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(get1).toMatchObject({
        //         content: contextTests.contentBlog1Post1Comment1,
        //         likesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 0,
        //             myStatus: 'None',
        //         },
        //     });
        //     for (let i = 0; contextTests.incorectData.length > i; i++) {
        //         await isCreatedCommentLike(
        //             contextTests.createdBlog1Post1Comment1.id,
        //             contextTests.incorectData[i],
        //             contextTests.accessTokenUser1Device1,
        //             HTTP_STATUSES.BAD_REQUEST_400
        //         )
        //     }
        //     const { getCommentById: get2 } = await contextTests.commentsTestManager.getCommentById(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(get2).toMatchObject({
        //         content: contextTests.contentBlog1Post1Comment1,
        //         likesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 0,
        //             myStatus: 'None',
        //         },
        //     });
        // })
        // it(`PUT    - Ожидается статус код 401, - Не стоит обновлять данные комментария лайк-статуса без авторизации! Дополнительные запросы: -> GET`, async () => {
        //     const { getCommentById: get1 } = await contextTests.commentsTestManager.getCommentById(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(get1).toMatchObject({
        //         content: contextTests.contentBlog1Post1Comment1,
        //         likesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 0,
        //             myStatus: 'None',
        //         },
        //     });
        //     await isCreatedCommentLike(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         'Dislike',
        //         contextTests.invalidToken,
        //         HTTP_STATUSES.UNAUTHORIZED_401
        //     )
        //     const { getCommentById: get2 } = await contextTests.commentsTestManager.getCommentById(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(get2).toMatchObject({
        //         content: contextTests.contentBlog1Post1Comment1,
        //         likesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 0,
        //             myStatus: 'None',
        //         },
        //     });
        // })

        // it(`PUT    - Ожидается статус код 204, - Успешное создание лайка комментария! Дополнительные запросы: -> GET`, async () => {
        //     const { getCommentById: get1 } = await contextTests.commentsTestManager.getCommentById(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(get1).toMatchObject({
        //         content: contextTests.contentBlog1Post1Comment1,
        //         likesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 0,
        //             myStatus: 'None',
        //         },
        //     });
        //     await isCreatedCommentLike(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         'Like',
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getCommentById } = await contextTests.commentsTestManager.getCommentById(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getCommentById).toMatchObject({
        //         content: contextTests.contentBlog1Post1Comment1,
        //         likesInfo: {
        //             likesCount: 1,
        //             dislikesCount: 0,
        //             myStatus: 'Like',
        //         },
        //     });
        // })
        // it(`PUT    - Ожидается статус код 204, - Успешное выключение лайка комментария! Дополнительные запросы: -> GET`, async () => {
        //     const { getCommentById: get1 } = await contextTests.commentsTestManager.getCommentById(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(get1).toMatchObject({
        //         content: contextTests.contentBlog1Post1Comment1,
        //         likesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 0,
        //             myStatus: 'None',
        //         },
        //     });
        //     await isCreatedCommentLike(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         'Like',
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getCommentById } = await contextTests.commentsTestManager.getCommentById(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getCommentById).toMatchObject({
        //         content: contextTests.contentBlog1Post1Comment1,
        //         likesInfo: {
        //             likesCount: 1,
        //             dislikesCount: 0,
        //             myStatus: 'Like',
        //         },
        //     });
        //     await isCreatedCommentLike(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         'None',
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getCommentById: res } = await contextTests.commentsTestManager.getCommentById(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(res).toMatchObject({
        //         content: contextTests.contentBlog1Post1Comment1,
        //         likesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 0,
        //             myStatus: 'None',
        //         },
        //     });
        // })
        // it(`PUT    - Ожидается статус код 204, - Успешное создание дизлайка комментария! Дополнительные запросы: -> GET`, async () => {
        //     const { getCommentById: get1 } = await contextTests.commentsTestManager.getCommentById(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(get1).toMatchObject({
        //         content: contextTests.contentBlog1Post1Comment1,
        //         likesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 0,
        //             myStatus: 'None',
        //         },
        //     });
        //     await isCreatedCommentLike(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         'Dislike',
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getCommentById } = await contextTests.commentsTestManager.getCommentById(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getCommentById).toMatchObject({
        //         content: contextTests.contentBlog1Post1Comment1,
        //         likesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 1,
        //             myStatus: 'Dislike',
        //         },
        //     });
        // })
        // it(`PUT    - Ожидается статус код 204, - Успешное выключение дизлайка комментария! Дополнительные запросы: -> GET`, async () => {
        //     const { getCommentById: get1 } = await contextTests.commentsTestManager.getCommentById(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(get1).toMatchObject({
        //         content: contextTests.contentBlog1Post1Comment1,
        //         likesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 0,
        //             myStatus: 'None',
        //         },
        //     });
        //     await isCreatedCommentLike(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         'Dislike',
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getCommentById } = await contextTests.commentsTestManager.getCommentById(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getCommentById).toMatchObject({
        //         content: contextTests.contentBlog1Post1Comment1,
        //         likesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 1,
        //             myStatus: 'Dislike',
        //         },
        //     });
        //     await isCreatedCommentLike(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         'None',
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getCommentById: res } = await contextTests.commentsTestManager.getCommentById(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(res).toMatchObject({
        //         content: contextTests.contentBlog1Post1Comment1,
        //         likesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 0,
        //             myStatus: 'None',
        //         },
        //     });
        // })
        // it(`PUT    - Ожидается статус код 204, - Успешное создание и переключение лайка на дизлайк комментария! Дополнительные запросы: -> GET`, async () => {
        //     const { getCommentById: get1 } = await contextTests.commentsTestManager.getCommentById(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(get1).toMatchObject({
        //         content: contextTests.contentBlog1Post1Comment1,
        //         likesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 0,
        //             myStatus: 'None',
        //         },
        //     });
        //     await isCreatedCommentLike(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         'Dislike',
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getCommentById: get2 } = await contextTests.commentsTestManager.getCommentById(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(get2).toMatchObject({
        //         content: contextTests.contentBlog1Post1Comment1,
        //         likesInfo: {
        //             likesCount: 0,
        //             dislikesCount: 1,
        //             myStatus: 'Dislike',
        //         },
        //     });
        //     await isCreatedCommentLike(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         'Like',
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getCommentById } = await contextTests.commentsTestManager.getCommentById(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getCommentById).toMatchObject({
        //         content: contextTests.contentBlog1Post1Comment1,
        //         likesInfo: {
        //             likesCount: 1,
        //             dislikesCount: 0,
        //             myStatus: 'Like',
        //         },
        //     });
        // })

        // it(`PUT    - Ожидается статус код 204, - Успешное создание трех лайков комментария разными пользователями! Дополнительные запросы: -> GET`, async () => {
        //     const isUser2 = await isCreatedUser2(
        //         contextTests.correctUserName2,
        //         contextTests.correctUserEmail2,
        //         contextTests.correctUserPassword2,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     // console.log('TEST - ⚙️ : - contextTests.accessTokenUser2Device1', contextTests.accessTokenUser2Device1)
        //     // console.log('TEST - ⚙️ : - contextTests.correctUserEmail2', contextTests.correctUserEmail2)

        //     const isLogin2 = await isLoginUser2(
        //         contextTests.accessTokenUser2Device1,
        //         contextTests.refreshTokenUser2Device1,
        //         contextTests.correctUserEmail2,
        //         contextTests.correctUserPassword2,
        //         contextTests.userAgent[0],
        //         HTTP_STATUSES.OK_200
        //     )
        //     // console.log('TEST - ⚙️ : - isLogin2', isLogin2)

        //     const isUser3 = await isCreatedUser3(
        //         contextTests.correctUserName3,
        //         contextTests.correctUserEmail3,
        //         contextTests.correctUserPassword3,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const isLogin3 = await isLoginUser3(
        //         contextTests.accessTokenUser3Device1,
        //         contextTests.refreshTokenUser3Device1,
        //         contextTests.correctUserEmail3,
        //         contextTests.correctUserPassword3,
        //         contextTests.userAgent[0],
        //         HTTP_STATUSES.OK_200
        //     )
        //     const { getAllComments } = await contextTests.commentsTestManager.getAllComments(
        //         contextTests.accessTokenUser1Device1,
        //         contextTests.createdBlog1Post1.id,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(getAllComments.items.length).toBe(contextTests.total_number_of_comments_in_tests)
        //     expect(getAllComments).toEqual(
        //         expect.objectContaining({
        //             pagesCount: 1,
        //             page: 1,
        //             pageSize: 10,
        //             totalCount: 1,
        //             items: [
        //                 {
        //                     ...contextTests.createdBlog1Post1Comment1,
        //                     likesInfo: {
        //                         likesCount: 0,
        //                         dislikesCount: 0,
        //                         myStatus: "None"
        //                     }
        //                 }
        //             ]
        //         })
        //     )
        //     await isCreatedCommentLike(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         'Like',
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     await isCreatedCommentLike(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         'Dislike',
        //         contextTests.accessTokenUser2Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     await isCreatedCommentLike(
        //         contextTests.createdBlog1Post1Comment1.id,
        //         'Like',
        //         contextTests.accessTokenUser3Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getAllComments: res2 } = await contextTests.commentsTestManager.getAllComments(
        //         contextTests.accessTokenUser1Device1,
        //         contextTests.createdBlog1Post1.id,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(res2.items.length).toBe(contextTests.total_number_of_comments_in_tests)
        //     expect(res2).toEqual(
        //         expect.objectContaining({
        //             pagesCount: 1,
        //             page: 1,
        //             pageSize: 10,
        //             totalCount: 1,
        //             items: [
        //                 {
        //                     ...contextTests.createdBlog1Post1Comment1,
        //                     likesInfo: {
        //                         likesCount: 2,
        //                         dislikesCount: 1,
        //                         myStatus: "Like"
        //                     }
        //                 }
        //             ]
        //         })
        //     )
        //     const isComment2 = await isCreatedComment2(
        //         contextTests.contentBlog1Post1Comment2,
        //         contextTests.createdBlog1Post1.id,
        //         HTTP_STATUSES.CREATED_201
        //     )
        //     await isCreatedCommentLike(
        //         contextTests.createdBlog1Post1Comment2.id,
        //         'Dislike',
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     await isCreatedCommentLike(
        //         contextTests.createdBlog1Post1Comment2.id,
        //         'Dislike',
        //         contextTests.accessTokenUser2Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     await isCreatedCommentLike(
        //         contextTests.createdBlog1Post1Comment2.id,
        //         'Dislike',
        //         contextTests.accessTokenUser3Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const isComment3 = await isCreatedComment3(
        //         contextTests.contentBlog1Post1Comment3,
        //         contextTests.createdBlog1Post1.id,
        //         HTTP_STATUSES.CREATED_201
        //     )
        //     await isCreatedCommentLike(
        //         contextTests.createdBlog1Post1Comment3.id,
        //         'Dislike',
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     await isCreatedCommentLike(
        //         contextTests.createdBlog1Post1Comment3.id,
        //         'Like',
        //         contextTests.accessTokenUser2Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     await isCreatedCommentLike(
        //         contextTests.createdBlog1Post1Comment3.id,
        //         'None',
        //         contextTests.accessTokenUser3Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { getAllComments: res3 } = await contextTests.commentsTestManager.getAllComments(
        //         contextTests.accessTokenUser1Device1,
        //         contextTests.createdBlog1Post1.id,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(res3.items.length).toBe(contextTests.total_number_of_comments_in_tests)
        //     expect(res3).toEqual(
        //         expect.objectContaining({
        //             pagesCount: 1,
        //             page: 1,
        //             pageSize: 10,
        //             totalCount: 3,
        //             items: [
        //                 {
        //                     ...contextTests.createdBlog1Post1Comment3,
        //                     likesInfo: {
        //                         likesCount: 1,
        //                         dislikesCount: 1,
        //                         myStatus: "Dislike"
        //                     }
        //                 },
        //                 {
        //                     ...contextTests.createdBlog1Post1Comment2,
        //                     likesInfo: {
        //                         likesCount: 0,
        //                         dislikesCount: 3,
        //                         myStatus: "Dislike"
        //                     }
        //                 },
        //                 {
        //                     ...contextTests.createdBlog1Post1Comment1,
        //                     likesInfo: {
        //                         likesCount: 2,
        //                         dislikesCount: 1,
        //                         myStatus: "Like"
        //                     }
        //                 },
        //             ]
        //         })
        //     )
        // })
        // // console.log('TEST ⚙️ - getAllComments', JSON.stringify(res3, null, 2))
    })
}