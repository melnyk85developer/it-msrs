import React, { useEffect, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { routeMain as routeAuth } from '../../../../../Auth/src/pages/Auth';
import { LoginOutlined, RollbackOutlined, DeleteOutlined } from "@ant-design/icons";
import { Button } from 'antd';
import { getMyBasketAC, removeAnItemFromTheCartAC } from '@packages/shared/src/store/MyShopsReducers/myShopsSlice';
import { BasketDevice, MyBasket, MyShopsType } from '@packages/shared/src/types/shopsTypes';
import { IUser } from '@packages/shared/src/types/IUser';
import { AppDispatch } from '@packages/shared/src/store/redux-store';
import { API_URL } from '@packages/shared/src/http';
import defaultUserAvatar from "@packages/shared/src/assets/fonAvatars.png";
import classes from './styles.module.scss';

export type PropsType = {
    shop: MyShopsType;
    basket: MyBasket;
    dispatch: AppDispatch;
    authorizedUser: IUser;
    modalActiveBasket: boolean;
    setModalActiveBasket: React.Dispatch<React.SetStateAction<boolean>>;
};
const Basket: React.FC<PropsType> = React.memo(({ shop, basket, dispatch, authorizedUser, modalActiveBasket, setModalActiveBasket }) => {
    const userId = authorizedUser ? authorizedUser.userId : undefined
    const shopId = shop ? shop.shopId : undefined
    const goods = basket.basketDevices;

    const deleteDevice = (deviceId: number) => {
        dispatch(removeAnItemFromTheCartAC(deviceId));
    };

    useEffect(() => {
        console.log('useEffect 3 - ')
        if(userId && shopId){
            dispatch(getMyBasketAC(userId, shopId));
        }
    }, [dispatch, userId, shopId, modalActiveBasket]);

    const commoditys = useMemo(() => goods?.map((item: BasketDevice) =>
        <div key={item.basketDeviceId} className={classes.wrapItemBasketDevice}>
            <div className={classes.itemBasketDevice}>
                <img src={item.image ? `${API_URL}/` + item.image : defaultUserAvatar} />
                <div>
                    <div className={classes.name}>{item.deviceName}</div>
                    <div className={classes.quantityOfGoods}>Колличество единиц. : {item.quantity}</div>
                    <div className={classes.price}>Стоимость за единицу товара. : {item.price}</div>
                </div>
                <div className={classes.deleteBlock}>
                    <strong onClick={() => deleteDevice(item.deviceId)}>Удалить</strong>
                    <DeleteOutlined />
                </div>
            </div>
        </div>
    ), [goods]);

    const sum = useMemo(() => {
        return goods?.reduce((acc, item) => acc + Number(item.price * item.quantity), 0) || 0;
    }, [goods]);

    return (
        <div className={classes.wrapBasket}>
            {authorizedUser && authorizedUser.userId ? (
                <div className={classes.wrapMyBasket}>
                    <div className={classes.titleBlockBasket}>
                        <h2>Выбранные Вами товары</h2>
                    </div>
                    <div className={classes.myCartProductBlock}>
                        {goods?.length ? (
                            <div>{commoditys}</div>
                        ) : (
                            <div className={classes.wrapBlockOfNoProdukts}>
                                <div className={classes.blockOfNoProdukts}>
                                    <h1>В данный момент у Вас нет ни одного добавленного товара в корзину!</h1>
                                    <h2>Выберите товар который Вам нравится в каком нибудь магазине этого сайта и совершите покупку из этой корзины!</h2>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={classes.blockMakeAPurchase}>
                        <h3>Итоговая сумма к оплате: {sum}</h3>
                        <Button>Купить</Button>
                    </div>
                </div>
            ) : (
                <div className={classes.titleBasketNoAuthorisedUsers}>
                    <h1>Для того, что бы совершить покупку Вам необходимо авторизоваться!</h1>
                    <div className={classes.blockLink}>
                        <div className={classes.linkIDontWantTo} onClick={() => setModalActiveBasket(false)}>
                            <strong>Не хочу</strong>
                            <RollbackOutlined />
                        </div>
                        <div className={classes.linkOutput}>
                            <NavLink to={routeAuth()} className={classes.a}>Авторизоваться</NavLink>
                            <LoginOutlined />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

export { routeAuth };
export default Basket;
