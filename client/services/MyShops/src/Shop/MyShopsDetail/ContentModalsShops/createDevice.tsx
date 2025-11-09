import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { MyShopsType, addInfo } from "@packages/shared/src/types/shopsTypes";
import { addDeviceAC } from "@packages/shared/src/store/MyShopsReducers/myShopsSlice";
import classes from './styles.module.scss';
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import FileUpload from "@packages/shared/src/components/FileUpload/fileUpload";
import paperСlip from "@packages/shared/src/assets/skrepka.png"

type PropsType = {
    shop: MyShopsType;
    dispatch: AppDispatch;
    setModalActiveDevice: any
}

const CreateDevice: React.FC<PropsType> = ({ shop, dispatch, setModalActiveDevice }) => {
    const [selectedType, setSelectedType] = useState('');
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
    const [nameImg, setNameImg] = useState('')
    const [inputNameValue, setInputNameValue] = useState('');
    const [inputNameFileValue, setInputNameFileValue] = useState<File | null>(null);
    const [inputPriceValue, setInputPriceValue] = useState(0);
    const [info, setInfo] = useState<Array<addInfo>>([]);

    const addPropertyField = () => {
        setInfo([...info, { title: '', description: '' }]);
    };

    const removePropertyField = (index: number) => {
        setInfo(info.filter((_, i) => i !== index));
    };

    const submitForm = () => {
        if (inputNameValue !== '' && inputPriceValue !== 0 && inputNameFileValue && selectedType !== '' && selectedBrand !== '') {
            const device = {
                name: inputNameValue,
                price: inputPriceValue,
                brandId: selectedBrandId,
                typeId: selectedTypeId,
                file: inputNameFileValue,
                info: info,
                shopId: shop.shopId
            };

            dispatch(addDeviceAC(device));
            setSelectedType('');
            setSelectedBrand('');
            setInputNameValue('');
            setInputPriceValue(0);
            setInputNameFileValue(null);
            clearForm();
        } else {
            console.log('Вы не заполнили нужные поля для товара!');
        }
    };

    const selectTypeDevice = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = e.target.value;
        setSelectedType(selectedName);
        const selectedItem = shop.types.find(item => item.name === selectedName);
        if (selectedItem) {
            setSelectedTypeId(selectedItem.id);
        }
    };

    const selectBrandDevice = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = e.target.value;
        setSelectedBrand(selectedName);
        const selectedItem = shop.brands.find(item => item.name === selectedName);
        if (selectedItem) {
            setSelectedBrandId(selectedItem.id);
        }
    };

    const clearForm = () => {
        setSelectedType('');
        setSelectedBrand('');
        setInputNameValue('');
        setInputPriceValue(0);
        setInputNameFileValue(null);
        setInfo([]);
        setModalActiveDevice(false);
    };

    return (
        <div className={classes.addFormType}>
            <h1>Добавить товар</h1>
            <h3>Например: Apple 35pro</h3>
            <div className={classes.wrapSelect}>
                <select value={selectedType} onChange={selectTypeDevice}>
                    <option value="">Выбирите тип товара</option>
                    {shop.types?.map(item => (
                        <option key={item.id} value={item.name}>
                            {item.name}
                        </option>
                    ))}
                </select>
                <select value={selectedBrand} onChange={selectBrandDevice}>
                    <option value="">Выбирите бренд товара</option>
                    {shop.brands?.map(item => (
                        <option key={item.id} value={item.name}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className={classes.inputBlock}>
                <Input
                    value={inputNameValue}
                    onChange={(e) => setInputNameValue(e.target.value)}
                    placeholder="Введите название добавляемого товара"
                    className={classes.addFormTypeInput}
                />
                <Input
                    value={inputPriceValue}
                    onChange={(e) => setInputPriceValue(Number(e.target.value))}
                    type="number"
                    placeholder="Введите стоимость добавляемого товара"
                    className={classes.addFormTypeInput}
                />

                <div className={classes.wrapFileBlock}>
                    <FileUpload setFile={setInputNameFileValue} setNameImg={setNameImg}>
                        <div className={classes.fileBlock}>
                            <img src={paperСlip} alt="skrepka"/>
                            <strong>Прикрепить картинку товара</strong>
                        </div>
                    </FileUpload>
                    <div className={classes.fileNameImg}>
                        {nameImg !== null ? <p>Файл {nameImg}</p> : null}
                    </div>
                </div>
            </div>

            {info.map((prop, index) => (
                <div key={index} className={classes.propertyField}>
                    <Input
                        value={prop.title}
                        onChange={(e) => setInfo(info.map((p, i) => i === index ? { ...p, title: e.target.value } : p))}
                        placeholder="Название свойства"
                        className={classes.addPropertyInput}
                    />
                    <Input
                        value={prop.description}
                        onChange={(e) => setInfo(info.map((p, i) => i === index ? { ...p, description: e.target.value } : p))}
                        placeholder="Описание свойства"
                        className={classes.addPropertyInput}
                    />
                    <MinusCircleOutlined onClick={() => removePropertyField(index)} />
                </div>
            ))}
            <div onClick={addPropertyField} className={classes.buttonAddForm}>
                <PlusOutlined />
                <span>Добавить свойство товара</span>
            </div>

            <div className={classes.wrapButtonAddFormType}>
                <div onClick={clearForm} className={classes.buttonClean}>
                    <span>Очистить все формы</span>
                </div>
                <div onClick={submitForm} className={classes.buttonAdd}>
                    <span>Добавить</span>
                </div>
            </div>
        </div>
    );
};

export default CreateDevice;
