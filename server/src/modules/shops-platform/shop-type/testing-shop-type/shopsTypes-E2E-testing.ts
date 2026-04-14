import { HTTP_STATUSES } from "src/core/utils/utils"
import { isLoginUser } from "src/modules/auth/auth-testing/testFunctionsAuth"
import { isCreatedUser } from "src/modules/user-accounts/testing-users/testFunctionsUser"
import { contextTests } from "test/helpers/init-settings"
import { isCreatedShopTypes } from "./testFunctionsShopTypes"

export const shopTypeE2ETest = () => {
    describe('E2E-SHOPS-TYPES', () => {
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
            const { response } = await contextTests.shopTypesTestManager.getShopTypes(
                contextTests.users.createdUsers[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
        it(`POST   - Ожидается статус код 400, - Не валидные данные для создания типа магазина! Дополнительные запросы: -> GET`, async () => {
            const type = await isCreatedShopTypes(
                0,
                '',
                HTTP_STATUSES.BAD_REQUEST_400
            )
            // console.log('TEST shopTypeE2ETest: type res 0', type)

            // Отправляем GET запрос на получение всех типов магазинов, что бы убедится, что тип магазина с не валидными данными не создался!
            const { response } = await contextTests.shopTypesTestManager.getShopTypes(
                contextTests.users.createdUsers[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем полученный результат, должен быть пустой массив!
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
        it(`POST   - Ожидается статус код 201, - Успешное создание типа магазина 1 ! Дополнительные запросы: -> GET`, async () => {
            const type = await isCreatedShopTypes(
                0,
                'Продукты',
                HTTP_STATUSES.CREATED_201
            )
            // console.log('TEST shopTypeE2ETest: type res 1', type)

            // Отправляем GET запрос на получение всех типов магазинов и ожидаем статус код 200 (OK)!
            const { getEntity } = await contextTests.shopTypesTestManager.getShopTypes(
                contextTests.users.createdUsers[0]!.id,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getEntity).toHaveLength(contextTests.shopType.total_number_of_shop_types_in_tests);
        })
        // it(`POST   - Ожидается статус код 201, - успешное создание типа магазина 2 ! Дополнительные запросы: -> GET`, async () => {
        //     const type = await isCreatedShopTypes(
        //         0,
        //         'Автозапчасти',
        //         HTTP_STATUSES.CREATED_201
        //     )
        //     // console.log('TEST shopTypeE2ETest: type res 2', type)

        //     // Отправляем GET запрос на получение всех типов магазинов и ожидаем статус код 200 (OK)!
        //     const { response } = await contextTests.shopTypesTestManager.getShopTypes(
        //         contextTests.users.createdUsers[0]!.id,
        //         HTTP_STATUSES.OK_200
        //     )
        //     expect(response.body).toEqual(
        //         expect.arrayContaining([
        //             expect.objectContaining(contextTests.shopType.createdShopTypes[0]),
        //             expect.objectContaining(contextTests.shopType.createdShopTypes[1]),
        //         ])
        //     )
        // })
        // it(`PUT    - Ожидается статус код 400, - Не валидные данные для обновления типа магазина! Дополнительные запросы: -> GET`, async () => {
        //     // Подготавливаем не валидные данные типа магазина!
        //     const data: any = {
        //         typeName: ''
        //     }
        //     // Отправляем не валидный PUT запрос на обновление типа магазина и ожидаем в ответ статус код 400 (BAD_REQUEST)!
        //     await contextTests.shopTypesTestManager.updateShopTypes(
        //         contextTests.shopType.createdShopTypes[0]!.typeId,
        //         data,
        //         HTTP_STATUSES.BAD_REQUEST_400
        //     )
        //     // Отправляем GET запрос на получение типа магазина и ожидаем ответ 200 (OK) и данные типа магазина!
        //     const { getEntity } = await contextTests.shopTypesTestManager.getShopTypeById(
        //         contextTests.shopType.createdShopTypes[0]!.typeId,
        //         contextTests.sessions.userAgent[0],
        //         HTTP_STATUSES.OK_200
        //     )
        //     // Сверяем ответ от сервера с данными и убеждаемся, что они не изменились!
        //     expect(getEntity).toEqual(
        //         expect.objectContaining({
        //             typeName: contextTests.shopType.createdShopTypes[0]!.typeName,
        //         })
        //     )
        // })
        // it(`PUT    - Ожидается статус код 404, - Обновление не существующего типа магазина!`, async () => {
        //     // Подготавливаем данные типа магазина!
        //     const data = {
        //         typeName: 'Компьютерная техника'
        //     }
        //     // Отправляем PUT запрос на обновление типа магазина с не существующим typeId и ожидаем в ответ 404 (NOT_FOUND)
        //     await contextTests.shopTypesTestManager.updateShopTypes(
        //         contextTests.constants.invalidId,
        //         data,
        //         HTTP_STATUSES.NOT_FOUND_404
        //     )
        // })
        // it(`PUT    - Ожидается статус код 200, - Обновление типа магазина с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
        //     // Подготавливаем данные типа магазина!
        //     const data = {
        //         typeName: 'Компьютерная техника'
        //     }
        //     // Отправляем PUT запрос на обновление типа магазина и ожидаем в ответ статус код 200!
        //     await contextTests.shopTypesTestManager.updateShopTypes(
        //         contextTests.shopType.createdShopTypes[0]!.typeId,
        //         data,
        //         HTTP_STATUSES.OK_200
        //     )
        //     // Отправляем GET запрос на получение обновленного типа магазина и ожидаем в ответ статус код 200!
        //     const { getEntity } = await contextTests.shopTypesTestManager.getShopTypeById(
        //         contextTests.shopType.createdShopTypes[0]!.typeId,
        //         contextTests.sessions.userAgent[0],
        //         HTTP_STATUSES.OK_200
        //     )
        //     // Сравниваем поля которые мы отправляли на обновление - с теми которые вернул сервер по GET запросу!
        //     expect(getEntity.typeName).toEqual(data.typeName);

        //     // Отправляем GET запрос на получение второго типа магазина и ожидаем в ответ статус код 200!
        //     const { response } = await contextTests.shopTypesTestManager.getShopTypeById(
        //         contextTests.shopType.createdShopTypes[1]!.typeId,
        //         contextTests.sessions.userAgent[0],
        //         HTTP_STATUSES.OK_200
        //     )
        //     // Сравниваем поля типа магазина с вторым пользователем и убеждаемся, что второй пользователь не обновился!
        //     expect(response.body).toEqual(
        //         expect.objectContaining(
        //             contextTests.shopType.createdShopTypes[1]
        //         )
        //     )
        // })
        // it(`DELETE - Ожидается статус код 200, - Должен удалить оба типа магазина! Дополнительные запросы: -> GET`, async () => {
        //     // Отправляем DELETE запрос на удаление первого типа магазина и ожидаем статус код 200 (OK)!
        //     await contextTests.shopTypesTestManager.deleteShopTypes(
        //         contextTests.shopType.createdShopTypes[0]!.typeId,
        //         contextTests.sessions.userAgent[0],
        //         HTTP_STATUSES.OK_200
        //     )
        //     // Отправляем GET запрос по удаленному userId, что бы убедится, что его не существует, ожидаем статус код 404 (NOT_FOUND)!
        //     const { response: res } = await contextTests.shopTypesTestManager.getShopTypeById(
        //         contextTests.shopType.createdShopTypes[0]!.typeId,
        //         contextTests.sessions.userAgent[0],
        //         HTTP_STATUSES.NOT_FOUND_404
        //     )
        //     if (res.status === HTTP_STATUSES.NOT_FOUND_404) {
        //         // console.log('TEST: - res', res.status)
        //         contextTests.shopType.deleteShopTypesStateTest({
        //             numShopType: 0
        //         })
        //     }

        //     // Отправляем DELETE запрос на удаление второго типа магазина и ожидаем статус код 200 (OK)!
        //     await contextTests.shopTypesTestManager.deleteShopTypes(
        //         contextTests.shopType.createdShopTypes[1]!.typeId,
        //         contextTests.sessions.userAgent[0],
        //         HTTP_STATUSES.OK_200
        //     )
        //     // Отправляем GET запрос по удаленному userId, что бы убедится, что его не существует, ожидаем статус код 404 (NOT_FOUND)!
        //     const { response: res2 } = await contextTests.shopTypesTestManager.getShopTypeById(
        //          contextTests.shopType.createdShopTypes[1]!.typeId,
        //         contextTests.sessions.userAgent[0],
        //         HTTP_STATUSES.NOT_FOUND_404
        //     )
        //     if (res2.status === HTTP_STATUSES.NOT_FOUND_404) {
        //         // console.log('TEST: - res2', res.status)
        //         contextTests.shopType.deleteShopTypesStateTest({
        //             numShopType: 1
        //         })
        //     }
        //     // Отправляем GET запрос на получение всех типов магазинов, ожидем статус код 200 (OK)!
        //     const { response } = await contextTests.shopTypesTestManager.getShopTypes(
        //         contextTests.users.createdUsers[0]!.id,
        //         HTTP_STATUSES.OK_200
        //     )
        //     // Сравниваем полученный результат, должен быть пустой массив!
        //     expect(response.body).toEqual(expect.arrayContaining([]));
        // })
    })
}