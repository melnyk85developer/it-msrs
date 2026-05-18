import { HTTP_STATUSES } from "src/core/utils/utils"
import { isLoginUser } from "src/modules/auth/auth-testing/testFunctionsAuth"
import { isCreatedUser } from "src/modules/user-accounts/testing-users/testFunctionsUser"
import { isCreatedShopBrands } from "./testFunctionsShopBrands"
import { contextTests } from "../../../../../test/helpers/init-settings"

export const shopBrandE2ETest = () => {
    describe('E2E-SHOPS-BRANDS', () => {
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
            const { response } = await contextTests.shopBrandsTestManager.getShopBrands(
                contextTests.users.createdUsers[0]!.userId,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
        it(`POST   - Ожидается статус код 401, - Попытка без авторизации создать бренд магазина! Дополнительные запросы: -> GET, POST`, async () => {
            const type = await isCreatedShopBrands(
                0,
                'SAMSUNG',
                contextTests.constants.invalidToken,
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            // console.log('TEST shopTypeE2ETest: type res 1', type)

            // Отправляем GET запрос на получение всех типов магазинов и ожидаем статус код 200 (OK)!
            const { getEntity } = await contextTests.shopBrandsTestManager.getShopBrands(
                contextTests.users.createdUsers[0]!.userId,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST getShopTypes: getEntity', getEntity)
            // console.log('TEST getShopTypes: contextTests.shopType.total_number_of_shop_types_in_tests', contextTests.shopType.total_number_of_shop_types_in_tests)
            expect(getEntity.items.length).toEqual(contextTests.shopBrand.total_number_of_shop_brands_in_tests);
            expect(getEntity).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: [contextTests.shopBrand.createdShopBrands[0]]
                })
            );
        })
        it(`POST   - Ожидается статус код 400, - Не валидные данные для создания бренда магазина! Дополнительные запросы: -> GET`, async () => {
            const type = await isCreatedShopBrands(
                0,
                '',
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.BAD_REQUEST_400
            )
            // console.log('TEST shopTypeE2ETest: type res 0', type)

            // Отправляем GET запрос на получение всех типов магазинов, что бы убедится, что тип магазина с не валидными данными не создался!
            const { response } = await contextTests.shopBrandsTestManager.getShopBrands(
                contextTests.users.createdUsers[0]!.userId,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем полученный результат, должен быть пустой массив!
            // expect(response.body).toEqual(expect.arrayContaining([]));
            expect(response.body).toEqual(
                expect.objectContaining({
                    pagesCount: 0,
                    page: 1,
                    pageSize: 10,
                    totalCount: 0,
                    items: []
                })
            );
        })
        it(`POST   - Ожидается статус код 201, - Успешное создание бренда магазина 1 ! Дополнительные запросы: -> GET`, async () => {
            const type = await isCreatedShopBrands(
                0,
                'SAMSUNG',
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.CREATED_201
            )
            // console.log('TEST shopTypeE2ETest: type res 1', type)

            // Отправляем GET запрос на получение всех типов магазинов и ожидаем статус код 200 (OK)!
            const { getEntity } = await contextTests.shopBrandsTestManager.getShopBrands(
                contextTests.users.createdUsers[0]!.userId,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST getShopTypes: getEntity', getEntity)
            // console.log('TEST getShopTypes: contextTests.shopType.total_number_of_shop_types_in_tests', contextTests.shopType.total_number_of_shop_types_in_tests)
            expect(getEntity.items.length).toEqual(contextTests.shopBrand.total_number_of_shop_brands_in_tests);
            expect(getEntity).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [contextTests.shopBrand.createdShopBrands[0]]
                })
            );
        })
        it(`POST   - Ожидается статус код 201, - успешное создание бренда магазина 2 ! Дополнительные запросы: -> GET`, async () => {
            const type = await isCreatedShopBrands(
                1,
                'ASUS',
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.CREATED_201
            )
            // console.log('TEST shopTypeE2ETest: type res 2', type)

            // Отправляем GET запрос на получение всех типов магазинов и ожидаем статус код 200 (OK)!
            const { response } = await contextTests.shopBrandsTestManager.getShopBrands(
                contextTests.users.createdUsers[0]!.userId,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST getShopTypes: contextTests.shopType.total_number_of_shop_types_in_tests', contextTests.shopType.total_number_of_shop_types_in_tests)
            expect(response.body.items.length).toEqual(contextTests.shopBrand.total_number_of_shop_brands_in_tests);
            expect(response.body.items).toEqual(
                expect.arrayContaining([
                    expect.objectContaining(contextTests.shopBrand.createdShopBrands[0]),
                    expect.objectContaining(contextTests.shopBrand.createdShopBrands[1]),
                ])
            )
        })
        it(`PUT    - Ожидается статус код 401, - Попытка без авторизации обновления записи бренда магазина с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            // Подготавливаем данные типа магазина!
            const data = {
                brandName: '401'
            }
            // Отправляем PUT запрос на обновление типа магазина и ожидаем в ответ статус код 200!
            await contextTests.shopBrandsTestManager.updateShopBrand(
                contextTests.shopBrand.createdShopBrands[0]!.brandId,
                data,
                contextTests.constants.invalidToken,
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            // Отправляем GET запрос на получение обновленного типа магазина и ожидаем в ответ статус код 200!
            const { getEntity } = await contextTests.shopBrandsTestManager.getShopBrandById(
                contextTests.shopBrand.createdShopBrands[0]!.brandId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем поля которые мы отправляли на обновление - с теми которые вернул сервер по GET запросу!
            expect(getEntity.brandName).toEqual(contextTests.shopBrand.createdShopBrands[0]!.brandName);

            // Отправляем GET запрос на получение второго типа магазина и ожидаем в ответ статус код 200!
            const { response } = await contextTests.shopBrandsTestManager.getShopBrandById(
                contextTests.shopBrand.createdShopBrands[1]!.brandId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем поля типа магазина с вторым пользователем и убеждаемся, что второй пользователь не обновился!
            expect(response.body).toEqual(
                expect.objectContaining(
                    contextTests.shopBrand.createdShopBrands[1]
                )
            )
        })
        it(`PUT    - Ожидается статус код 400, - Не валидные данные для обновления бренда магазина! Дополнительные запросы: -> GET`, async () => {
            // Подготавливаем не валидные данные типа магазина!
            const data: any = {
                brandName: ''
            }
            // Отправляем не валидный PUT запрос на обновление типа магазина и ожидаем в ответ статус код 400 (BAD_REQUEST)!
            await contextTests.shopBrandsTestManager.updateShopBrand(
                contextTests.shopBrand.createdShopBrands[0]!.brandId,
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.BAD_REQUEST_400
            )
            // Отправляем GET запрос на получение типа магазина и ожидаем ответ 200 (OK) и данные типа магазина!
            const { getEntity } = await contextTests.shopBrandsTestManager.getShopBrandById(
                contextTests.shopBrand.createdShopBrands[0]!.brandId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            // Сверяем ответ от сервера с данными и убеждаемся, что они не изменились!
            expect(getEntity).toEqual(
                expect.objectContaining({
                    brandName: contextTests.shopBrand.createdShopBrands[0]!.brandName,
                })
            )
        })
        it(`PUT    - Ожидается статус код 404, - Обновление не существующего бренда магазина!`, async () => {
            // Подготавливаем данные типа магазина!
            const data = {
                brandName: 'Компьютерная техника'
            }
            // Отправляем PUT запрос на обновление типа магазина с не существующим typeId и ожидаем в ответ 404 (NOT_FOUND)
            await contextTests.shopBrandsTestManager.updateShopBrand(
                contextTests.constants.invalidId,
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`PUT    - Ожидается статус код 403, - Попытка обновления чужой записи бренда магазина с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            // Подготавливаем данные типа магазина!
            const data = {
                brandName: '403'
            }
            // Отправляем PUT запрос на обновление типа магазина и ожидаем в ответ статус код 200!
            await contextTests.shopBrandsTestManager.updateShopBrand(
                contextTests.shopBrand.createdShopBrands[0]!.brandId,
                data,
                contextTests.sessions.accessTokenUser2Devices[0],
                HTTP_STATUSES.FORBIDDEN_403
            )
            // Отправляем GET запрос на получение обновленного типа магазина и ожидаем в ответ статус код 200!
            const { getEntity } = await contextTests.shopBrandsTestManager.getShopBrandById(
                contextTests.shopBrand.createdShopBrands[0]!.brandId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем поля которые мы отправляли на обновление - с теми которые вернул сервер по GET запросу!
            expect(getEntity.brandName).toEqual(contextTests.shopBrand.createdShopBrands[0]!.brandName);

            // Отправляем GET запрос на получение второго типа магазина и ожидаем в ответ статус код 200!
            const { response } = await contextTests.shopBrandsTestManager.getShopBrandById(
                contextTests.shopBrand.createdShopBrands[1]!.brandId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем поля типа магазина с вторым пользователем и убеждаемся, что второй пользователь не обновился!
            expect(response.body).toEqual(
                expect.objectContaining(
                    contextTests.shopBrand.createdShopBrands[1]
                )
            )
        })
        it(`PUT    - Ожидается статус код 204, - Обновление бренда магазина с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            // Подготавливаем данные типа магазина!
            const data = {
                brandName: 'Компьютерная техника'
            }
            // Отправляем PUT запрос на обновление типа магазина и ожидаем в ответ статус код 200!
            const { response: res } = await contextTests.shopBrandsTestManager.updateShopBrand(
                contextTests.shopBrand.createdShopBrands[0]!.brandId,
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // Отправляем GET запрос на получение обновленного типа магазина и ожидаем в ответ статус код 200!
            const { getEntity, response: res2 } = await contextTests.shopBrandsTestManager.getShopBrandById(
                contextTests.shopBrand.createdShopBrands[0]!.brandId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем поля которые мы отправляли на обновление - с теми которые вернул сервер по GET запросу!
            expect(getEntity.brandName).toEqual(data.brandName);
            if (res.status === HTTP_STATUSES.NO_CONTENT_204 && res2.status === HTTP_STATUSES.OK_200) {
                // console.log('TEST: - res', res.status)
                contextTests.shopBrand.updateShopBrandsStateTest({
                    numShopBrand: 0,
                    updateShopBrand: getEntity
                })
            }
            // Отправляем GET запрос на получение второго типа магазина и ожидаем в ответ статус код 200!
            const { response } = await contextTests.shopBrandsTestManager.getShopBrandById(
                contextTests.shopBrand.createdShopBrands[1]!.brandId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем поля типа магазина с вторым пользователем и убеждаемся, что второй пользователь не обновился!
            expect(response.body).toEqual(
                expect.objectContaining(
                    contextTests.shopBrand.createdShopBrands[1]
                )
            )
        })
        it(`DELETE - Ожидается статус код 401, - Попытка без авторизации удалить оба бренда магазина! Дополнительные запросы: -> GET`, async () => {
            // Отправляем DELETE запрос на удаление первого типа магазина и ожидаем статус код 200 (OK)!
            await contextTests.shopBrandsTestManager.deleteShopBrand(
                contextTests.shopBrand.createdShopBrands[0]!.brandId,
                contextTests.constants.invalidToken,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            // Отправляем GET запрос по удаленному userId, что бы убедится, что его не существует, ожидаем статус код 404 (NOT_FOUND)!
            const { response: res } = await contextTests.shopBrandsTestManager.getShopBrandById(
                contextTests.shopBrand.createdShopBrands[0]!.brandId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            expect(res.body).toEqual(
                expect.objectContaining(
                    contextTests.shopBrand.createdShopBrands[0]
                )
            )
            // Отправляем GET запрос на получение всех типов магазинов, ожидем статус код 200 (OK)!
            const { response } = await contextTests.shopBrandsTestManager.getShopBrands(
                contextTests.users.createdUsers[0]!.userId,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(response.body.items).toHaveLength(contextTests.shopBrand.total_number_of_shop_brands_in_tests);
        })
        it(`DELETE - Ожидается статус код 403, - Попытка удалить чужой бренд магазина! Дополнительные запросы: -> GET`, async () => {
            // Отправляем DELETE запрос на удаление первого типа магазина и ожидаем статус код 200 (OK)!
            await contextTests.shopBrandsTestManager.deleteShopBrand(
                contextTests.shopBrand.createdShopBrands[0]!.brandId,
                contextTests.sessions.accessTokenUser2Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.FORBIDDEN_403
            )
            // Отправляем GET запрос по удаленному userId, что бы убедится, что его не существует, ожидаем статус код 404 (NOT_FOUND)!
            const { response: res } = await contextTests.shopBrandsTestManager.getShopBrandById(
                contextTests.shopBrand.createdShopBrands[0]!.brandId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            expect(res.body).toEqual(
                expect.objectContaining(
                    contextTests.shopBrand.createdShopBrands[0]
                )
            )
            // Отправляем GET запрос на получение всех типов магазинов, ожидем статус код 200 (OK)!
            const { response } = await contextTests.shopBrandsTestManager.getShopBrands(
                contextTests.users.createdUsers[0]!.userId,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(response.body.items).toHaveLength(contextTests.shopBrand.total_number_of_shop_brands_in_tests);
        })
        it(`DELETE - Ожидается статус код 401, - Попытка удалить не существующий бренд магазина! Дополнительные запросы: -> GET`, async () => {
            // Отправляем DELETE запрос на удаление первого типа магазина и ожидаем статус код 200 (OK)!
            await contextTests.shopBrandsTestManager.deleteShopBrand(
                contextTests.constants.invalidId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
            // Отправляем GET запрос по удаленному userId, что бы убедится, что его не существует, ожидаем статус код 404 (NOT_FOUND)!
            const { response: res } = await contextTests.shopBrandsTestManager.getShopBrandById(
                contextTests.shopBrand.createdShopBrands[0]!.brandId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            expect(res.body).toEqual(
                expect.objectContaining(
                    contextTests.shopBrand.createdShopBrands[0]
                )
            )
            // Отправляем GET запрос на получение всех типов магазинов, ожидем статус код 200 (OK)!
            const { response } = await contextTests.shopBrandsTestManager.getShopBrands(
                contextTests.users.createdUsers[0]!.userId,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(response.body.items).toHaveLength(contextTests.shopBrand.total_number_of_shop_brands_in_tests);
        })
        it(`DELETE - Ожидается статус код 204, - Должен удалить оба бренда магазина! Дополнительные запросы: -> GET`, async () => {
            // Отправляем DELETE запрос на удаление первого типа магазина и ожидаем статус код 200 (OK)!
            await contextTests.shopBrandsTestManager.deleteShopBrand(
                contextTests.shopBrand.createdShopBrands[0]!.brandId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // Отправляем GET запрос по удаленному userId, что бы убедится, что его не существует, ожидаем статус код 404 (NOT_FOUND)!
            const { response: res } = await contextTests.shopBrandsTestManager.getShopBrandById(
                contextTests.shopBrand.createdShopBrands[0]!.brandId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
            if (res.status === HTTP_STATUSES.NOT_FOUND_404) {
                // console.log('TEST: - res', res.status)
                contextTests.shopBrand.deleteShopBrandsStateTest({
                    numShopBrand: 0
                })
            }

            // Отправляем DELETE запрос на удаление второго типа магазина и ожидаем статус код 200 (OK)!
            await contextTests.shopBrandsTestManager.deleteShopBrand(
                contextTests.shopBrand.createdShopBrands[1]!.brandId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            // Отправляем GET запрос по удаленному userId, что бы убедится, что его не существует, ожидаем статус код 404 (NOT_FOUND)!
            const { response: res2 } = await contextTests.shopBrandsTestManager.getShopBrandById(
                contextTests.shopBrand.createdShopBrands[1]!.brandId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
            if (res2.status === HTTP_STATUSES.NOT_FOUND_404) {
                // console.log('TEST: - res2', res.status)
                contextTests.shopBrand.deleteShopBrandsStateTest({
                    numShopBrand: 1
                })
            }
            // Отправляем GET запрос на получение всех типов магазинов, ожидем статус код 200 (OK)!
            const { response } = await contextTests.shopBrandsTestManager.getShopBrands(
                contextTests.users.createdUsers[0]!.userId,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем полученный результат, должен быть пустой массив!
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
    })
}