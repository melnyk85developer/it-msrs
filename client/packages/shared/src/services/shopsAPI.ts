import { AxiosResponse } from "axios"
import $api from "../http"
import { Devices, MyShopsType, TypesOfGoods, TypesShopsTypes, addDeviceType } from "@/types/shopsTypes"

export default class MyShopsAPI {
    static async createShopAPI(shop: any): Promise<AxiosResponse<MyShopsType>> {
        console.log('createShopAPI: - ', shop)
        return await $api.post<MyShopsType>(`/myshop`, shop)
    }
    static async updateShopAPI(shop: any): Promise<AxiosResponse<MyShopsType>> {
        const { shopId } = shop;
        return await $api.put<MyShopsType>(`/myshops/${shopId}`, shop)
    }
    static async getAllShopsAPI(click_shop_typeId: number, page: number, limit: number): Promise<AxiosResponse<any>> {
        return await $api.get<any>(`/shops`, {params: { click_shop_typeId, page, limit }})
    }
    static async getMyShopsByIdAPI(userId: string): Promise<AxiosResponse<any>> {
        const shops = await $api.get<any>(`/myshops/${userId}`)
        // console.log('getMyShopsAPI: - ', shops)
        return shops
    }
    static async getShopDetaiAPI(shopId: number):  Promise<AxiosResponse<MyShopsType>> {
        const shop = await $api.get<MyShopsType>(`/myshop/${shopId}`)
        console.log('getMyShopsAPI: - ', shop)
        return shop
    }
    static async getShopsTypesAPI(): Promise<AxiosResponse<Array<TypesShopsTypes>>> {
        return await $api.get<Array<TypesShopsTypes>>(`/shoptype`, )
    }
    static async createShopsTypesAPI(typeName: string): Promise<AxiosResponse<any>> {
        console.log(typeName)
        const formData = new FormData()
        formData.append('typeName', typeName.toString())
        return await $api.post<any>(`/shoptype`, {typeName: typeName})
    }
    static async createTypeAPI(type: any): Promise<AxiosResponse<any>> {
        // console.log('createTypeAPI: - req', type)

        const createdType = await $api.post<any>(`/type`, type)
        // console.log('createTypeAPI: - res', createdType)
        return createdType
    }
    static async createBrandAPI(brand: any): Promise<AxiosResponse<any>> {
        return await $api.post<any>(`/brand`, brand)
    }
    static async addDeviceAPI(device: addDeviceType): Promise<AxiosResponse<Devices>> {
        const formData = new FormData()
        formData.append('name', device.name)
        formData.append('price', `${device.price}`)
        formData.append('image', device.file)
        formData.append('info', JSON.stringify(device.info))
        formData.append('brandId', device.brandId.toString())
        formData.append('typeId', device.typeId.toString())
        formData.append('shopId', device.shopId.toString())
        return await $api.post<Devices>(`/device/`, formData)
    }
    static async updateDiviceAPI(device: Devices): Promise<AxiosResponse<Devices>> {
        const deviceId = device.deviceId
        const formData = new FormData()
        formData.append('name', device.name)
        formData.append('price', `${device.price}`)
        formData.append('image', device.file)
        formData.append('info', JSON.stringify(device.info))
        formData.append('brandId', device.brandId.toString())
        formData.append('typeId', device.typeId.toString())
        formData.append('shopId', device.shopId.toString())

        return await $api.put<Devices>(`/device/update/${deviceId}`, formData)
    }
    static async deleteDiviceAPI(deviceId: number): Promise<AxiosResponse<Devices>> {
        return await $api.delete<Devices>(`/device/${deviceId}`)
    }
    static async getTypesAPI(): Promise<AxiosResponse<Array<TypesOfGoods>>> {
        return await $api.get<Array<TypesOfGoods>>(`/types`)
    }
    static async getBrandsAPI(): Promise<AxiosResponse<any>> {
        return await $api.get<any>(`/brands`)
    }
    static async setDevicesAPI(shopId: number, typeId?: any , brandId?: any, page?: number, limit = 9): Promise<AxiosResponse<any>> {
        return await $api.get<any>(`/device`, {params: { shopId, typeId, brandId, page, limit }})
    }
    static async getOneDeviceAPI(deviceId: number): Promise<AxiosResponse<any>> {
        return await $api.get<any>(`/device/${deviceId}`)
    }
    static async addItemToCartAPI(basketId: number, deviceId: number, name: string, shopId: number, price: number, quantity: number): Promise<AxiosResponse<any>> {
        return await $api.post<any>(`/backetd/`, {basketId, deviceId, name, shopId, price, quantity})
    }
    static async removeAnItemFromTheCartAPI(deviceId: number): Promise<AxiosResponse<any>> {
        return await $api.delete<any>(`/backetd/${deviceId}`)
    }
    static async createMyBasketAPI(userId: number, shopId: number): Promise<AxiosResponse<any>> {
        return await $api.post<any>(`/basket/`, {userId, shopId})
    }
    static async getMyBasketAPI(userId: number, shopId: number): Promise<AxiosResponse<any>> {
        return await $api.get<any>(`/basket/`, {params: { userId, shopId }})
    }
}

