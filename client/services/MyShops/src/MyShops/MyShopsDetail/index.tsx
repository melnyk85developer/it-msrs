import React, { useEffect, useState } from "react";
import { Navigate, useOutletContext, useParams } from "react-router-dom";
import MerchandiseList from "./MerchandiseList/merchandiseList";
import { setMerchandisesAC, setShopDetailAC } from "@packages/shared/src/store/MyShopsReducers/myShopsSlice";
import { ShopsOutletContext } from "../../ShopsOutletContext/shopsOutletContext";
import { routeMain } from "./routes";
import classes from './styles.module.scss';

const MyShopsDetail: React.FC = React.memo(() => {
    const {
        shop,
        setTitleMyShop,
        titleMyShop,
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
        setCurrentTypePage
    } = useOutletContext<ShopsOutletContext>();
    const { myshopId } = useParams<{ myshopId: string }>();

    useEffect(() => {
        if (!myshopId && myshops.length) {
            dispatch(setShopDetailAC(myshops[0].shopId))
        }
        if (myshopId) {
            setCurrentTypePage('shop')
            setTitleMyShop(myshops[0]?.name)
            dispatch(setShopDetailAC(myshopId))
        }
    }, [myshopId, myshops.length]);

    useEffect(() => {
        if (shop.shopId !== undefined) {
            dispatch(setMerchandisesAC(shop.shopId, click_typeId, click_brandId, page, 9));
        }
    }, [click_typeId, click_brandId, clickAllBrand, clickAllType, page]);

    // console.log('MyShopsDetail: - myshops', myshops)
    // console.log('MyShopsDetail: - shopTypes', shopTypes)
    // console.log('MyShopsDetail: - shopBrands', shopBrands)

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
                shopTypes={shopTypes}
                shopBrands={shopBrands}
                merchandisesTypes={merchandisesTypes}
                merchandisesBrands={merchandisesBrands}
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
        </>
    );
});
export { routeMain };
export default MyShopsDetail;
