import React, { useEffect, useState } from "react";
import basketImg from '@packages/shared/src/assets/basketBlack.png'
import star from '@packages/shared/src/assets/star.png'
import { CheckCircleFilled, LoadingOutlined } from "@ant-design/icons";
import { API_URL } from "@packages/shared/src/http";
import { Merchandise, Info, MyBasket, MyShopsType } from "@packages/shared/src/types/shopsTypes";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { addToBasketMerchandiseAC, deleteToBasketMerchandiseAC } from "@packages/shared/src/store/MyShopsReducers/myShopsSlice";
import { IUser } from "@packages/shared/src/types/IUser";
import { Input } from "antd";
import classes from './styles.module.scss';

type PropsType = {
    merchandiseId: string;
    shop: MyShopsType;
    basket: MyBasket;
    reModal: boolean;
    merchandise: Merchandise;
    dispatch: AppDispatch;
    authorizedUser: IUser;
    setModalActiveBasket: any;
};

const DeviceDetail: React.FC<PropsType> = React.memo(({ 
    merchandiseId, 
    shop, 
    basket, 
    reModal, 
    merchandise, 
    authorizedUser, 
    setModalActiveBasket, 
    dispatch 
}) => {
    const [inputQuantityValue, setInputQuantityValue] = useState(1);
    const [addedDevice, setAdedDevice] = useState(false);
    const [loading, setLoading] = useState(false);
    let quantity = inputQuantityValue

    if(quantity === 0){
        quantity = 1
    }

    const addToBasketMerchandise = () => {
        if(basket.id && merchandiseId && shop.shopId){
            setLoading(true)
            dispatch(addToBasketMerchandiseAC(basket.id, merchandiseId, merchandise.name, shop.shopId, merchandise.price, quantity))
            .then(() => setAdedDevice(true))
            .then(() => setLoading(false))
        }
    }
    const deleteToBasketMerchandise = () => {
        let basketMerchandise = basket.basketMerchandises?.filter(item => item.merchandiseId === merchandiseId);
        setAdedDevice(false)
        setLoading(true)
        dispatch(deleteToBasketMerchandiseAC(basketMerchandise[0]?.merchandiseId))
        .then(() => setLoading(false))
    }

    useEffect(() => {
        let added = basket.basketMerchandises?.some(item => item.merchandiseId === merchandiseId);
        setAdedDevice(added)
    }, [basket.basketMerchandises, reModal])

    return (
        <div className={classes.wrapDetailDevice}>
            <div className={classes.headerDetailDevice}>
                <div className={classes.wrapNameRatingDetailDevice}>
                    <div className={classes.deviceDetailName}>
                        <h4>{merchandise?.name}</h4>
                    </div>
                    <div className={classes.wrapDeviceDetailRating}> 
                        <div className={classes.deviceDetailRatingNumber}>
                            <strong>{merchandise?.rating}</strong>
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
                    <img src={API_URL + '/' + merchandise?.image}/>
                </div>
                <div className={classes.wrapBasketDetailDevice}>
                    <div className={classes.headerBasketDetailDevice}>
                        <h4>От{' ' + merchandise?.price + ' '}$</h4>
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
                        {authorizedUser.id 
                            ? 
                                addedDevice === false 
                                ? 
                                <strong onClick={addToBasketMerchandise}>Добавить в корзину</strong>
                                :
                                <strong onClick={deleteToBasketMerchandise}>Отменить добавление в корзину</strong>
                            :
                                <strong onClick={() => setModalActiveBasket(true)}>Добавить в корзину</strong>
                        }
                    </div>
                </div>
            </div>
            
            <div className={classes.сharacteristicsDetailDevice}>
                <h1>Характеристики товара</h1>
                {merchandise.infos?.map((info: Info, index: number) => 
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