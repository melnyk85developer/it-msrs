import { HTTP_STATUSES } from "src/core/utils/utils"
import { isLoginUser } from "src/modules/auth/auth-testing/testFunctionsAuth"
import { isCreatedUser } from "src/modules/user-accounts/testing-users/testFunctionsUser"
import { contextTests } from "test/helpers/init-settings"
import { isCreatedShop } from "../../shops/testing-shops/testFunctionsShop"
import { isCreatedShopTypes } from "../../shop-type/testing-shop-type/testFunctionsShopTypes"
import { isCreatedMerchandiseTypes } from "./testFunctionsMerchandiseType"

export const merchandiseTypeE2ETest = () => {
    describe('E2E-MERCHANDISE-TYPE', () => {
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
        })
        it('GET    - Ожидается статус код 200, - В теле ответа ожидаем пустой массив!', async () => {
            const createdShop = await isCreatedShop(
                0,
                contextTests.shopType.correctShopTypeNames[0],
                contextTests.shops.correctShopNames[0],
                contextTests.shops.correctShopDescriptions[0],
                contextTests.users.createdUsers[0]!.id,
                HTTP_STATUSES.CREATED_201
            )
            // Отправляем GET запрос на получение всех типов магазинов и ожидаем в ответ статус код 200 (OK) и пустой массив!
            const data = {
                shopId: contextTests.shops.createdShops[0]!.shopId,
                typeId: contextTests.shops.createdShops[0]!.shopTypeId,
                brandId: contextTests.shops.createdShops[0]!.shopBrandId,
                pageNumber: 1,
                pageSize: 10,
            }

            const { response } = await contextTests.merchandiseTypesTestManager.getAllMerchandiseTypes(
                data,
                HTTP_STATUSES.OK_200
            )
            // Сравниваем полученный результат, должен быть пустой массив!
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
        it(`POST   - Ожидается статус код 400, - Не валидные данные для создания типа товара в магазине! Дополнительные запросы: -> GET`, async () => {
            const createdShop = await isCreatedShop(
                0,
                contextTests.shopType.correctShopTypeNames[0],
                contextTests.shops.correctShopNames[0],
                contextTests.shops.correctShopDescriptions[0],
                contextTests.users.createdUsers[0]!.id,
                HTTP_STATUSES.CREATED_201
            )
            // console.log('TEST merchandiseTypeE2ETest: createdShop ', createdShop)

            // Подготавливаем не валидные данные для создания типа товара магазина!
            const dataType: any = {
                name: '',
                shopId: ''
            }
            // Отправляем не валидный POST запрос на регистрацию типа товара магазина и ожидаем в ответ статус код 400 (BAD_REQUEST) !
            await contextTests.merchandiseTypesTestManager.createMerchandiseType(
                dataType,
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const data = {
                shopId: contextTests.shops.createdShops[0]!.shopId,
                typeId: contextTests.shops.createdShops[0]!.shopTypeId,
                brandId: contextTests.shops.createdShops[0]!.shopBrandId,
                pageNumber: 1,
                pageSize: 10,
            }
            // Отправляем GET запрос на получение всех типов магазинов, что бы убедится, что тип магазина с не валидными данными не создался!
            const { response } = await contextTests.merchandiseTypesTestManager.getAllMerchandiseTypes(
                data,
                HTTP_STATUSES.OK_200
            )
            // Сравниваем полученный результат, должен быть пустой массив!
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
        it(`POST   - Ожидается статус код 201, - Успешное создание типа товара магазина 1 ! Дополнительные запросы: -> GET`, async () => {
            const type = await isCreatedMerchandiseTypes(
                0,
                'Компьютеры',
                HTTP_STATUSES.CREATED_201
            )
            const data = {
                shopId: contextTests.shops.createdShops[0]!.shopId,
                typeId: contextTests.shops.createdShops[0]!.shopTypeId,
                brandId: contextTests.shops.createdShops[0]!.shopBrandId,
                pageNumber: 1,
                pageSize: 10,
            }
            // Отправляем GET запрос на получение всех типов магазинов и ожидаем статус код 200 (OK)!
            const { getEntity } = await contextTests.merchandiseTypesTestManager.getAllMerchandiseTypes(
                data,
                HTTP_STATUSES.OK_200
            )
            // Проверяем, что в теле ответа должен быть только 1 объект в массиве!
            expect(getEntity).toHaveLength(contextTests.merchandiseType.total_number_of_merchandise_types_in_tests);
            expect(getEntity).toEqual(
                expect.arrayContaining([
                    expect.objectContaining(
                        contextTests.merchandiseType.createdMerchandiseTypes[0]
                    )
                ])
            )
        })
        it(`POST   - Ожидается статус код 201, - Успешное создание типа товара магазина 2 ! Дополнительные запросы: -> GET`, async () => {
            const type = await isCreatedMerchandiseTypes(
                0,
                'Холодильники',
                HTTP_STATUSES.CREATED_201
            )
            const data = {
                shopId: contextTests.shops.createdShops[0]!.shopId,
                typeId: contextTests.shops.createdShops[0]!.shopTypeId,
                brandId: contextTests.shops.createdShops[0]!.shopBrandId,
                pageNumber: 1,
                pageSize: 10,
            }
            // console.log('merchandiseTypeE2ETest: - type', type)
            // Отправляем GET запрос на получение всех типов магазинов и ожидаем статус код 200 (OK)!
            const { getEntity } = await contextTests.merchandiseTypesTestManager.getAllMerchandiseTypes(
                data,
                HTTP_STATUSES.OK_200
            )
            expect(getEntity).toEqual(expect.arrayContaining([
                expect.objectContaining(contextTests.merchandiseType.createdMerchandiseTypes[0]),
                expect.objectContaining(contextTests.merchandiseType.createdMerchandiseTypes[1]),
            ]))
        })
        it(`PUT    - Ожидается статус код 400, - Не валидные данные для обновления типа товара магазина! Дополнительные запросы: -> GET`, async () => {
            // Подготавливаем не валидные данные типа товара магазина!
            const data: any = {
                merchandiseTypeName: '',
                shopId: ''
            }
            // Отправляем не валидный PUT запрос на обновление типа товара магазина и ожидаем в ответ статус код 400 (BAD_REQUEST)!
            await contextTests.merchandiseTypesTestManager.updateMerchandiseType(
                contextTests.merchandiseType.createdMerchandiseTypes[0]!.typeId,
                data,
                HTTP_STATUSES.BAD_REQUEST_400
            )
            // Отправляем GET запрос на получение типа товара магазина и ожидаем ответ 200 (OK) и данные типа товара магазина!
            const { getEntity } = await contextTests.merchandiseTypesTestManager.getMerchandiseTypeById(
                contextTests.merchandiseType.createdMerchandiseTypes[0]!.typeId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            // Сверяем ответ от сервера с данными и убеждаемся, что они не изменились!
            expect(getEntity).toEqual(
                expect.objectContaining({
                    merchandiseTypeName: contextTests.merchandiseType.createdMerchandiseTypes[0]!.merchandiseTypeName,
                })
            )
        })
        it(`PUT    - Ожидается статус код 404, - Обновление не существующего типа товара магазина!`, async () => {
            const data = {
                name: contextTests.merchandiseType.correctMerchandiseTypesNames[3],
                shopId: contextTests.shops.createdShops[0]!.shopId
            }
            await contextTests.merchandiseTypesTestManager.updateMerchandiseType(
                contextTests.constants.invalidId,
                data,
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`PUT    - Ожидается статус код 204, - Обновление типа товара магазина с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            const data = {
                name: 'Компьютерная техника',
                shopId: contextTests.shops.createdShops[0]!.shopId
            }
            await contextTests.merchandiseTypesTestManager.updateMerchandiseType(
                contextTests.merchandiseType.createdMerchandiseTypes[0]!.typeId,
                data,
                HTTP_STATUSES.OK_200
            )
            const { getEntity } = await contextTests.merchandiseTypesTestManager.getMerchandiseTypeById(
                contextTests.merchandiseType.createdMerchandiseTypes[0]!.typeId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            expect(getEntity.name).toEqual(data.name);

            const { response } = await contextTests.merchandiseTypesTestManager.getMerchandiseTypeById(
                contextTests.merchandiseType.createdMerchandiseTypes[1]!.typeId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            expect(response.body).toEqual(
                expect.objectContaining(
                    contextTests.merchandiseType.createdMerchandiseTypes[1]
                )
            )
        })
        it(`DELETE - Ожидается статус код 200, - Должен удалить оба типа товара магазина! Дополнительные запросы: -> GET`, async () => {
            await contextTests.merchandiseTypesTestManager.deleteMerchandiseTypes(
                contextTests.merchandiseType.createdMerchandiseTypes[0]!.typeId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            const { response: res } = await contextTests.merchandiseTypesTestManager.getMerchandiseTypeById(
                contextTests.merchandiseType.createdMerchandiseTypes[0]!.typeId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
            if (res.status === HTTP_STATUSES.NOT_FOUND_404) {
                // console.log('TEST: - res', res.status)
                contextTests.merchandiseType.deleteMerchandiseTest({
                    numMerchandiseType: 0
                })
            }
            await contextTests.merchandiseTypesTestManager.deleteMerchandiseTypes(
                contextTests.merchandiseType.createdMerchandiseTypes[1]!.typeId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            const { response: res2 } = await contextTests.merchandiseTypesTestManager.getMerchandiseTypeById(
                contextTests.merchandiseType.createdMerchandiseTypes[1]!.typeId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
            if (res2.status === HTTP_STATUSES.NOT_FOUND_404) {
                // console.log('TEST: - res2', res.status)
                contextTests.merchandiseType.deleteMerchandiseTest({
                    numMerchandiseType: 1
                })
            }
            const data = {
                shopId: contextTests.shops.createdShops[0]!.shopId,
                typeId: contextTests.shops.createdShops[0]!.shopTypeId,
                brandId: contextTests.shops.createdShops[0]!.shopBrandId,
                pageNumber: 1,
                pageSize: 10,
            }
            const { response } = await contextTests.merchandiseTypesTestManager.getAllMerchandiseTypes(
                data,
                HTTP_STATUSES.OK_200
            )
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
    })
}