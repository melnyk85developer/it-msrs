import { HTTP_STATUSES } from "src/core/utils/utils"
import { contextTests } from "test/helpers/init-settings"

export const isCreatedMerchandiseBrands = async (
    numMerchandiseBrand: number,
    brandName: string,
    statusCode: number = HTTP_STATUSES.CREATED_201
) => {
    // console.log('TEST isCreatedShopBrand1: brand, statusCode ', brand, statusCode)
    if (contextTests.merchandiseBrand.createdMerchandiseBrands[numMerchandiseBrand] === undefined || contextTests.merchandiseBrand.createdMerchandiseBrands[numMerchandiseBrand] === null) {
        // Подготавливаем валидные данные для создания типа товара магазина!
        const data: any = {
            merchandiseBrandName: brandName,
            shopId: contextTests.shops.createdShops[0]!.shopId
        }
        // console.log('TEST isCreatedMerchandiseBrands: brandName', brandName)
        // console.log('TEST isCreatedShopBrand1: createdBrand res ', brand)

        // Отправляем POST запрос на регистрацию типа товара магазина и ожидаем в ответ статус код 201 (CREATED) !
        const { createdBrand, response } = await contextTests.merchandiseBrandTestManager.createMerchandiseBrand(
            data,
            contextTests.sessions.accessTokenUser1Devices[0],
            statusCode
        )
        // console.log('TEST isCreatedShopBrand1: createdBrand res ', createdBrand)

        if (response.status === statusCode) {
            // console.log('isCreatedBlog: bodyBlog 😡', bodyBlog)
            // Добавляем в тест-сторе Blog после удачного посещения createBlogs!
            contextTests.merchandiseBrand.addMerchandiseBrandStateTest({ numMerchandiseBrand, addMerchandiseBrand: createdBrand })
            return response.body;
        } else {
            return response.body;
        }
    } else {
        return null
    }
}