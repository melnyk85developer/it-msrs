import { HTTP_STATUSES } from "src/core/utils/utils"
import { contextTests } from "test/helpers/init-settings"

export const isCreatedMerchandiseTypes = async (
    numMerchandiseType: number,
    typeName: string,
    statusCode: number = HTTP_STATUSES.CREATED_201
) => {
    if (contextTests.merchandiseType.createdMerchandiseTypes[numMerchandiseType] === undefined || contextTests.merchandiseType.createdMerchandiseTypes[numMerchandiseType] === null) {
        const dataType: any = {
            name: typeName,
            shopId: contextTests.shops.createdShops[0]!.shopId
        }
        // Отправляем POST запрос на регистрацию типа товара магазина и ожидаем в ответ статус код 201 (CREATED) !
        const { createdEntity, response } = await contextTests.merchandiseTypesTestManager.createMerchandiseType(
            dataType,
            statusCode
        )
        if (response.status === statusCode) {
            // console.log('isCreatedBlog: bodyBlog 😡', bodyBlog)
            // Добавляем в тест-сторе Blog после удачного посещения createBlogs!
            contextTests.merchandiseType.addMerchandiseStateTest({ numMerchandiseType, addMerchandiseType: createdEntity })
            return response.body;
        } else {
            return response.body;
        }
    } else {
        return null
    }
}