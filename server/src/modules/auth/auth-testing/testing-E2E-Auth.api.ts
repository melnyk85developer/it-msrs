import { HTTP_STATUSES } from "src/core/utils/utils"
import { contextTests } from "test/helpers/init-settings"
import { isLoginUser } from "./testFunctionsAuth"
import { delay } from "test/helpers/delay"

export const authE2eTest = () => {
    describe('E2E-AUTH', () => {
        it('POST   - Ожидается статус код 204, - Успешная регистрация пользователя!', async () => {
            await contextTests.authTestManager.registration(
                {
                    login: contextTests.users.correctUserNames[0],
                    password: contextTests.users.correctUserPasswords[0],
                    email: contextTests.users.correctUserEmails[0]
                },
                HTTP_STATUSES.NO_CONTENT_204
            )
        })
        it('POST   - Ожидается статус код 400, - Если указаный логин уже занят во время ругистрации!', async () => {
            await contextTests.authTestManager.registration(
                {
                    login: contextTests.users.correctUserNames[0],
                    password: contextTests.users.correctUserPasswords[0],
                    email: contextTests.users.correctUserEmails[0]
                },
                HTTP_STATUSES.BAD_REQUEST_400
            )
        })
        it('POST   - Ожидается статус код 200, - Если авторизация прошла успешно!', async () => {
            const isLogin = await isLoginUser(
                0,
                0,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                contextTests.users.correctUserEmails[0],
                contextTests.users.correctUserPasswords[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
        })
        it('POST   - Ожидается статус код 200, - При повторной авторизации с этого же устройства!', async () => {
            const isLogin = await isLoginUser(
                0,
                0,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                contextTests.users.correctUserEmails[0],
                contextTests.users.correctUserPasswords[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
        })
        it('GET    - Ожидается статус код 200, - Возвращает минимальную информацию о пользователе!', async () => {
            const { id } = await contextTests.authTestManager.me(
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
        })
        it('POST   - Ожидается статус код 201, - Выдаёт новую пару access и refresh tokens, заносит старый refreshToken в черный список!, Дополнительные запросы: -> GET', async () => {
            await delay(1000)
            const beforeAccessToken = contextTests.sessions.accessTokenUser1Devices[0]
            const beforeRefreshToken = contextTests.sessions.refreshTokenUser1Devices[0]

            const { response, refresh } = await contextTests.authTestManager.refreshToken(
                beforeAccessToken,
                beforeRefreshToken,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.CREATED_201
            )
            // console.log('🔥 TEST: - response, refresh', response.body, refresh)
            await contextTests.userSessionTestManager.getAllUserSessionByUserId(
                beforeAccessToken,
                beforeRefreshToken,
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            contextTests.sessions.updateAccessRefreshTokenUsersStateTest({
                numUser: 0,
                numDevice: 0,
                accessToken: response.body.accessToken,
                refreshToken: refresh
            })
            expect(contextTests.sessions.accessTokenUser1Devices[0]).toBeDefined()
            expect(typeof contextTests.sessions.accessTokenUser1Devices[0]).toBe('string')
            expect(contextTests.sessions.refreshTokenUser1Devices[0]).toBeDefined()
            expect(typeof contextTests.sessions.refreshTokenUser1Devices[0]).toBe('string')

            const { arrSessions } = await contextTests.userSessionTestManager.getAllUserSessionByUserId(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(arrSessions.items.length).toBe(contextTests.sessions.total_count_sessions_user1)
        })
        // it('POST   - Ожидается статус код 204, - При logout заносит в черный список refreshToken! Дополнительные запросы: -> POST', async () => {
        //     const isLogin = await isLoginUser(
        //         0,
        //         0,
        //         contextTests.sessions.accessTokenUser1Devices[0],
        //         contextTests.sessions.refreshTokenUser1Devices[0],
        //         contextTests.users.correctUserEmails[0],
        //         contextTests.users.correctUserPasswords[0],
        //         contextTests.sessions.userAgent[0],
        //         HTTP_STATUSES.OK_200
        //     )
        //     const beforeAccessToken = contextTests.sessions.accessTokenUser1Devices[0]
        //     const beforeRefreshToken = contextTests.sessions.refreshTokenUser1Devices[0]

        //     const { status } = await contextTests.authTestManager.logout(
        //         beforeAccessToken,
        //         beforeRefreshToken,
        //         HTTP_STATUSES.NO_CONTENT_204
        //     )
        //     const { response } = await contextTests.authTestManager.refreshToken(
        //         beforeAccessToken,
        //         beforeRefreshToken,
        //         contextTests.sessions.userAgent[0],
        //         HTTP_STATUSES.UNAUTHORIZED_401
        //     )
        //     expect(response.body.message).toBe('Указаной сессии по deviceId не найдено!')
        //     if (status === HTTP_STATUSES.NO_CONTENT_204) {
        //         console.log('🔥TEST🔥: - status:', status);
        //         contextTests.sessions.deleteSessionStateTest(
        //             {
        //                 numUser: 0,
        //                 numDevice: 0,
        //                 accessToken: contextTests.sessions.accessTokenUser1Devices[0],
        //                 refreshToken: contextTests.sessions.refreshTokenUser1Devices[0]
        //             }
        //         )
        //     }
        // })
    })
}