import { HTTP_STATUSES } from 'src/core/utils/utils';
import { isLoginUser } from 'src/modules/auth/auth-testing/testFunctionsAuth';
import { isCreatedUser } from 'src/modules/user-accounts/testing-users/testFunctionsUser';
import { contextTests } from 'test/helpers/init-settings';
import { isCreatedPostForProfile } from './testFunctionsPostsForProfile';
import { CreatePostForProfileInputDto } from '../posts-for-profile-api/posts-for-profile-input-dto/posts.input-dto';

export const postForProfileE2ETest = () => {
    describe('E2E-POSTS-FOR-PROFILE', () => {
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
            const isUser2 = await isCreatedUser(
                1,
                contextTests.users.correctUserNames[1],
                contextTests.users.correctUserEmails[1],
                contextTests.users.correctUserPasswords[1],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // console.log('TEST: - blogsE2eTest: isUser1 😡', isUser1)
            const isLogin2 = await isLoginUser(
                1,
                0,
                contextTests.sessions.accessTokenUser2Devices[0],
                contextTests.sessions.refreshTokenUser2Devices[0],
                contextTests.users.correctUserEmails[0],
                contextTests.users.correctUserPasswords[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST: - blogsE2eTest: isLogin.status 😡', isLogin.authData)
        })
        it('GET    - Ожидается статус код 200, - В теле ответа ожидаем пустой массив!', async () => {
            const { response } = await contextTests.postsForProfileTestManager.getAllPostsForProfile(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем полученный результат, должен быть пустой массив!
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
        it('GET    - Ожидается статус код 404, - Запрос на не существующий пост!', async () => {
            await contextTests.postsForProfileTestManager.getPostByIdForProfile(
                contextTests.constants.invalidId,
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`POST   - Ожидается статус код 400, - Не валидные данные для создания поста! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                name: '',
                surname: '',
                password: '',
                email: ''
            }
            await contextTests.postsForProfileTestManager.createPostForProfile(
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const { response } = await contextTests.postsForProfileTestManager.getAllPostsForProfile(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем полученный результат, должен быть пустой массив!
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
        it(`POST   - Ожидается статус код 201, - Успешное создание поста 1 ! Дополнительные запросы: -> POST, GET`, async () => {
            const postData: CreatePostForProfileInputDto = {
                title: contextTests.posts_for_profile.correctTitleUser1Posts[0],
                content: contextTests.posts_for_profile.contentUser1Posts[0],
                profileId: contextTests.users.createdUsers[0]!.id,
                // postedByUserId: contextTests.users.createdUsers[0]!.id,
            }
            const isPost = await isCreatedPostForProfile(
                0,
                0,
                postData,
                HTTP_STATUSES.CREATED_201
            )
            // console.log('TEST: - isPost 😡 ', isPost)
            const { getEntity } = await contextTests.postsForProfileTestManager.getAllPostsForProfile(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST: - getEntity 😡 ', getEntity)
            expect(getEntity.items).toHaveLength(1);
            expect(getEntity.items[0]).toEqual(expect.objectContaining(contextTests.posts_for_profile.createdUser1Posts[0]))
        })
        it(`POST   - Ожидается статус код 201, - успешное создание поста 2 ! Дополнительные запросы: -> GET`, async () => {
            const postData: CreatePostForProfileInputDto = {
                title: contextTests.posts_for_profile.correctTitleUser1Posts[2],
                content: contextTests.posts_for_profile.contentUser1Posts[0],
                profileId: contextTests.users.createdUsers[1]!.id,
                // postedByUserId: contextTests.createdUser2.userId
            }
            const isPost = await isCreatedPostForProfile(
                1,
                0,
                postData,
                HTTP_STATUSES.CREATED_201
            )
            const { getEntity } = await contextTests.postsForProfileTestManager.getAllPostsForProfile(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getEntity).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 2,
                    items: expect.arrayContaining([
                        expect.objectContaining(contextTests.posts_for_profile.createdUser2Posts[0]),
                        expect.objectContaining(contextTests.posts_for_profile.createdUser1Posts[0])
                    ])
                })
            )
        })
        it(`PUT    - Ожидается статус код 400, - Не валидные данные для обновления поста! Дополнительные запросы: -> GET`, async () => {
            // Подготавливаем не валидные данные поста!
            const postData: CreatePostForProfileInputDto = {
                title: '',
                content: '',
                profileId: contextTests.users.createdUsers[0]!.id,
                // postedByUserId: contextTests.createdUser1.userId,
                // authorizedUserId: contextTests.createdUser1.userId
            }
            // Отправляем не валидный PUT запрос на обновление поста и ожидаем в ответ статус код 400 (BAD_REQUEST)!
            await contextTests.postsForProfileTestManager.updatePostForProfile(
                contextTests.posts_for_profile.createdUser1Posts[0]!.postId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                postData,
                HTTP_STATUSES.BAD_REQUEST_400
            )
            // Отправляем GET запрос на получение поста и ожидаем ответ 200 (OK) и данные пользователя!
            const { getPostById } = await contextTests.postsForProfileTestManager.getPostByIdForProfile(
                contextTests.posts_for_profile.createdUser1Posts[0]!.postId,
                HTTP_STATUSES.OK_200
            )
            // Сверяем ответ от сервера с данными поста которые хотели обновить и убеждаемся, что они не изменились!
            expect(getPostById).toEqual(
                expect.objectContaining({
                    title: contextTests.posts_for_profile.createdUser1Posts[0]!.title,
                    content: contextTests.posts_for_profile.createdUser1Posts[0]!.content,
                    profileId: contextTests.posts_for_profile.createdUser1Posts[0]!.profileId,
                    // postedByUserId: contextTests.createdPost1User1.postedByUserId,
                })
            )
        })
        it(`PUT    - Ожидается статус код 404, - Обновление не существующего поста!`, async () => {
            // Подготавливаем не валидные данные поста!
            const postData: any = {
                title: contextTests.posts_for_profile.correctTitleUser1Posts[0],
                content: contextTests.posts_for_profile.contentUser1Posts[0],
                profileId: contextTests.users.createdUsers[0]!.id,
                // postedByUserId: contextTests.createdUser1.userId,
                // authorizedUserId: contextTests.createdUser1.userId
            }
            // Отправляем PUT запрос на обновление поста c не существующим id и ожидаем в ответ статус код 404 (NOT_FOUND)!
            await contextTests.postsForProfileTestManager.updatePostForProfile(
                contextTests.constants.invalidId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                postData,
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`PUT    - Ожидается статус код 200, - Обновление поста с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            // Подготавливаем данные поста!
            const postData: any = {
                title: 'update_title',
                content: 'update_content',
                profileId: contextTests.posts_for_profile.createdUser1Posts[0]!.profileId,
                // postedByUserId: contextTests.createdPost1User1.profileId,
                // authorizedUserId: contextTests.createdPost1User1.profileId
            }
            // Отправляем PUT запрос на обновление поста и ожидаем в ответ статус код 400 (BAD_REQUEST)!
            await contextTests.postsForProfileTestManager.updatePostForProfile(
                contextTests.posts_for_profile.createdUser1Posts[0]!.postId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                postData,
                HTTP_STATUSES.NO_CONTENT_204
            )
            // Отправляем GET запрос на получение обновленного поста и ожидаем в ответ статус код 200!
            const { getPostById } = await contextTests.postsForProfileTestManager.getPostByIdForProfile(
                contextTests.posts_for_profile.createdUser1Posts[0]!.postId,
                HTTP_STATUSES.OK_200
            )
            // Сравниваем поля которые мы отправляли на обновление - с теми которые вернул сервер по GET запросу!
            expect(getPostById.title).toEqual(postData.title);
            expect(getPostById.content).toEqual(postData.content);

            // Отправляем GET запрос на получение второго поста и ожидаем в ответ статус код 200!
            const { response } = await contextTests.postsForProfileTestManager.getPostByIdForProfile(
                contextTests.posts_for_profile.createdUser2Posts[0]!.postId,
                HTTP_STATUSES.OK_200
            )
            // Сравниваем поля ответа сервера с вторым постом и убеждаемся, что второй пост не обновился!
            expect(response.body).toEqual(
                expect.objectContaining(contextTests.posts_for_profile.createdUser2Posts[0])
            )
        })
        it(`DELETE - Ожидается статус код 200, - Должен удалить оба поста! Дополнительные запросы: -> GET`, async () => {
            // Отправляем DELETE запрос на удаление первого поста и ожидаем статус код 200 (OK)!
            await contextTests.postsForProfileTestManager.deletePostForProfile(
                contextTests.posts_for_profile.createdUser1Posts[0]!.postId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // Отправляем GET запрос по удаленному postId, что бы убедится, что его не существует, ожидаем статус код 404 (NOT_FOUND)!
            await contextTests.postsForProfileTestManager.getPostByIdForProfile(
                contextTests.posts_for_profile.createdUser1Posts[0]!.postId,
                HTTP_STATUSES.NOT_FOUND_404
            )
            // Отправляем DELETE запрос на удаление второго поста и ожидаем статус код 200 (OK)!
            await contextTests.postsForProfileTestManager.deletePostForProfile(
                contextTests.posts_for_profile.createdUser2Posts[0]!.postId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // Отправляем GET запрос по удаленному postId, что бы убедится, что его не существует, ожидаем статус код 404 (NOT_FOUND)!
            await contextTests.postsForProfileTestManager.getPostByIdForProfile(
                contextTests.posts_for_profile.createdUser2Posts[0]!.postId,
                HTTP_STATUSES.NOT_FOUND_404
            )
            // Отправляем GET запрос на получение всех постов, ожидем статус код 200 (OK)!
            const { response } = await contextTests.postsForProfileTestManager.getAllPostsForProfile(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем полученный результат, должен быть пустой массив!
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
    })
}