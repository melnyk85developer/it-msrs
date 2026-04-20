import React from "react";
import { MyBasket, MyShopsType, MerchandisesBrands, MerchandisesTypes, ShopTypes, ShopBrands } from "@packages/shared/src/types/shopsTypes";
import { IUser } from "@packages/shared/src/types/IUser";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import ModalWindows from "@packages/shared/src/components/ModalWindows";
import MerchandiseList from "./MerchandiseList/merchandiseList";
import ShopPagination from "./shopPaginations/shopPagination";
import Basket from "./Basket/basket";
import classes from './styles.module.scss';

type PropsType = {
    shop: MyShopsType;
    shopTypes: ShopTypes[];
    shopBrands: ShopBrands[];
    merchandisesTypes: MerchandisesTypes[];
    merchandisesBrands: MerchandisesBrands[];
    basket: MyBasket;
    allshops: MyShopsType[];
    myshops: MyShopsType[];
    click_brandId: string;
    click_typeId: string;
    click_deviceId: string;
    clickBrand: (id: string) => void
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
    merchandisesBrands,
    shop, basket, authorizedUser, click_typeId, click_brandId, click_deviceId, clickAllBrand, page,
    modalActiveBasket, dispatch, setModalActiveBasket, allBrandsDevices, clickBrand
}) => {

    console.log('AllShopDetail')
    return (
        <>
            <div className={classes.headerShop}>
                <div className={classes.brandBar} onClick={(e) => e.stopPropagation()}>
                    <li onClick={allBrandsDevices} className={clickAllBrand === true ? `${classes.activeBrand}` : ''}>Все Бренды</li>
                    {merchandisesBrands?.map(item =>
                        <li key={item.brandId} onClick={() => clickBrand(item.brandId)}
                            className={click_brandId === item.brandId ? `${classes.activeBrand}` : ''}>
                            {item.merchandiseBrandName}
                        </li>)
                    }
                </div>
            </div>
            <h2>{shop.title}</h2>
            <MerchandiseList
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