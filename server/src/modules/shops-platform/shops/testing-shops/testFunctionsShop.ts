import { HTTP_STATUSES } from "src/core/utils/utils";
import { contextTests } from "test/helpers/init-settings";
import { isCreatedShopTypes } from "../../shop-type/testing-shop-type/testFunctionsShopTypes";

export const isCreatedShop = async (
    numShop: number,
    typeName: string,
    shopName: string,
    description: string,
    websiteUrl: string,
    statusCode: number = HTTP_STATUSES.CREATED_201
) => {
    if (contextTests.shops.createdShops[numShop] === undefined || contextTests.shops.createdShops[numShop] === null) {
        // console.log('isCreatedBlog: - contextTests.createdBlogs[num]', contextTests.createdBlogs[num])
        if (!contextTests.shopType.createdShopTypes.length) {
            const type = await isCreatedShopTypes(
                0,
                typeName,
                statusCode
            )
            // console.log('TEST isCreatedShopType1: type res1 ', type)
        }
        // Подготавливаем данные магазина для регистрации!
        const shopsData = {
            name: shopName,
            title: description,
            shopTypeId: contextTests.shopType.createdShopTypes[0]!.typeId,
            // description,
            // websiteUrl
        }
        const { createdShop, response } = await contextTests.shopTestManager.createShop(
            shopsData,
            HTTP_STATUSES.CREATED_201
        )

        if (response.status === statusCode) {
            // console.log('isCreatedBlog: bodyBlog 😡', bodyBlog)
            // Добавляем в тест-сторе Blog после удачного посещения createBlogs!
            contextTests.shops.addShopStateTest({ numShop, addShop: createdShop })
            return response.body;
        } else {
            return response.body;
        }
    } else {
        return null
    }
}