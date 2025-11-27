import { HTTP_STATUSES } from "src/core/utils/utils"
import { isLoginUser } from "src/modules/auth/auth-testing/testFunctionsAuth"
import { isCreatedUser } from "src/modules/user.accounts/testing-users/testFunctionsUser"
import { delay } from "test/helpers/delay"
import { contextTests } from "test/helpers/init-settings"

export const userSessionE2eTest = () => {
    describe('E2E-USERS-SESSIONS', () => {
        beforeAll(async () => {
            const isUser1 = await isCreatedUser(
                0,
                contextTests.users.correctUserNames[0],
                contextTests.users.correctUserEmails[0],
                contextTests.users.correctUserPasswords[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // console.log('TEST usersE2eTest - isUser1: ', isUser1)
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
            // console.log('TEST usersE2eTest - isLogin1: ', isLogin.authData.accessToken)
            const isUser2 = await isCreatedUser(
                1,
                contextTests.users.correctUserNames[1],
                contextTests.users.correctUserEmails[1],
                contextTests.users.correctUserPasswords[1],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // console.log('TEST usersE2eTest - isUser2: ', isUser2)
            const isLogin2 = await isLoginUser(
                1,
                0,
                contextTests.sessions.accessTokenUser2Devices[0],
                contextTests.sessions.refreshTokenUser2Devices[0],
                contextTests.users.correctUserEmails[1],
                contextTests.users.correctUserPasswords[1],
                contextTests.sessions.userAgent[1],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST usersE2eTest - isLogin2: ', isLogin2.authData.accessToken)
            // console.log('TEST usersE2eTest - isLogin2: ', isLogin2.authData.refreshToken)
        })
        it('POST   - Ожидается статус код 201, Должен создать в цикле 4 сессии пользователя, Дополнительные запросы: -> GET', async () => {
            const countSession = 4;
            // contextTests.accessTokenUser1Devices = []
            // contextTests.refreshTokenUser1Devices = []
            for (let i = 0; countSession > i; i++) {
                await delay(1000)
                const isLogin = await isLoginUser(
                    0,
                    i,
                    // null,
                    // null,
                    contextTests.sessions.accessTokenUser1Devices[i],
                    contextTests.sessions.refreshTokenUser1Devices[i],
                    contextTests.users.correctUserEmails[0],
                    contextTests.users.correctUserPasswords[0],
                    contextTests.sessions.userAgent[i],
                    HTTP_STATUSES.OK_200
                )
                // console.log('TEST - FOR I isLogin', i, isLogin.authData.accessToken)
            }
            // const user = await contextTests.usersRepository.findById(contextTests.createdUsers[0].id)
            const { arrSessions } = await contextTests.userSessionTestManager.getAllUserSessionByUserId(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST - arrSessions', arrSessions)
            // console.log('TEST - contextTests.sessionsUser1', contextTests.sessionsUser1)
            expect(arrSessions.length).toBe(contextTests.sessions.total_count_sessions_user1)
        })
        it('POST   - Ожидается статус код 201, - Выдаёт новую пару access и refresh tokens, заносит старый refreshToken в черный список!, Дополнительные запросы: -> GET', async () => {
            const { arrSessions: userSessions } = await contextTests.userSessionTestManager.getAllUserSessionByUserId(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST - arrSessions', userSessions)
            expect(userSessions.length).toBe(contextTests.sessions.total_count_sessions_user1)
            // console.log('TEST - accessTokenUser1Device1, refreshTokenUser1Device1', contextTests.accessTokenUser1Device1, contextTests.refreshTokenUser1Device1)
            const { response, refresh } = await contextTests.authTestManager.refreshToken(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.CREATED_201
            )
            // console.log('contextTests.accessTokenUser1Devices: - ', contextTests.sessions.accessTokenUser1Devices.length)
            // console.log('response, refresh: - ', response.body, refresh)
            await contextTests.userSessionTestManager.getAllUserSessionByUserId(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            // Обновляем в тест-сторе токены после удачного посещения refresh!
            contextTests.sessions.updateAccessRefreshTokenUsersStateTest({ numUser: 0, numDevice: 0, accessToken: response.body.accessToken, refreshToken: refresh })

            expect(contextTests.sessions.accessTokenUser1Devices[0]).toBeDefined()
            expect(typeof contextTests.sessions.accessTokenUser1Devices[0]).toBe('string')
            expect(contextTests.sessions.refreshTokenUser1Devices[0]).toBeDefined()
            expect(typeof contextTests.sessions.refreshTokenUser1Devices[0]).toBe('string')
            const { arrSessions } = await contextTests.userSessionTestManager.getAllUserSessionByUserId(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(arrSessions.length).toBe(contextTests.sessions.total_count_sessions_user1)
        })
        it('DELETE - Ожидается статус код 204, - Успешное удаление сессии пользователя!', async () => {
            const { arrSessions } = await contextTests.userSessionTestManager.getAllUserSessionByUserId(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(arrSessions.length).toBe(contextTests.sessions.total_count_sessions_user1)
            const { response: res } = await contextTests.userSessionTestManager.deleteSessionByDeviceId(
                contextTests.sessions.sessionsUser1[1].deviceId,
                contextTests.sessions.accessTokenUser1Devices[1],
                contextTests.sessions.refreshTokenUser1Devices[1],
                HTTP_STATUSES.NO_CONTENT_204
            )
            if (res.status === HTTP_STATUSES.NO_CONTENT_204) {
                // Удаляем в тест-сторе сессию и токены после удачного посещения deleteSessionByDeviceId!
                contextTests.sessions.deleteSessionStateTest({ numUser: 0, numDevice: 1, accessToken: contextTests.sessions.accessTokenUser1Devices[0], refreshToken: contextTests.sessions.refreshTokenUser1Devices[0] })
            }
            const { response } = await contextTests.userSessionTestManager.getAllUserSessionByUserId(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(response.length).toBe(contextTests.sessions.total_count_sessions_user1)
        })
        it('POST   - Ожидается статус код 204, При logout заносит в черный список refreshToken и онулирует сессию пользователя!, Дополнительные запросы: -> GET', async () => {
            const { status } = await contextTests.authTestManager.logout(
                contextTests.sessions.accessTokenUser1Devices[2],
                contextTests.sessions.refreshTokenUser1Devices[2],
                HTTP_STATUSES.NO_CONTENT_204
            )
            if (status === HTTP_STATUSES.NO_CONTENT_204) {
                // Удаляем в тест-сторе сессию и токены после удачного посещения logout!
                contextTests.sessions.deleteSessionStateTest({
                    numUser: 0,
                    numDevice: 2,
                    accessToken: contextTests.sessions.accessTokenUser1Devices[2],
                    refreshToken: contextTests.sessions.refreshTokenUser1Devices[2]
                })
            }
            const { response } = await contextTests.authTestManager.refreshToken(
                contextTests.sessions.accessTokenUser1Devices[2],
                contextTests.sessions.refreshTokenUser1Devices[2],
                contextTests.sessions.userAgent[2],
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            expect(response.body.message).toBe('⛔️ Отсутствует или некорректный refresh токен!')

            const { response: sessions } = await contextTests.userSessionTestManager.getAllUserSessionByUserId(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(sessions.length).toBe(contextTests.sessions.total_count_sessions_user1)
        })
        it(`DELETE - Должен удалить все сессии пользователя - кроме текущей! Дополнительные запросы: -> GET`, async () => {
            const { response } = await contextTests.userSessionTestManager.deleteUserSessions(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            if (response.status === HTTP_STATUSES.NO_CONTENT_204) {
                // console.log('contextTests.total_count_sessions_user1', contextTests.total_count_sessions_user1)
                
                // Удаляем в тест-сторе все сессии кроме текущей, а так же токены после удачного посещения deleteUserSessions!
                await contextTests.sessions.deleteAllSessionStateTest({
                    numUser: 0,
                    numDevice: 0,
                    accessToken: contextTests.sessions.accessTokenUser1Devices[0],
                    refreshToken: contextTests.sessions.refreshTokenUser1Devices[0]
                })
                // console.log('contextTests.total_count_sessions_user1', contextTests.total_count_sessions_user1)
            }
            const { arrSessions } = await contextTests.userSessionTestManager.getAllUserSessionByUserId(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(arrSessions.length).toBe(1)
        })
    })
}