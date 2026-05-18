import { HTTP_STATUSES } from "src/core/utils/utils"
import { isLoginUser } from "src/modules/auth/auth-testing/testFunctionsAuth"
import { isCreatedUser } from "src/modules/user-accounts/testing-users/testFunctionsUser"
import { contextTests } from "test/helpers/init-settings"
import { isCreatedShop } from "../../shops/testing-shops/testFunctionsShop"
import { isCreatedMerchandiseTypes } from "../../merchandise-type/testing-merchandise-type/testFunctionsMerchandiseType"
import { isCreatedMerchandiseBrands } from "../../merchandise-brand/testing-merchandise-brand/testFunctionsMerchandiseBrands"
import { isCreatedMerchandises } from "../../merchandise/testing-merchandise/testFunctionsMerchandise"

export const basketMerchandiseE2ETest = () => {
    describe('E2E-BASKET-MERCHANDISE', () => {
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
                0,
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
                contextTests.users.createdUsers[0]!.userId,
                HTTP_STATUSES.CREATED_201
            )
            const dataBasket: any = {
                userId: contextTests.users.createdUsers[0]!.userId
            }
            const { getBasket, response: res1 } = await contextTests.shopBasketTestManager.getBasket(
                dataBasket,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            if (res1.status === HTTP_STATUSES.OK_200) {
                contextTests.basket.addBasketStateTest({
                    numBasket: 0,
                    addBasket: getBasket
                });
            }
            // contextTests.createBasketMerchandise = getBasket

            const dataBasketDevice: any = {
                userId: contextTests.users.createdUsers[0]!.userId,
                shopId: contextTests.shops.createdShops[0]!.shopId,
                basketId: contextTests.basket.createdBaskets[0]!.basketId
            }
            const { response } = await contextTests.shopBasketMerchandiseTestManager.getAllBasketsMerchandise(
                dataBasketDevice,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(response.body.items).toEqual([]);
        })
        it('GET    - Ожидается статус код 404, - Запрос на не существующий товар в корзине!', async () => {
            await contextTests.shopBasketMerchandiseTestManager.getBasketMerchandiseById(
                contextTests.constants.invalidId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`POST   - Ожидается статус код 401, - Попытка без авторизации добавления товара в корзину! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                merchandiseImgName: contextTests.constants.image1Path,
                merchandiseName: 'Компьютер',
                price: 500,
                rating: 0,
                quantity: 1,
                info: [{ title: 'Процессор', description: '64Гг Х-128' }],
                brandId: contextTests.merchandiseBrand.createdMerchandiseBrands[0]!.brandId,
                typeId: contextTests.merchandiseType.createdMerchandiseTypes[0]!.typeId,
                shopId: contextTests.shops.createdShops[0]!.shopId
            }
            await contextTests.shopBasketMerchandiseTestManager.createBasketMerchandise(
                data,
                contextTests.constants.invalidToken,
                HTTP_STATUSES.UNAUTHORIZED_401
            )
            const dataBasket: any = {
                userId: contextTests.users.createdUsers[0]!.userId,
                shopId: contextTests.shops.createdShops[0]!.shopId,
                basketId: contextTests.basket.createdBaskets[0]!.basketId
            }
            const { response } = await contextTests.shopBasketMerchandiseTestManager.getAllBasketsMerchandise(
                dataBasket,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем полученный результат, должен быть пустой массив!
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
        it(`POST   - Ожидается статус код 400, - Не валидные данные товара для добавления их в корзину! Дополнительные запросы: -> GET`, async () => {
            const data: any = {
                basketId: '',
                merchandiseId: '',
                merchandiseName: '',
                shopId: '',
                price: '',
                quantity: ''
            }
            await contextTests.shopBasketMerchandiseTestManager.createBasketMerchandise(
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const dataBasket: any = {
                userId: contextTests.users.createdUsers[0]!.userId,
                shopId: contextTests.shops.createdShops[0]!.shopId,
                basketId: contextTests.basket.createdBaskets[0]!.basketId
            }
            const { response } = await contextTests.shopBasketMerchandiseTestManager.getAllBasketsMerchandise(
                dataBasket,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // Сравниваем полученный результат, должен быть пустой массив!
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
        it(`POST   - Ожидается статус код 201, - Успешное добавление товара в корзину! Дополнительные запросы: -> GET`, async () => {
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
                    merchandiseImgName: contextTests.constants.image1Path,
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
            )

            const dataBasket: any = {
                userId: contextTests.users.createdUsers[0]!.userId,
                shopId: contextTests.shops.createdShops[0]!.shopId
            }
            const { createdBasket } = await contextTests.shopBasketTestManager.createBasket(
                dataBasket,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.CREATED_201
            )
            // contextTests.createdBasket1 = createdBasket;

            const data: any = {
                basketId: contextTests.basket.createdBaskets[0]!.basketId,
                merchandiseId: contextTests.merchandise.createdMerchandises[0]!.merchandiseId,
                merchandiseName: contextTests.merchandise.createdMerchandises[0]!.merchandiseName,
                merchandiseImgName: contextTests.merchandise.createdMerchandises[0]!.merchandiseImgName,
                merchandiseCoverName: contextTests.merchandise.createdMerchandises[0]!.merchandiseCoverName,
                shopId: contextTests.shops.createdShops[0]!.shopId,
                price: 500,
                quantity: 1
            }
            const { createdBasketMerchandise, response } = await contextTests.shopBasketMerchandiseTestManager.createBasketMerchandise(
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.CREATED_201
            )

            // contextTests.createBasketMerchandise = createdBasketMerchandise;
            if (response.status === HTTP_STATUSES.CREATED_201) {
                contextTests.basketMerchandise.addBasketMerchandiseStateTest(
                    {
                        numBasketMerchandise: 0,
                        addBasketMerchandise: createdBasketMerchandise
                    }
                )
            }

            const dataBasketMerchandise: any = {
                shopId: contextTests.shops.createdShops[0]!.shopId,
                basketId: contextTests.basket.createdBaskets[0]!.basketId,
            }
            const { getBasketMerchandise } = await contextTests.shopBasketMerchandiseTestManager.getAllBasketsMerchandise(
                dataBasketMerchandise,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST: - ⚙️ getBasketMerchandise', getBasketMerchandise)
            // console.log('TEST: - ⚙️ contextTests.basketMerchandise.createdBasketMerchandises[0]', contextTests.basketMerchandise.createdBasketMerchandises[0])
            expect(getBasketMerchandise.items).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    basketId: contextTests.basketMerchandise.createdBasketMerchandises[0]!.basketId,
                    basketMerchandiseId: contextTests.basketMerchandise.createdBasketMerchandises[0]!.basketMerchandiseId,
                    quantity: contextTests.basketMerchandise.createdBasketMerchandises[0]!.quantity,
                    shopId: contextTests.basketMerchandise.createdBasketMerchandises[0]!.shopId
                })
            ]))
        })
        it(`DELETE - Ожидается статус код 204, - Должен удалить товар из корзины! Дополнительные запросы: -> GET`, async () => {
            const dataBasketMerchandise: any = {
                shopId: contextTests.shops.createdShops[0]!.shopId,
                basketId: contextTests.basket.createdBaskets[0]!.basketId,
            }
            const { response: res1 } = await contextTests.shopBasketMerchandiseTestManager.deleteBasketMerchandise(
                contextTests.basketMerchandise.createdBasketMerchandises[0]!.basketMerchandiseId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            await contextTests.shopBasketMerchandiseTestManager.getBasketMerchandiseById(
                contextTests.basketMerchandise.createdBasketMerchandises[0]!.basketId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
            if (res1.status === HTTP_STATUSES.NO_CONTENT_204) {
                contextTests.basketMerchandise.deleteAllBasketMerchandisesStateTest()
                // console.log('TEST: - ⚙️ dataBasketMerchandise', dataBasketMerchandise)
            }
            const { response } = await contextTests.shopBasketMerchandiseTestManager.getAllBasketsMerchandise(
                dataBasketMerchandise,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            // console.log('TEST: - ⚙️ response.body', response.body)

            expect(response.body.items).toEqual([]);
        })
    })
}