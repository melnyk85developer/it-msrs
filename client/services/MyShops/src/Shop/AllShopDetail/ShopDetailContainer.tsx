import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Col } from "antd";
import WidgetFriends from "@packages/shared/src/components/Widgets/WidgetFriends";
import WidgetPeople from "@packages/shared/src/components/Widgets/WidgetsPeople";
import WidgetYofamiliar from "@packages/shared/src/components/Widgets/WidgetPerhapsYoureFamiliar";
import basketIkon from "@packages/shared/src/assets/basketWhite.png";
import ShopDetail from ".";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { setDevicesAC, setShopDetailAC, setClickBrandAC, setClickTypeAC,  } from "@packages/shared/src/store/MyShopsReducers/myShopsSlice";
import { setLSidebarAC, setRSidebarAC } from "@packages/shared/src/store/SidebarsReducers/sidebarsSlice";
import { routeMain } from "./routes";
import { useAppContext } from "@packages/shared/src/components/contexts/AppContext";
import { TypesOfGoods } from "@packages/shared/src/types/shopsTypes";
import classes from './styles.module.scss';

const ShopDetailContainer: React.FC = React.memo(() => {
    const dispatch = useAppDispatch();
    const { setContent } = useAppContext();
    const { isAuth, authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage);
    const { shop, basket, myshops, allshops, types, brands, limit, click_brandId, click_typeId, 
        click_deviceId, page, error } = useAppSelector(state => state.myShopsPage);
    const [modalActiveBasket, setModalActiveBasket] = useState(false);

    const [clickAllType, setClickAllType] = useState(true);
    const [clickAllBrand, setClickAllBrand] = useState(true);

    const { shopId } = useParams<{ shopId: string }>();
    const numericShopId = Number(shopId);
    
    useEffect(() => {
        if (numericShopId && (!shop || shop.shopId !== numericShopId)) {
            dispatch(setShopDetailAC(numericShopId));
        }
        dispatch(setLSidebarAC(null))
        dispatch(setRSidebarAC('off'));
    }, [numericShopId, shop, dispatch]);  

    const newContent = (newContent: unknown) => ({
        contentTopNav: [ 
            <Col className={classes.wrapTopNawShop}>
                <div className={classes.leftBlockTopNavNoAuthorization}></div>
                <h1>{shop.name}</h1>
                <img src={basketIkon} onClick={() => setModalActiveBasket(true)} className={classes.basketImg}/>
            </Col>

        ] as React.ReactNode[],
        contentLsidebar: [
            <div className={`${classes.wrap_product_name} ${classes.borderWidgets}`}>
                <div className={classes.wrapH4Widgets}>
                    <h4>Типы товаров</h4>
                </div>
                <div onClick={(e) => e.stopPropagation()} className={classes.type_product}>
                    <li onClick={allTypeDevices} className={
                        clickAllType === true ? `${classes.activeAllDevices}` : ''}>Все товары</li>
                    {typesName}
                </div>
            </div>,
            <div className={classes.wrapWidgetFriendsProfile}>
                <WidgetYofamiliar />
                <WidgetPeople />
                <WidgetFriends />
            </div>
        ],
        contentRsidebar: [<></>]
    });

    useEffect(() => {
        setContent(newContent);
    }, [allshops, click_typeId, shop, myshops]);

    useEffect(() => {
        console.log(click_typeId, click_brandId)
        if (shop.shopId !== undefined) {
            dispatch(setDevicesAC(shop.shopId, click_typeId, click_brandId, page, 9));
        }
    }, [click_typeId, click_brandId, clickAllBrand, clickAllType, page]);

    const clickType = (id: number) => {
        dispatch(setClickTypeAC(id))
        .then(() => setClickAllType(false))
    };
    const clickBrand = (id: number) => {
        dispatch(setClickBrandAC(id))
        .then(() => setClickAllBrand(false))
    };

    const allTypeDevices = () => {
        dispatch(setShopDetailAC(shop.shopId))
        .then(() => dispatch(setClickTypeAC(-1)))
        .then(() => setClickAllType(true))
    }
    const allBrandsDevices = () => {
        dispatch(setShopDetailAC(shop.shopId))
        .then(() => dispatch(setClickBrandAC(-1)))
        .then(() => setClickAllBrand(true))
    }

    const typesName = shop.types?.map((item: TypesOfGoods) =>
        <li key={item.id} onClick={() => clickType(item.id)}
            className={click_typeId === item.id ? `${classes.activeType}` : ''}>
            {item.name}
        </li>);

    return (
        <div className={ `${classes.contentShop} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <ShopDetail 
                shop={shop}
                basket={basket}
                myshops={myshops}
                allshops={allshops}
                types={types}
                brands={brands}
                click_brandId={click_brandId}
                click_typeId={click_typeId}
                click_deviceId={click_deviceId}
                clickAllBrand={clickAllBrand}
                clickBrand={clickBrand}
                allBrandsDevices={allBrandsDevices}
                modalActiveBasket={modalActiveBasket}
                setModalActiveBasket={setModalActiveBasket}
                page={page}
                limit={limit}
                isAuth={isAuth}
                dispatch={dispatch}
                authorizedUser={authorizedUser}
                isDarkTheme={isDarkTheme}
                error={error}
            />
        </div>
    );
});
export { routeMain };
export default ShopDetailContainer;
