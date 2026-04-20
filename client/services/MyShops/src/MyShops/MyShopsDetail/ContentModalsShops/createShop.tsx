import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { createShopAC, createShopTypeAC, getMyAllShopsAC, setShopsTypesAC } from "@packages/shared/src/store/MyShopsReducers/myShopsSlice";
import { Button, Col, Input } from "antd";
import classes from './styles.module.scss';
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { ShopTypes } from "@packages/shared/src/types/shopsTypes";

type PropsType = {
    dispatch: AppDispatch;
    shopTypes: ShopTypes[];
    setModalActiveCreateShop: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateShop: React.FC<PropsType> = ({ 
    dispatch, 
    shopTypes, 
    setModalActiveCreateShop 
}) => {
    const {isAuth, authorizedUser, isDarkTheme} = useAppSelector(state => state.authPage);
    const [inputValueName, setInputValueName] = useState('');
    const [inputValueTitle, setInputValueTitle] = useState('');
    const [selectedShopType, setSelectedShopType] = useState('');
    const [selectedShopTypeId, setSelectedShopTypeId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(setShopsTypesAC());
    }, [dispatch]);

    const selectTypeDevice = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = e.target.value;
        setSelectedShopType(selectedName);
        const selectedItem = shopTypes?.find(item => item.typeName === selectedName);
        if(selectedItem){
            setSelectedShopTypeId(selectedItem.typeId);
        }
    };

    const createShop = () => {
        if (inputValueName !== '') {
            if (selectedShopTypeId !== null) {
                dispatch(createShopAC({
                    name: inputValueName,
                    title: inputValueTitle,
                    shopTypeId: selectedShopTypeId,
                    userId: authorizedUser.id
                }))
                .then(data => {
                    setInputValueName('');
                    setInputValueTitle('');
                    setModalActiveCreateShop(false)
                    dispatch(getMyAllShopsAC())
                })
            } else {
                console.log('Выберите тип магазина!');
            }
        } else {
            console.log('Вы не указали название магазина!');
        }
    };

    const addInputValueName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValueName(e.target.value);
    };

    const addInputValueTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValueTitle(e.target.value);
    };

    const Cancellation = () => {
        setInputValueName('');
        setInputValueTitle('');
        setModalActiveCreateShop(false);
    };

    return (
        <Col className={classes.addFormType}>
            <h1>Создать магазин</h1>
            <select value={selectedShopType} onChange={selectTypeDevice}>
                <option value="">Выберите тип магазина</option>
                {shopTypes?.map(item => (
                    <option key={item.typeId} value={item.typeName}>
                        {item.typeName}
                    </option>
                ))}
            </select>

            <h3>Придумайте название для своего магазина, к примеру: Fenix</h3>
            <Input
                onChange={addInputValueName} 
                value={inputValueName} 
                placeholder="Введите название Магазина" 
                className={classes.addFormTypeInput}
            />
            <h3>Придумайте подзаголовок для своего магазина, к примеру: Лучший ассортимент компьютерной техники!</h3>
            <Input
                onChange={addInputValueTitle} 
                value={inputValueTitle} 
                placeholder="Введите подзаголовок Магазина" 
                className={classes.addFormTypeInput}
            />
            <div className={classes.wrapButtonAddFormType}>
                <Button onClick={Cancellation}>Отмена</Button>
                <Button onClick={createShop}>Создать</Button>
            </div>
        </Col>
    );
};

export default CreateShop;
