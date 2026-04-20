import React, { useEffect, useRef, useState } from 'react';
import { StarOutlined, MoreOutlined, ShoppingCartOutlined, DeleteOutlined, FrownOutlined, LoadingOutlined, EditOutlined, CheckCircleFilled } from '@ant-design/icons';
import ModalWindows from '@packages/shared/src/components/ModalWindows';
import MerchandiseDetail from '../MerchandiseDetail';
import { API_URL } from "@packages/shared/src/http";
import {
    addToBasketMerchandiseAC,
    createMyBasketAC,
    deleteMerchandiseAC,
    deleteToBasketMerchandiseAC,
    setClickMerchandiseAC,
    setMerchandisesDetailAC,
    setMerchandisesAC,
    updateMerchandiseAC
} from '@packages/shared/src/store/MyShopsReducers/myShopsSlice';
import { Merchandise, MerchandisesBrands, MerchandisesTypes, MyBasket, MyShopsType, ShopBrands, ShopTypes } from '@packages/shared/src/types/shopsTypes';
import { AppDispatch } from '@packages/shared/src/store/redux-store';
import { IUser } from '@packages/shared/src/types/IUser';
import UpdateMerchandise from '../ContentModalsShops/updateMerchandise';
import { Button } from 'antd';
import classes from './styles.module.scss';
import { useNavigate } from 'react-router-dom';

type PropsType = {
    merchandiseId: string
    shopTypes: ShopTypes[];
    shopBrands: ShopBrands[];
    merchandisesTypes: MerchandisesTypes[];
    merchandisesBrands: MerchandisesBrands[];
    name: string
    price: number
    rating: number
    merchandiseImgName: string
    shop: MyShopsType;
    basket: MyBasket;
    dispatch: AppDispatch;
    authorizedUser: IUser;
    click_typeId: string;
    click_brandId: string;
    click_deviceId: string;
    page: number;
    setModalActiveBasket: any;
}
const MerchandiseItem: React.FC<PropsType> = React.memo(({
    merchandiseId, shopTypes, shopBrands, merchandisesTypes,
    merchandisesBrands, name, price, rating, merchandiseImgName,
    shop, basket, authorizedUser, click_brandId, click_typeId,
    click_deviceId, page, setModalActiveBasket, dispatch
}) => {
    const [modalActive, setModalActive] = useState(false);
    const [modalWarningActive, setModalWarningActive] = useState(false);
    const [modalUpdateMerchandiseActive, setModalUpdateMerchandiseActive] = useState(false);
    const [addedMerchandise, setAdedMerchandise] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reModal, setRemodal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const typeId = click_typeId
    const brandId = click_brandId
    let quantity = 1

    const merchandise = shop.merchandises.filter(item => item.merchandiseId === merchandiseId)[0]

    if (quantity === 0) {
        quantity = 1
    }

    // useEffect(() => {
    //     if (modalActive === false && shop) {
    //         navigate(`/myshops/${shop.shopId}`,
    //             {
    //                 replace: true
    //             }
    //         );
    //     }
    // }, [modalActive]);

    useEffect(() => {
        let added = basket.basketMerchandises?.some(item => item.merchandiseId === merchandiseId);
        setAdedMerchandise(added)
    }, [basket.basketMerchandises, isOpen])

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const addItemToCart = () => {
        if (basket.id && merchandiseId && shop.shopId) {
            setLoading(true)
            dispatch(addToBasketMerchandiseAC(basket.id, merchandiseId, merchandise.name, shop.shopId, merchandise.price, quantity))
                .then(() => setAdedMerchandise(true))
                .then(() => setLoading(false))
        }
    }
    const removeItemToCart = () => {
        let basketDevice = basket.basketMerchandises?.filter(item => item.merchandiseId === merchandiseId);
        setAdedMerchandise(false)
        setLoading(true)
        dispatch(deleteToBasketMerchandiseAC(basketDevice[0]?.merchandiseId))
            .then(() => setLoading(false))
    }
    const clickUpdateMerchandise = () => {
        dispatch(setMerchandisesDetailAC(merchandiseId))
            .then(() => setModalUpdateMerchandiseActive(true))
    }
    const deleteMerchandise = () => {
        dispatch(deleteMerchandiseAC(merchandiseId))
            .then(() => dispatch(setMerchandisesAC(shop.shopId, typeId, brandId, page, 9)))
    }
    const openModal = (e: any) => {
        e.stopPropagation();
        setModalActive(true);
        dispatch(setClickMerchandiseAC(merchandiseId));
        setRemodal(prevState => !prevState)
        if (basket && Object.keys(basket).length === 0) {
            dispatch(createMyBasketAC(authorizedUser.id, shop.shopId));
        }
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    return (
        <div className={classes.wrapItemMerchandise} style={click_deviceId === merchandiseId ? { borderColor: "#FFAC00" } : undefined} ref={dropdownRef}>
            <div className={classes.wrapNavItemContent}>
                <div className={classes.wrapItemNavMerchandise}>
                    <div className={addedMerchandise === true ? `${classes.addedEnabled}` : `${classes.addedDisabled}`}>
                        <strong>Добавленно в корзину</strong>
                        <CheckCircleFilled style={{ color: '#43ca04' }} />
                    </div>
                    <div onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)} className={classes.wrapItemNav}>
                        <MoreOutlined />
                    </div>

                    <div className={isOpen === true ? `${classes.navMerchandiseItemEnabled}` : `${classes.navMerchandiseItemDisabled}`}>
                        {shop.userId === authorizedUser.id
                            ?
                            <>
                                <div onClick={clickUpdateMerchandise}>
                                    <EditOutlined />
                                    <span>Редактировать</span>
                                </div>
                                <div onClick={() => setModalWarningActive(true)}>
                                    <DeleteOutlined />
                                    <span>Удалить</span>
                                </div>
                            </>
                            :
                            <div>
                                <FrownOutlined />
                                <span>Пожаловаться</span>
                            </div>}
                        <div><ShoppingCartOutlined />
                            {authorizedUser.id
                                ?
                                addedMerchandise === false
                                    ? <span onClick={addItemToCart}>Добавить в корзину</span>
                                    : <span onClick={removeItemToCart}>Отменить</span>
                                :
                                <span onClick={() => setModalActiveBasket(true)}>Добавить в корзину</span>
                            }
                            <span className={loading === true ? `${classes.loadingEnabled}` : `${classes.loadingDisabled}`}>
                                <LoadingOutlined />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div onClick={openModal} className={classes.itemMerchandise}>
                <div className={classes.wrapImgMerchandise}>
                    <img src={API_URL + '/' + merchandiseImgName} />
                </div>
                <div className={classes.wrapItemDescription}>
                    <div className={classes.nameMerchandiseItem}>
                        <strong>{name}</strong>
                    </div>
                    <div className={classes.ratingMerchandiseItem}>
                        <strong>{rating}</strong><StarOutlined />
                    </div>
                    <div className={classes.priceMerchandiseItem}>
                        <strong>{price}</strong>$
                    </div>
                </div>
            </div>
            <ModalWindows modalActive={modalActive} setModalActive={setModalActive}>
                <MerchandiseDetail
                    merchandiseId={merchandiseId}
                    shop={shop}
                    reModal={reModal}
                    basket={basket}
                    dispatch={dispatch}
                    merchandise={merchandise}
                    authorizedUser={authorizedUser}
                    setModalActiveBasket={setModalActiveBasket}
                    modalActive={modalActive}
                    setModalActive={setModalActive}
                />
            </ModalWindows>
            <ModalWindows modalActive={modalUpdateMerchandiseActive} setModalActive={setModalUpdateMerchandiseActive}>
                <UpdateMerchandise
                    shop={shop}
                    shopTypes={shopTypes}
                    shopBrands={shopBrands}
                    merchandisesTypes={merchandisesTypes}
                    merchandisesBrands={merchandisesBrands}
                    merchandise={merchandise}
                    dispatch={dispatch}
                    page={page}
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
        </div>
    );
})
export default MerchandiseItem;