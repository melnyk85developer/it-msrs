import React, { useState, useRef, useEffect } from "react";
import { PlusOutlined, UnorderedListOutlined, ShoppingCartOutlined, EditOutlined, MenuOutlined } from "@ant-design/icons";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import classes from './styles.module.scss';

type PropsTypeMenuShopRight = {
    currentTypePage: string;
    dispatch: AppDispatch;
    setModalActiveBasket: React.Dispatch<React.SetStateAction<boolean>>;
    setModalActiveCreateShop: React.Dispatch<React.SetStateAction<boolean>>;
    setModalActiveUpdateShop: React.Dispatch<React.SetStateAction<boolean>>;
    setModalActiveType: React.Dispatch<React.SetStateAction<boolean>>;
    setModalActiveBrand: React.Dispatch<React.SetStateAction<boolean>>;
    setModalActiveMerchandise: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MenuShopRightAdminUser: React.FC<PropsTypeMenuShopRight> = ({
    currentTypePage,
    setModalActiveCreateShop,
    setModalActiveUpdateShop,
    setModalActiveBrand,
    setModalActiveMerchandise,
    setModalActiveType,
    setModalActiveBasket
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={classes.wrapTopNavRightShopAdmin} ref={dropdownRef}>
            <div className={classes.menu_icon} onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)}>
                <MenuOutlined className={classes.icon} />
            </div>
            <div className={`${isOpen ? classes.shop_menuRightActive : classes.shop_menuRightDisactive}`}>
                {
                    currentTypePage === 'list'
                        ?
                        <ul className={classes.wrap_menu_options}>
                            <div className={classes.li} onClick={() => setModalActiveCreateShop(true)}>
                                <PlusOutlined />
                                <strong>Создать еще магазин</strong>
                            </div>
                        </ul>
                        :
                        currentTypePage === 'shop'
                            ?
                            <ul className={classes.wrap_menu_options}>
                                <div className={classes.li} onClick={() => setModalActiveMerchandise(true)}>
                                    <PlusOutlined />
                                    <strong>Добавить товар</strong>
                                </div>
                                <div className={classes.li} onClick={() => setModalActiveType(true)}>
                                    <PlusOutlined />
                                    <strong>Добавить тип товара</strong>
                                </div>
                                <div className={classes.li} onClick={() => setModalActiveBrand(true)}>
                                    <PlusOutlined />
                                    <strong>Добавить бренд товара</strong>
                                </div>
                                <div className={classes.li} onClick={() => setModalActiveBasket(true)}>
                                    <ShoppingCartOutlined className={classes.basketImgNavUserAdmin} />
                                    <span>Тестовая Корзина</span>
                                </div>
                            </ul>
                            :
                            <></>
                }
            </div>
        </div>
    );
};
