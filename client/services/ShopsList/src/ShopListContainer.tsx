import React, { useEffect, useState } from "react"
import WidgetFriends from "@packages/shared/src/components/Widgets/WidgetFriends";
import WidgetPeople from "@packages/shared/src/components/Widgets/WidgetsPeople";
import WidgetYofamiliar from "@packages/shared/src/components/Widgets/WidgetPerhapsYoureFamiliar";
import basketIkon from "@packages/shared/src/assets/basketWhite.png";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { FOOTER_ON, setContentSpanAC, setFooterAC, setLSidebarAC, setLSidebarSpanAC, setRSidebarAC, setRSidebarSpanAC, SIDEBAR_ON } from "@packages/shared/src/store/PageElementsSlice/pageElementsSlice";
import { setAllShopsAC, setClickShopTypeAC, setShopsTypesAC } from "@packages/shared/src/store/MyShopsReducers/myShopsSlice";
import { useAppContext } from "@packages/shared/src/components/contexts/AppContext";
import { Col } from "antd";
import ShopsList from "./ShopsList";
import routeMain from './routes'
import classes from './styles.module.scss';

const ShopsListContainer: React.FC = React.memo(() => {
    const dispatch = useAppDispatch()
    const { setContent, setPageType } = useAppContext();
    const {isAuth, authorizedUser, isDarkTheme} = useAppSelector(state => state.authPage)
    const { shop, basket, allshops, shop_types, types, brands, click_shop_typeId,
        click_deviceId, page, limit, error } = useAppSelector(state => state.myShopsPage);
    const [clickAllShopType, setClickAllShopType] = useState(true);
    const [modalActiveBasket, setModalActiveBasket] = useState(false);

    const clickShopsType = (typeId: number) => {
        dispatch(setClickShopTypeAC(typeId))
        .then(() => setClickAllShopType(false))
    };

    const allTypeShops = () => {
        dispatch(setClickShopTypeAC(null))
        .then(() => setClickAllShopType(true))
    }

    useEffect(() => {
        console.log('useEffect - 1')
        dispatch(setAllShopsAC());
        dispatch(setShopsTypesAC())
        dispatch(setLSidebarAC(SIDEBAR_ON));
        dispatch(setLSidebarSpanAC(5));
        dispatch(setContentSpanAC(10));
        dispatch(setRSidebarAC(SIDEBAR_ON));
        dispatch(setRSidebarSpanAC(5));
        dispatch(setFooterAC(FOOTER_ON));
        setPageType('stretch');
    }, []);

    useEffect(() => {
        dispatch(setAllShopsAC(click_shop_typeId, page, 9));
    }, [click_shop_typeId, clickAllShopType, page]);

    const typesName = shop_types?.map(item =>
        <li key={item.typeId} onClick={() => clickShopsType(item.typeId)}
            className={click_shop_typeId === item.typeId ? `${classes.activeShopType}` : ''}>
            {item.typeName}
        </li>);

    const newContent = {
        contentTopNav: [ 
            <Col className={`
                ${classes.wrapTopNawShop}
                ${isDarkTheme !== "light" 
                    ? classes.dark 
                    : classes.light 
                }
            `}>
                <div className={classes.leftBlockTopNavNoAuthorization}></div>
                <h1>Магазины</h1>
                <img src={basketIkon} onClick={() => setModalActiveBasket(true)} className={classes.basketImg}/>
            </Col>
        ] as React.ReactNode[],
        contentLsidebar: [
            <div className={`
                ${classes.wrap_product_name}
                ${isDarkTheme !== "light" 
                    ? classes.dark 
                    : classes.light 
                }
            `}>
                <div className={classes.wrapH4Widgets}>
                    <h4>Типы магазинов</h4>
                </div>
                <div onClick={(e) => e.stopPropagation()} className={classes.type_product}>
                    <li onClick={allTypeShops} className={
                        clickAllShopType === true ? `${classes.activeAllShops}` : ''}>Все магазины</li>
                    {typesName}
                </div>
            </div>,
            <div className={classes.wrapWidgetFriendsProfile}>
                <WidgetYofamiliar />
                <WidgetPeople />
                <WidgetFriends />
            </div>
        ],
        contentRsidebar: [
            <div className={classes.wrapWidgetFriendsProfile}>
                <WidgetYofamiliar />
                <WidgetPeople />
                <WidgetFriends />
            </div>
        ],
        contentFooter: [
            <div className={`
                ${classes.wrapFooterSectionsForShopsList}
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
    };

    useEffect(() => {
        console.log('useEffect - 2')
        console.log('ShopsList - ', allshops)
        setContent(newContent);
    }, [click_shop_typeId, clickAllShopType]);

    return (
        <ShopsList
            shop={shop}
            basket={basket}
            allshops={allshops}
            shop_types={shop_types}
            types={types}
            brands={brands}
            click_deviceId={click_deviceId}
            click_shop_typeId={click_shop_typeId}
            page={page}
            limit={limit}
            isAuth={isAuth}
            dispatch={dispatch}
            isDarkTheme={isDarkTheme}
            authorizedUser={authorizedUser}
            modalActiveBasket={modalActiveBasket}
            setModalActiveBasket={setModalActiveBasket}
            error={error}
        />
    )
})
export {routeMain};
export default ShopsListContainer;