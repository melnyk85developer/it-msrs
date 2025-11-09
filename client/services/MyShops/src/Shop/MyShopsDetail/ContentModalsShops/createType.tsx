import { Button, Col, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { createTypeAC } from "@packages/shared/src/store/MyShopsReducers/myShopsSlice";
import classes from './styles.module.scss';
import { MyShopsType } from "@packages/shared/src/types/shopsTypes";

type PropsType = {
    shop: MyShopsType
    setModalActiveType: any
}

const CreateType: React.FC<PropsType> = ({ shop, setModalActiveType }) => {
    const dispatch = useAppDispatch()
    const [inputValue, setInputValue] = useState('')

    const addType = () => {
        if(inputValue !== ''){
            dispatch(createTypeAC({
                name: inputValue,
                shopId: shop.shopId
            }))
            .then(data => {
                setInputValue('')
                setModalActiveType(false)
            })
        }else{
            console.log('Вы не указали тип')
        }
    }
    const addInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }
    const Cancellation = () => {
        setInputValue('')
        setModalActiveType(false)
    }
    return (
        <Col className={classes.addFormType}>
            <h1>Добавить тип товара</h1>
            <h3>Например: Техника, Одежда, Продукты, и т.д. </h3>
            <Input
                onChange={addInputValue} 
                value={inputValue} 
                placeholder="Ведите название типа" 
                className={classes.addFormTypeInput}
            />
            <div className={classes.wrapButtonAddFormType}>
                <Button onClick={Cancellation}>Отмена</Button>
                <Button onClick={addType}>Добавить</Button>
            </div>
        </Col>
    )
}
export default CreateType