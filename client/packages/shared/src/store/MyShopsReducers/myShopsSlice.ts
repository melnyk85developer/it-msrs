import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../redux-store";
import MyShopsAPI from "../../services/shopsAPI";
import { AllShopsType, BasketDevice, Devices, MyBasket, MyShopsType, ProductBrands, TypesOfGoods, TypesShopsTypes, addDeviceType } from "@/types/shopsTypes";

const initialState = {
    shop: {} as MyShopsType,
    shop_types: [] as Array<TypesShopsTypes>,
    myshops: [] as Array<MyShopsType>,
    allshops: [] as Array<AllShopsType>,
    types: [] as Array<TypesOfGoods>,
    brands: [] as Array<ProductBrands>,
    basket: {} as MyBasket | null,
    device: {} as Devices,
    shoppingCart: {} as any,
    click_typeId: null as number | null,
    click_shop_typeId: null as number | null,
    click_brandId: null as number | null,
    click_deviceId: null as number | null,
    page: 1,
    totalCount: 0,
    limit: 9,
    error: '',
}
export const myShopsSlice = createSlice({
    name: 'my-shops',
    initialState,
    reducers: {
        createShop(state, action: PayloadAction<MyShopsType>){
            state.error = '';
            state.myshops.push(action.payload);
        },
        updateShop(state, action: PayloadAction<MyShopsType>){
            state.error = '';
            state.shop = action.payload
        },
        setMyAllShops(state, action: PayloadAction<Array<MyShopsType>>){
            state.error = ''
            state.myshops = action.payload
        },
        setAllShops(state, action: PayloadAction<Array<AllShopsType>>){
            state.error = ''
            state.allshops = action.payload
        },
        setShopDetail(state, action: PayloadAction<MyShopsType>){
            state.error = ''
            state.shop = action.payload
        },
        setShopsTypes(state, action: PayloadAction<Array<TypesShopsTypes>>){
            state.error = ''
            state.shop_types = action.payload
        },
        createType(state, action: PayloadAction<any>){
            state.error = '';
            state.shop.types.push(action.payload);
        },
        createBrand(state, action: PayloadAction<any>){
            state.error = '';
            state.shop.brands.push(action.payload);
        },
        addDevices(state, action: PayloadAction<Devices>){
            state.error = ''
            state.shop.devices.push(action.payload)
        },
        setTypes(state, action: PayloadAction<Array<TypesOfGoods>>){
            state.error = ''
            state.types = action.payload
        },
        setBrands(state, action: PayloadAction<Array<ProductBrands>>){
            state.error = ''
            state.brands = action.payload
        },
        setDevices(state, action: PayloadAction<Array<Devices>>){
            state.error = ''
            state.shop.devices = action.payload
        },
        setDeviceDetail(state, action: PayloadAction<Devices>){
            state.error = '';
            state.device = action.payload;
        },
        createMyBasket(state, action: PayloadAction<MyBasket>){
            state.error = '';
            state.basket = action.payload;
        },
        getMyBasket(state, action: PayloadAction<MyBasket>){
            state.error = '';
            state.basket = action.payload;
        },
        addItemToCart(state, action: PayloadAction<BasketDevice>){
            state.error = '';
            state.basket.basketDevices.push(action.payload);
        },
        removeAnItemFromTheCart(state, action: PayloadAction<BasketDevice>){
            state.error = '';
            const deviceIdToDelete = action.payload;
            state.basket.basketDevices = state.basket.basketDevices.filter(item => item.deviceId !== deviceIdToDelete.deviceId);
        },
        updateDivice(state, action: PayloadAction<Devices>){
            state.error = '';
            const deviceIdToUpdate = action.payload;
            let updateDevice = state.shop.devices.filter(item => item.deviceId === deviceIdToUpdate.deviceId);
            let devices = state.shop.devices.filter(item => item.deviceId !== deviceIdToUpdate.deviceId);
            updateDevice[0] = action.payload
            devices.push(updateDevice[0])
            state.shop.devices = devices
        },
        deleteDivice(state, action: PayloadAction<Devices>){
            state.error = '';
            const deviceIdToDelete = action.payload;
            state.shop.devices = state.shop.devices.filter(item => item.deviceId !== deviceIdToDelete.deviceId);
        },
        setPage(state, action: PayloadAction<number>){
            state.error = '';
            state.page = action.payload;
        },
        setTotalCount(state, action: PayloadAction<number>){
            state.error = '';
            state.totalCount = action.payload;
        },
        setClickShopTypeId(state, action: PayloadAction<number>){
            state.error = '';
            state.click_shop_typeId = action.payload;
            state.page = 1;
        },
        setClickTypeId(state, action: PayloadAction<number>){
            state.error = '';
            state.click_typeId = action.payload;
            state.page = 1;
        },
        setClickBrandId(state, action: PayloadAction<number>){
            state.error = '';
            state.click_brandId = action.payload;
        },
        setClickDeviceId(state, action: PayloadAction<number>){
            state.error = '';
            state.click_deviceId = action.payload;
        },
        myShopsFetchingError(state, action: PayloadAction<string>){
            state.error = action.payload
        }
    }
})
export const createShopAC = (shop: any) => async (dispatch: AppDispatch) => {
    // console.log('createShopAC req - ', shop)
    try {
        const data = await MyShopsAPI.createShopAPI(shop)
        console.log('createShopAC req - ', data.data)
        dispatch(myShopsSlice.actions.createShop(data.data))
    } catch(e: any) {
        alert(e.response.data.messages)
    }  
}
export const createShopTypeAC = (typeName: string) => async (dispatch: AppDispatch) => {
    // console.log('createShopTypeAC req - ', typeName)
    try {
        const data = await MyShopsAPI.createShopsTypesAPI(typeName)
        dispatch(myShopsSlice.actions.createShop(data.data))
    } catch(e: any) {
        alert(e.response.data.messages)
    }  
}
export const updateShopAC = (shop: any) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.updateShopAPI(shop)
        dispatch(myShopsSlice.actions.updateShop(data.data))
    } catch(e: any) {
        alert(e.response.data.messages)
    }  
}
export const setAllShopsAC = (click_shop_typeId?: number, page?: number, limit?: number) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.getAllShopsAPI(click_shop_typeId, page, limit)
        dispatch(myShopsSlice.actions.setAllShops(data.data))
    } catch(e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }  
}
export const getMyAllShopsByIdAC = (userId: number) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.getMyShopsByIdAPI(userId)
        // console.log('setMyShopsAC res - ', data.data)
        dispatch(myShopsSlice.actions.setMyAllShops(data.data))
    } catch(e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }  
}
export const setShopDetailAC = (shopId: number) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.getShopDetaiAPI(shopId)
        dispatch(myShopsSlice.actions.setShopDetail(data.data))
    } catch(e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }  
}
export const setShopsTypesAC = () => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.getShopsTypesAPI()
        dispatch(myShopsSlice.actions.setShopsTypes(data.data))
    } catch(e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }
}
export const createTypeAC = (type: any) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.createTypeAPI(type)
        dispatch(myShopsSlice.actions.createType(data.data))
    } catch(e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }  
}
export const createBrandAC = (brand: any) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.createBrandAPI(brand)
        dispatch(myShopsSlice.actions.createBrand(data.data))
    } catch(e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }  
}
export const addDeviceAC = (device: addDeviceType) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.addDeviceAPI(device)
        dispatch(myShopsSlice.actions.addDevices(data.data))
    } catch(e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }
}
export const setTypesAC = () => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.getTypesAPI()
        dispatch(myShopsSlice.actions.setTypes(data.data))
    } catch(e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }
}
export const setBrandsAC = () => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.getBrandsAPI()
        dispatch(myShopsSlice.actions.setBrands(data.data))
    } catch(e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }
}
export const setDevicesAC = (shopId: number, typeId?: number, brandId?: number, page?: number, limit?: number) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.setDevicesAPI(shopId, typeId, brandId, page, limit)
        // console.log('setDevicesAC res - ', data.data)
        // dispatch(myShopsSlice.actions.setTotalCount(data.data.count))
        dispatch(myShopsSlice.actions.setDevices(data.data))
    } catch(e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }
}
export const setDeviceDetailAC = (deviceId: number) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.getOneDeviceAPI(deviceId)
        dispatch(myShopsSlice.actions.setDeviceDetail(data.data))
    } catch(e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }  
}
export const createMyBasketAC = (userId: number, shopId: number) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.createMyBasketAPI(userId, shopId)
        dispatch(myShopsSlice.actions.createMyBasket(data.data))
    } catch(e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }  
}
export const getMyBasketAC = (userId: number, shopId: number) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.getMyBasketAPI(userId, shopId)
        dispatch(myShopsSlice.actions.getMyBasket(data.data))
    } catch(e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }  
}
export const addItemToCartAC = (basketId: number, deviceDetailId: number, name: string, shopId: number, price: number, quantity: number) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.addItemToCartAPI(basketId, deviceDetailId, name, shopId, price, quantity)
        dispatch(myShopsSlice.actions.addItemToCart(data.data))
    } catch(e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }  
}
export const removeAnItemFromTheCartAC = (deviceId: number) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.removeAnItemFromTheCartAPI(deviceId)
        dispatch(myShopsSlice.actions.removeAnItemFromTheCart(data.data))
    } catch(e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }  
}
export const updateDiviceAC = (device: Devices) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.updateDiviceAPI(device)
        dispatch(myShopsSlice.actions.updateDivice(data.data))
    } catch(e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }  
}
export const deleteDiviceAC = (deviceId: number) => async (dispatch: AppDispatch) => {
    try {
        const data = await MyShopsAPI.deleteDiviceAPI(deviceId)
        dispatch(myShopsSlice.actions.deleteDivice(data.data))
    } catch(e: any) {
        dispatch(myShopsSlice.actions.myShopsFetchingError(e.response?.data?.message))
    }  
}
export const setClickShopTypeAC = (typeId: number) => async (dispatch: AppDispatch) => {
    dispatch(myShopsSlice.actions.setClickShopTypeId(typeId));    
}
export const setClickTypeAC = (typeId: number) => async (dispatch: AppDispatch) => {
    dispatch(myShopsSlice.actions.setClickTypeId(typeId));    
}
export const setClickBrandAC = (brandId: number) => async (dispatch: AppDispatch) => {
    dispatch(myShopsSlice.actions.setClickBrandId(brandId));    
}
export const setClickDeviceAC = (deviceId: number) => async (dispatch: AppDispatch) => {
    dispatch(myShopsSlice.actions.setClickDeviceId(deviceId));    
}
export const setPageAC = (page: number) => async (dispatch: AppDispatch) => {
    dispatch(myShopsSlice.actions.setPage(page));    
}
export default myShopsSlice.reducer