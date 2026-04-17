import { HTTP_STATUSES } from "src/core/utils/utils"
import { isLoginUser } from "src/modules/auth/auth-testing/testFunctionsAuth"
import { isCreatedUser } from "src/modules/user-accounts/testing-users/testFunctionsUser"
import { contextTests } from "test/helpers/init-settings"
import { isCreatedShop } from "../../shops/testing-shops/testFunctionsShop"

export const basketE2ETest = () => {
    describe('E2E-BASKET-SHOP', () => {
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
                contextTests.sessions.accessTokenUser2Devices[0],
                contextTests.sessions.refreshTokenUser2Devices[0],
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
            // console.log('TEST basketE2ETest: createdShop ', createdShop)
            // Подготавливаем данные корзины для регистрации!
            const dataBasket: any = {
                userId: contextTests.users.createdUsers[0]!.id,
                shopId: contextTests.shops.createdShops[0]!.shopId
            }
            // Отправляем GET запрос на получение всех корзин и ожидаем в ответ статус код 200 (OK) и пустой массив!
            const { response } = await contextTests.shopBasketTestManager.getBasket(
                dataBasket,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST basketE2ETest: response ', response.body)
            // Сравниваем полученный результат, должен быть пустой массив!
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
        it('GET    - Ожидается статус код 404, - Запрос на не существующую корзину!', async () => {
            await contextTests.shopBasketTestManager.getBasketById(
                contextTests.constants.invalidId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`POST   - Ожидается статус код 400, - Не валидные данные для создания корзины! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                userId: '',
                // shopId: ''
            }
            await contextTests.shopBasketTestManager.createBasket(
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const dataBasket: any = {
                userId: contextTests.users.createdUsers[0]!.id,
                shopId: contextTests.shops.createdShops[0]!.shopId
            }
            const { response } = await contextTests.shopBasketTestManager.getBasket(
                dataBasket,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
        it(`POST   - Ожидается статус код 201, - Успешное создание корзины! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                userId: contextTests.users.createdUsers[1]!.id,
                // shopId: contextTests.shops.createdShops[0]!.shopId
            }
            const { createdBasket } = await contextTests.shopBasketTestManager.createBasket(
                data,
                contextTests.sessions.accessTokenUser2Devices[0],
                HTTP_STATUSES.CREATED_201
            )
            contextTests.basket.addBasketStateTest({
                numBasket: 0,
                addBasket: createdBasket
            });
            const dataBasket: any = {
                userId: contextTests.users.createdUsers[0]!.id,
                // shopId: contextTests.shops.createdShops[0]!.shopId
            }
            const { getBasket } = await contextTests.shopBasketTestManager.getBasket(
                dataBasket,
                contextTests.sessions.accessTokenUser2Devices[0],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST basketE2ETest: getBasket ', getBasket)

            expect(getBasket).toEqual(expect.objectContaining({
                userId: contextTests.users.createdUsers[1]!.id,
                basketId: contextTests.basket.createdBaskets[0]!.basketId,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }))
        })
        it(`DELETE - Ожидается статус код 204, - Должен удалить корзину! Дополнительные запросы: -> GET`, async () => {
            const dataBasket: any = {
                userId: contextTests.users.createdUsers[0]!.id,
                // shopId: contextTests.shops.createdShops[0]!.shopId
            }
            await contextTests.shopBasketTestManager.deleteBasket(
                contextTests.basket.createdBaskets[0]!.basketId,
                contextTests.sessions.accessTokenUser2Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { response: res } = await contextTests.shopBasketTestManager.getBasketById(
                contextTests.basket.createdBaskets[0]!.basketId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
            if (res.status === HTTP_STATUSES.NOT_FOUND_404) {
                contextTests.basket.deleteBasketStateTest({
                    numBasket: 0
                })
            }
            const { response } = await contextTests.shopBasketTestManager.getBasket(
                dataBasket,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST basketE2ETest: getBasket ', response.body)
            expect(response.body.userId).toEqual(contextTests.users.createdUsers[0]!.id);
        })
    })
}