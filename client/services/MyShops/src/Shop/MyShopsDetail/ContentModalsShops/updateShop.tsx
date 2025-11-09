import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { updateShopAC } from "@packages/shared/src/store/MyShopsReducers/myShopsSlice";
import { Button, Col, Input } from "antd";
import { MyShopsType } from "@packages/shared/src/types/shopsTypes";
import classes from './styles.module.scss';
import { AppDispatch } from "@packages/shared/src/store/redux-store";

type PropsType = {
    shop: MyShopsType;
    dispatch: AppDispatch;
    setModalActiveUpdateShop: React.Dispatch<React.SetStateAction<boolean>>
}

const UpdateShop: React.FC<PropsType> = ({ shop, dispatch, setModalActiveUpdateShop }) => {
    const {isAuth, authorizedUser, isDarkTheme} = useAppSelector(state => state.authPage)
    const [inputValueName, setInputValueName] = useState('')
    const [inputValueTitle, setInputValueTitle] = useState('')

    useEffect(() => {
        setInputValueName(shop.name);
        setInputValueTitle(shop.title)
    }, [shop])

    const updateShop = () => {
        if(inputValueName !== ''){
            dispatch(updateShopAC({
                shopId: shop.shopId,
                name: inputValueName,
                title: inputValueTitle,
                userId: authorizedUser.userId
            }))
            .then(data => {
                setInputValueName('')
                setInputValueTitle('')
                setModalActiveUpdateShop(false)
            })
        }else{
            console.log('Вы не указали название магазина!')
        }
    }
    const addInputValueName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValueName(e.target.value)
    }
    const addInputValueTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValueTitle(e.target.value)
    }
    const Cancellation = () => {
        setInputValueName('')
        setInputValueTitle('')
        setModalActiveUpdateShop(false)
    }
    return (
        <Col className={classes.addFormType}>
            <h1>Редактировать магазин</h1>
            <Input
                onChange={addInputValueName} 
                value={inputValueName} 
                placeholder="Ведите название Магазина" 
                className={classes.addFormTypeInput}
            />
            <Input
                onChange={addInputValueTitle} 
                value={inputValueTitle} 
                placeholder="Ведите подзаголовок Магазина" 
                className={classes.addFormTypeInput}
            />
            <div className={classes.wrapButtonAddFormType}>
                <Button onClick={Cancellation}>Отмена</Button>
                <Button onClick={updateShop}>Сохранить</Button>
            </div>
        </Col>
    )
}
export default UpdateShop