import { HTTP_STATUSES } from "src/core/utils/utils";
import { contextTests } from "test/helpers/init-settings";

export const isCreatedShopTypes = async (
    numShopType: number,
    typeName: string,
    statusCode: number = HTTP_STATUSES.CREATED_201
) => {
    if (contextTests.shopType?.createdShopTypes[numShopType] === undefined || contextTests.shopType.createdShopTypes[numShopType] === null) {
        // Подготавливаем данные типа магазина для регистрации!
        const data: any = {
            typeName: typeName
        }
        // Отправляем POST запрос на регистрацию типа магазина и ожидаем статус код 201 (CREATED)!
        const { createdEntity, response } = await contextTests.shopTypesTestManager.createShopTypes(
            data,
            contextTests.sessions.accessTokenUser1Devices[0],
            statusCode
        )
        // console.log('TEST isCreatedShopType1: createdEntity res ', createdEntity)

        if (response.status === statusCode) {
            // console.log('isCreatedBlog: bodyBlog 😡', bodyBlog)
            // Добавляем в тест-сторе Blog после удачного посещения createBlogs!
            contextTests.shopType?.addShopTypesStateTest({ numShopType, addShopType: createdEntity })
            return response.body;
        } else {
            return response.body;
        }
    } else {
        return null
    }
}