import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { createBrandAC } from "@packages/shared/src/store/MyShopsReducers/myShopsSlice";
import { Button, Col, Input } from "antd";
import React, { useState } from "react";
import classes from './styles.module.scss';
import { MyShopsType } from "@packages/shared/src/types/shopsTypes";

type PropsType = {
    shop: MyShopsType
    setModalActiveBrand: any
}

const CreateBrand: React.FC<PropsType> = ({ shop, setModalActiveBrand }) => {
    const dispatch = useAppDispatch()
    const [inputValue, setInputValue] = useState('')

    const addBrand = () => {
        if(inputValue !== ''){
            dispatch(createBrandAC({
                name: inputValue,
                shopId: shop.shopId
            }))
            .then(data => {
                setInputValue('')
                setModalActiveBrand(false)
            })
        }else{
            console.log('Вы не указали бренд')
        }
    }
    const addInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value)
    }
    const Cancellation = () => {
        setInputValue('')
        setModalActiveBrand(false)
    }
    return (
        <Col className={classes.addFormType}>
            <h1>Добавить бренд</h1>
            <h3>Например: Samsung, Asus, Lenovo, и т.д. </h3>
            <Input
                onChange={addInputValue} 
                value={inputValue} 
                placeholder="Ведите название бренда" 
                className={classes.addFormTypeInput}
            />
            <div className={classes.wrapButtonAddFormType}>
                <Button onClick={Cancellation}>Отмена</Button>
                <Button onClick={addBrand}>Добавить</Button>
            </div>
        </Col>
    )
}
export default CreateBrand