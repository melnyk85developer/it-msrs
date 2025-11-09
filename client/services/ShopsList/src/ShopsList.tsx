import React from "react";
import { MyBasket, MyShopsType, ProductBrands, TypesOfGoods, TypesShopsTypes } from "@packages/shared/src/types/shopsTypes";
import { NavLink } from "react-router-dom";
import { routeMain as routeShop} from "../../MyShops/src/Shop/myShopsContainer"
import { IUser } from "@packages/shared/src/types/IUser";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import ModalWindows from "@packages/shared/src/components/ModalWindows";
import Basket from "../../MyShops/src/Shop/AllShopDetail/Basket/basket";
import classes from './styles.module.scss';

type PropsType = {
    shop: MyShopsType;
    basket: MyBasket;
    allshops: MyShopsType[];
    shop_types: TypesShopsTypes[];
    types: TypesOfGoods[];
    brands: ProductBrands[];
    click_deviceId: number;
    click_shop_typeId: number;
    page: number;
    limit: number;
    isAuth: boolean;
    authorizedUser: IUser;
    isDarkTheme: string;
    dispatch: AppDispatch;
    modalActiveBasket: boolean;
    setModalActiveBasket: React.Dispatch<React.SetStateAction<boolean>>;
    error: string;
}
const ShopsList: React.FC<PropsType> = React.memo(({ 
    shop, authorizedUser, allshops, basket, modalActiveBasket, setModalActiveBasket, dispatch, isDarkTheme }) => {

    return (
        <div className={`${classes.shopContent} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            {Array.isArray(allshops) && allshops.length > 0
                ? 
                allshops?.map(shop => 
                    <div key={shop.shopId} className={classes.wrapItemShop}>
                        <NavLink to={routeShop(shop.shopId)}>
                            <h2>{shop.name}</h2>
                            <h3>{shop.title}</h3>
                            <div className={classes.blockType}>
                                <h4>Типы товаров:</h4>
                                <div className={classes.blockLi}>
                                    {shop.types?.map(type => <li key={type.id}>{type.name}</li>)}
                                </div>
                            </div>
                        </NavLink>
                    </div>
                )
                :
                <h1>Магазинов такого типа не найдено</h1>
            } 
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
        </div>
    )
});

export default ShopsList