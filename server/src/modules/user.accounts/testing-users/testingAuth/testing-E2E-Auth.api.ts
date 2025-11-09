import { delay } from "rxjs"
import { HTTP_STATUSES } from "src/shared/utils/utils"
import { contextTests } from "test/contextTests"
import { authTestManager } from "test/managersTests/authTestManager"
import { usersTestManager } from "test/managersTests/usersTestManager"

export const authE2eTest = () => {
    describe('E2E-AUTH', () => {
        it('POST   - Ожидается статус код 204, - Успешная регистрация пользователя!', async () => {
            await authTestManager.registration(
                {
                    login: contextTests.correctUserName1,
                    password: contextTests.correctUserPassword1,
                    email: contextTests.correctUserEmail1
                },
                HTTP_STATUSES.NO_CONTENT_204
            )
        })
        it('POST   - Ожидается статус код 400, - Если указаный логин уже занят во время ругистрации!', async () => {
            await authTestManager.registration(
                {
                    login: contextTests.correctUserName1,
                    password: contextTests.correctUserPassword1,
                    email: contextTests.correctUserEmail1
                },
                HTTP_STATUSES.BAD_REQUEST_400
            )
        })
        // it('POST   - Ожидается статус код 200, - Если авторизация прошла успешно!', async () => {
        //     const authData = {
        //         loginOrEmail: contextTests.correctUserName1,
        //         password: contextTests.correctUserPassword1
        //     }
        //     const { accessToken, refreshToken, response } = await authTestManager.login(
        //         authData,
        //         contextTests.userAgent[0],
        //         HTTP_STATUSES.OK_200
        //     )
        //     contextTests.accessTokenUser1Device1 = accessToken
        //     expect(accessToken).toBeDefined()
        //     expect(typeof accessToken).toBe('string')
        //     contextTests.refreshTokenUser1Device1 = refreshToken
        //     expect(refreshToken).toBeDefined()
        //     expect(typeof refreshToken).toBe('string')

        //     if (response.status === HTTP_STATUSES.OK_200) {
        //         contextTests.total_number_of_active_sessions_in_tests++
        //     }
        // })
        // it('POST   - Ожидается статус код 200, - При повторной авторизации с этого же устройства!', async () => {
        //     const { accessToken, refreshToken } = await authTestManager.login(
        //         {
        //             loginOrEmail: contextTests.correctUserName1,
        //             password: contextTests.correctUserPassword1
        //         },
        //         contextTests.userAgent[0],
        //         HTTP_STATUSES.OK_200
        //     )
        //     contextTests.accessTokenUser1Device1 = accessToken
        //     expect(accessToken).toBeDefined()
        //     expect(typeof accessToken).toBe('string')
        //     contextTests.refreshTokenUser1Device1 = refreshToken
        //     expect(refreshToken).toBeDefined()
        //     expect(typeof refreshToken).toBe('string')
        // })
        // it('GET    - Ожидается статус код 200, - Возвращает информацию о пользователе, затем уже запрашавает пользователя! Дополнительные запросы: -> GET', async () => {
        //     const { userInfo } = await authTestManager.getUserInfo(
        //         contextTests.accessTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     const { getUsersById } = await usersTestManager.getUserById(
        //         userInfo.userId,
        //         HTTP_STATUSES.OK_200
        //     )
        //     contextTests.createdUser1 = getUsersById
        // })
        // it('POST   - Ожидается статус код 200, - Выдаёт новую пару access и refresh tokens, заносит старый refreshToken в черный список!', async () => {
        //     const { response, refresh } = await authTestManager.refreshToken(
        //         contextTests.accessTokenUser1Device1,
        //         contextTests.refreshTokenUser1Device1,
        //         HTTP_STATUSES.OK_200
        //     )
        //     contextTests.accessTokenUser1Device1 = response.body.accessToken
        //     expect(response.body.accessToken).toBeDefined()
        //     expect(typeof response.body.accessToken).toBe('string')
        //     contextTests.refreshTokenUser1Device1 = refresh
        //     expect(contextTests.refreshTokenUser1Device1).toBeDefined()
        //     expect(typeof contextTests.refreshTokenUser1Device1).toBe('string')
        // })
        // it('POST   - Ожидается статус код 204, - При logout заносит в черный список refreshToken! Дополнительные запросы: -> POST', async () => {
        //     await delay(2000)

        //     const { accessToken, refreshToken } = await authTestManager.login(
        //         {
        //             loginOrEmail: contextTests.correctUserName1,
        //             password: contextTests.correctUserPassword1,
        //         },
        //         contextTests.userAgent[0],
        //         HTTP_STATUSES.OK_200
        //     )
        //     contextTests.accessTokenUser1Device1 = accessToken
        //     contextTests.refreshTokenUser1Device1 = refreshToken

        //     expect(contextTests.accessTokenUser1Device1).toBeDefined()
        //     expect(typeof contextTests.accessTokenUser1Device1).toBe('string')
        //     expect(contextTests.refreshTokenUser1Device1).toBeDefined()
        //     expect(typeof contextTests.refreshTokenUser1Device1).toBe('string')

        //     const { status } = await authTestManager.logout(
        //         contextTests.accessTokenUser1Device1,
        //         contextTests.refreshTokenUser1Device1,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )

        //     const { response } = await authTestManager.refreshToken(
        //         contextTests.accessTokenUser1Device1,
        //         contextTests.refreshTokenUser1Device1,
        //         HTTP_STATUSES.UNAUTHORIZED_401
        //     )
        //     expect(response.body.errorsMessages[0].message).toBe('Онулирован refresh-token!')
        // })
    })
}