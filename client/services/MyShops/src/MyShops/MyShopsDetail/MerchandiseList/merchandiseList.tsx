import React from 'react';
import MerchandiseItem from '../MerchandiseItem/merchandiseItem';
import {
    Merchandise,
    MerchandisesBrands,
    MerchandisesTypes,
    MyBasket,
    MyShopsType,
    ShopBrands,
    ShopTypes
} from "@packages/shared/src/types/shopsTypes";
import { Col } from 'antd';
import { AppDispatch } from '@packages/shared/src/store/redux-store';
import { IUser } from '@packages/shared/src/types/IUser';
import classes from './styles.module.scss';

type PropsType = {
    shop: MyShopsType;
    basket: MyBasket;
    dispatch: AppDispatch;
    authorizedUser: IUser;
    click_deviceId: string;
    setModalActiveMerchandise: React.Dispatch<React.SetStateAction<boolean>>;
    setModalActiveBasket: React.Dispatch<React.SetStateAction<boolean>>;
    setModalActive: React.Dispatch<React.SetStateAction<boolean>>;
    setRemodal: React.Dispatch<React.SetStateAction<boolean>>;
    setModalWarningActive: React.Dispatch<React.SetStateAction<boolean>>;
    setModalUpdateMerchandiseActive: React.Dispatch<React.SetStateAction<boolean>>;
};
const MerchandiseList: React.FC<PropsType> = React.memo(({
    shop,
    basket,
    authorizedUser,
    click_deviceId,
    setModalActiveMerchandise,
    setModalActiveBasket,
    setModalActive,
    setRemodal,
    setModalWarningActive,
    setModalUpdateMerchandiseActive,
    dispatch
}) => {

    return (
        <Col className={classes.wrapMerchandiseList}>
            {!shop.merchandises?.length
                ?
                <div className={classes.noGoods}>
                    <div className={classes.wrapBlockOfNoGoods}>
                        {
                            shop.userId === authorizedUser.id
                                ?
                                <div className={classes.blockOfNoGoods}>
                                    <h1>В данный момент у Вас нет ни одного добавленного товара с таким типом и с таким брендом в магазине!</h1>
                                    <h2>Вы можете добавить типы товаров, бренды и сами товары в Ваш магазин!</h2>
                                    <h2>Для этого Вам нужно всего лишь нажать <span onClick={() => setModalActiveMerchandise(true)}>Добавить товар</span>,
                                        а так же в верхнем правом меню магазина Вы сможете найти как добавить типы товаров, бренды и другие настройки!</h2>
                                </div>
                                : <></>
                        }

                    </div>
                </div>
                :
                shop.merchandises?.map(item => <MerchandiseItem
                    key={item.merchandiseId}
                    merchandise={item}
                    merchandiseId={item.merchandiseId}
                    merchandiseName={item.merchandiseName}
                    price={item.price}
                    rating={item.rating}
                    merchandiseImgName={item.merchandiseImgName}
                    shop={shop}
                    basket={basket}
                    dispatch={dispatch}
                    authorizedUser={authorizedUser}
                    click_deviceId={click_deviceId}
                    setModalActive={setModalActive}
                    setRemodal={setRemodal}
                    setModalWarningActive={setModalWarningActive}
                    setModalUpdateMerchandiseActive={setModalUpdateMerchandiseActive}
                    setModalActiveBasket={setModalActiveBasket}
                />)
            }
        </Col>
    );
})
export default MerchandiseList;