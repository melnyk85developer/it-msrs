import React, { useState, useRef, useEffect } from "react";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { MenuShopRightAdminUser } from "./MenuAdmin/menuShopRightAdminUser";
import { Col } from "antd";
import { MenuShopLeftAdminUser } from "./MenuAdmin/menuShopLeftAdminUser";
import classes from './styles.module.scss';
import { ShopBrands, ShopTypes } from "@packages/shared/src/types/shopsTypes";

type PropsTypeMenuShopRight = {
    dispatch: AppDispatch;
    // shopTypes: ShopTypes[],
    // shopBrands: ShopBrands[],
    titleMyShop: string;
    setTitleMyShop: React.Dispatch<React.SetStateAction<string>>;
    currentTypePage: string;
    setCurrentTypePage: React.Dispatch<React.SetStateAction<string>>;
    setModalActiveBasket: React.Dispatch<React.SetStateAction<boolean>>;
    setModalActiveCreateShop: React.Dispatch<React.SetStateAction<boolean>>;
    setModalActiveUpdateShop: React.Dispatch<React.SetStateAction<boolean>>;
    setModalActiveType: React.Dispatch<React.SetStateAction<boolean>>;
    setModalActiveBrand: React.Dispatch<React.SetStateAction<boolean>>;
    setModalActiveMerchandise: React.Dispatch<React.SetStateAction<boolean>>;
    isDarkTheme: string;
};

export const MyShopTopNav: React.FC<PropsTypeMenuShopRight> = ({
    dispatch,
    // shopTypes,
    // shopBrands,
    titleMyShop,
    setTitleMyShop,
    setModalActiveBasket,
    setModalActiveBrand,
    setModalActiveCreateShop,
    setModalActiveMerchandise,
    setModalActiveType,
    setModalActiveUpdateShop,
    currentTypePage,
    setCurrentTypePage,
    isDarkTheme
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

    // console.log('MyShopTopNav: - shopTypes', shopTypes)
    // console.log('MyShopTopNav: - shopBrands', shopBrands)

    return (
        <Col span={24} className={`
            ${classes.wrapTopNawShop}
                ${isDarkTheme !== "light"
                ? classes.dark
                : classes.light
            }`}
        >
            <Col span={2}>
                {/* <MenuShopLeftAdminUser myshops={myshops} dispatch={dispatch} /> */}
            </Col>
            <Col span={4}></Col>
            <Col span={12}>
                <h1>{titleMyShop}</h1>
            </Col>
            <Col span={4}></Col>
            <Col span={2}>
                <MenuShopRightAdminUser
                    dispatch={dispatch}
                    currentTypePage={currentTypePage}
                    setModalActiveType={setModalActiveType}
                    setModalActiveBrand={setModalActiveBrand}
                    setModalActiveMerchandise={setModalActiveMerchandise}
                    setModalActiveBasket={setModalActiveBasket}
                    setModalActiveCreateShop={setModalActiveCreateShop}
                    setModalActiveUpdateShop={setModalActiveUpdateShop}
                />
            </Col>
        </Col>
    );
};
