import React, { useEffect, useState } from "react";
import basketImg from '@packages/shared/src/assets/basketBlack.png'
import star from '@packages/shared/src/assets/star.png'
import { CheckCircleFilled, LoadingOutlined } from "@ant-design/icons";
import { API_URL } from "@packages/shared/src/http";
import { Devices, Info, MyBasket, MyShopsType } from "@packages/shared/src/types/shopsTypes";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { addItemToCartAC, removeAnItemFromTheCartAC } from "@packages/shared/src/store/MyShopsReducers/myShopsSlice";
import { IUser } from "@packages/shared/src/types/IUser";
import { Input } from "antd";
import classes from './styles.module.scss';

type PropsType = {
    deviceId: number;
    shop: MyShopsType;
    basket: MyBasket;
    reModal: boolean;
    device: Devices;
    dispatch: AppDispatch;
    authorizedUser: IUser;
    setModalActiveBasket: any;
};

const DeviceDetail: React.FC<PropsType> = React.memo(({ deviceId, shop, basket, reModal, device, authorizedUser, setModalActiveBasket, dispatch }) => {
    const [inputQuantityValue, setInputQuantityValue] = useState(1);
    const [addedDevice, setAdedDevice] = useState(false);
    const [loading, setLoading] = useState(false);
    let quantity = inputQuantityValue

    if(quantity === 0){
        quantity = 1
    }

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

    useEffect(() => {
        let added = basket.basketDevices?.some(item => item.deviceId === deviceId);
        setAdedDevice(added)
    }, [basket.basketDevices, reModal])

    return (
        <div className={classes.wrapDetailDevice}>
            <div className={classes.headerDetailDevice}>
                <div className={classes.wrapNameRatingDetailDevice}>
                    <div className={classes.deviceDetailName}>
                        <h4>{device?.name}</h4>
                    </div>
                    <div className={classes.wrapDeviceDetailRating}> 
                        <div className={classes.deviceDetailRatingNumber}>
                            <strong>{device?.rating}</strong>
                        </div>
                        <div className={classes.wrapStarRaiting}>
                            <img src={star}/>
                            <img src={star}/>
                            <img src={star}/>
                            <img src={star}/>
                            <img src={star}/>
                        </div>
                    </div>
                </div>
                <div className={classes.blockImgDevice}>
                    <img src={API_URL + '/' + device?.image}/>
                </div>
                <div className={classes.wrapBasketDetailDevice}>
                    <div className={classes.headerBasketDetailDevice}>
                        <h4>От{' ' + device?.price + ' '}$</h4>
                        <div className={loading === true ? `${classes.loadingActive}`: `${classes.loadingDisabled}`}>
                            <LoadingOutlined />
                        </div>
                        <div className={addedDevice === true ? `${classes.addedActive}` : `${classes.addedDisabled}`}>
                            <strong>Добавленно</strong>
                            <CheckCircleFilled style={{color: '#43ca04'}}/>
                        </div>
                    </div>
                    <img src={basketImg}/>
                    <h4>Укажите количество единиц товара</h4>
                    <Input
                        value={inputQuantityValue}
                        onChange={(e) => setInputQuantityValue(Number(e.target.value))}
                        type="number"
                        placeholder="Введите стоимость устройства"
                        className={classes.numberOfPiecesInput}
                    />
                    <div className={classes.addЕoСart}>
                        {authorizedUser.userId 
                            ? 
                                addedDevice === false 
                                ? 
                                <strong onClick={addItemToCart}>Добавить в корзину</strong>
                                :
                                <strong onClick={removeItemToCart}>Отменить добавление в корзину</strong>
                            :
                                <strong onClick={() => setModalActiveBasket(true)}>Добавить в корзину</strong>
                        }
                    </div>
                </div>
            </div>
            
            <div className={classes.сharacteristicsDetailDevice}>
                <h1>Характеристики товара</h1>
                {device.infos?.map((info: Info, index: number) => 
                    <div key={info.deviceInfoId} style={{background: index % 2 === 0 ? '#454545' : 'transparent', color: index % 2 === 0 ? "black" : '', padding: 5}} className={classes.descriptionCharacteristicsDetailDevice}>
                        <strong>{info.title} : </strong>
                        <strong>{info.description}</strong>
                    </div>
                )}
            </div>
        </div>
    )
})
export default DeviceDetail