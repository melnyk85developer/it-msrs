import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useOutletContext, useParams } from "react-router-dom";
import MerchandiseList from "./MerchandiseList/merchandiseList";
import { deleteMerchandiseAC, setMerchandisesAC, setShopDetailAC } from "@packages/shared/src/store/MyShopsReducers/myShopsSlice";
import { ShopsOutletContext } from "../../ShopsOutletContext/shopsOutletContext";
import { routeMain } from "./routes";
import ModalWindows from "@packages/shared/src/components/ModalWindows";
import MerchandiseDetail from "./MerchandiseDetail";
import UpdateMerchandise from "./ContentModalsShops/updateMerchandise";
import { Button } from "antd";
import classes from './styles.module.scss';

const MyShop: React.FC = React.memo(() => {
    const {
        shop,
        merchandise,
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
        setModalActiveMerchandise,
        allBrandsMerchandises,
        pageSize,
        pageNumber,
        dispatch,
        currentTypePage,
        setCurrentTypePage
    } = useOutletContext<ShopsOutletContext>();
    const { myshopId } = useParams<{ myshopId: string }>();
    const [modalActive, setModalActive] = useState(false);
    const [reModal, setRemodal] = useState(false);
    const [modalWarningActive, setModalWarningActive] = useState(false);
    const [modalUpdateMerchandiseActive, setModalUpdateMerchandiseActive] = useState(false);

    const typeId = click_typeId
    const brandId = click_brandId

    // console.log('MyShop: - merchandise', merchandise)
    // console.log('MyShopsDetail: - myshops', myshops)
    // console.log('MyShopsDetail: - shopTypes', shopTypes)
    // console.log('MyShopsDetail: - shopBrands', shopBrands)

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
            dispatch(setMerchandisesAC(shop.shopId, click_typeId, click_brandId, pageNumber, 9));
        }
    }, [click_typeId, click_brandId, clickAllBrand, clickAllType, pageNumber]);

    const deleteMerchandise = () => {
        dispatch(deleteMerchandiseAC(merchandise.merchandiseId))
            .then(() => dispatch(
                setMerchandisesAC(
                    shop.shopId,
                    typeId,
                    brandId,
                    pageNumber,
                    9
                )
            )
            )
    }

    return (
        <>
            <h2 className={classes.shopDescription}>{shop.title}</h2>
            <div className={classes.headerShop}>
                <div className={classes.brandBar} onClick={(e) => e.stopPropagation()}>
                    <li onClick={allBrandsMerchandises} className={clickAllBrand === true ? `${classes.activeBrand}` : ''}>Все Бренды</li>
                    {merchandisesBrands?.map(item =>
                        <li key={item.brandId} onClick={() => clickBrand(item.brandId)}
                            className={click_brandId === item.brandId ? `${classes.activeBrand}` : ''}>
                            {item.merchandiseBrandName}
                        </li>)
                    }
                </div>
            </div>
            <MerchandiseList
                shop={shop}
                basket={basket}
                dispatch={dispatch}
                authorizedUser={authorizedUser}
                click_deviceId={click_deviceId}
                setModalActiveMerchandise={setModalActiveMerchandise}
                setModalActiveBasket={setModalActiveBasket}
                setModalActive={setModalActive}
                setRemodal={setRemodal}
                setModalWarningActive={setModalWarningActive}
                setModalUpdateMerchandiseActive={setModalUpdateMerchandiseActive}
            />
            <ModalWindows
                modalActive={modalActive}
                setModalActive={setModalActive}
                isSetModal={0}
            >
                <MerchandiseDetail
                    merchandiseId={merchandise.merchandiseId}
                    shop={shop}
                    reModal={reModal}
                    setRemodal={setRemodal}
                    basket={basket}
                    dispatch={dispatch}
                    merchandise={merchandise}
                    authorizedUser={authorizedUser}
                    setModalActiveBasket={setModalActiveBasket}
                    setModalActive={setModalActive}
                />
            </ModalWindows>
            <ModalWindows modalActive={modalUpdateMerchandiseActive} setModalActive={setModalUpdateMerchandiseActive}>
                <UpdateMerchandise
                    shop={shop}
                    merchandise={merchandise}
                    shopTypes={shopTypes}
                    shopBrands={shopBrands}
                    dispatch={dispatch}
                    pageNumber={pageNumber}
                    setModalUpdateDeviceActive={setModalUpdateMerchandiseActive}
                />
            </ModalWindows>
            <ModalWindows modalActive={modalWarningActive} setModalActive={setModalWarningActive}>
                <div className={classes.wrapWarningBlock}>
                    <div className={classes.WarningBlock}>
                        <h1>Вы уверенны, что хотите удалить этот товар?</h1>
                        <h2>Это действие не возможно будет отменить!</h2>
                        <div className={classes.buttonBlock}>
                            <Button onClick={() => setModalWarningActive(false)}>Нет</Button>
                            <Button onClick={deleteMerchandise}>Да</Button>
                        </div>
                    </div>
                </div>
            </ModalWindows>
        </>
    );
});
export { routeMain };
export default MyShop;
