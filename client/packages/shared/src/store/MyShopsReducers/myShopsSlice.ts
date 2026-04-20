import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../redux-store";
import MyShopsAPI from "../../services/shopsAPI";
import {
    AllShopsType,
    BasketMerchandise,
    Merchandise,
    MerchandisesBrands,
    MerchandisesTypes,
    MyBasket,
    MyShopsType,
    ShopBrands,
    ShopTypes,
    addMerchandiseType
} from "@/types/shopsTypes";

const initialState = {
    shop: {} as MyShopsType,
    myshops: [] as Array<MyShopsType>,
    allshops: [] as Array<AllShopsType>,
    shopTypes: [] as Array<ShopTypes>,
    shopBrands: [] as Array<ShopBrands>,
    merchandisesTypes: [] as Array<MerchandisesTypes>,
    merchandisesBrands: [] as Array<MerchandisesBrands>,
    basket: {} as MyBasket | null,
    merchandise: {} as Merchandise,
    shoppingCart: {} as any,
    click_typeId: null as string | null,
    click_shop_typeId: null as string | null,
    click_brandId: null as string | null,
    click_deviceId: null as string | null,
    page: 1,
    totalCount: 0,
    limit: 9,
    error: '',
}
export const myShopsSlice = createSlice({
    name: 'my-shops',
    initialState,
    reducers: {
        createShop(state, action: PayloadAction<MyShopsType>) {
            state.error = '';
            state.myshops.push(action.payload);
        },
        updateShop(state, action: PayloadAction<MyShopsType>) {
            state.error = '';
            state.shop = action.payload
        },
        setMyAllShops(state, action: PayloadAction<Array<MyShopsType>>) {
            state.error = ''
            state.myshops = action.payload
        },
        setAllShops(state, action: PayloadAction<Array<AllShopsType>>) {
            state.error = ''
            state.allshops = action.payload
        },
        setShopDetail(state, action: PayloadAction<MyShopsType>) {
            state.error = ''
            state.shop = action.payload
        },
        setShopsTypes(state, action: PayloadAction<Array<ShopTypes>>) {
            state.error = ''
            state.shopTypes = action.payload
        },
        createShopType(state, action: PayloadAction<ShopTypes>) {
            state.error = '';
            state.shopTypes.push(action.payload);
        },
        createShopBrand(state, action: PayloadAction<ShopBrands>) {
            state.error = '';
            state.shopBrands.push(action.payload);
        },
        addMerchandise(state, action: PayloadAction<Merchandise>) {
            state.error = ''
            state.shop.merchandises.push(action.payload)
        },
        createMerchandiseType(state, action: PayloadAction<any>) {
            state.error = '';
            state.merchandisesTypes.push(action.payload);
        },
        setMerchandisesTypes(state, action: PayloadAction<Array<MerchandisesTypes>>) {
            state.error = ''
            state.merchandisesTypes = action.payload
        },
        createMerchandisesBrand(state, action: PayloadAction<MerchandisesBrands>) {
            state.error = '';
            state.merchandisesBrands.push(action.payload);
        },
        setMerchandisesBrands(state, action: PayloadAction<Array<MerchandisesBrands>>) {
            state.error = ''
            state.merchandisesBrands = action.payload
        },

        setMerchandises(state, action: PayloadAction<Array<Merchandise>>) {
            state.error = ''
            state.shop.merchandises = action.payload
        },
        setMerchandiseDetail(state, action: PayloadAction<Merchandise>) {
            state.error = '';
            state.merchandise = action.payload;
        },
        createMyBasket(state, action: PayloadAction<MyBasket>) {
            state.error = '';
            state.basket = action.payload;
        },
        getMyBasket(state, action: PayloadAction<MyBasket>) {
            state.error = '';
            state.basket = action.payload;
        },
        addMerchandiseToBasket(state, action: PayloadAction<BasketMerchandise>) {
            state.error = '';
            state.basket.basketMerchandises.push(action.payload);
        },
        deleteBasketToMerchandise(state, action: PayloadAction<BasketMerchandise>) {
            state.error = '';
            const deviceIdToDelete = action.payload;
            state.basket.basketMerchandises = state.basket.basketMerchandises.filter(item => item.merchandiseId !== deviceIdToDelete.merchandiseId);
        },
        updateMerchandise(state, action: PayloadAction<Merchandise>) {
            state.error = '';
            const merchandiseIdToUpdate = action.payload;
            let updateMerchandise = state.shop.merchandises.filter(item => item.merchandiseId === merchandiseIdToUpdate.merchandiseId);
            let merchandise = state.shop.merchandises.filter(item => item.merchandiseId !== merchandiseIdToUpdate.merchandiseId);
            updateMerchandise[0] = action.payload
            merchandise.push(updateMerchandise[0])
            state.shop.merchandises = merchandise
        },
        deleteMerchandise(state, action: PayloadAction<Merchandise>) {
            state.error = '';
            const merchandiseIdToDelete = action.payload;
            state.shop.merchandises = state.shop.merchandises.filter(item => item.merchandiseId !== merchandiseIdToDelete.merchandiseId);
        },
        setPage(state, action: PayloadAction<number>) {
            state.error = '';
            state.page = action.payload;
        },
        setTotalCount(state, action: PayloadAction<number>) {
            state.error = '';
            state.totalCount = action.payload;
        },
        setClickShopTypeId(state, action: PayloadAction<string>) {
            state.error = '';
            state.click_shop_typeId = action.payload;
            state.page = 1;
        },
        setClickTypeId(state, action: PayloadAction<string>) {
            state.error = '';
            state.click_typeId = action.payload;
            state.page = 1;
        },
        setClickBrandId(state, action: PayloadAction<string>) {
            state.error = '';
            state.click_brandId = action.payload;
        },
        setClickDeviceId(state, action: PayloadAction<string>) {
            state.error = '';
            state.click_deviceId = action.payload;
        },
        myShopsFetchingError(state, action: PayloadAction<string>) {
            state.error = action.payload
        }
    }
})
export const createShopAC = (shop: any) => async (dispatch: AppDispatch) => {
    console.log('createShopAC req - ', shop)
    try {
        const data = await MyShopsAPI.createShopAPI(shop)
        console.log('createShopAC req - ', data.data)
        dispatch(myShopsSlice.actions.createShop(data.data))
    } catch (e: any) {
        alert(e.response.data.messages)
    }
}
export const createShopTypeAC = (typeName: string) => async (dispatch: AppDispatch) => {
    // console.log('createShopTypeAC req - ', typeName)
    try {
        const data = await MyShopsAPI.createShopsTypesAPI(typeName)
        dispatch(myShopsSlice.actions.createShop(data.data))
    } catch (e: any) {
        alert(e.response.data.messages)
    }
}
export const updateShopAC = (shop: any) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.updateShopAPI(shop)
        dispatch(myShopsSlice.actions.updateShop(data.data))
    } catch (e: any) {
        alert(e.response.data.messages)
    }
}
export const setAllShopsAC = (click_shop_typeId?: string, page?: number, limit?: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await MyShopsAPI.getAllShopsAPI(click_shop_typeId, page, limit)
        if (response.data && response.data.item) {
            dispatch(myShopsSlice.actions.setAllShops(response.data.items))
        }
    } catch (e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }
}
export const getMyAllShopsAC = () => async (dispatch: AppDispatch) => {
    try {
        const response = await MyShopsAPI.getAllMyShopsAPI()
        // console.log('setMyShopsAC res - response.data.item', response.data.items)
        if (response.data) {
            dispatch(myShopsSlice.actions.setMyAllShops(response.data.items))
        } else {
            return response.data
        }
    } catch (error: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(error.response?.data?.message))
    }
}
export const setShopDetailAC = (shopId: string) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.getShopDetaiAPI(shopId)
        dispatch(myShopsSlice.actions.setShopDetail(data.data))
    } catch (e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }
}
export const setShopsTypesAC = () => async (dispatch: AppDispatch) => {
    try {
        const response = await MyShopsAPI.getShopsTypesAPI()
        if (response.data && response.data.items) {
            dispatch(myShopsSlice.actions.setShopsTypes(response.data.items))
        }
    } catch (e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }
}
export const setShopsBrandsAC = () => async (dispatch: AppDispatch) => {
    try {
        const response = await MyShopsAPI.getShopsTypesAPI()
        if (response.data && response.data.items) {
            dispatch(myShopsSlice.actions.setShopsTypes(response.data.items))
        }
    } catch (e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }
}

export const createMerchandiseTypeAC = (type: { shopId: string, merchandiseTypeName: string }) => async (dispatch: AppDispatch) => {
    // console.log('createMerchandiseTypeAC: - dto', type)
    try {
        const data = await MyShopsAPI.createMerchandiseTypeAPI(type)
        dispatch(myShopsSlice.actions.createMerchandiseType(data.data))
    } catch (error: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(error.response?.data?.message))
    }
}
export const createMerchandiseBrandAC = (brand: { shopId: string, merchandiseBrandName: string }) => async (dispatch: AppDispatch) => {
    // console.log('createMerchandiseBrandAC: - brand', brand)
    try {
        const response = await MyShopsAPI.createMerchandiseBrandAPI(brand)
        // console.log('createMerchandiseBrandAC: - response.data', response.data)
        dispatch(myShopsSlice.actions.createMerchandisesBrand(response.data))
    } catch (error: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(error.response?.data?.message))
    }
}
export const addMerchandiseAC = (merchandise: addMerchandiseType) => async (dispatch: AppDispatch) => {
    // console.log('addMerchandiseAC: - merchandise', merchandise)
    try {
        const response = await MyShopsAPI.addMerchandiseAPI(merchandise)
        // console.log('addMerchandiseAC: - response.data', response.data)

        dispatch(myShopsSlice.actions.addMerchandise(response.data))
    } catch (error: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(error.response?.data?.message))
    }
}
export const setMerchandisesTypesAC = () => async (dispatch: AppDispatch) => {
    try {
        const response = await MyShopsAPI.getMerchandiseTypesAPI()
        if (response.data) {
            dispatch(myShopsSlice.actions.setMerchandisesTypes(response.data.items))
        } else {
            return response.data
        }
    } catch (error: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(error.response?.data?.message))
    }
}
export const setMerchandisesBrandsAC = () => async (dispatch: AppDispatch) => {
    try {
        const response = await MyShopsAPI.getMerchandiseBrandsAPI()
        if (response.data) {
            dispatch(myShopsSlice.actions.setMerchandisesBrands(response.data.items))
        } else {
            return response.data
        }
    } catch (error: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(error.response?.data?.message))
    }
}
export const setMerchandisesAC = (shopId: string, typeId?: string, brandId?: string, page?: number, limit?: number) => async (dispatch: AppDispatch) => {
    try {
        const response = await MyShopsAPI.setMerchandisesAPI(shopId, typeId, brandId, page, limit)
        // console.log('setDevicesAC res - ', data.data)
        if (response.data) {
            dispatch(myShopsSlice.actions.setMerchandises(response.data.items))
        }
        // dispatch(myShopsSlice.actions.setTotalCount(data.data.count))
    } catch (e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }
}
export const setMerchandisesDetailAC = (merchandiseId: string) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.getOneMerchandiseAPI(merchandiseId)
        dispatch(myShopsSlice.actions.setMerchandiseDetail(data.data))
    } catch (e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }
}
export const createMyBasketAC = (userId: string, shopId: string) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.createMyBasketAPI(userId, shopId)
        dispatch(myShopsSlice.actions.createMyBasket(data.data))
    } catch (e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }
}
export const getMyBasketAC = (userId: string, shopId: string) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.getMyBasketAPI(userId, shopId)
        dispatch(myShopsSlice.actions.getMyBasket(data.data))
    } catch (e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }
}
export const addToBasketMerchandiseAC = (basketId: string, deviceDetailId: string, name: string, shopId: string, price: number, quantity: number) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.addToBasketMerchandiseAPI(basketId, deviceDetailId, name, shopId, price, quantity)
        dispatch(myShopsSlice.actions.addMerchandiseToBasket(data.data))
    } catch (e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }
}
export const deleteToBasketMerchandiseAC = (merchandiseId: string) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.deleteToBasketMerchandiseAPI(merchandiseId)
        dispatch(myShopsSlice.actions.deleteBasketToMerchandise(data.data))
    } catch (e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }
}
export const updateMerchandiseAC = (device: Merchandise) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.updateMerchandiseAPI(device)
        dispatch(myShopsSlice.actions.updateMerchandise(data.data))
    } catch (e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }
}
export const deleteMerchandiseAC = (deviceId: string) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.deleteMerchandiseAPI(deviceId)
        dispatch(myShopsSlice.actions.deleteMerchandise(data.data))
    } catch (e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }
}
export const setClickShopTypeAC = (typeId: string) => async (dispatch: AppDispatch) => {
    dispatch(myShopsSlice.actions.setClickShopTypeId(typeId));
}
export const setClickTypeAC = (typeId: string) => async (dispatch: AppDispatch) => {
    dispatch(myShopsSlice.actions.setClickTypeId(typeId));
}
export const setClickBrandAC = (brandId: string) => async (dispatch: AppDispatch) => {
    dispatch(myShopsSlice.actions.setClickBrandId(brandId));
}
export const setClickMerchandiseAC = (merchandiseId: string) => async (dispatch: AppDispatch) => {
    dispatch(myShopsSlice.actions.setClickDeviceId(merchandiseId));
}
export const setPageAC = (page: number) => async (dispatch: AppDispatch) => {
    dispatch(myShopsSlice.actions.setPage(page));
}
export default myShopsSlice.reducer