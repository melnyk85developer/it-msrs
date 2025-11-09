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
    setModalActiveBasket: any;
};
const DeviceList: React.FC<PropsType> = React.memo(({ 
    shop, basket, authorizedUser, click_brandId, click_typeId, click_deviceId, page, setModalActiveBasket, dispatch }) => {
    
    return (
        <Col className={classes.wrapDeviceList}>
            {!shop.devices?.length
                ? 
                <div className={classes.noGoods}>
                    <div className={classes.wrapBlockOfNoGoods}>
                        <div className={classes.blockOfNoGoods}>
                            <h1>Товаров с таким типом и с таким брендом не найдено!</h1>
                        </div>
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