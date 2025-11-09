import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { useAppContext } from "@packages/shared/src/components/contexts/AppContext";
import { createShopTypeAC } from "@packages/shared/src/store/MyShopsReducers/myShopsSlice";
import { Button, Col, Input } from "antd";
import classes from '../../styles.module.scss';

const AdminShops: React.FC = React.memo(() => {
    const dispatch = useAppDispatch();
    const { isDarkTheme } = useAppSelector(state => state.authPage);
    const [inputValueTypeShop, setInputValueTypeShop] = useState('');

    const typeName = inputValueTypeShop
    
    const createTypeShop = () => {
        if(inputValueTypeShop){
            dispatch(createShopTypeAC(typeName))
        }else{
            console.log('Вы не указали тип магазина!');
        }
    };

    const addInputValueTypeShop = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValueTypeShop(e.target.value);
    };
    
    return (
        <div className={`${classes.wrapAdminContent} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <div className={classes.adminContent}>
                <h1 className={classes.title}>Первичные настройки для магазинов!</h1>
                <div className={classes.content}>
                    <div className={classes.wrapAdminShop}>
                        <div className={classes.addTypeShopBlock}>
                            <Input
                                onChange={addInputValueTypeShop} 
                                value={inputValueTypeShop} 
                                placeholder="Введите название типа магазина" 
                                className={classes.addFormTypeShopInput}
                            />
                            <Button onClick={createTypeShop}>Добавить тип магазина</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})
export default AdminShops