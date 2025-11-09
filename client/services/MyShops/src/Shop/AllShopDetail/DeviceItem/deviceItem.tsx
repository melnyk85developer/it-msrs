import React, { useEffect, useRef, useState } from 'react';
import { StarOutlined, MoreOutlined, ShoppingCartOutlined, DeleteOutlined, FrownOutlined, LoadingOutlined, EditOutlined, CheckCircleFilled } from '@ant-design/icons';
import ModalWindows from '@packages/shared/src/components/ModalWindows';
import DeviceDetail from '../DeviceDetail';
import { API_URL } from "@packages/shared/src/http";
import { addItemToCartAC, createMyBasketAC, deleteDiviceAC, removeAnItemFromTheCartAC, setClickDeviceAC, setDeviceDetailAC, setDevicesAC, updateDiviceAC } from '@packages/shared/src/store/MyShopsReducers/myShopsSlice';
import { Devices, MyBasket, MyShopsType } from '@packages/shared/src/types/shopsTypes';
import { AppDispatch } from '@packages/shared/src/store/redux-store';
import { IUser } from '@packages/shared/src/types/IUser';
import classes from './styles.module.scss';
import { Button } from 'antd';

type PropsType = {
    deviceId: number
    name: string
    price: number
    rating: number
    image: string
    shop: MyShopsType;
    basket: MyBasket;
    dispatch: AppDispatch;
    authorizedUser: IUser;
    click_typeId: number;
    click_brandId: number;
    click_deviceId: number;
    page: number;
    setModalActiveBasket: any;
}
const DeviceItem: React.FC<PropsType> = React.memo(({
    deviceId, name, price, rating, image, shop, basket, authorizedUser, click_brandId, click_typeId, click_deviceId, page, setModalActiveBasket, dispatch}) => {
    const [modalActive, setModalActive] = useState(false);
    const [modalWarningActive, setModalWarningActive] = useState(false);
    const [modalUpdateDeviceActive, setModalUpdateDeviceActive] = useState(false);
    const [addedDevice, setAdedDevice] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reModal, setRemodal] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const typeId = click_typeId
    const brandId = click_brandId
    let quantity = 1

    const device = shop.devices.filter(item => item.deviceId === deviceId)[0]

    if(quantity === 0){
        quantity = 1
    }

    useEffect(() => {
        let added = basket.basketDevices?.some(item => item.deviceId === deviceId);
        setAdedDevice(added)
    }, [basket.basketDevices, isOpen])

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const addItemToCart = () => {
        if(basket.id && deviceId && shop.shopId){
            setLoading(true)
            dispatch(addItemToCartAC(basket.id, deviceId, device.name, shop.shopId, device.price, quantity))
            .then(() => setAdedDevice(true))
            .then(() => setLoading(false))
        }
    }
    const removeItemToCart = () => {
        let basketDevice = basket.basketDevices?.filter(item => item.deviceId === deviceId);
        setAdedDevice(false)
        setLoading(true)
        dispatch(removeAnItemFromTheCartAC(basketDevice[0]?.deviceId))
        .then(() => setLoading(false))
    }
    const deleteDivice = () => {
        dispatch(deleteDiviceAC(deviceId))
        .then(() => dispatch(setDevicesAC(shop.shopId, typeId, brandId, page, 9)))
    }
    const openModal = (e: any) => {
        e.stopPropagation();
        setModalActive(true);
        dispatch(setClickDeviceAC(deviceId));
        setRemodal(prevState => !prevState)
        if (basket && Object.keys(basket).length === 0) {
            dispatch(createMyBasketAC(authorizedUser.userId, shop.shopId));
        }
    }
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    return (
        <div className={classes.wrapItemDevice} style={click_deviceId === deviceId ? {borderColor: "#FFAC00"}: undefined} ref={dropdownRef}>
            <div className={classes.wrapNavItemContent}>
                <div className={classes.wrapItemNavDevice}>
                    <div className={addedDevice === true ? `${classes.addedEnabled}` : `${classes.addedDisabled}`}>
                        <strong>Добавленно в корзину</strong>
                        <CheckCircleFilled style={{color: '#43ca04'}}/>
                    </div>
                    <div onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)} className={classes.wrapItemNav}>
                        <MoreOutlined />
                    </div>
                    <div className={isOpen === true ? `${classes.navDeviceItemEnabled}` : `${classes.navDeviceItemDisabled}`}>
                        <div>
                            <FrownOutlined />
                            <span>Пожаловаться</span>
                        </div> 
                        <div><ShoppingCartOutlined />
                            {authorizedUser.userId 
                                ? 
                                    addedDevice === false 
                                    ? <span onClick={addItemToCart}>Добавить в корзину</span> 
                                    : <span onClick={removeItemToCart}>Отменить</span>
                                :
                                <span onClick={() => setModalActiveBasket(true)}>Добавить в корзину</span>
                            }
                            <span className={loading === true ? `${classes.loadingEnabled}`: `${classes.loadingDisabled}`}>
                                <LoadingOutlined />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div onClick={openModal} className={classes.itemDevice}>
                <div className={classes.wrapImgDevice}>
                    <img src={API_URL + '/' + image}/>
                </div>
                <div className={classes.wrapItemDescription}>
                    <div className={classes.nameDeviceItem}>
                        <strong>{name}</strong>
                    </div>
                    <div className={classes.ratingDeviceItem}>
                        <strong>{rating}</strong><StarOutlined />
                    </div>
                    <div className={classes.priceDeviceItem}>
                        <strong>{price}</strong>$
                    </div>
                </div>
            </div>
            <ModalWindows modalActive={modalActive} setModalActive={setModalActive}>
                <DeviceDetail 
                    deviceId={deviceId}
                    shop={shop}
                    reModal={reModal}
                    basket={basket}
                    dispatch={dispatch}
                    device={device}
                    authorizedUser={authorizedUser}
                    setModalActiveBasket={setModalActiveBasket}
                />
            </ModalWindows>
            <ModalWindows modalActive={modalWarningActive} setModalActive={setModalWarningActive}>
                <div className={classes.wrapWarningBlock}>
                    <div className={classes.WarningBlock}>
                        <h1>Вы уверенны, что хотите удалить этот товар?</h1>
                        <h2>Это действие не возможно будет отменить!</h2>
                        <div className={classes.buttonBlock}>
                            <Button onClick={() => setModalWarningActive(false)}>Нет</Button>
                            <Button onClick={deleteDivice}>Да</Button>
                        </div>
                    </div>
                </div>
            </ModalWindows>
        </div>
    );
})
export default DeviceItem;