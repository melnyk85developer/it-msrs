import { HTTP_STATUSES } from 'src/core/utils/utils';
import { contextTests } from 'test/helpers/init-settings';
import { deleteAllData } from 'test/helpers/delete-all-data';
import { CreateUserInputDto } from '../users-dto/users.input-dto';

export const usersE2eTest = () => {
    describe('E2E-USERS', () => {
        beforeAll(async () => {
            await deleteAllData(contextTests.app);
            await contextTests.users.deleteAllUsersStateTest();
            await contextTests.sessions.clearAllSessionsStateTest();
            // console.log('TEST: -  😡')
        })
        it('GET    - Ожидается статус код 200, - Ожидается пустой массив пользователей!', async () => {
            const { getAllUsers } = await contextTests.usersTestManager.getAllUsers(
                contextTests.userParams,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.constants.codedAuth,
                HTTP_STATUSES.OK_200
            )
            expect(getAllUsers).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
            )
        })
        it('GET    - Ожидается статус код 404, - Запрос не существующего пользователя!', async () => {
            await contextTests.usersTestManager.getUserById(
                contextTests.constants.invalidId,
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`POST   - Ожидается статус код 400, - Создание пользователя не валидными данными! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                login: '',
                password: '',
                email: ''
            }
            await contextTests.usersTestManager.createUser(
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.constants.codedAuth,
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const { getAllUsers } = await contextTests.usersTestManager.getAllUsers(
                contextTests.userParams,
                contextTests.constants.codedAuth,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getAllUsers).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
            )
        })
        it(`POST   - Ожидается статус код 201, - Успешное создание пользователя 1!  Дополнительные запросы: -> POST, GET`, async () => {
            const data: CreateUserInputDto = {
                login: contextTests.users.correctUserNames[0],
                password: contextTests.users.correctUserPasswords[0],
                email: contextTests.users.correctUserEmails[0]
            }
            const { createdEntity, response } = await contextTests.usersTestManager.createUser(
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.constants.codedAuth,
                HTTP_STATUSES.CREATED_201
            )
            if (response.status === HTTP_STATUSES.CREATED_201) {
                contextTests.users.addUserStateTest({ numUser: 0, addUser: createdEntity });
                // console.log('TEST: contextTests.createdUser1 😡 ', contextTests.users.createdUsers[0])
            }
            const authData = {
                loginOrEmail: contextTests.users.correctUserEmails[0],
                password: contextTests.users.correctUserPasswords[0]
            }
            const { accessToken, refreshToken, response: res2 } = await contextTests.authTestManager.login(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                authData,
                contextTests.sessions.userAgent[4],
                HTTP_STATUSES.OK_200
            )
            if (res2.status === HTTP_STATUSES.OK_200) {
                // Добавляем в контекст тестов созданного пользователя!
                await contextTests.sessions.saveSessionStateTest({
                    numUser: 0,
                    numDevice: 0,
                    accessToken,
                    refreshToken
                });
            }
            const { getAllUsers } = await contextTests.usersTestManager.getAllUsers(
                contextTests.userParams,
                contextTests.constants.codedAuth,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getAllUsers).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [contextTests.users.createdUsers[0]]
                })
            );
        })
        it(`POST   - Ожидается статус код 201, - Успешное создание пользователя 2!  Дополнительные запросы: -> POST, GET`, async () => {
            const data: any = {
                login: contextTests.users.correctUserNames[1],
                password: contextTests.users.correctUserPasswords[1],
                email: contextTests.users.correctUserEmails[1]
            }
            const { createdEntity, response } = await contextTests.usersTestManager.createUser(
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.constants.codedAuth,
                HTTP_STATUSES.CREATED_201
            )
            if (response.status === HTTP_STATUSES.CREATED_201) {
                contextTests.users.addUserStateTest({ numUser: 1, addUser: createdEntity });
                // console.log('TEST: contextTests.createdUser1 😡 ', contextTests.users.createdUsers[0])
            }
            const authData = {
                loginOrEmail: data.email,
                password: data.password
            }
            const { accessToken, refreshToken, response: res2 } = await contextTests.authTestManager.login(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                authData,
                contextTests.sessions.userAgent[6],
                HTTP_STATUSES.OK_200
            )
            if (res2.status === HTTP_STATUSES.OK_200) {
                // Добавляем в контекст тестов созданного пользователя!
                await contextTests.sessions.saveSessionStateTest({
                    numUser: 1,
                    numDevice: 0,
                    accessToken,
                    refreshToken
                });
            }
            const { getAllUsers } = await contextTests.usersTestManager.getAllUsers(
                contextTests.userParams,
                contextTests.constants.codedAuth,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getAllUsers).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 2,
                    items: [contextTests.users.createdUsers[1], contextTests.users.createdUsers[0]]
                })
            )
        })
        it(`PUT    - Ожидается статус код 400, - Обновление пользователя не валидными данными! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                login: '',
                password: '',
                email: ''
            }
            await contextTests.usersTestManager.updateUser(
                contextTests.users.createdUsers[0]!.id,
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.constants.codedAuth,
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const { getUsersById } = await contextTests.usersTestManager.getUserById(
                contextTests.users.createdUsers[0]!.id,
                HTTP_STATUSES.OK_200
            )
            expect(getUsersById).toEqual(
                expect.objectContaining(
                    contextTests.users.createdUsers[0]
                )
            )
        })
        it(`PUT    - Ожидается статус код 404, - Обновление не существующего пользователя!`, async () => {
            const data = {
                login: contextTests.users.correctUserNames[2],
                password: contextTests.users.correctUserPasswords[2],
                email: contextTests.users.correctUserEmails[2]
            }
            await contextTests.usersTestManager.updateUser(
                contextTests.constants.invalidId,
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.constants.codedAuth,
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`PUT    - Ожидается статус код 204, - Обновление пользователя валидными исходными данными! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                avatar: null,
                login: contextTests.users.correctUserNames[2],
                password: contextTests.users.correctUserPasswords[2],
                email: contextTests.users.correctUserEmails[2]
            }
            const { response: res } = await contextTests.usersTestManager.updateUser(
                contextTests.users.createdUsers[0]!.id,
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.constants.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            )
            // if(res.status === HTTP_STATUSES.NO_CONTENT_204){
            //     contextTests.users.addUserStateTest({
            //         numUser: 0,
            //         addUser: 
            //     })
            // }
            const { getUsersById } = await contextTests.usersTestManager.getUserById(
                contextTests.users.createdUsers[0]!.id,
                HTTP_STATUSES.OK_200
            )
            expect(getUsersById).toEqual(
                expect.objectContaining(
                    {
                        id: expect.any(String),
                        login: contextTests.users.correctUserNames[2],
                        email: contextTests.users.correctUserEmails[2],
                        // createdAt: expect.any(String),
                    },
                )
            )
            const { response } = await contextTests.usersTestManager.getUserById(
                contextTests.users.createdUsers[1]!.id,
                HTTP_STATUSES.OK_200
            )
            expect(response.body)
                .toEqual(
                    expect.objectContaining(
                        contextTests.users.createdUsers[1]
                    )
                )
        })
        it(`DELETE - Ожидается статус код 204, - Успешное удаление обоих пользователей! Дополнительные запросы: -> GET`, async () => {
            await contextTests.usersTestManager.deleteUser(
                contextTests.users.createdUsers[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.constants.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            )
            await contextTests.usersTestManager.getUserById(
                contextTests.users.createdUsers[0]!.id,
                HTTP_STATUSES.NOT_FOUND_404
            )
            await contextTests.usersTestManager.deleteUser(
                contextTests.users.createdUsers[1]!.id,
                contextTests.sessions.accessTokenUser2Devices[0],
                contextTests.constants.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            )
            await contextTests.usersTestManager.getUserById(
                contextTests.users.createdUsers[1]!.id,
                HTTP_STATUSES.NOT_FOUND_404
            )
            const { getAllUsers } = await contextTests.usersTestManager.getAllUsers(
                contextTests.userParams,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.constants.codedAuth,
                HTTP_STATUSES.OK_200
            )
            expect(getAllUsers).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
            )
        })
    })
}