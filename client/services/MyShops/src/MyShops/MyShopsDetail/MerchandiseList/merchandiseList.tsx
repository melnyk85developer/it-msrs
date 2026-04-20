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
    shopTypes: ShopTypes[];
    shopBrands: ShopBrands[];
    merchandisesTypes: MerchandisesTypes[];
    merchandisesBrands: MerchandisesBrands[];
    basket: MyBasket;
    dispatch: AppDispatch;
    authorizedUser: IUser;
    click_typeId: string;
    click_brandId: string;
    click_deviceId: string;
    page: number;
    setModalActiveDevice: any;
    setModalActiveBasket: any;
};
const MerchandiseList: React.FC<PropsType> = React.memo(({
    shop,
    shopTypes,
    shopBrands,
    merchandisesTypes,
    merchandisesBrands,
    basket,
    authorizedUser,
    click_brandId,
    click_typeId,
    click_deviceId,
    page,
    setModalActiveDevice,
    setModalActiveBasket,
    dispatch
}) => {

    return (
        <Col className={classes.wrapDeviceList}>
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
                                    <h2>Для этого Вам нужно всего лишь нажать <span onClick={() => setModalActiveDevice(true)}>Добавить товар</span>,
                                        а так же в верхнем правом меню магазина Вы сможете найти как добавить типы товаров, бренды и другие настройки!</h2>
                                </div>
                                : <></>
                        }

                    </div>
                </div>
                :
                shop.merchandises?.map(item => <MerchandiseItem
                    key={item.merchandiseId}
                    merchandiseId={item.merchandiseId}
                    name={item.name}
                    price={item.price}
                    rating={item.rating}
                    merchandiseImgName={item.merchandiseImgName}
                    shopTypes={shopTypes}
                    shopBrands={shopBrands}
                    merchandisesTypes={merchandisesTypes} 
                    merchandisesBrands={merchandisesBrands}
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
export default MerchandiseList;