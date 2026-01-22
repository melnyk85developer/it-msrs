import { HTTP_STATUSES } from "src/core/utils/utils"
import { isLoginUser } from "src/modules/auth/auth-testing/testFunctionsAuth"
import { isCreatedUser } from "src/modules/user.accounts/testing-users/testFunctionsUser"
import { contextTests } from "test/helpers/init-settings"
import * as fs from 'fs';

export const photoAlbumsE2ETest = () => {
    describe('E2E-PHOTO-ALBUMS', () => {
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
        })
        it('GET    - Ожидается статус код 200, - В теле ответа ожидаем пустой массив!', async () => {
            const { response } = await contextTests.usersTestManager.getUserById(
                contextTests.users.createdUsers[0]!.id,
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST photoProfileE2ETest - response.body: ', response.body)
            expect(response.body.login).toEqual(contextTests.users.correctUserNames[0]);
            expect(response.body.email).toEqual(contextTests.users.correctUserEmails[0]);
            // Отправляем GET запрос на получение всех фотографий пользователя и ожидаем в ответ статус код 200 (OK) и пустой массив!
            const { response: res } = await contextTests.userPhotoAlbumsTestManager.getAllPhotoAlbums(
                contextTests.users.createdUsers[0]!.id,
                HTTP_STATUSES.OK_200
            )
            // Сравниваем полученный результат, должен быть пустой массив!
            expect(res.body).toEqual(expect.arrayContaining([]));
        })
        it('GET    - Ожидается статус код 404, - Запрос на не существующую картинку!', async () => {
            await contextTests.userPhotoAlbumsTestManager.getPhotoAlbumById(
                contextTests.constants.invalidId,
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`POST   - Ожидается статус код 400, - Не валидные данные для создания картинки! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                userId: '',
                files: {
                    albumCoverFile: fs.createReadStream(contextTests.constants.image1Path),
                },
                albumName: ''
            }
            // Отправляем не валидный POST запрос на регистрацию пользователя и ожидаем в ответ статус код 400 (BAD_REQUEST) !
            await contextTests.userPhotoAlbumsTestManager.createPhotoAlbum(
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.BAD_REQUEST_400
            )
            // Отправляем GET запрос на получение всех картинок, что бы убедится, что картинка с не валидными данными не добавилась в базу!
            const { response } = await contextTests.userPhotoAlbumsTestManager.getAllPhotoAlbums(
                contextTests.users.createdUsers[0]!.id,
                HTTP_STATUSES.OK_200
            )
            // Сравниваем полученный результат, должен быть пустой массив!
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
        it(`POST   - Ожидается статус код 201, - Успешное добавление картинки 1 ! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                files: {
                    albumCoverFile: fs.createReadStream(contextTests.constants.image1Path)
                },
                userId: contextTests.users.createdUsers[0]!.id,
                albumName: 'Семейный'
            }
            const { createdEntity } = await contextTests.userPhotoAlbumsTestManager.createPhotoAlbum(
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.CREATED_201
            )
            contextTests.constants.createdPhotoAlbum1 = createdEntity

            const { getEntity } = await contextTests.userPhotoAlbumsTestManager.getPhotoAlbumById(
                createdEntity.albumId,
                HTTP_STATUSES.OK_200
            )
            expect(getEntity).toEqual(
                expect.objectContaining({
                    userId: expect.any(String),
                    albumId: expect.any(String),
                    albumName: expect.any(String),
                    albumCoverName: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                })
            )
        })
        it(`POST   - Ожидается статус код 201, - Успешное добавление картинки 2 ! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                files: {
                    albumCoverFile: fs.createReadStream(contextTests.constants.image2Path)
                },
                userId: contextTests.users.createdUsers[0]!.id,
                albumName: 'Новогодний'
            }
            const { createdEntity } = await contextTests.userPhotoAlbumsTestManager.createPhotoAlbum(
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.CREATED_201
            )
            contextTests.constants.createdPhotoAlbum2 = createdEntity
            const { response } = await contextTests.userPhotoAlbumsTestManager.getAllPhotoAlbums(
                contextTests.users.createdUsers[0]!.id,
                HTTP_STATUSES.OK_200
            )
            expect(response.body.items).toEqual(
                expect.arrayContaining([
                    // expect.objectContaining(contextTests.constants.createdPhotoAlbum1),
                    expect.objectContaining(contextTests.constants.createdPhotoAlbum2)
                ]))
        })
        it(`PUT    - Ожидается статус код 400, - Не валидные данные для обновления картинки! Дополнительные запросы: -> GET`, async () => {
            // Подготавливаем не валидные данные картинки для публекации!
            const files = {
                albumCoverFile: fs.createReadStream(contextTests.constants.image1Path)
            }
            const data: any = {
                userId: '',
                // albumId: '',
                albumCoverName: '',
                albumName: 'albumName'
            }
            // Отправляем не валидный PUT запрос на обновление пользователя и ожидаем в ответ статус код 400 (BAD_REQUEST)!
            await contextTests.userPhotoAlbumsTestManager.updatePhotoAlbum(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.constants.createdPhotoAlbum1!.albumId,
                files,
                data,
                HTTP_STATUSES.BAD_REQUEST_400
            )

            // console.log('TEST: - createdPhoto1', contextTests.constants.createdPhoto1)

            // Отправляем GET запрос на получение картинки и ожидаем ответ 200 (OK) и данные пользователя!
            const { getEntity } = await contextTests.userPhotoAlbumsTestManager.getPhotoAlbumById(
                contextTests.constants.createdPhotoAlbum1!.albumId,
                HTTP_STATUSES.OK_200
            )
            // Сверяем ответ от сервера с данными и убеждаемся, что они не изменились!
            expect(getEntity).toEqual(
                expect.objectContaining({
                    userId: expect.any(String),
                    albumId: expect.any(String),
                    albumCoverName: expect.any(String),
                    albumName: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                })
            )
        })
        it(`PUT    - Ожидается статус код 404, - Обновление не существующей картинки!`, async () => {
            const files = {
                albumCoverFile: fs.createReadStream(contextTests.constants.image1Path)
            }
            // console.log('createdUsers1', contextTests.users.createdUsers[0])
            const data: any = {
                albumCoverName: contextTests.constants.createdPhotoAlbum2?.albumCoverName,
                userId: contextTests.users.createdUsers[0]!.id,
                // albumId: contextTests.constants.invalidId,
                albumName: contextTests.constants.createdPhotoAlbum2?.albumName
            }
            console.log('TEST: PUT - data', data)

            await contextTests.userPhotoAlbumsTestManager.updatePhotoAlbum(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.constants.invalidId,
                files,
                data,
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`PUT    - Ожидается статус код 204, - Обновление картинки с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            const files = {
                albumCoverFile: fs.createReadStream(contextTests.constants.image1Path)
            }
            const data: any = {
                albumCoverName: contextTests.constants.createdPhotoAlbum1?.albumCoverName,
                userId: contextTests.users.createdUsers[0]!.id,
                albumName: 'Пасха'
            }
            await contextTests.userPhotoAlbumsTestManager.updatePhotoAlbum(
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.constants.createdPhotoAlbum1!.albumId,
                files,
                data,
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getEntity } = await contextTests.userPhotoAlbumsTestManager.getPhotoAlbumById(
                contextTests.constants.createdPhotoAlbum1!.albumId,
                HTTP_STATUSES.OK_200
            )
            expect(getEntity.albumCoverName).not.toEqual(contextTests.constants.createdPhotoAlbum1?.albumCoverName);
            expect(getEntity.albumName).toEqual(data.albumName);
            expect(getEntity.albumId).toEqual(contextTests.constants.createdPhotoAlbum1?.albumId);
            expect(getEntity.userId).toEqual(contextTests.constants.createdPhotoAlbum1?.userId);
        })
        it(`DELETE - Ожидается статус код 200, - Должен удалить обе картинки! Дополнительные запросы: -> GET`, async () => {
            // Отправляем DELETE запрос на удаление первой картинки и ожидаем статус код 200 (OK)!
            await contextTests.userPhotoAlbumsTestManager.deletePhotoAlbum(
                contextTests.constants.createdPhotoAlbum1!.albumId,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // Отправляем GET запрос по удаленному userId, что бы убедится, что его не существует, ожидаем статус код 404 (NOT_FOUND)!
            await contextTests.userPhotoAlbumsTestManager.getPhotoAlbumById(
                contextTests.constants.createdPhotoAlbum1!.albumId,
                HTTP_STATUSES.NOT_FOUND_404
            )
            // Отправляем DELETE запрос на удаление второго пользователя и ожидаем статус код 200 (OK)!
            await contextTests.userPhotoAlbumsTestManager.deletePhotoAlbum(
                contextTests.constants.createdPhotoAlbum2!.albumId,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // Отправляем GET запрос по удаленному userId, что бы убедится, что его не существует, ожидаем статус код 404 (NOT_FOUND)!
            await contextTests.userPhotoAlbumsTestManager.getPhotoAlbumById(
                contextTests.constants.createdPhotoAlbum2!.albumId,
                HTTP_STATUSES.NOT_FOUND_404
            )
            // Отправляем GET запрос на получение всех пользователей, ожидем статус код 200 (OK)!
            const { response } = await contextTests.userPhotoAlbumsTestManager.getAllPhotoAlbums(
                contextTests.users.createdUsers[0]!.id,
                HTTP_STATUSES.OK_200
            )
            // Сравниваем полученный результат, должен быть пустой массив!
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
    })
}