import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5";
import { CheckCircleFilled, LoadingOutlined } from "@ant-design/icons";
import { API_URL } from "../../../../../../packages/shared/src/http";
import { Merchandise, Info, MyBasket, MyShopsType } from "../../../../../../packages/shared/src/types/shopsTypes";
import { AppDispatch } from "../../../../../../packages/shared/src/store/redux-store";
import { addToBasketMerchandiseAC, deleteToBasketMerchandiseAC } from "../../../../../../packages/shared/src/store/MyShopsReducers/myShopsSlice";
import { IUser } from "../../../../../../packages/shared/src/types/IUser";
import { Col, Input } from "antd";
import { IoCloseSharp } from "react-icons/io5";
import { PiShoppingCartThin } from "react-icons/pi";
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
    setRemodal: React.Dispatch<React.SetStateAction<boolean>>
    setModalActive: React.Dispatch<React.SetStateAction<boolean>>
};
const MerchandiseDetail: React.FC<PropsType> = React.memo(({
    merchandiseId,
    shop, basket, reModal, merchandise,
    authorizedUser, setModalActiveBasket,
    dispatch,
    setModalActive
}) => {
    const [inputQuantityValue, setInputQuantityValue] = useState(1);
    const [addedDevice, setAdedDevice] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    let quantity = inputQuantityValue

    if (quantity === 0) {
        quantity = 1
    }
    const closeModal = (e: any) => {
        e.stopPropagation();
        navigate(`/myshops/${shop.shopId}`);
        setModalActive(false);
    }

    useEffect(() => {
        let added = basket.basketMerchandises?.some(item => item.merchandiseId === merchandiseId);
        setAdedDevice(added)
    }, [basket.basketMerchandises, reModal])

    const addItemToCart = () => {
        if (basket.id && merchandiseId && shop.shopId) {
            setLoading(true)
            dispatch(addToBasketMerchandiseAC(basket.id, merchandiseId, merchandise.merchandiseName, shop.shopId, merchandise.price, quantity))
                .then(() => setAdedDevice(true))
                .then(() => setLoading(false))
        }
    }
    const removeItemToCart = () => {
        let basketMerchandise = basket.basketMerchandises?.filter(item => item.merchandiseId === merchandiseId);
        setAdedDevice(false)
        setLoading(true)
        dispatch(deleteToBasketMerchandiseAC(basketMerchandise[0]?.merchandiseId))
            .then(() => setLoading(false))
    }

    return (
        <Col span={24} className={classes.wrapDetailMerchandise}>
            <Col span={24} className={classes.wrapHeaderDetailMerchandise}>
                <div className={classes.wrapMerchandiseDetailName}>
                    <h1>
                        {merchandise.merchandiseName}
                    </h1>
                    <IoCloseSharp
                        className={`${classes.topIcon} ${classes.topIconHover}`}
                        onClick={closeModal}
                    />
                </div>
            </Col>
            <Col span={24}>
                <div className={classes.wrapBasketDetailMerchandise}>
                    <div className={classes.basketDetailMerchandise}>
                        <div className={classes.priceBlock}>
                            <strong className={classes.price}>Цена{' ' + merchandise?.price + ' '}$</strong>
                            <div className={loading === true ? `${classes.loadingActive}` : `${classes.loadingDisabled}`}>
                                <LoadingOutlined />
                            </div>
                            <div className={classes.wrapAdded}>
                                <div className={addedDevice === true ? `${classes.addedActive}` : `${classes.addedDisabled}`}>
                                    <CheckCircleFilled style={{ color: '#43ca04' }} />
                                    <strong>Добавленно</strong>
                                </div>
                            </div>
                        </div>
                        <PiShoppingCartThin className={classes.shopingCartIcon} />
                    </div>
                    <div className={classes.basket}>
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
                                    <strong onClick={addItemToCart}>Добавить в корзину</strong>
                                    :
                                    <strong onClick={removeItemToCart}>Отменить добавление в корзину</strong>
                                :
                                <strong onClick={() => setModalActiveBasket(true)}>Добавить в корзину</strong>
                            }
                        </div>
                    </div>
                </div>
            </Col>
            <Col span={24}>
                <div className={classes.blockImgMerchandise}>
                    <img src={API_URL + '/' + merchandise?.merchandiseImgName} />
                </div>
            </Col>
            <Col span={24} className={classes.ratingBlockMerchandise}>
                <div className={classes.wrapStarRaiting}>
                    <IoStarOutline className={classes.starIcon} />
                    <IoStarHalf className={classes.starIcon} />
                    <IoStar className={classes.starIcon} />
                </div>
            </Col>
            <div className={classes.сharacteristicsDetailMerchandise}>
                <h2>Характеристики товара</h2>
                {merchandise.infos?.map((info: Info, index: number) =>
                    <div key={info.deviceInfoId} style={{ background: index % 2 === 0 ? '#454545' : 'transparent', color: index % 2 === 0 ? "black" : '', padding: 5 }} className={classes.descriptionCharacteristicsDetailMerchandise}>
                        <strong>{info.title} : </strong>
                        <strong>{info.description}</strong>
                    </div>
                )}
            </div>
        </Col>
    )
})
export default MerchandiseDetail