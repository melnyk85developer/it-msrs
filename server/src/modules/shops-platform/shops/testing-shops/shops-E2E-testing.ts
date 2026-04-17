import { HTTP_STATUSES } from "src/core/utils/utils"
import { isLoginUser } from "src/modules/auth/auth-testing/testFunctionsAuth"
import { isCreatedUser } from "src/modules/user-accounts/testing-users/testFunctionsUser"
import { contextTests } from "test/helpers/init-settings"
import { isCreatedShop } from "./testFunctionsShop"
import { isCreatedShopTypes } from "../../shop-type/testing-shop-type/testFunctionsShopTypes"
import { CreateMyShopsInputDto } from "../shops-dto/create-shops-input-dto"
import { UpdateMyShopsInputDto } from "../shops-dto/update-shops.input-dto"

export const shopsE2ETest = () => {
    describe('E2E-SHOPS', () => {
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
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.refreshTokenUser1Devices[0],
                contextTests.users.correctUserEmails[0],
                contextTests.users.correctUserPasswords[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
        })
        it('GET    - Ожидается статус код 200, - В теле ответа ожидаем пустой массив!', async () => {
            const { response } = await contextTests.shopTestManager.getShops(
                contextTests.users.createdUsers[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
        it('GET    - Ожидается статус код 404, - Запрос на не существующий магазин!', async () => {
            await contextTests.shopTestManager.getShopById(
                contextTests.constants.invalidId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`POST   - Ожидается статус код 400, - Не валидные данные для создания магазина! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                name: '',
                title: '',
                userId: '',
                shopTypeId: ''
            }
            await contextTests.shopTestManager.createShop(
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const { response } = await contextTests.shopTestManager.getShops(
                contextTests.users.createdUsers[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
        it(`POST   - Ожидается статус код 401, - Попытка без авторизации создать магазин! Дополнительные запросы: -> GET, POST`, async () => {
            const createdShop = await isCreatedShop(
                0,
                contextTests.constants.invalidToken,
                contextTests.shopType.correctShopTypeNames[0],
                contextTests.shopType.correctShopBrandsNames[0],
                contextTests.shops.correctShopNames[0],
                contextTests.shops.correctShopDescriptions[0],
                contextTests.users.createdUsers[0]!.id,
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            // console.log('TEST shopsE2ETest: createdShop ', createdShop)

            const { getEntity } = await contextTests.shopTestManager.getShops(
                contextTests.users.createdUsers[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST shopsE2ETest: getShops ', getEntity)

            // Проверяем, что в теле ответа должен быть только 1 объект в массиве!
            expect(getEntity.items).toHaveLength(contextTests.shops.total_number_of_shops_in_tests);
            // Сравниваем, что бы вернувшийся ответ совпадал с нашими регистрационными данными!
            expect(getEntity.items).toEqual([])
        })
        it(`POST   - Ожидается статус код 201, - Успешное создание магазина 1 ! Дополнительные запросы: -> GET`, async () => {
            const createdShop = await isCreatedShop(
                0,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.shopType.correctShopTypeNames[0],
                contextTests.shopType.correctShopBrandsNames[0],
                contextTests.shops.correctShopNames[0],
                contextTests.shops.correctShopDescriptions[0],
                contextTests.users.createdUsers[0]!.id,
                HTTP_STATUSES.CREATED_201
            )
            // console.log('TEST shopsE2ETest: createdShop ', createdShop)

            const { getEntity } = await contextTests.shopTestManager.getShops(
                contextTests.users.createdUsers[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST shopsE2ETest: getShops ', getEntity)

            // Проверяем, что в теле ответа должен быть только 1 объект в массиве!
            expect(getEntity.items).toHaveLength(contextTests.shops.total_number_of_shops_in_tests);
            // Сравниваем, что бы вернувшийся ответ совпадал с нашими регистрационными данными!
            expect(getEntity.items).toEqual([
                expect.objectContaining(contextTests.shops.createdShops[0])
            ])
        })
        it(`POST   - Ожидается статус код 201, - успешное создание магазина 2 ! Дополнительные запросы: -> GET`, async () => {
            const type = await isCreatedShopTypes(
                1,
                contextTests.shopType.correctShopTypeNames[3],
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.CREATED_201
            )
            // console.log('TEST shopTypeE2ETest - type res2: ', type.typeId)
            const createdShop = await isCreatedShop(
                1,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.shopType.correctShopTypeNames[1],
                contextTests.shopType.correctShopBrandsNames[1],
                contextTests.shops.correctShopNames[1],
                contextTests.shops.correctShopDescriptions[1],
                contextTests.users.createdUsers[0]!.id,
                HTTP_STATUSES.CREATED_201
            )
            // console.log('TEST shopsE2ETest: createdShop ', createdShop)

            // Отправляем GET запрос на получение всех магазинов и ожидаем статус код 200 (OK)!
            const { response, getEntity } = await contextTests.shopTestManager.getShops(
                contextTests.users.createdUsers[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST shopE2ETest - getEntity: ', getEntity)
            expect(getEntity.items).toHaveLength(contextTests.shops.total_number_of_shops_in_tests);
            expect(getEntity).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 2,
                    items: [contextTests.shops.createdShops[1], contextTests.shops.createdShops[0]]
                })
            )
        })
        it(`PUT    - Ожидается статус код 401, - Попытка обновления магазина без авторизации с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            // Подготавливаем данные магазина для обновления!
            const data: UpdateMyShopsInputDto = {
                name: 'Автомаркет',
                title: 'Широкий выбор качественных запчастей от производителя!',
                // userId: contextTests.users.createdUsers[0]!.id,
                shopTypeId: contextTests.shopType.createdShopTypes[0]!.typeId
            }
            // Отправляем PUT запрос на обновление магазина и ожидаем в ответ статус код 200!
            await contextTests.shopTestManager.updateShop(
                contextTests.shops.createdShops[0]!.shopId,
                data,
                contextTests.constants.invalidToken,
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            // Отправляем GET запрос на получение обновленного пользователя и ожидаем в ответ статус код 200!
            const { getEntity } = await contextTests.shopTestManager.getShopById(
                contextTests.shops.createdShops[0]!.shopId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем поля которые мы отправляли на обновление - с теми которые вернул сервер по GET запросу!
            expect(getEntity.name).toEqual(contextTests.shops.createdShops[0]!.name);
            expect(getEntity.title).toEqual(contextTests.shops.createdShops[0]!.title);
            // expect(getEntity.userId).toEqual(data.userId);
            // Отправляем GET запрос на получение второго магазина и ожидаем в ответ статус код 200!
            const { response } = await contextTests.shopTestManager.getShopById(
                contextTests.shops.createdShops[1]!.shopId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем поля магазина с вторым магазином и убеждаемся, что второй магазин не обновился!
            expect(response.body).toEqual(
                expect.objectContaining(
                    contextTests.shops.createdShops[1]
                )
            )
        })
        it(`PUT    - Ожидается статус код 400, - Не валидные данные для обновления магазина! Дополнительные запросы: -> GET`, async () => {
            // Подготавливаем не валидные данные на обновление магазина!
            const data: any = {
                name: '',
                title: '',
                userId: null,
                shopTypeId: null
            }
            // Отправляем не валидный PUT запрос на обновление магазина и ожидаем в ответ статус код 400 (BAD_REQUEST)!
            await contextTests.shopTestManager.updateShop(
                contextTests.shops.createdShops[0]!.shopId,
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.BAD_REQUEST_400
            )
            // Отправляем GET запрос на получение магазина и ожидаем ответ 200 (OK) и данные магазина!
            const { getEntity } = await contextTests.shopTestManager.getShopById(
                contextTests.shops.createdShops[0]!.shopId,
                contextTests.sessions.userAgent[1],
                HTTP_STATUSES.OK_200
            )
            // Сверяем ответ от сервера с данными и убеждаемся, что они не изменились!
            expect(getEntity).toEqual(
                expect.objectContaining({
                    userId: contextTests.shops.createdShops[0]!.userId,
                    name: contextTests.shops.createdShops[0]!.name,
                    title: contextTests.shops.createdShops[0]!.title,
                    shopTypeId: contextTests.shops.createdShops[0]!.shopTypeId,
                })
            )
        })
        it(`PUT    - Ожидается статус код 404, - Обновление не существующего магазина!`, async () => {
            // Подготавливаем не валидные данные на обновление магазина!
            const data: UpdateMyShopsInputDto = {
                name: 'Автомаркет',
                title: 'Широкий выбор качественных запчастей от производителя!',
                shopTypeId: contextTests.shopType.createdShopTypes[0]!.typeId
            }
            // Отправляем не валидный PUT запрос на обновление магазина и ожидаем в ответ статус код 400 (BAD_REQUEST)!
            await contextTests.shopTestManager.updateShop(
                contextTests.constants.invalidId,
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`PUT    - Ожидается статус код 403, - Попытка обновления чужого магазина с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            // Подготавливаем данные магазина для обновления!
            const data: UpdateMyShopsInputDto = {
                name: 'Автомаркет',
                title: 'Широкий выбор качественных запчастей от производителя!',
                // userId: contextTests.users.createdUsers[0]!.id,
                shopTypeId: contextTests.shopType.createdShopTypes[0]!.typeId
            }
            // Отправляем PUT запрос на обновление магазина и ожидаем в ответ статус код 200!
            await contextTests.shopTestManager.updateShop(
                contextTests.shops.createdShops[0]!.shopId,
                data,
                contextTests.sessions.accessTokenUser2Devices[0],
                HTTP_STATUSES.FORBIDDEN_403
            )
            // Отправляем GET запрос на получение обновленного пользователя и ожидаем в ответ статус код 200!
            const { getEntity } = await contextTests.shopTestManager.getShopById(
                contextTests.shops.createdShops[0]!.shopId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем поля которые мы отправляли на обновление - с теми которые вернул сервер по GET запросу!
            expect(getEntity.name).toEqual(contextTests.shops.createdShops[0]!.name);
            expect(getEntity.title).toEqual(contextTests.shops.createdShops[0]!.title);
            // expect(getEntity.userId).toEqual(data.userId);
            // Отправляем GET запрос на получение второго магазина и ожидаем в ответ статус код 200!
            const { response } = await contextTests.shopTestManager.getShopById(
                contextTests.shops.createdShops[1]!.shopId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем поля магазина с вторым магазином и убеждаемся, что второй магазин не обновился!
            expect(response.body).toEqual(
                expect.objectContaining(
                    contextTests.shops.createdShops[1]
                )
            )
        })
        it(`PUT    - Ожидается статус код 204, - Обновление магазина с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            // Подготавливаем данные магазина для обновления!
            const data: UpdateMyShopsInputDto = {
                name: 'Автомаркет',
                title: 'Широкий выбор качественных запчастей от производителя!',
                // userId: contextTests.users.createdUsers[0]!.id,
                shopTypeId: contextTests.shopType.createdShopTypes[0]!.typeId
            }
            // Отправляем PUT запрос на обновление магазина и ожидаем в ответ статус код 200!
            const { response: res } = await contextTests.shopTestManager.updateShop(
                contextTests.shops.createdShops[0]!.shopId,
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // Отправляем GET запрос на получение обновленного пользователя и ожидаем в ответ статус код 200!
            const { getEntity, response: res2 } = await contextTests.shopTestManager.getShopById(
                contextTests.shops.createdShops[0]!.shopId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем поля которые мы отправляли на обновление - с теми которые вернул сервер по GET запросу!
            expect(getEntity.name).toEqual(data.name);
            expect(getEntity.title).toEqual(data.title);

            if (res.status === HTTP_STATUSES.NO_CONTENT_204 && res2.status === HTTP_STATUSES.OK_200) {
                contextTests.shops.updateShopStateTest({
                    numShop: 0,
                    updateShop: getEntity
                })
            }

            // expect(getEntity.userId).toEqual(data.userId);
            // Отправляем GET запрос на получение второго магазина и ожидаем в ответ статус код 200!
            const { response } = await contextTests.shopTestManager.getShopById(
                contextTests.shops.createdShops[1]!.shopId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем поля магазина с вторым магазином и убеждаемся, что второй магазин не обновился!
            expect(response.body).toEqual(
                expect.objectContaining(
                    contextTests.shops.createdShops[1]
                )
            )
        })
        it(`DELETE - Ожидается статус код 401, - Попытка удаления магазина без авторизации! Дополнительные запросы: -> GET`, async () => {
            // Отправляем DELETE запрос на удаление первого магазина и ожидаем статус код 200 (OK)!
            await contextTests.shopTestManager.deleteShop(
                contextTests.shops.createdShops[0]!.shopId,
                contextTests.constants.invalidToken,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            // Отправляем GET запрос по удаленному shopId, что бы убедится, что его не существует, ожидаем статус код 404 (NOT_FOUND)!
            const { response: res } = await contextTests.shopTestManager.getShopById(
                contextTests.shops.createdShops[0]!.shopId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            expect(res.body).toEqual(expect.objectContaining(contextTests.shops.createdShops[0]))
            // Отправляем GET запрос на получение всех магазинов, ожидем статус код 200 (OK)!
            const { response } = await contextTests.shopTestManager.getShops(
                contextTests.users.createdUsers[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем полученный результат, должен быть пустой массив!
            expect(response.body.items).toHaveLength(contextTests.shops.total_number_of_shops_in_tests);
        })
        it(`DELETE - Ожидается статус код 403, - Попытка удаления чужого магазина! Дополнительные запросы: -> GET`, async () => {
            // Отправляем DELETE запрос на удаление первого магазина и ожидаем статус код 200 (OK)!
            await contextTests.shopTestManager.deleteShop(
                contextTests.shops.createdShops[0]!.shopId,
                contextTests.sessions.accessTokenUser2Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.FORBIDDEN_403
            )
            // Отправляем GET запрос по удаленному shopId, что бы убедится, что его не существует, ожидаем статус код 404 (NOT_FOUND)!
            const { response: res } = await contextTests.shopTestManager.getShopById(
                contextTests.shops.createdShops[0]!.shopId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            expect(res.body).toEqual(expect.objectContaining(contextTests.shops.createdShops[0]))
            // Отправляем GET запрос на получение всех магазинов, ожидем статус код 200 (OK)!
            const { response } = await contextTests.shopTestManager.getShops(
                contextTests.users.createdUsers[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем полученный результат, должен быть пустой массив!
            expect(response.body.items).toHaveLength(contextTests.shops.total_number_of_shops_in_tests);
        })
        it(`DELETE - Ожидается статус код 404, - Попытка удаления не существующего магазина! Дополнительные запросы: -> GET`, async () => {
            // Отправляем DELETE запрос на удаление первого магазина и ожидаем статус код 200 (OK)!
            await contextTests.shopTestManager.deleteShop(
                contextTests.constants.invalidId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
            // Отправляем GET запрос по удаленному shopId, что бы убедится, что его не существует, ожидаем статус код 404 (NOT_FOUND)!
            const { response: res } = await contextTests.shopTestManager.getShopById(
                contextTests.shops.createdShops[0]!.shopId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            expect(res.body).toEqual(expect.objectContaining(contextTests.shops.createdShops[0]))
            // Отправляем GET запрос на получение всех магазинов, ожидем статус код 200 (OK)!
            const { response } = await contextTests.shopTestManager.getShops(
                contextTests.users.createdUsers[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем полученный результат, должен быть пустой массив!
            expect(response.body.items).toHaveLength(contextTests.shops.total_number_of_shops_in_tests);
        })
        it(`DELETE - Ожидается статус код 204, - Должен удалить оба магазина! Дополнительные запросы: -> GET`, async () => {
            // Отправляем DELETE запрос на удаление первого магазина и ожидаем статус код 200 (OK)!
            await contextTests.shopTestManager.deleteShop(
                contextTests.shops.createdShops[0]!.shopId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // Отправляем GET запрос по удаленному shopId, что бы убедится, что его не существует, ожидаем статус код 404 (NOT_FOUND)!
            const { response: res } = await contextTests.shopTestManager.getShopById(
                contextTests.shops.createdShops[0]!.shopId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
            if (res.status === HTTP_STATUSES.NOT_FOUND_404) {
                // console.log('TEST: - res', res.status)
                contextTests.shops.deleteShopStateTest({
                    numShop: 0
                })
            }
            // Отправляем DELETE запрос на удаление второго магазина и ожидаем статус код 200 (OK)!
            await contextTests.shopTestManager.deleteShop(
                contextTests.shops.createdShops[1]!.shopId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // Отправляем GET запрос по удаленному shopId, что бы убедится, что его не существует, ожидаем статус код 404 (NOT_FOUND)!
            const { response: res2 } = await contextTests.shopTestManager.getShopById(
                contextTests.shops.createdShops[1]!.shopId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
            if (res2.status === HTTP_STATUSES.NOT_FOUND_404) {
                // console.log('TEST: - res2', res.status)
                contextTests.shops.deleteShopStateTest({
                    numShop: 1
                })
            }
            // Отправляем GET запрос на получение всех магазинов, ожидем статус код 200 (OK)!
            const { response } = await contextTests.shopTestManager.getShops(
                contextTests.users.createdUsers[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем полученный результат, должен быть пустой массив!
            expect(response.body.items).toHaveLength(contextTests.shops.total_number_of_shops_in_tests);
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
    })
}