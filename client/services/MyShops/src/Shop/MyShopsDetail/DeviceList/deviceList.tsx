import React from 'react';
import DeviceItem from '../DeviceItem/deviceItem';
import { Devices, MyBasket, MyShopsType } from "@packages/shared/src/types/shopsTypes";
import { Col } from 'antd';
import classes from './styles.module.scss';
import { AppDispatch } from '@packages/shared/src/store/redux-store';
import { IUser } from '@packages/shared/src/types/IUser';

type PropsType = {
    shop: MyShopsType;
    basket: MyBasket;
    dispatch: AppDispatch;
    authorizedUser: IUser;
    click_typeId: number;
    click_brandId: number;
    click_deviceId: number;
    page: number;
    setModalActiveDevice: any;
    setModalActiveBasket: any;
};
const DeviceList: React.FC<PropsType> = React.memo(({ 
    shop, basket, authorizedUser, click_brandId, click_typeId, click_deviceId, page, setModalActiveDevice, setModalActiveBasket, dispatch }) => {
    
    return (
        <Col className={classes.wrapDeviceList}>
            {!shop.devices?.length
                ? 
                <div className={classes.noGoods}>
                    <div className={classes.wrapBlockOfNoGoods}>
                        {
                            shop.userId === authorizedUser.userId
                            ?
                            <div className={classes.blockOfNoGoods}>
                                <h1>В данный момент у Вас нет ни одного добавленного товара с таким типом и с таким брендом в магазине!</h1>
                                <h2>Вы можете добавить типы товаров, бренды и сами товары в Ваш магазин!</h2>
                                <h2>Для этого Вам нужно всего лишь нажать <span onClick={() => setModalActiveDevice(true)}>Добавить товар</span>,
                                    а так же в верхнем правом меню магазина Вы сможете найти как добавить типы товаров, бренды и другие настройки!</h2>
                            </div>
                            :<></>
                        }

                    </div>
                </div>
                : 
                shop.devices?.map(item => <DeviceItem
                    key={item.deviceId}
                    deviceId={item.deviceId}
                    name={item.name}
                    price={item.price}
                    rating={item.rating}
                    image={item.image}

                    page={page}
                    shop={shop}
                    basket={basket}
                    dispatch={dispatch}
                    authorizedUser={authorizedUser}
                    click_typeId={click_typeId}
                    click_brandId={click_brandId}
                    click_deviceId={click_deviceId}
                    setModalActiveBasket={setModalActiveBasket}
                />)
            }
        </Col>
    );
})
export default DeviceList;