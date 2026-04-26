export type MyShopsType = {
    shopId: string;
    name: string;
    title: string;
    userId: string;
    shopTypeId: string;
    shopBrandId: string;
    createdAt: string;
    updatedAt: string;

    merchandises: Merchandise[];
    // shoppingCart: any;
}
export type AllShopsType = {
    shopId: string;
    name: string;
    title: string;
    userId: string;
    shopTypeId: string;
    shopBrandId: string;
    createdAt: string;
    updatedAt: string;
}
export type MyBasket = {
    basketId: string;
    userId: string;
    shopId: string;
    basketMerchandises: BasketMerchandise[];
}
export type BasketMerchandise = {
    basketMerchandiseId: string
    basketId: string
    merchandiseId: string
    merchandiseName: string
    image: string
    price: number
    shopId: string
    quantity: number
}
export type ShopTypes = {
    typeId: string
    typeName: string
}
export type ShopBrands = {
    brandId: string
    brandName: string
}
export type MerchandisesTypes = {
    typeId: string
    merchandiseTypeName: string
}
export type MerchandisesBrands = {
    brandId: string
    merchandiseBrandName: string
}
export type CreateMerchandise = {
    merchandiseName: string;
    price: number;
    rating: number;
    file?: File
    info: Array<Info> | null;
    infos: Info[];
    userId: string;
    shopId: string;
    brandId: string | null;
    typeId: string | null;
    createdAt: string;
    updatedAt: string;
}
export type UpdateMerchandise = {
    merchandiseId: string;
    merchandiseName: string;
    price: number;
    rating: number;
    merchandiseImgName: string;
    merchandiseCoverName: string;
    file?: File
    userId: string;
    shopId: string;
    brandId: string | null;
    info: Array<Info> | null;
    typeId: string | null;
    createdAt: string;
    updatedAt: string;
    infos: Info[];
}
export type Merchandise = {
    merchandiseId: string;
    merchandiseName: string;
    price: number;
    rating: number;
    merchandiseImgName: string;
    merchandiseCoverName: string;
    // file?: File
    userId: string;
    shopId: string;
    brandId: string | null;
    info: Array<Info> | null;
    typeId: string | null;
    createdAt: string;
    updatedAt: string;
    infos: Info[];
}
export type SetMerchandisesParams = {
    typeId: string
    brandId: string
    page: number
    limit: number
}
export type Info = {
    deviceInfoId: string | null
    title: string
    description: string
}
export type addMerchandiseType = {
    merchandiseName: string
    price: number;
    rating: number;
    quantity: number;
    info: Array<addInfo> | null;
    brandId?: string | null;
    typeId: string | null;
    shopId: string | null;
    file: File | null;
}
export type addInfo = {
    title: string;
    description: string;
}