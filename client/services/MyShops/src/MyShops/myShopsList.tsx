import React, { useEffect, useState } from "react";
import { Navigate, NavLink, useOutletContext } from "react-router-dom";
import { routeMain } from "./routes";
import { routeMain as routeAuth } from '../../../Auth/src/pages/Auth';
import { ShopsOutletContext } from "@/ShopsOutletContext/shopsOutletContext";
import { routeMain as routeMyShops } from '../MyShops/MyShopsDetail';
import classes from './styles.module.scss';

const MyShopsList: React.FC = React.memo(() => {
    const {
        setTitleMyShop,
        titleMyShop,
        shop,
        basket,
        myshops,
        shopTypes,
        shopBrands,
        merchandisesTypes,
        merchandisesBrands,
        authorizedUser,
        click_brandId,
        click_typeId,
        click_deviceId,
        clickBrand,
        clickAllBrand,
        clickAllType,
        setModalActiveBasket,
        setModalActiveCreateShop,
        setModalActiveDevice,
        allBrandsDevices,
        limit,
        page,
        dispatch,
        currentTypePage,
        setCurrentTypePage,
        isDarkTheme,
        isAuth
    } = useOutletContext<ShopsOutletContext>();

    // console.log('MyShopsList: - myshops', myshops)

    useEffect(() => {
        setTitleMyShop('Мои магазины')
        setCurrentTypePage('list')
    }, [])

    return (
        <>
            {!isAuth && <Navigate to={routeAuth()} />}
            {
                myshops.length
                    ?
                    myshops.map(shop =>
                        <div key={shop.shopId} className={classes.wrapItemMyShop}>
                            <NavLink to={routeMyShops(shop.shopId)} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <h1>{shop.name}</h1>
                                <h2>{shop.title}</h2>
                            </NavLink>
                        </div>
                    )
                    :
                    <div className={classes.noShop}>
                        <div className={classes.wrapBlockOfNoShops}>
                            <div className={classes.blockOfNoShops}>
                                <h1>ADMIN В данный момент у Вас нет ни одного магазина!</h1>
                                <h2>Вы можете совершенно легко и бесплатно создать один или несколько магазинов и пользоваться услугами сайта!</h2>
                                <h2>Для этого Вам нужно всего лишь нажать <span onClick={() => setModalActiveCreateShop(true)}>Создать Магазин</span> и следовать подсказкам на сайте!</h2>
                            </div>
                        </div>
                    </div>
            }
        </>
    );
});
export { routeMain };
export default MyShopsList;
