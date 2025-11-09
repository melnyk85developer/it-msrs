import React, { useState } from "react";
import { MyBasket, MyShopsType, ProductBrands, TypesOfGoods, TypesShopsTypes } from "@packages/shared/src/types/shopsTypes";
import { IUser } from "@packages/shared/src/types/IUser";
import ModalWindows from "@packages/shared/src/components/ModalWindows";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import DeviceList from "./DeviceList/deviceList";
import CreateShop from "./ContentModalsShops/createShop";
import UpdateShop from "./ContentModalsShops/updateShop";
import Basket from "./Basket/basket";
import CreateType from "./ContentModalsShops/createType";
import CreateBrand from "./ContentModalsShops/createBrand";
import CreateDevice from "./ContentModalsShops/createDevice";
import ShopPagination from "../shopPaginations/shopPagination";
import classes from './styles.module.scss';

type PropsType = {
    shop: MyShopsType;
    basket: MyBasket;
    allshops: MyShopsType[];
    myshops: MyShopsType[];
    shop_types: TypesShopsTypes[];
    types: TypesOfGoods[];
    brands: ProductBrands[];
    click_brandId: number;
    click_typeId: number;
    click_deviceId: number;
    clickAllBrand: boolean;
    selectedShop: string;
    setSelectedShop: React.Dispatch<React.SetStateAction<string>>;
    modalActiveType: boolean;
    setModalActiveType: React.Dispatch<React.SetStateAction<boolean>>;
    modalActiveBrand: boolean;
    setModalActiveBrand: React.Dispatch<React.SetStateAction<boolean>>;
    modalActiveDevice: boolean;
    setModalActiveDevice: React.Dispatch<React.SetStateAction<boolean>>;
    modalActiveBasket: boolean;
    setModalActiveBasket: React.Dispatch<React.SetStateAction<boolean>>;
    modalActiveCreateShop: boolean;
    setModalActiveCreateShop: React.Dispatch<React.SetStateAction<boolean>>;
    modalActiveUpdateShop: boolean;
    setModalActiveUpdateShop: React.Dispatch<React.SetStateAction<boolean>>;
    allBrandsDevices: () => void;
    clickBrand: (id: number) => void;
    page: number;
    limit: number;
    isAuth: boolean;
    authorizedUser: IUser;
    isDarkTheme: string;
    dispatch: AppDispatch;
    error: string;
};
const MyShopsDetail: React.FC<PropsType> = React.memo(({ 
    shop, basket, myshops, shop_types, authorizedUser, click_brandId, click_typeId, click_deviceId, clickBrand, 
    clickAllBrand, modalActiveBasket, setModalActiveBasket, modalActiveBrand, setModalActiveBrand, 
    modalActiveCreateShop, setModalActiveCreateShop, modalActiveDevice, setModalActiveDevice, 
    modalActiveType, setModalActiveType, modalActiveUpdateShop, setModalActiveUpdateShop,  
    allBrandsDevices, limit, page, dispatch }) => {

    console.log('MyShopsDetail')
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
                {!myshops.length
                ?
                <div className={classes.noShop}>
                    <div className={classes.wrapBlockOfNoShops}>
                        <div className={classes.blockOfNoShops}>
                            <h1>ADMIN В данный момент у Вас нет ни одного магазина!</h1>
                            <h2>Вы можете совершенно легко и бесплатно создать один или несколько магазинов и пользоваться услугами сайта!</h2>
                            <h2>Для этого Вам нужно всего лишь нажать <span onClick={() => setModalActiveCreateShop(true)}>Создать Магазин</span> и следовать подсказкам на сайте!</h2>
                        </div>
                    </div>
                </div>
                :
                <DeviceList 
                    shop={shop}
                    basket={basket}
                    dispatch={dispatch}
                    authorizedUser={authorizedUser}
                    click_typeId={click_typeId}
                    click_brandId={click_brandId}
                    click_deviceId={click_deviceId}
                    page={page}
                    setModalActiveDevice={setModalActiveDevice}
                    setModalActiveBasket={setModalActiveBasket}
                />
                }

            <ModalWindows modalActive={modalActiveCreateShop} setModalActive={setModalActiveCreateShop}>
                <CreateShop
                    dispatch={dispatch}
                    shop_types={shop_types}
                    setModalActiveCreateShop={setModalActiveCreateShop} 
                />
            </ModalWindows>
            <ModalWindows modalActive={modalActiveUpdateShop} setModalActive={setModalActiveUpdateShop}>
                <UpdateShop
                    shop={shop} 
                    dispatch={dispatch}
                    setModalActiveUpdateShop={setModalActiveUpdateShop} 
                />
            </ModalWindows>
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
            <ModalWindows modalActive={modalActiveType} setModalActive={setModalActiveType}>
                <CreateType
                    shop={shop}
                    setModalActiveType={setModalActiveType}
                />
            </ModalWindows>
            <ModalWindows modalActive={modalActiveBrand} setModalActive={setModalActiveBrand}>
                <CreateBrand
                    shop={shop}
                    setModalActiveBrand={setModalActiveBrand}
                />
            </ModalWindows>
            <ModalWindows modalActive={modalActiveDevice} setModalActive={setModalActiveDevice}>
                <CreateDevice 
                    shop={shop}
                    dispatch={dispatch}
                    setModalActiveDevice={setModalActiveDevice} 
                />
            </ModalWindows>
            <ShopPagination />
        </>
    );
});
export default MyShopsDetail;
