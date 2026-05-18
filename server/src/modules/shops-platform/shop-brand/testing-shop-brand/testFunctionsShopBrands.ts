import { HTTP_STATUSES } from "src/core/utils/utils";
import { contextTests } from "../../../../../test/helpers/init-settings";

export const isCreatedShopBrands = async (
    numShopBrand: number,
    brandName: string,
    accessToken: string,
    statusCode: number = HTTP_STATUSES.CREATED_201
) => {
    if (contextTests.shopBrand.createdShopBrands[numShopBrand] === undefined || contextTests.shopBrand.createdShopBrands[numShopBrand] === null) {
        // Подготавливаем данные типа магазина для регистрации!
        const data: any = {
            brandName: brandName
        }
        // Отправляем POST запрос на регистрацию типа магазина и ожидаем статус код 201 (CREATED)!
        const { createdEntity, response } = await contextTests.shopBrandsTestManager.createShopBrands(
            data,
            accessToken,
            statusCode
        )
        // console.log('TEST isCreatedShopTypes: createdEntity res ', createdEntity)
        // console.log('TEST isCreatedShopTypes: statusCode ', statusCode)
        // console.log('TEST isCreatedShopTypes: createdEntity response.status ', response.status)

        if (response.status === HTTP_STATUSES.CREATED_201) {
            // console.log('isCreatedShopTypes: statusCode 😡', statusCode)
            // console.log('TEST isCreatedShopTypes: createdEntity res ', createdEntity)
            contextTests.shopBrand.addShopBrandsStateTest({ numShopBrand, addShopBrand: createdEntity })
            // Добавляем в тест-сторе Blog после удачного посещения createBlogs!
            return response.body;
        } else {
            return response.body;
        }
    } else {
        return null
    }
}