import { contextTests } from 'test/contextTests';
import { HTTP_STATUSES } from '../../../shared/utils/utils';
import { usersTestManager } from 'test/managersTests/usersTestManager';
import { authTestManager } from 'test/managersTests/authTestManager';
import { CreateUserInputDto } from '../users-api/input-dto-users/users.input-dto';

export const usersE2eTest = () => {
    describe('E2E-USERS', () => {
        it('GET    - Ожидается статус код 200, - Ожидается пустой массив пользователей!', async () => {
            const { getAllUsers } = await usersTestManager.getAllUsers(
                contextTests.userParams,
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
            await usersTestManager.getUserById(
                contextTests.invalidId,
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`POST   - Ожидается статус код 400, - Создание пользователя не валидными данными! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                login: '',
                password: '',
                email: ''
            }
            await usersTestManager.createUser(
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const { getAllUsers } = await usersTestManager.getAllUsers(
                contextTests.userParams,
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
                login: contextTests.correctUserName1,
                password: contextTests.correctUserPassword1,
                email: contextTests.correctUserEmail1
            }
            const { createdEntity } = await usersTestManager.createUser(
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.CREATED_201
            )
            contextTests.createdUser1 = createdEntity
            // console.log('TEST: contextTests.createdUser1 😡 ', contextTests.createdUser1)

            // const authData = {
            //     loginOrEmail: contextTests.correctUserEmail1,
            //     password: contextTests.correctUserPassword1
            // }
            // const { accessToken, refreshToken } = await authTestManager.login(
            //     authData,
            //     contextTests.userAgent[4],
            //     HTTP_STATUSES.OK_200
            // )
            // contextTests.accessTokenUser1Device1 = accessToken
            // contextTests.refreshTokenUser1Device1 = refreshToken

            const { getAllUsers } = await usersTestManager.getAllUsers(
                contextTests.userParams,
                HTTP_STATUSES.OK_200
            )
            expect(getAllUsers).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [contextTests.createdUser1]
                })
            );
        })
        it(`POST   - Ожидается статус код 201, - Успешное создание пользователя 2!  Дополнительные запросы: -> POST, GET`, async () => {
            const data: any = {
                login: contextTests.correctUserName2,
                password: contextTests.correctUserPassword2,
                email: contextTests.correctUserEmail2
            }
            const { createdEntity } = await usersTestManager.createUser(
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.CREATED_201
            )
            contextTests.createdUser2 = createdEntity
            // const authData = {
            //     loginOrEmail: data.email,
            //     password: data.password
            // }
            // const { accessToken } = await authTestManager.login(
            //     authData,
            //     contextTests.userAgent[6],
            //     HTTP_STATUSES.OK_200
            // )
            // contextTests.accessTokenUser2Device1 = accessToken
            const { getAllUsers } = await usersTestManager.getAllUsers(
                contextTests.userParams,
                HTTP_STATUSES.OK_200
            )
            expect(getAllUsers).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 2,
                    items: [contextTests.createdUser2, contextTests.createdUser1]
                })
            )
        })
        it(`PUT    - Ожидается статус код 400, - Обновление пользователя не валидными данными! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                login: '',
                password: '',
                email: ''
            }
            await usersTestManager.updateUser(
                contextTests.createdUser1.id,
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const { getUsersById } = await usersTestManager.getUserById(
                contextTests.createdUser1.id,
                HTTP_STATUSES.OK_200
            )
            expect(getUsersById).toEqual(
                expect.objectContaining(
                    contextTests.createdUser1
                )
            )
        })
        it(`PUT    - Ожидается статус код 404, - Обновление не существующего пользователя!`, async () => {
            const data = {
                login: contextTests.correctUserName3,
                password: contextTests.correctUserPassword3,
                email: contextTests.correctUserEmail3
            }
            await usersTestManager.updateUser(
                contextTests.invalidId,
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`PUT    - Ожидается статус код 204, - Обновление пользователя валидными исходными данными! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                login: contextTests.correctUserName2,
                password: contextTests.correctUserPassword2,
                email: contextTests.correctUserEmail2
            }
            await usersTestManager.updateUser(
                contextTests.createdUser1.id,
                data,
                contextTests.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getUsersById } = await usersTestManager.getUserById(
                contextTests.createdUser1.id,
                HTTP_STATUSES.OK_200
            )
            expect(getUsersById).toEqual(
                expect.objectContaining(
                    {
                        // id: expect.any(String),
                        login: contextTests.correctUserName2,
                        email: contextTests.correctUserEmail2,
                        // createdAt: expect.any(String),
                    },
                )
            )
            const { response } = await usersTestManager.getUserById(
                contextTests.createdUser2.id,
                HTTP_STATUSES.OK_200
            )
            expect(response.body)
                .toEqual(expect.objectContaining(
                    contextTests.createdUser2
                )
            )
        })
        it(`PUT    - Ожидается статус код 204, - Успешное удаление обоих пользователей! Дополнительные запросы: -> GET`, async () => {
            await usersTestManager.deleteUser(
                contextTests.createdUser1.id,
                contextTests.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            )
            await usersTestManager.getUserById(
                contextTests.createdUser1.id,
                HTTP_STATUSES.NOT_FOUND_404
            )
            await usersTestManager.deleteUser(
                contextTests.createdUser2.id,
                contextTests.codedAuth,
                HTTP_STATUSES.NO_CONTENT_204
            )
            await usersTestManager.getUserById(
                contextTests.createdUser2.id,
                HTTP_STATUSES.NOT_FOUND_404
            )
            const { getAllUsers } = await usersTestManager.getAllUsers(
                contextTests.userParams,
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