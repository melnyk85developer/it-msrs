import { contextTests } from "test/helpers/init-settings"
import { HTTP_STATUSES } from "src/core/utils/utils"
import { isCreatedUser } from "src/modules/user-accounts/testing-users/testFunctionsUser"
import { isLoginUser } from "src/modules/auth/auth-testing/testFunctionsAuth"
import { isCreatedShop } from "../../shops/testing-shops/testFunctionsShop"
import { isCreatedMerchandiseBrands } from "./testFunctionsMerchandiseBrands"

export const merchandiseBrandsE2ETest = () => {
    describe('E2E-MERCHANDISE-BRANDS', () => {
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
            const data = {
                searchMerchandiseBrand: ''
            }
            const { response } = await contextTests.merchandiseBrandTestManager.getMerchandiseBrands(
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
        it(`POST   - Ожидается статус код 400, - Не валидные данные для создания бренда товара магазина! Дополнительные запросы: -> GET`, async () => {
            const createdShop = await isCreatedShop(
                0,
                contextTests.shopType.correctShopTypeNames[0],
                contextTests.shopType.correctShopBrandsNames[0],
                contextTests.shops.correctShopNames[0],
                contextTests.shops.correctShopDescriptions[0],
                contextTests.users.createdUsers[0]!.id,
                HTTP_STATUSES.CREATED_201
            )
            // console.log('TEST brandsE2ETest: createdShop ?', createdShop)
            const data: any = {
                searchMerchandiseBrand: '',
                shopId: ''
            }
            await contextTests.merchandiseBrandTestManager.createMerchandiseBrand(
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const { response } = await contextTests.merchandiseBrandTestManager.getMerchandiseBrands(
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(response.body).toEqual(expect.arrayContaining([]));
        })
        it(`POST   - Ожидается статус код 201, - Успешное создание бренда 1 товара в магазине 1 ! Дополнительные запросы: -> GET`, async () => {
            const type = await isCreatedMerchandiseBrands(
                0,
                'ApplePro',
                HTTP_STATUSES.CREATED_201
            )
            const { getBrands } = await contextTests.merchandiseBrandTestManager.getMerchandiseBrands(
                {
                    merchandiseBrandName: '',
                    shopId: ''
                },
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(getBrands.items).toHaveLength(contextTests.merchandiseBrand.total_number_of_merchandise_brands_in_tests);
            expect(getBrands).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 1,
                    items: [contextTests.merchandiseBrand.createdMerchandiseBrands[0]]
                })
            )
        })
        it(`POST   - Ожидается статус код 201, - Успешное создание бренда 2 товара в магазине 2 ! Дополнительные запросы: -> GET`, async () => {
            const type = await isCreatedMerchandiseBrands(
                1,
                'ASUS',
                HTTP_STATUSES.CREATED_201
            )
            const { response } = await contextTests.merchandiseBrandTestManager.getMerchandiseBrands(
                {
                    merchandiseBrandName: '',
                    shopId: ''
                },
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(response.body.items).toHaveLength(contextTests.merchandiseBrand.total_number_of_merchandise_brands_in_tests);
            expect(response.body).toEqual(
                expect.objectContaining({
                    pagesCount: 1,
                    page: 1,
                    pageSize: 10,
                    totalCount: 2,
                    items: [contextTests.merchandiseBrand.createdMerchandiseBrands[1], contextTests.merchandiseBrand.createdMerchandiseBrands[0]]
                })
            )
        })
        it(`PUT    - Ожидается статус код 400, - Не валидные данные для обновления бренда товара в магазине! Дополнительные запросы: -> GET`, async () => {
            await contextTests.merchandiseBrandTestManager.updateMerchandiseBrand(
                contextTests.merchandiseBrand.createdMerchandiseBrands[0]!.brandId,
                {
                    merchandiseBrandName: '',
                    shopId: ''
                },
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.BAD_REQUEST_400
            )
            const { getEntity } = await contextTests.merchandiseBrandTestManager.getMerchandiseBrandById(
                contextTests.merchandiseBrand.createdMerchandiseBrands[0]!.brandId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            expect(getEntity).toEqual(
                expect.objectContaining({
                    merchandiseBrandName: contextTests.merchandiseBrand.createdMerchandiseBrands[0]!.merchandiseBrandName,
                })
            )
        })
        it(`PUT    - Ожидается статус код 404, - Обновление не существующего типа бренда магазина!`, async () => {
            const data = {
                merchandiseBrandName: 'ASUS',
                shopId: contextTests.shops.createdShops[0]!.shopId
            }
            await contextTests.merchandiseBrandTestManager.updateMerchandiseBrand(
                contextTests.constants.invalidId,
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
        })
        it(`PUT    - Ожидается статус код 204, - Обновление бренда товара в магазине с правильными исходными данными! Дополнительные запросы: -> GET`, async () => {
            const data = {
                merchandiseBrandName: 'LENOWO',
                shopId: contextTests.shops.createdShops[0]!.shopId
            }
            await contextTests.merchandiseBrandTestManager.updateMerchandiseBrand(
                contextTests.merchandiseBrand.createdMerchandiseBrands[0]!.brandId,
                data,
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { getEntity } = await contextTests.merchandiseBrandTestManager.getMerchandiseBrandById(
                contextTests.merchandiseBrand.createdMerchandiseBrands[0]!.brandId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.OK_200
            )
            expect(getEntity.merchandiseBrandName).toEqual(data.merchandiseBrandName);
        })
        it(`DELETE - Ожидается статус код 200, - Должен удалить оба бренда товара в магазине! Дополнительные запросы: -> GET`, async () => {
            await contextTests.merchandiseBrandTestManager.deleteMerchandiseBrand(
                contextTests.merchandiseBrand.createdMerchandiseBrands[0]!.brandId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { response: res } = await contextTests.merchandiseBrandTestManager.getMerchandiseBrandById(
                contextTests.merchandiseBrand.createdMerchandiseBrands[0]!.brandId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
            if (res.status === HTTP_STATUSES.NOT_FOUND_404) {
                // console.log('TEST: - res', res.status)
                contextTests.merchandiseBrand.deleteMerchandiseBrandStateTest({
                    numMerchandiseBrand: 0
                })
            }
            await contextTests.merchandiseBrandTestManager.deleteMerchandiseBrand(
                contextTests.merchandiseBrand.createdMerchandiseBrands[1]!.brandId,
                contextTests.sessions.accessTokenUser1Devices[0],
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NO_CONTENT_204
            )
            const { response: res2 } = await contextTests.merchandiseBrandTestManager.getMerchandiseBrandById(
                contextTests.merchandiseBrand.createdMerchandiseBrands[1]!.brandId,
                contextTests.sessions.userAgent[0],
                HTTP_STATUSES.NOT_FOUND_404
            )
            if (res2.status === HTTP_STATUSES.NOT_FOUND_404) {
                // console.log('TEST: - res2', res.status)
                contextTests.merchandiseBrand.deleteMerchandiseBrandStateTest({
                    numMerchandiseBrand: 1
                })
            }
            const { response } = await contextTests.merchandiseBrandTestManager.getMerchandiseBrands(
                {},
                contextTests.sessions.accessTokenUser1Devices[0],
                HTTP_STATUSES.OK_200
            )
            expect(response.body.items).toEqual(expect.arrayContaining([]));
        })
    })
}