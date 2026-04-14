import { HTTP_STATUSES } from "src/core/utils/utils";
import { contextTests } from "test/helpers/init-settings";
import { CreateMerchandiseInputDto } from "../merchandise-dto/create-merchandise.input-dto";

export const isCreatedMerchandises = async (
    numMerchandise: number,
    merchandiseData: any,
    statusCode: number = HTTP_STATUSES.CREATED_201
) => {
    // console.log('TEST isCreatedMerchandise1: merchandiseData ', merchandiseData)
    const { image, name, price, info, brandId, typeId, shopId } = merchandiseData
    if (contextTests.merchandise.createdMerchandises[numMerchandise] === undefined || contextTests.merchandise.createdMerchandises[numMerchandise] === null) {
        const data = {
            image,
            name,
            price,
            info,
            brandId,
            typeId,
            shopId
        }
        // Отправляем POST запрос на добавление товара в магазин и ожидаем статус код 201 (CREATED)!
        const { createdMerchandise, response } = await contextTests.merchandiseTestManager.createMerchandise(
            data,
            statusCode
        )
        if (response.status === statusCode) {
            // console.log('isCreatedBlog: bodyBlog 😡', bodyBlog)
            // Добавляем в тест-сторе Blog после удачного посещения createBlogs!
            contextTests.merchandise.addMerchandiseStateTest({ numMerchandise, addMerchandise: createdMerchandise })
            return response.body;
        } else {
            return response.body;
        }
    } else {
        return null
    }
}