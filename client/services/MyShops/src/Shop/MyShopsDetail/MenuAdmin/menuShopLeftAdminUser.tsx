import React, { useState, useRef, useEffect } from "react";
import { MyShopsType } from "@packages/shared/src/types/shopsTypes";
import { setShopDetailAC } from "@packages/shared/src/store/MyShopsReducers/myShopsSlice";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { NavLink } from "react-router-dom";
import { routeMain as routeShop} from "../../myShopsContainer"
import classes from './styles.module.scss';

type PropsTypeMenuShopLeft = {
    myshops: MyShopsType[]
    dispatch: AppDispatch;
}

export const MenuShopLeftAdminUser: React.FC<PropsTypeMenuShopLeft> = ({ myshops, dispatch }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const setShop = (shopId: number) => {
        dispatch(setShopDetailAC(shopId));
    };
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
        <div className={classes.wrapTopNavLeftShopAdmin} ref={dropdownRef}>
            <strong onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)} className={classes.myShops}>
                Мои Магазины
            </strong>
            <div className={classes.topMenuShopLeft}>
                <div className={`${isOpen ? classes.shop_menuLeftActive : classes.shop_menuLeftDisactive}`}>
                    {myshops?.map(shop => (
                        <NavLink to={routeShop(shop.shopId)}
                            key={shop.shopId}
                            onClick={() => setShop(shop.shopId)}
                            className={classes.shopItemMenuLeft}
                        >
                            {shop.name}
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
};
