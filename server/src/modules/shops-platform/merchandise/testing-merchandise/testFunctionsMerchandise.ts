import { HTTP_STATUSES } from "src/core/utils/utils";
import { contextTests } from "test/helpers/init-settings";
import { CreateMerchandiseInputDto } from "../merchandise-dto/create-merchandise.input-dto";

export const isCreatedMerchandises = async (
    numMerchandise: number,
    merchandiseData: any,
    accessToken: string,
    statusCode: number = HTTP_STATUSES.CREATED_201
) => {
    // console.log('TEST isCreatedMerchandise1: merchandiseData ', merchandiseData)
    // console.log('TEST isCreatedMerchandise1: contextTests.merchandise.createdMerchandises[numMerchandise] ', contextTests.merchandise.createdMerchandises[numMerchandise])
    const { image, merchandiseName, price, rating, quantity, info, brandId, typeId, shopId } = merchandiseData
    if (contextTests.merchandise.createdMerchandises[numMerchandise] === undefined || contextTests.merchandise.createdMerchandises[numMerchandise] === null) {
        const data = {
            // image,
            merchandiseName,
            price,
            rating,
            quantity,
            info,
            brandId,
            typeId,
            shopId
        }
        // Отправляем POST запрос на добавление товара в магазин и ожидаем статус код 201 (CREATED)!
        const { createdMerchandise, response } = await contextTests.merchandiseTestManager.createMerchandise(
            data,
            accessToken,
            statusCode
        )
        // console.log('isCreatedMerchandises: response.status 😡', response.status)
        // console.log('isCreatedMerchandises: createdMerchandise 😡', createdMerchandise)

        if (response.status === HTTP_STATUSES.CREATED_201) {
            // console.log('isCreatedMerchandises: createdMerchandise 😡', createdMerchandise)
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