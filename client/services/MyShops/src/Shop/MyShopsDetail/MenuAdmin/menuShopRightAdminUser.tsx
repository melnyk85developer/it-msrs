import React, { useState, useRef, useEffect } from "react";
import { PlusOutlined, UnorderedListOutlined, ShoppingCartOutlined, EditOutlined } from "@ant-design/icons";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import classes from './styles.module.scss';

type PropsTypeMenuShopRight = {
    dispatch: AppDispatch;
    setModalActiveBasket: React.Dispatch<React.SetStateAction<boolean>>;
    setModalActiveCreateShop: React.Dispatch<React.SetStateAction<boolean>>;
    setModalActiveUpdateShop: React.Dispatch<React.SetStateAction<boolean>>;
    setModalActiveType: React.Dispatch<React.SetStateAction<boolean>>;
    setModalActiveBrand: React.Dispatch<React.SetStateAction<boolean>>;
    setModalActiveDevice: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MenuShopRightAdminUser: React.FC<PropsTypeMenuShopRight> = ({ 
    setModalActiveCreateShop, setModalActiveUpdateShop, setModalActiveBrand, setModalActiveDevice, 
    setModalActiveType, setModalActiveBasket }) => {
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
                <UnorderedListOutlined className={classes.icon} />
            </div>
            <div className={`${isOpen ? classes.shop_menuRightActive : classes.shop_menuRightDisactive}`}>
                <ul className={classes.wrap_menu_options}>
                    <div className={classes.li} onClick={() => setModalActiveDevice(true)}>
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
                    <div className={classes.li} onClick={() => setModalActiveCreateShop(true)}>
                        <PlusOutlined />
                        <strong>Создать еще магазин</strong>
                    </div>
                    <div className={classes.li} onClick={() => setModalActiveUpdateShop(true)}>
                        <EditOutlined />
                        <strong>Редактировать магазин</strong>
                    </div>
                    <div className={classes.li} onClick={() => setModalActiveBasket(true)}>
                        <ShoppingCartOutlined className={classes.basketImgNavUserAdmin}/>
                        <span>Тестовая Корзина</span>
                    </div>
                </ul>
            </div>
        </div>
    );
};
