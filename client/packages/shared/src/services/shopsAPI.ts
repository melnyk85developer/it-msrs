import { AxiosResponse } from "axios"
import $api from "../http"
import { Merchandise, MyShopsType, MerchandisesTypes, ShopTypes, addMerchandiseType, UpdateMerchandise } from "@/types/shopsTypes"

export default class MyShopsAPI {
    static async createShopAPI(shop: any): Promise<AxiosResponse<MyShopsType>> {
        console.log('createShopAPI: - ', shop)
        return await $api.post<MyShopsType>(`/myshops/myshop`, shop)
    }
    static async updateShopAPI(shop: any): Promise<AxiosResponse<MyShopsType>> {
        const { shopId } = shop;
        return await $api.put<MyShopsType>(`/myshops/myshop/${shopId}`, shop)
    }
    static async getAllShopsAPI(click_shop_typeId: string, page: number, limit: number): Promise<AxiosResponse<any>> {
        return await $api.get<any>(`/myshops/all/shops`, { params: { click_shop_typeId, page, limit } })
    }
    // static async getMyShopsByIdAPI(shopId: string): Promise<AxiosResponse<any>> {
    //     const shops = await $api.get<any>(`/myshops/${shopId}`)
    //     // console.log('getMyShopsAPI: - ', shops)
    //     return shops
    // }
    static async getAllMyShopsAPI(): Promise<AxiosResponse<any>> {
        const shops = await $api.get<any>(`/myshops`)
        // console.log('getMyShopsAPI: - ', shops)
        return shops
    }
    static async getShopDetaiAPI(shopId: string): Promise<AxiosResponse<MyShopsType>> {
        const shop = await $api.get<MyShopsType>(`/myshops/myshop/${shopId}`)
        // console.log('getMyShopsAPI: - ', shop)
        return shop
    }

    static async getShopsTypesAPI(): Promise<AxiosResponse<any>> {
        return await $api.get<any>(`/shop-type`,)
    }
    static async createShopsTypesAPI(typeName: string): Promise<AxiosResponse<any>> {
        console.log(typeName)
        const formData = new FormData()
        formData.append('typeName', typeName.toString())
        return await $api.post<any>(`/shop-type`, { typeName: typeName })
    }
    static async createShopsBrandsAPI(brandName: string): Promise<AxiosResponse<any>> {
        console.log(brandName)
        const formData = new FormData()
        formData.append('brandName', brandName.toString())
        return await $api.post<any>(`/shop-brand`, { brandName: brandName })
    }

    static async createMerchandiseTypeAPI(type: { shopId: string, merchandiseTypeName: string }): Promise<AxiosResponse<any>> {
        console.log('createMerchandiseTypeAPI: - req', type)

        const createdType = await $api.post<any>(`/merchandise-type`, type)
        console.log('createMerchandiseTypeAPI: - res', createdType)
        return createdType
    }
    static async getMerchandiseTypesAPI(): Promise<AxiosResponse<any>> {
        return await $api.get<any>(`/merchandise-type/types`)
    }

    static async createMerchandiseBrandAPI(brand: any): Promise<AxiosResponse<any>> {
        // console.log('createMerchandiseBrandAPI: - brand', brand)
        return await $api.post<any>(`/merchandise-brand/brand`, brand)
    }
    static async getMerchandiseBrandsAPI(): Promise<AxiosResponse<any>> {
        return await $api.get<any>(`/merchandise-brand/brand`)
    }
    static async addMerchandiseAPI(merchandise: addMerchandiseType): Promise<AxiosResponse<Merchandise>> {
        console.log('addMerchandiseAPI: - merchandise', merchandise)

        const formData = new FormData()
        formData.append('merchandiseName', merchandise.merchandiseName)
        formData.append('price', `${merchandise.price}`)
        formData.append('image', merchandise.file)
        formData.append('info', JSON.stringify(merchandise.info))
        formData.append('brandId', merchandise.brandId.toString())
        formData.append('typeId', merchandise.typeId.toString())
        formData.append('shopId', merchandise.shopId.toString())

        return await $api.post<Merchandise>(`/merchandise/`, formData)
    }
    static async updateMerchandiseAPI(merchandise: UpdateMerchandise): Promise<AxiosResponse<Merchandise>> {
        const merchandiseId = merchandise.merchandiseId
        const formData = new FormData()
        formData.append('merchandiseName', merchandise.merchandiseName)
        formData.append('price', `${merchandise.price}`)
        formData.append('image', merchandise.file)
        formData.append('info', JSON.stringify(merchandise.info))
        formData.append('brandId', merchandise.brandId.toString())
        formData.append('typeId', merchandise.typeId.toString())
        formData.append('shopId', merchandise.shopId.toString())

        return await $api.put<Merchandise>(`/merchandise/${merchandiseId}`, formData)
    }
    static async deleteMerchandiseAPI(merchandiseId: string): Promise<AxiosResponse<Merchandise>> {
        return await $api.delete<Merchandise>(`/merchandise/${merchandiseId}`)
    }

    static async setMerchandisesAPI(shopId: string, typeId?: string, brandId?: string, page?: number, limit = 9): Promise<AxiosResponse<any>> {
        return await $api.get<any>(`/merchandise`, { params: { shopId, typeId, brandId, page, limit } })
    }
    static async getOneMerchandiseAPI(merchandiseId: string): Promise<AxiosResponse<any>> {
        return await $api.get<any>(`/merchandise/${merchandiseId}`)
    }
    static async addToBasketMerchandiseAPI(
        basketId: string,
        merchandiseId: string,
        merchandiseName: string,
        shopId: string,
        price: number,
        quantity: number
    ): Promise<AxiosResponse<any>> {

        return await $api.post<any>(`/basket-merchandise`, { basketId, merchandiseId, merchandiseName, shopId, price, quantity })
    }
    static async deleteToBasketMerchandiseAPI(basketMerchandiseId: string): Promise<AxiosResponse<any>> {
        return await $api.delete<any>(`/basket-merchandise/${basketMerchandiseId}`)
    }
    static async createMyBasketAPI(userId: string, shopId: string): Promise<AxiosResponse<any>> {
        return await $api.post<any>(`/basket-merchandise/`, { userId, shopId })
    }
    static async getMyBasketAPI(userId: string, shopId: string): Promise<AxiosResponse<any>> {
        return await $api.get<any>(`/basket/`, { params: { userId, shopId } })
    }
}

