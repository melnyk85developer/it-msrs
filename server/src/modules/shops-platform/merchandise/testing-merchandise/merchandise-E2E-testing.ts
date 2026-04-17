import { contextTests } from "test/helpers/init-settings"
import { isCreatedMerchandises } from "./testFunctionsMerchandise"
import { isCreatedUser } from "src/modules/user-accounts/testing-users/testFunctionsUser"
import { HTTP_STATUSES } from "src/core/utils/utils"
import { isLoginUser } from "src/modules/auth/auth-testing/testFunctionsAuth"
import { isCreatedShop } from "../../shops/testing-shops/testFunctionsShop"
import { CreateMerchandiseInputDto } from "../merchandise-dto/create-merchandise.input-dto"
import { isCreatedMerchandiseTypes } from "../../merchandise-type/testing-merchandise-type/testFunctionsMerchandiseType"
import { isCreatedMerchandiseBrands } from "../../merchandise-brand/testing-merchandise-brand/testFunctionsMerchandiseBrands"

export const merchandiseE2ETest = () => {
    describe('E2E-MERCHANDISE', () => {
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
                contextTests.users.correctUserEmails[1],
                contextTests.users.correctUserPasswords[1],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
        })
        it('GET    - Ожидается статус код 200, - В теле ответа ожидаем пустой массив!', async () => {
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
            // Отправляем GET запрос на получение всех магазинов и ожидаем статус код 200 (OK)!
            const { getEntity } = await contextTests.shopTestManager.getShops(
                contextTests.users.createdUsers[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // Проверяем, что в теле ответа должен быть только 1 объект в массиве!
            expect(getEntity.items).toHaveLength(1);
            // Сравниваем, что бы вернувшийся ответ совпадал с нашими регистрационными данными!
            expect(getEntity).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [contextTests.shops.createdShops[0]]
                })
            )
            const dataDevice = {
                shopId: contextTests.shops.createdShops[0]!.shopId,
                userId: contextTests.shops.createdShops[0]!.userId,
                brandId: null,
                pageSize: 9,
                page: 1
            }
            // Отправляем GET запрос на получение всех товаров и ожидаем в ответ статус код 200 (OK) и пустой массив!
            const { response } = await contextTests.merchandiseTestManager.getMerchandise(
                dataDevice,
                HTTP_STATUSES.OK_200
            )
            // Сравниваем полученный результат, должен быть пустой массив!
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
        it('GET    - Ожидается статус код 404, - Запрос на не существующий товар!', async () => {
            // Отправляем GET запрос на получение пользователя с не существующим userId, ожидаем статус код 404 (NOT_FOUND)!
            await contextTests.merchandiseTestManager.getMerchandiseById(
                contextTests.constants.invalidId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`POST   - Ожидается статус код 400, - Не валидные данные для добавления товара! Дополнительные запросы: -> GET`, async () => {
            // Подготавливаем не валидные данные товара!
            const data: any = {
                // merchandiseFile: '',
                merchandiseName: '',
                price: '',
                info: [],
                rating: '',
                brandId: '',
                typeId: '',
                shopId: ''
            }
            // Отправляем не валидный POST запрос на добавление товара и ожидаем в ответ статус код 400 (BAD_REQUEST) !
            await contextTests.merchandiseTestManager.createMerchandise(
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const dataDevice = {
                shopId: contextTests.shops.createdShops[0]!.shopId,
                userId: contextTests.shops.createdShops[0]!.userId,
                brandId: null,
                pageSize: 9,
                page: 1
            }
            // Отправляем GET запрос на получение всех товаров, что бы убедится, что товар с не валидными данными не зарегистрировался!
            const { response } = await contextTests.merchandiseTestManager.getMerchandise(
                dataDevice,
                HTTP_STATUSES.OK_200
            )
            // Сравниваем полученный результат, должен быть пустой массив!
            expect(response.body).toEqual(expect.arrayContaining([]))
        })
        it(`POST   - Ожидается статус код 201, - Успешное добавление товара 1 в магазин ! Дополнительные запросы: -> GET`, async () => {
            const type = await isCreatedMerchandiseTypes(
                0,
                'Компьютерная техника',
                HTTP_STATUSES.CREATED_201
            )
            // console.log('merchandiseE2ETest: isType', isType)
            const isBrand = await isCreatedMerchandiseBrands(
                0,
                'ApplePro',
                HTTP_STATUSES.CREATED_201
            )
            // console.log('merchandiseE2ETest: isBrand', isBrand)
            const merchandise = await isCreatedMerchandises(
                0,
                {
                    image: contextTests.constants.image1Path,
                    merchandiseName: 'Компьютер',
                    price: 500,
                    rating: 0,
                    quantity: 1,
                    info: [{ title: 'Процессор', description: '64Гг Х-128' }],
                    brandId: contextTests.merchandiseBrand.createdMerchandiseBrands[0]!.brandId,
                    typeId: contextTests.merchandiseType.createdMerchandiseTypes[0]!.typeId,
                    shopId: contextTests.shops.createdShops[0]!.shopId
                },
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.CREATED_201
            )
            // console.log('TEST merchandiseE2ETest - merchandise: ', merchandise)

            const dataMerchandise = {
                shopId: contextTests.shops.createdShops[0]!.shopId,
                userId: contextTests.shops.createdShops[0]!.userId,
                brandId: null,
                pageSize: 9,
                page: 1
            }
            // Отправляем GET запрос на получение всех товаров, что бы убедится, что наш товар добавился!
            const { getMerchandise } = await contextTests.merchandiseTestManager.getMerchandise(
                dataMerchandise,
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST merchandiseE2ETest - getMerchandise: ', getMerchandise)

            // // const { info: info1, ...expected1 } = contextTests.createMerchandise1;
            expect(getMerchandise.items).toHaveLength(contextTests.merchandise.total_number_of_merchandise_in_tests);
            expect(getMerchandise).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [contextTests.merchandise.createdMerchandises[0]]
                })
            )
        })
        it(`POST   - Ожидается статус код 201, - успешное добавление товара 2 в магазин ! Дополнительные запросы: -> GET`, async () => {
            const type = await isCreatedMerchandiseTypes(
                1,
                'Автомобили',
                HTTP_STATUSES.CREATED_201
            )
            // console.log('merchandiseE2ETest: isType', isType)
            const isBrand = await isCreatedMerchandiseBrands(
                1,
                'BMW',
                HTTP_STATUSES.CREATED_201
            )
            // console.log('merchandiseE2ETest: isBrand', isBrand)

            const isMerchandise = await isCreatedMerchandises(
                1,
                {
                    image: contextTests.constants.image2Path,
                    merchandiseName: 'КПП Ваз 21099',
                    price: 500,
                    rating: 0,
                    quantity: 1,
                    info: [{ title: '5 ст.', description: 'КПП' }],
                    brandId: contextTests.merchandiseBrand.createdMerchandiseBrands[1]!.brandId,
                    typeId: contextTests.merchandiseType.createdMerchandiseTypes[0]!.typeId,
                    shopId: contextTests.shops.createdShops[0]!.shopId
                },
                contextTests.sessions.accessTokenUser1Devices[0],
            )
            // console.log('merchandiseE2ETest: isMerchandise', isMerchandise)
            const dataMerchandise = {
                shopId: contextTests.shops.createdShops[0]!.shopId,
                userId: contextTests.shops.createdShops[0]!.userId,
                brandId: null,
                pageSize: 9,
                page: 1
            }
            // Отправляем GET запрос на получение всех товаров, что бы убедится, что наш товар добавился!
            const { getMerchandise } = await contextTests.merchandiseTestManager.getMerchandise(
                dataMerchandise,
                HTTP_STATUSES.OK_200
            )
            // console.log('merchandiseE2ETest: getMerchandise', getMerchandise)
            // Проверяем, что в теле ответа должен быть массив с двумя создаными нами пользователями!
            // const { info: info1, ...expected1 } = contextTests.createMerchandise1;
            // const { info: info2, ...expected2 } = contextTests.createMerchandise2;
            expect(getMerchandise.items).toHaveLength(contextTests.merchandise.total_number_of_merchandise_in_tests);
            expect(getMerchandise).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 2,
                    items: [contextTests.merchandise.createdMerchandises[1], contextTests.merchandise.createdMerchandises[0]]
                })
            )
        })
        it(`PUT    - Ожидается статус код 400, - Не валидные данные для обновления товара! Дополнительные запросы: -> GET`, async () => {
            // Подготавливаем не валидные данные товара!
            const data: any = {
                merchandiseImgName: '',
                merchandiseName: '',
                price: '',
                rating: 0,
                quantity: '1',
                info: null,
                brandId: '',
                typeId: '',
                shopId: ''
            }
            // Отправляем не валидный PUT запрос на обновление товара и ожидаем в ответ статус код 400 (BAD_REQUEST)!
            await contextTests.merchandiseTestManager.updateMerchandise(
                contextTests.merchandise.createdMerchandises[0]!.merchandiseId,
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.BAD_REQUEST_400
            )
            // Отправляем GET запрос на получение товара и ожидаем ответ 200 (OK) и данные товара!
            const { getEntity } = await contextTests.merchandiseTestManager.getMerchandiseById(
                contextTests.merchandise.createdMerchandises[0]!.merchandiseId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            // Сверяем ответ от сервера с данными и убеждаемся, что они не изменились!
            expect(getEntity.shopId).toEqual(contextTests.merchandise.createdMerchandises[0]!.shopId);
            expect(getEntity.merchandiseName).toEqual(contextTests.merchandise.createdMerchandises[0]!.merchandiseName);
            expect(getEntity.price).toEqual(contextTests.merchandise.createdMerchandises[0]!.price);
            expect(getEntity.brandId).toEqual(contextTests.merchandise.createdMerchandises[0]!.brandId);
            expect(getEntity.typeId).toEqual(contextTests.merchandise.createdMerchandises[0]!.typeId);
        })
        it(`PUT    - Ожидается статус код 401, - Не валидные данные для обновления товара! Дополнительные запросы: -> GET`, async () => {
            // Подготавливаем не валидные данные товара!
            const data = {
                // productId: contextTests.merchandise.createdMerchandises[0]!.productId,
                merchandiseImgName: contextTests.constants.image2Path,
                merchandiseName: 'UpdateComputer',
                price: 1000,
                rating: 0,
                quantity: 1,
                info: [{ "deviceInfoId": 1, "title": "Морозит", "description": "Лучше всех", "deviceId": 1, "shopId": 1, "createdAt": "2024-10-24T15:55:55.876Z", "updatedAt": "2024-10-24T15:55:55.876Z" }],
                brandId: contextTests.merchandiseBrand.createdMerchandiseBrands[0]!.brandId,
                typeId: contextTests.merchandiseType.createdMerchandiseTypes[0]!.typeId,
                shopId: contextTests.shops.createdShops[0]!.shopId,
            }
            // Отправляем не валидный PUT запрос на обновление товара и ожидаем в ответ статус код 400 (BAD_REQUEST)!
            await contextTests.merchandiseTestManager.updateMerchandise(
                contextTests.merchandise.createdMerchandises[0]!.merchandiseId,
                data,
                contextTests.constants.invalidToken,
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            // Отправляем GET запрос на получение товара и ожидаем ответ 200 (OK) и данные товара!
            const { getEntity } = await contextTests.merchandiseTestManager.getMerchandiseById(
                contextTests.merchandise.createdMerchandises[0]!.merchandiseId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            // Сверяем ответ от сервера с данными и убеждаемся, что они не изменились!
            expect(getEntity.shopId).toEqual(contextTests.merchandise.createdMerchandises[0]!.shopId);
            expect(getEntity.merchandiseName).toEqual(contextTests.merchandise.createdMerchandises[0]!.merchandiseName);
            expect(getEntity.price).toEqual(contextTests.merchandise.createdMerchandises[0]!.price);
            expect(getEntity.brandId).toEqual(contextTests.merchandise.createdMerchandises[0]!.brandId);
            expect(getEntity.typeId).toEqual(contextTests.merchandise.createdMerchandises[0]!.typeId);
        })
        it(`PUT    - Ожидается статус код 404, - Обновление не существующего товара!`, async () => {
            // Подготавливаем данные товара!
            const data: any = {
                // productId: contextTests.merchandise.createdMerchandises[0]!.productId,
                merchandiseImgName: contextTests.constants.image1Path,
                merchandiseName: 'UpdateComputer',
                price: 1000,
                rating: 0,
                quantity: 1,
                info: [{ "deviceInfoId": 1, "title": "Морозит", "description": "Пиздец", "deviceId": 2, "shopId": 1, "createdAt": "2024-10-24T15:55:55.876Z", "updatedAt": "2024-10-24T15:55:55.876Z" }],
                brandId: contextTests.merchandiseBrand.createdMerchandiseBrands[0]!.brandId,
                typeId: contextTests.merchandiseType.createdMerchandiseTypes[0]!.typeId,
                shopId: contextTests.shops.createdShops[0]!.shopId,
            }
            // Отправляем PUT запрос на обновление товара с не существующим deviceId и ожидаем в ответ 404 (NOT_FOUND)
            await contextTests.merchandiseTestManager.updateMerchandise(
                contextTests.constants.invalidId,
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`PUT    - Ожидается статус код 403, - Попытка обновления чужого товара! Дополнительные запросы: -> GET`, async () => {
            // Подготавливаем не валидные данные товара!
            const data = {
                // productId: contextTests.merchandise.createdMerchandises[0]!.productId,
                merchandiseImgName: contextTests.constants.image2Path,
                merchandiseName: 'UpdateComputer',
                price: 1000,
                rating: 0,
                quantity: 1,
                info: [{ "deviceInfoId": 1, "title": "Морозит", "description": "Лучше всех", "deviceId": 1, "shopId": 1, "createdAt": "2024-10-24T15:55:55.876Z", "updatedAt": "2024-10-24T15:55:55.876Z" }],
                brandId: contextTests.merchandiseBrand.createdMerchandiseBrands[0]!.brandId,
                typeId: contextTests.merchandiseType.createdMerchandiseTypes[0]!.typeId,
                shopId: contextTests.shops.createdShops[0]!.shopId,
            }
            // Отправляем не валидный PUT запрос на обновление товара и ожидаем в ответ статус код 400 (BAD_REQUEST)!
            await contextTests.merchandiseTestManager.updateMerchandise(
                contextTests.merchandise.createdMerchandises[0]!.merchandiseId,
                data,
                contextTests.sessions.accessTokenUser2Devices[0],
                HTTP_STATUSES.FORBIDDEN_403
            )
            // Отправляем GET запрос на получение товара и ожидаем ответ 200 (OK) и данные товара!
            const { getEntity } = await contextTests.merchandiseTestManager.getMerchandiseById(
                contextTests.merchandise.createdMerchandises[0]!.merchandiseId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            // Сверяем ответ от сервера с данными и убеждаемся, что они не изменились!
            expect(getEntity.shopId).toEqual(contextTests.merchandise.createdMerchandises[0]!.shopId);
            expect(getEntity.merchandiseName).toEqual(contextTests.merchandise.createdMerchandises[0]!.merchandiseName);
            expect(getEntity.price).toEqual(contextTests.merchandise.createdMerchandises[0]!.price);
            expect(getEntity.brandId).toEqual(contextTests.merchandise.createdMerchandises[0]!.brandId);
            expect(getEntity.typeId).toEqual(contextTests.merchandise.createdMerchandises[0]!.typeId);
        })
        it(`PUT    - Ожидается статус код 204, - Обновление товара с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            // Подготавливаем данные товара!
            const data = {
                // productId: contextTests.merchandise.createdMerchandises[0]!.productId,
                merchandiseImgName: contextTests.constants.image2Path,
                merchandiseName: 'UpdateComputer',
                price: 1000,
                rating: 0,
                quantity: 1,
                info: [{ "deviceInfoId": 1, "title": "Морозит", "description": "Лучше всех", "deviceId": 1, "shopId": 1, "createdAt": "2024-10-24T15:55:55.876Z", "updatedAt": "2024-10-24T15:55:55.876Z" }],
                brandId: contextTests.merchandiseBrand.createdMerchandiseBrands[0]!.brandId,
                typeId: contextTests.merchandiseType.createdMerchandiseTypes[0]!.typeId,
                shopId: contextTests.shops.createdShops[0]!.shopId,
            }
            // Отправляем PUT запрос на обновление товара и ожидаем в ответ статус код 200!
            const { response: res } = await contextTests.merchandiseTestManager.updateMerchandise(
                contextTests.merchandise.createdMerchandises[0]!.merchandiseId,
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // Отправляем GET запрос на получение обновленного товара и ожидаем в ответ статус код 200!
            const { getEntity, response: res2 } = await contextTests.merchandiseTestManager.getMerchandiseById(
                contextTests.merchandise.createdMerchandises[0]!.merchandiseId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем поля которые мы отправляли на обновление - с теми которые вернул сервер по GET запросу!
            expect(getEntity.merchandiseName).toEqual(data.merchandiseName);
            expect(getEntity.price).toEqual(data.price);
            // expect(getEntity.info).toEqual(expect.objectContaining(data.info));
            expect(getEntity.brandId).toEqual(data.brandId);
            expect(getEntity.typeId).toEqual(data.typeId);
            expect(getEntity.shopId).toEqual(data.shopId);
            if (res.status === HTTP_STATUSES.NO_CONTENT_204 && res2.status === HTTP_STATUSES.OK_200) {
                // console.log('TEST: - res', res.status)
                contextTests.merchandise.updateMerchandiseStateTest({
                    numMerchandise: 0,
                    updateMerchandise: getEntity
                })
            }
            // Отправляем GET запрос на получение второго товара и ожидаем в ответ статус код 200!
            const { response } = await contextTests.merchandiseTestManager.getMerchandiseById(
                contextTests.merchandise.createdMerchandises[1]!.merchandiseId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем поля товара которые прислал сервер со вторым товаром и убеждаемся, что второй товар не обновился!
            expect(response.body.merchandiseId).toEqual(contextTests.merchandise.createdMerchandises[1]!.merchandiseId);
            expect(response.body.merchandiseName).toEqual(contextTests.merchandise.createdMerchandises[1]!.merchandiseName);
            expect(response.body.price).toEqual(contextTests.merchandise.createdMerchandises[1]!.price);
            // expect(getEntity.info).toEqual(expect.objectContaining(data.info));
            expect(response.body.brandId).toEqual(contextTests.merchandise.createdMerchandises[1]!.brandId);
            expect(response.body.typeId).toEqual(contextTests.merchandise.createdMerchandises[1]!.typeId);
            expect(response.body.shopId).toEqual(contextTests.merchandise.createdMerchandises[1]!.shopId);
        })
        it(`DELETE - Ожидается статус код 401, - Попытка удаления товара без авторизации! Дополнительные запросы: -> GET`, async () => {
            const merchandise = {
                shopId: contextTests.shops.createdShops[0]!.shopId,
                userId: contextTests.shops.createdShops[0]!.userId,
                brandId: null,
                pageSize: 9,
                page: 1
            }
            // Отправляем DELETE запрос на удаление первого пользователя и ожидаем статус код 200 (OK)!
            await contextTests.merchandiseTestManager.deleteMerchandise(
                contextTests.merchandise.createdMerchandises[0]!.merchandiseId,
                contextTests.constants.invalidToken,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            // Отправляем GET запрос по удаленному userId, что бы убедится, что его не существует, ожидаем статус код 404 (NOT_FOUND)!
            const { response: res } = await contextTests.merchandiseTestManager.getMerchandiseById(
                contextTests.merchandise.createdMerchandises[0]!.merchandiseId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            expect(res.body).toEqual(
                expect.objectContaining(
                    contextTests.merchandise.createdMerchandises[0]
                )
            )
            // Отправляем GET запрос на получение всех пользователей, ожидем статус код 200 (OK)!
            const { response } = await contextTests.merchandiseTestManager.getMerchandise(
                merchandise,
                HTTP_STATUSES.OK_200
            )
            expect(response.body.items).toHaveLength(contextTests.merchandise.total_number_of_merchandise_in_tests);
        })
        it(`DELETE - Ожидается статус код 403, - Попытка удаления чужого товара! Дополнительные запросы: -> GET`, async () => {
            const merchandise = {
                shopId: contextTests.shops.createdShops[0]!.shopId,
                userId: contextTests.shops.createdShops[0]!.userId,
                brandId: null,
                pageSize: 9,
                page: 1
            }
            // Отправляем DELETE запрос на удаление первого пользователя и ожидаем статус код 200 (OK)!
            await contextTests.merchandiseTestManager.deleteMerchandise(
                contextTests.merchandise.createdMerchandises[0]!.merchandiseId,
                contextTests.sessions.accessTokenUser2Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.FORBIDDEN_403
            )
            // Отправляем GET запрос по удаленному userId, что бы убедится, что его не существует, ожидаем статус код 404 (NOT_FOUND)!
            const { response: res } = await contextTests.merchandiseTestManager.getMerchandiseById(
                contextTests.merchandise.createdMerchandises[0]!.merchandiseId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            expect(res.body).toEqual(
                expect.objectContaining(
                    contextTests.merchandise.createdMerchandises[0]
                )
            )
            // Отправляем GET запрос на получение всех пользователей, ожидем статус код 200 (OK)!
            const { response } = await contextTests.merchandiseTestManager.getMerchandise(
                merchandise,
                HTTP_STATUSES.OK_200
            )
            expect(response.body.items).toHaveLength(contextTests.merchandise.total_number_of_merchandise_in_tests);
        })
        it(`DELETE - Ожидается статус код 404, - Попытка удаления не существующего товара! Дополнительные запросы: -> GET`, async () => {
            const merchandise = {
                shopId: contextTests.shops.createdShops[0]!.shopId,
                userId: contextTests.shops.createdShops[0]!.userId,
                brandId: null,
                pageSize: 9,
                page: 1
            }
            // Отправляем DELETE запрос на удаление первого пользователя и ожидаем статус код 200 (OK)!
            await contextTests.merchandiseTestManager.deleteMerchandise(
                contextTests.constants.invalidId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
            // Отправляем GET запрос по удаленному userId, что бы убедится, что его не существует, ожидаем статус код 404 (NOT_FOUND)!
            const { response: res } = await contextTests.merchandiseTestManager.getMerchandiseById(
                contextTests.merchandise.createdMerchandises[0]!.merchandiseId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            expect(res.body).toEqual(
                expect.objectContaining(
                    contextTests.merchandise.createdMerchandises[0]
                )
            )
            // Отправляем GET запрос на получение всех пользователей, ожидем статус код 200 (OK)!
            const { response } = await contextTests.merchandiseTestManager.getMerchandise(
                merchandise,
                HTTP_STATUSES.OK_200
            )
            expect(response.body.items).toHaveLength(contextTests.merchandise.total_number_of_merchandise_in_tests);
        })
        it(`DELETE - Ожидается статус код 204, - Должен удалить оба товара! Дополнительные запросы: -> GET`, async () => {
            const merchandise = {
                shopId: contextTests.shops.createdShops[0]!.shopId,
                userId: contextTests.shops.createdShops[0]!.userId,
                brandId: null,
                pageSize: 9,
                page: 1
            }
            // Отправляем DELETE запрос на удаление первого пользователя и ожидаем статус код 200 (OK)!
            await contextTests.merchandiseTestManager.deleteMerchandise(
                contextTests.merchandise.createdMerchandises[0]!.merchandiseId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // Отправляем GET запрос по удаленному userId, что бы убедится, что его не существует, ожидаем статус код 404 (NOT_FOUND)!
            const { response: res } = await contextTests.merchandiseTestManager.getMerchandiseById(
                contextTests.merchandise.createdMerchandises[0]!.merchandiseId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
            if (res.status === HTTP_STATUSES.NOT_FOUND_404) {
                contextTests.merchandise.deleteMerchandiseStateTest({
                    numMerchandise: 0
                })
            }
            // Отправляем DELETE запрос на удаление второго пользователя и ожидаем статус код 200 (OK)!
            await contextTests.merchandiseTestManager.deleteMerchandise(
                contextTests.merchandise.createdMerchandises[1]!.merchandiseId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // Отправляем GET запрос по удаленному userId, что бы убедится, что его не существует, ожидаем статус код 404 (NOT_FOUND)!
            const { response: res2 } = await contextTests.merchandiseTestManager.getMerchandiseById(
                contextTests.merchandise.createdMerchandises[1]!.merchandiseId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
            if (res2.status === HTTP_STATUSES.NOT_FOUND_404) {
                contextTests.merchandise.deleteMerchandiseStateTest({
                    numMerchandise: 1
                })
            }
            // Отправляем GET запрос на получение всех пользователей, ожидем статус код 200 (OK)!
            const { response } = await contextTests.merchandiseTestManager.getMerchandise(
                merchandise,
                HTTP_STATUSES.OK_200
            )
            // Сравниваем полученный результат, должен быть пустой массив!
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
    })
}