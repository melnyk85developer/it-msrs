import React, { useEffect, useState } from "react";
import WidgetFriends from "@packages/shared/src/components/Widgets/WidgetFriends";
import WidgetPeople from "@packages/shared/src/components/Widgets/WidgetsPeople";
import WidgetYofamiliar from "@packages/shared/src/components/Widgets/WidgetPerhapsYoureFamiliar";
import MyShopsDetail from "./MyShopsDetail";
import basketIkon from "@packages/shared/src/assets/basketWhite.png";
import AllShopDetail from "./AllShopDetail";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { getMyAllShopsByIdAC, setClickBrandAC, setClickTypeAC, setDevicesAC, setShopDetailAC } from "@packages/shared/src/store/MyShopsReducers/myShopsSlice";
import { FOOTER_ON, setContentSpanAC, setFooterAC, setLSidebarAC, setLSidebarSpanAC, setRSidebarAC, setRSidebarSpanAC, SIDEBAR_OFF, SIDEBAR_ON } from "@packages/shared/src/store/PageElementsSlice/pageElementsSlice";
import { useParams } from "react-router-dom";
import { useAppContext } from "@packages/shared/src/components/contexts/AppContext";
import { TypesOfGoods } from "@packages/shared/src/types/shopsTypes";
import { MenuShopLeftAdminUser } from "./MyShopsDetail/MenuAdmin/menuShopLeftAdminUser";
import { MenuShopRightAdminUser } from "./MyShopsDetail/MenuAdmin/menuShopRightAdminUser";
import { Col } from "antd";
import { routeMain } from "./routes";
import classes from './styles.module.scss';

const MyShopsContainer: React.FC = React.memo(() => {
    const dispatch = useAppDispatch();
    const { setContent, setPageType } = useAppContext();
    const { isAuth, authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage);
    const { shop, device, basket, myshops, shop_types, allshops, types, brands, limit, click_brandId, 
    click_typeId, click_deviceId, page, error } = useAppSelector(state => state.myShopsPage);
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
    const numericShopId = Number(shopId);
console.log('device: - ', device)
    const allTypeDevices = () => {
        dispatch(setClickTypeAC(null))
        .then(() => setClickAllType(true))
    }
    const allBrandsDevices = () => {
        dispatch(setClickBrandAC(null))
        .then(() => setClickAllBrand(true))
    }

    useEffect(() => {
        if(userId){
            dispatch(getMyAllShopsByIdAC(userId))
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
    
    useEffect(() => {
        if(!numericShopId && (myshops.length && userId)){
            dispatch(setShopDetailAC(myshops[0].shopId))
        }
        if(numericShopId && !shop || shop.shopId !== numericShopId){
            dispatch(setShopDetailAC(numericShopId))
        }
    }, [numericShopId, myshops]);

    const clickType = (id: number) => {
        dispatch(setClickTypeAC(id))
        .then(() => setClickAllType(false))
    };
    const clickBrand = (id: number) => {
        dispatch(setClickBrandAC(id))
        .then(() => setClickAllBrand(false))
    };

    const typesName = shop.types?.map((item: TypesOfGoods) =>
        <li key={item.id} onClick={() => clickType(item.id)}
            className={click_typeId === item.id ? `${classes.activeType}` : ''}>
            {item.name}
        </li>);  

    const newContent = () => ({
        contentTopNav: [
            shop.userId === authorizedUser.id
            ?
                <Col className={`${classes.wrapTopNawShop}
                    ${isDarkTheme !== "light" 
                        ? classes.dark 
                        : classes.light 
                }
                `}>
                    <MenuShopLeftAdminUser myshops={myshops} dispatch={dispatch}/>
                    <h1>{shop?.name}</h1>
                    <MenuShopRightAdminUser
                        dispatch={dispatch}
                        setModalActiveType={setModalActiveType}
                        setModalActiveBrand={setModalActiveBrand}
                        setModalActiveDevice={setModalActiveDevice}
                        setModalActiveBasket={setModalActiveBasket}
                        setModalActiveCreateShop={setModalActiveCreateShop}
                        setModalActiveUpdateShop={setModalActiveUpdateShop}
                    />
                </Col>
            : 
            <Col className={classes.wrapTopNawShop}>
                <div className={classes.leftBlockTopNavNoAuthorization}></div>
                <h1>{shop.name}</h1>
                <img src={basketIkon} onClick={() => setModalActiveBasket(true)} className={classes.basketImg}/>
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
            dispatch(setDevicesAC(shop.shopId, click_typeId, click_brandId, page, 9));
        }
    }, [click_typeId, click_brandId, clickAllBrand, clickAllType, page]);
    
    return (
        <div className={ `${classes.contentShop} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            {shop.userId !== authorizedUser.id
            ?   
                <MyShopsDetail 
                    shop={shop}
                    basket={basket}
                    myshops={myshops}
                    allshops={allshops}
                    shop_types={shop_types}
                    types={types}
                    brands={brands}
                    allBrandsDevices={allBrandsDevices}
                    limit={limit}
                    page={page}
                    isAuth={isAuth}
                    dispatch={dispatch}
                    selectedShop={selectedShop}
                    setSelectedShop={setSelectedShop}
                    click_brandId={click_brandId}
                    click_typeId={click_typeId}
                    click_deviceId={click_deviceId}
                    clickBrand={clickBrand}
                    clickAllBrand={clickAllBrand}
                    modalActiveType={modalActiveType}
                    setModalActiveType={setModalActiveType}
                    modalActiveBrand={modalActiveBrand}
                    setModalActiveBrand={setModalActiveBrand}
                    modalActiveDevice={modalActiveDevice}
                    setModalActiveDevice={setModalActiveDevice}
                    modalActiveBasket={modalActiveBasket}
                    setModalActiveBasket={setModalActiveBasket}
                    modalActiveCreateShop={modalActiveCreateShop}
                    setModalActiveCreateShop={setModalActiveCreateShop}
                    modalActiveUpdateShop={modalActiveUpdateShop}
                    setModalActiveUpdateShop={setModalActiveUpdateShop}
                    authorizedUser={authorizedUser}
                    isDarkTheme={isDarkTheme}
                    error={error}
                />
            :
                <AllShopDetail 
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
            }
        </div>
    );
});
export { routeMain };
export default MyShopsContainer;
