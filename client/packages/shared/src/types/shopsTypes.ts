export type MyShopsType = {
    shopId: number;
    name: string;
    title: string;
    userId: number;
    shopTypeId: number;
    types: TypesOfGoods[];
    brands: ProductBrands[];
    devices: Devices[];
    shoppingCart: any;
}
export type TypesShopsTypes = {
    typeId: number;
    typeName: string;
}
export type AllShopsType = {
    shopId: number;
    name: string;
    title: string;
    userId: number;
    types: TypesOfGoods[];
    brands: ProductBrands[];
}
export type MyBasket = {
    id: number;
    userId: number;
    shopId: number;
    basketDevices: BasketDevice[];
}
export type BasketDevice = {
    basketDeviceId: number
    basketId: number
    deviceId: number
    deviceName: string
    image: string
    price: number
    shopId: number
    quantity: number
}
export type TypesOfGoods = {
    id: number
    name: string
}
export type ProductBrands = {
    id: number
    name: string
}
export type Devices = {
    deviceId: number
    name: string
    price: number
    rating: number
    image: string
    file?: File
    shopId: number
    brandId: number | null
    info: Array<Info> | null
    typeId: number | null
    createdAt: string
    updatedAt: string
    infos: Info[]
}
export type SetDevicesParams = {
    typeId: number
    brandId: number
    page: number
    limit: number
}
export type Info = {
    deviceInfoId: number | null
    title: string
    description: string
}
export type addDeviceType = {
    name: string
    price: number
    file: File | null
    brandId?: number | null
    info: Array<addInfo> | null
    typeId: number | null
    shopId: number | null
}
export type addInfo = {
    title: string
    description: string
}