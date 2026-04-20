import React, { useEffect, useState } from "react";
import WidgetFriends from "@packages/shared/src/components/Widgets/WidgetFriends";
import WidgetPeople from "@packages/shared/src/components/Widgets/WidgetsPeople";
import WidgetYofamiliar from "@packages/shared/src/components/Widgets/WidgetPerhapsYoureFamiliar";
import basketIkon from "@packages/shared/src/assets/basketWhite.png";
import AllShopDetail from "./AllShopDetail";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { setAllShopsAC, setClickBrandAC, setClickTypeAC, setMerchandisesAC, setShopDetailAC } from "@packages/shared/src/store/MyShopsReducers/myShopsSlice";
import { FOOTER_ON, setContentSpanAC, setFooterAC, setLSidebarAC, setLSidebarSpanAC, setRSidebarAC, setRSidebarSpanAC, SIDEBAR_OFF, SIDEBAR_ON } from "@packages/shared/src/store/PageElementsSlice/pageElementsSlice";
import { Outlet, useParams } from "react-router-dom";
import { useAppContext } from "@packages/shared/src/components/contexts/AppContext";
import { Col } from "antd";
import { routeMain } from "./routes";
import classes from './styles.module.scss';
import { MerchandisesTypes } from "@packages/shared/src/types/shopsTypes";

const UsersShopsContainer: React.FC = React.memo(() => {
    const dispatch = useAppDispatch();
    const { setContent, setPageType } = useAppContext();
    const { isAuth, authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage);
    const {
        shop,
        merchandise,
        basket,
        myshops,
        shopTypes,
        shopBrands,
        merchandisesTypes,
        merchandisesBrands,
        allshops,
        limit,
        click_brandId,
        click_typeId,
        click_deviceId,
        page,
        error
    } = useAppSelector(state => state.myShopsPage);
    const [selectedShop, setSelectedShop] = useState('');
    const [clickAllType, setClickAllType] = useState(true);
    const [clickAllBrand, setClickAllBrand] = useState(true);
    const [modalActiveType, setModalActiveType] = useState(false);
    const [modalActiveBrand, setModalActiveBrand] = useState(false);
    const [modalActiveDevice, setModalActiveDevice] = useState(false);
    const [modalActiveBasket, setModalActiveBasket] = useState(false);
    const [modalActiveCreateShop, setModalActiveCreateShop] = useState(false);
    const [modalActiveUpdateShop, setModalActiveUpdateShop] = useState(false);
    const userId = authorizedUser.id
    const { shopId } = useParams<{ shopId: string }>();
    const numericShopId = shopId;

    console.log('MyShopsContainer: - myshops', myshops)
    // console.log('MyShopsContainer: - shopTypes', shopTypes)
    // console.log('MyShopsContainer: - shopBrands', shopBrands)
    // console.log('MyShopsContainer: - merchandisesTypes', merchandisesTypes)
    // console.log('MyShopsContainer: - merchandisesBrands', merchandisesBrands)

    const allTypeDevices = () => {
        dispatch(setClickTypeAC(null))
            .then(() => setClickAllType(true))
    }
    const allBrandsDevices = () => {
        dispatch(setClickBrandAC(null))
            .then(() => setClickAllBrand(true))
    }

    useEffect(() => {
        if (authorizedUser.id) {
            dispatch(setAllShopsAC())
                .then(() => allTypeDevices())
                .then(() => allBrandsDevices())
        }
        allTypeDevices()
        allBrandsDevices()
        dispatch(setLSidebarAC(SIDEBAR_ON));
        dispatch(setLSidebarSpanAC(5));
        dispatch(setContentSpanAC(10));
        dispatch(setRSidebarAC(SIDEBAR_OFF));
        dispatch(setRSidebarSpanAC(5));
        dispatch(setFooterAC(FOOTER_ON));
        setPageType('stretch');
    }, []);

    const clickType = (id: string) => {
        dispatch(setClickTypeAC(id))
            .then(() => setClickAllType(false))
    };
    const clickBrand = (id: string) => {
        dispatch(setClickBrandAC(id))
            .then(() => setClickAllBrand(false))
    };

    const typesName = shopTypes?.map((item: MerchandisesTypes) =>
        <li key={item.typeId} onClick={() => clickType(item.typeId)}
            className={click_typeId === item.typeId ? `${classes.activeType}` : ''}>
            {item.merchandiseTypeName}
        </li>);

    const newContent = () => ({
        contentTopNav: [
            <Col className={classes.wrapTopNawShop}>
                <div className={classes.leftBlockTopNavNoAuthorization}></div>
                <h1>{shop.name}</h1>
                <img src={basketIkon} onClick={() => setModalActiveBasket(true)} className={classes.basketImg} />
            </Col>
        ] as React.ReactNode[],
        contentLsidebar: [
            <div className={`${classes.wrap_product_name} 
                ${isDarkTheme !== "light"
                    ? classes.dark
                    : classes.light
                }
            `}>
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
        contentRsidebar: [<></>],
        contentFooter: [
            <div className={`
                ${classes.wrapFooterSectionsForShop}
                ${isDarkTheme !== "light"
                    ? classes.dark
                    : classes.light
                }
            `}>
                <Col className={classes.footer_sections}>
                    <p>Блок 1</p>
                </Col>
                <Col className={classes.footer_sections}>
                    <p>Блок 2</p>
                </Col>
                <Col className={classes.footer_sections}>
                    <p>Блок 3</p>
                </Col>
                <Col className={classes.footer_sections}>
                    <p>Блок 4</p>
                </Col>
            </div>
        ]
    });

    useEffect(() => {
        setContent(newContent);
    }, [click_typeId, shop, myshops]);

    useEffect(() => {
        if (shop.shopId !== undefined) {
            dispatch(setMerchandisesAC(shop.shopId, click_typeId, click_brandId, page, 9));
        }
    }, [click_typeId, click_brandId, clickAllBrand, clickAllType, page]);

    return (
        <div className={`${classes.contentShop} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <Outlet
                context={{
                    shop,
                    basket,
                    myshops,
                    allshops,
                    shopTypes,
                    shopBrands,
                    merchandisesTypes,
                    merchandisesBrands,
                    allBrandsDevices,
                    allTypeDevices,
                    limit,
                    page,
                    isAuth,
                    dispatch,
                    selectedShop,
                    setSelectedShop,
                    click_brandId,
                    click_typeId,
                    click_deviceId,
                    clickBrand,
                    clickAllBrand,
                    modalActiveType,
                    setModalActiveType,
                    modalActiveBrand,
                    setModalActiveBrand,
                    modalActiveDevice,
                    setModalActiveDevice,
                    modalActiveBasket,
                    setModalActiveBasket,
                    modalActiveCreateShop,
                    setModalActiveCreateShop,
                    modalActiveUpdateShop,
                    setModalActiveUpdateShop,
                    authorizedUser,
                    isDarkTheme,
                    error,
                }}
            />

            {/* <AllShopDetail
                shop={shop}
                basket={basket}
                myshops={myshops}
                allshops={allshops}
                shopTypes={shopTypes}
                shopBrands={shopBrands}
                merchandisesTypes={merchandisesTypes}
                merchandisesBrands={merchandisesBrands}
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
            /> */}
        </div>
    );
});
export { routeMain };
export default UsersShopsContainer;
