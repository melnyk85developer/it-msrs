import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { getMyAllShopsAC, setClickBrandAC, setClickTypeAC, setMerchandisesAC, setShopDetailAC, setShopsBrandsAC, setShopsTypesAC } from "@packages/shared/src/store/MyShopsReducers/myShopsSlice";
import { FOOTER_ON, setContentSpanAC, setFooterAC, setLSidebarAC, setLSidebarSpanAC, setRSidebarAC, setRSidebarSpanAC, SIDEBAR_OFF, SIDEBAR_ON } from "@packages/shared/src/store/PageElementsSlice/pageElementsSlice";
import { useAppContext } from "@packages/shared/src/components/contexts/AppContext";
import { MyShopTopNav } from "./MyShopsTopNav/myShopTopNav";
import { MerchandisesTypes } from "@packages/shared/src/types/shopsTypes";
import { routeMain } from "./routes";
import { Col } from "antd";
import ModalWindows from "@packages/shared/src/components/ModalWindows";
import WidgetPeople from "@packages/shared/src/components/Widgets/WidgetsPeople";
import WidgetYofamiliar from "@packages/shared/src/components/Widgets/WidgetPerhapsYoureFamiliar";
import CreateShop from "./MyShopsDetail/ContentModalsShops/createShop";
import UpdateShop from "./MyShopsDetail/ContentModalsShops/updateShop";
import CreateMerchandiseType from "./MyShopsDetail/ContentModalsShops/createMerchandiseType";
import CreateMerchandiseBrand from "./MyShopsDetail/ContentModalsShops/createMerchandiseBrand";
import CreateMerchandise from "./MyShopsDetail/ContentModalsShops/createMerchandise";
import ShopPagination from "./shopPaginations/shopPagination";
import Basket from "./MyShopsDetail/Basket/basket";
import classes from './styles.module.scss';

const MyShopsContainer: React.FC = React.memo(() => {
    const dispatch = useAppDispatch();
    const { setContent, setPageType } = useAppContext();
    const { isAuth, authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage);
    const [titleMyShop, setTitleMyShop] = useState('');
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
    const [currentTypePage, setCurrentTypePage] = useState('list');
    const [selectedShop, setSelectedShop] = useState('');
    const [clickAllType, setClickAllType] = useState(true);
    const [clickAllBrand, setClickAllBrand] = useState(true);
    const [modalActiveType, setModalActiveType] = useState(false);
    const [modalActiveBrand, setModalActiveBrand] = useState(false);
    const [modalActiveMerchandise, setModalActiveMerchandise] = useState(false);
    const [modalActiveBasket, setModalActiveBasket] = useState(false);
    const [modalActiveCreateShop, setModalActiveCreateShop] = useState(false);
    const [modalActiveUpdateShop, setModalActiveUpdateShop] = useState(false);

    // console.log('MyShopsContainer: - myshops[0]?.shopId', myshops[0]?.shopId)
    // console.log('MyShopsContainer: - myshops[0].merchandises', myshops[0]?.merchandises)

    // console.log('MyShopsContainer: - shopTypes', shopTypes)
    // console.log('MyShopsContainer: - shopBrands', shopBrands)
    // console.log('MyShopsContainer: - merchandisesTypes', merchandisesTypes)
    // console.log('MyShopsContainer: - merchandisesBrands', merchandisesBrands)

    const allTypeMerchandises = () => {
        dispatch(setClickTypeAC(null))
            .then(() => setClickAllType(true))
    }
    const allBrandsMerchandises = () => {
        dispatch(setClickBrandAC(null))
            .then(() => setClickAllBrand(true))
    }

    const clickType = (id: string) => {
        dispatch(setClickTypeAC(id))
            .then(() => setClickAllType(false))
    };
    const clickBrand = (id: string) => {
        dispatch(setClickBrandAC(id))
            .then(() => setClickAllBrand(false))
    };

    useEffect(() => {
        allTypeMerchandises()
        allBrandsMerchandises()
        dispatch(setLSidebarAC(SIDEBAR_ON));
        dispatch(setLSidebarSpanAC(5));
        dispatch(setContentSpanAC(10));
        dispatch(setRSidebarAC(SIDEBAR_OFF));
        dispatch(setRSidebarSpanAC(5));
        dispatch(setFooterAC(FOOTER_ON));
        setPageType('stretch');
        dispatch(getMyAllShopsAC())
        dispatch(setShopsTypesAC())
        dispatch(setShopsBrandsAC())
    }, []);

    const newContent = () => ({
        contentTopNav: [
            <MyShopTopNav
                dispatch={dispatch}
                // shopTypes={shopTypes}
                // shopBrands={shopBrands}
                titleMyShop={titleMyShop}
                setTitleMyShop={setTitleMyShop}
                currentTypePage={currentTypePage}
                setCurrentTypePage={setCurrentTypePage}
                setModalActiveType={setModalActiveType}
                setModalActiveBrand={setModalActiveBrand}
                setModalActiveBasket={setModalActiveBasket}
                setModalActiveCreateShop={setModalActiveCreateShop}
                setModalActiveUpdateShop={setModalActiveUpdateShop}
                setModalActiveMerchandise={setModalActiveMerchandise}
                isDarkTheme={isDarkTheme}
            />
        ] as React.ReactNode[],
        contentLsidebar: [
            <div className={`${classes.wrap_product_name} 
                ${isDarkTheme !== "light"
                    ? classes.dark
                    : classes.light
                }
            `}>
                <h4>Типы товаров</h4>

                <ul onClick={(e) => e.stopPropagation()} className={classes.type_product}>
                    <li onClick={allTypeMerchandises} className={clickAllType === true ? `${classes.activeAllDevices}` : ''}>
                        Все товары
                    </li>
                    {/* {typesName} */}
                    {
                        merchandisesTypes?.map((item: MerchandisesTypes) =>
                            <li key={item.typeId} onClick={() => clickType(item.typeId)}
                                className={click_typeId === item.typeId ? `${classes.activeType}` : ''}>
                                {item.merchandiseTypeName}
                            </li>
                        )
                    }
                </ul>
            </div>,
            <div className={classes.wrapWidgetFriendsProfile}>
                <WidgetYofamiliar />
                <WidgetPeople />
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
    }, [click_typeId, shop, titleMyShop, currentTypePage, myshops.length]);

    return (
        <section className={`${classes.wrapContentMyShops} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <Outlet
                context={{
                    dispatch,
                    setTitleMyShop,
                    titleMyShop,
                    currentTypePage,
                    setCurrentTypePage,
                    modalActiveMerchandise,
                    setModalActiveMerchandise,
                    
                    shop,
                    merchandise,
                    basket,
                    myshops,
                    allshops,
                    shopTypes,
                    shopBrands,
                    merchandisesTypes,
                    merchandisesBrands,
                    allBrandsMerchandises,
                    allTypeMerchandises,

                    selectedShop,
                    setSelectedShop,
                    click_brandId,
                    click_typeId,
                    click_deviceId,
                    clickBrand,
                    clickAllBrand,
                    clickAllType,
                    authorizedUser,
                    isDarkTheme,
                    limit,
                    page,
                    isAuth,
                    error,
                }}
            />
            <ShopPagination />
            <ModalWindows modalActive={modalActiveCreateShop} setModalActive={setModalActiveCreateShop}>
                <CreateShop
                    dispatch={dispatch}
                    shopTypes={shopTypes}
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
                <CreateMerchandiseType
                    shop={shop}
                    setModalActiveType={setModalActiveType}
                />
            </ModalWindows>
            <ModalWindows modalActive={modalActiveBrand} setModalActive={setModalActiveBrand}>
                <CreateMerchandiseBrand
                    shop={shop}
                    setModalActiveBrand={setModalActiveBrand}
                />
            </ModalWindows>
            <ModalWindows modalActive={modalActiveMerchandise} setModalActive={setModalActiveMerchandise}>
                <CreateMerchandise
                    shop={shop}
                    merchandisesTypes={merchandisesTypes}
                    merchandisesBrands={merchandisesBrands}
                    dispatch={dispatch}
                    // modalActiveMerchandise={modalActiveMerchandise}
                    setModalActiveMerchandise={setModalActiveMerchandise}
                />
            </ModalWindows>
        </section>
    );
});
export { routeMain };
export default MyShopsContainer;
