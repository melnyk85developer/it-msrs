import { HTTP_STATUSES } from "src/core/utils/utils";
import { contextTests } from "test/helpers/init-settings";

export const isCreatedShopTypes = async (
    numShopType: number,
    typeName: string,
    accessToken: string,
    statusCode: number = HTTP_STATUSES.CREATED_201
) => {
    if (contextTests.shopType.createdShopTypes[numShopType] === undefined || contextTests.shopType.createdShopTypes[numShopType] === null) {
        // Подготавливаем данные типа магазина для регистрации!
        const data: any = {
            typeName: typeName
        }
        // Отправляем POST запрос на регистрацию типа магазина и ожидаем статус код 201 (CREATED)!
        const { createdEntity, response } = await contextTests.shopTypesTestManager.createShopType(
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
            contextTests.shopType.addShopTypesStateTest({ numShopType, addShopType: createdEntity })
            // Добавляем в тест-сторе Blog после удачного посещения createBlogs!
            return response.body;
        } else {
            return response.body;
        }
    } else {
        return null
    }
}