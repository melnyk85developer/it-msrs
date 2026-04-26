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
    merchandise: Merchandise,

    setModalActive: React.Dispatch<React.SetStateAction<boolean>>;
    setRemodal: React.Dispatch<React.SetStateAction<boolean>>;
    setModalWarningActive: React.Dispatch<React.SetStateAction<boolean>>;
    setModalUpdateMerchandiseActive: React.Dispatch<React.SetStateAction<boolean>>;
    merchandiseName: string;
    price: number;
    rating: number;
    merchandiseImgName: string;
    shop: MyShopsType;
    basket: MyBasket;
    dispatch: AppDispatch;
    authorizedUser: IUser;
    click_deviceId: string;
    setModalActiveBasket: any;
}
const MerchandiseItem: React.FC<PropsType> = React.memo(({
    dispatch,
    merchandiseId,
    merchandise,

    merchandiseImgName,
    shop,
    basket,
    authorizedUser,
    click_deviceId,
    setModalActiveBasket,
    setModalActive,
    setModalWarningActive,
    setModalUpdateMerchandiseActive,
}) => {
    const [addedMerchandise, setAdedMerchandise] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    let quantity = 1

    if (quantity === 0) {
        quantity = 1
    }

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

    // const merchandise = shop.merchandises.filter(item => item.merchandiseId === merchandiseId)[0]

    // console.log('MerchandiseItem: - merchandise', merchandise)
    console.log('MerchandiseItem: - basket', basket)

    const openModal = (e: any) => {
        e.stopPropagation();
        setModalActive(true);
        dispatch(setMerchandisesDetailAC(merchandiseId))
        navigate(`/myshops/${shop.shopId}/merchandise/${merchandiseId}`);

        // dispatch(setClickMerchandiseAC(merchandiseId));
        // setRemodal(prevState => !prevState)

        // if (basket && Object.keys(basket).length === 0) {
        //     dispatch(createMyBasketAC(authorizedUser.id, shop.shopId));
        // }
    }

    const addToBasketMerchandise = () => {
        if (basket.basketId && merchandiseId && shop.shopId) {
            setLoading(true)
            dispatch(addToBasketMerchandiseAC(
                basket.basketId,
                merchandiseId,
                merchandise.merchandiseName,
                shop.shopId,
                merchandise.price,
                quantity
            ))
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
                                    ? <span onClick={addToBasketMerchandise}>Добавить в корзину</span>
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
                    <img src={API_URL + '/' + merchandise?.merchandiseImgName} />
                </div>
                <div className={classes.wrapItemDescription}>
                    <div className={classes.nameMerchandiseItem}>
                        <strong>{merchandise?.merchandiseName}</strong>
                    </div>
                    <div className={classes.ratingMerchandiseItem}>
                        <strong>{merchandise?.rating}</strong><StarOutlined />
                    </div>
                    <div className={classes.priceMerchandiseItem}>
                        <strong>{merchandise?.price}</strong>$
                    </div>
                </div>
            </div>

        </div>
    );
})
export default MerchandiseItem;