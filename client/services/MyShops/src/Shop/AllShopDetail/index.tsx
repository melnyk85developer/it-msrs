import React from "react";
import { MyBasket, MyShopsType, ProductBrands, TypesOfGoods } from "@packages/shared/src/types/shopsTypes";
import { IUser } from "@packages/shared/src/types/IUser";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import ModalWindows from "@packages/shared/src/components/ModalWindows";
import DeviceList from "./DeviceList/deviceList";
import ShopPagination from "./shopPaginations/shopPagination";
import Basket from "./Basket/basket";
import classes from './styles.module.scss';

type PropsType = {
    shop: MyShopsType;
    basket: MyBasket;
    allshops: MyShopsType[];
    myshops: MyShopsType[];
    types: TypesOfGoods[];
    brands: ProductBrands[];
    click_brandId: number;
    click_typeId: number;
    click_deviceId: number;
    clickBrand: (id: number) => void
    clickAllBrand: boolean;
    allBrandsDevices: () => void
    modalActiveBasket: boolean
    setModalActiveBasket: React.Dispatch<React.SetStateAction<boolean>>;
    page: number;
    limit: number;
    isAuth: boolean;
    authorizedUser: IUser;
    isDarkTheme: string;
    dispatch: AppDispatch;
    error: string;
}
const AllShopDetail: React.FC<PropsType> = React.memo(({ 
shop, basket, authorizedUser, click_typeId, click_brandId, click_deviceId, clickAllBrand, page, 
modalActiveBasket, dispatch, setModalActiveBasket,  allBrandsDevices, clickBrand }) => {

    console.log('AllShopDetail')
    return (
        <>
            <div className={classes.headerShop}>
                <div className={classes.brandBar} onClick={(e) => e.stopPropagation()}>
                    <li onClick={allBrandsDevices} className={clickAllBrand === true ? `${classes.activeBrand}` : ''}>Все Бренды</li>
                    {shop.brands?.map(item =>
                        <li key={item.id} onClick={() => clickBrand(item.id)}
                            className={click_brandId === item.id ? `${classes.activeBrand}` : ''}>
                            {item.name}
                        </li>)
                    }
                </div>
            </div>
            <h2>{shop.title}</h2>
            <DeviceList 
                shop={shop}
                basket={basket}
                dispatch={dispatch}
                authorizedUser={authorizedUser}
                click_typeId={click_typeId}
                click_brandId={click_brandId}
                click_deviceId={click_deviceId}
                page={page}
                setModalActiveBasket={setModalActiveBasket}
            />
            <ModalWindows modalActive={modalActiveBasket} setModalActive={setModalActiveBasket}>
                <Basket
                    shop={shop}
                    basket={basket}
                    dispatch={dispatch}
                    authorizedUser={authorizedUser}
                    modalActiveBasket={modalActiveBasket}
                    setModalActiveBasket={setModalActiveBasket}
                />
            </ModalWindows>
            <ShopPagination />
        </>
    );
})
export default AllShopDetail