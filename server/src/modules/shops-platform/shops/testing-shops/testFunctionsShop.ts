import { HTTP_STATUSES } from "src/core/utils/utils";
import { contextTests } from "test/helpers/init-settings";
import { isCreatedShopTypes } from "../../shop-type/testing-shop-type/testFunctionsShopTypes";

export const isCreatedShop = async (
    numShop: number,
    shopName: string,
    userId: string,
    description?: string,
    typeName?: string,
    brandName?: string,
    statusCode: number = HTTP_STATUSES.CREATED_201
) => {
    if (contextTests.shops.createdShops[numShop] === undefined || contextTests.shops.createdShops[numShop] === null) {
        // console.log('isCreatedShop: - contextTests.createdBlogs[num]', contextTests.createdBlogs[num])
        if (typeName && !contextTests.shopType.createdShopTypes[shopName]) {
            const type = await isCreatedShopTypes(
                0,
                typeName,
                statusCode
            )
            // console.log('TEST isCreatedShopType1: type res1 ', type)
        }

        // if (!contextTests.shopType.createdShopTypes[shopName]) {
        //     const type = await isCreatedShopBrands(
        //         0,
        //         typeName,
        //         statusCode
        //     )
        //     // console.log('TEST isCreatedShopType1: type res1 ', type)
        // }
        // console.log('isCreatedShop: - contextTests.shopType.createdShopTypes', contextTests.shopType.createdShopTypes)

        const shopsData = {
            name: shopName,
            title: description,
            shopTypeId: contextTests.shopType.createdShopTypes[0]!.typeId,
            // shopBrandId: ''
        }
        const { createdShop, response } = await contextTests.shopTestManager.createShop(
            shopsData,
            contextTests.sessions.accessTokenUser1Devices[0],
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