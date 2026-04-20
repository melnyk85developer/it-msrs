import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { MerchandisesBrands, MerchandisesTypes, MyShopsType, ShopBrands, ShopTypes, addInfo } from "@packages/shared/src/types/shopsTypes";
import { addMerchandiseAC, getMyAllShopsAC, setMerchandisesBrandsAC, setMerchandisesTypesAC, setShopsBrandsAC, setShopsTypesAC } from "@packages/shared/src/store/MyShopsReducers/myShopsSlice";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import FileUpload from "@packages/shared/src/components/FileUpload/fileUpload";
import paperСlip from "@packages/shared/src/assets/skrepka.png"
import classes from './styles.module.scss';

type PropsType = {
    dispatch: AppDispatch;
    shop: MyShopsType;
    merchandisesTypes: MerchandisesTypes[];
    merchandisesBrands: MerchandisesBrands[];
    // modalActiveMerchandise: boolean;
    setModalActiveMerchandise: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateMerchandise: React.FC<PropsType> = ({
    dispatch,
    shop,
    merchandisesTypes,
    merchandisesBrands,
    // modalActiveMerchandise,
    setModalActiveMerchandise
}) => {
    const [selectedType, setSelectedType] = useState('');
    const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
    const [nameImg, setNameImg] = useState('')
    const [inputNameValue, setInputNameValue] = useState('');
    const [inputNameFileValue, setInputNameFileValue] = useState<File | null>(null);
    const [inputPriceValue, setInputPriceValue] = useState(0);
    const [info, setInfo] = useState<Array<addInfo>>([]);

    useEffect(() => {
        dispatch(setMerchandisesTypesAC())
        dispatch(setMerchandisesBrandsAC())
    }, []);

    // console.log('CreateMerchandise: - merchandisesTypes', merchandisesTypes)
    // console.log('CreateMerchandise: - merchandisesBrands', merchandisesBrands)

    const addPropertyField = () => {
        setInfo([...info, { title: '', description: '' }]);
    };

    const removePropertyField = (index: number) => {
        setInfo(info.filter((_, i) => i !== index));
    };

    const submitForm = () => {
        // console.log('CreateMerchandise: - inputNameValue', inputNameValue)
        // console.log('CreateMerchandise: - selectedType', selectedType)
        // console.log('CreateMerchandise: - selectedBrand', selectedBrand)
        // console.log('CreateMerchandise: - inputNameFileValue', inputNameFileValue)
        // console.log('CreateMerchandise: - inputPriceValue', inputPriceValue)
        // console.log('CreateMerchandise: - info', info)
        if (inputNameValue && inputPriceValue !== 0 && selectedType && selectedBrand) {
            const merchandise = {
                merchandiseName: inputNameValue,
                price: inputPriceValue,
                brandId: selectedBrandId,
                typeId: selectedTypeId,
                file: inputNameFileValue,
                info: info,
                shopId: shop.shopId
            };

            dispatch(addMerchandiseAC(merchandise));
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

    const selectTypeMerchandise = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = e.target.value;
        setSelectedType(selectedName);
        const selectedItem = merchandisesTypes.find(item => item.merchandiseTypeName === selectedName);
        if (selectedItem) {
            setSelectedTypeId(selectedItem.typeId);
        }
    };

    const selectBrandMerchandise = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = e.target.value;
        setSelectedBrand(selectedName);
        const selectedItem = merchandisesBrands.find(item => item.merchandiseBrandName === selectedName);
        if (selectedItem) {
            setSelectedBrandId(selectedItem.brandId);
        }
    };

    const clearForm = () => {
        setSelectedType('');
        setSelectedBrand('');
        setInputNameValue('');
        setInputPriceValue(0);
        setInputNameFileValue(null);
        setInfo([]);
        setModalActiveMerchandise(false);
    };

    return (
        <div className={classes.addFormType}>
            <h1>Добавить товар</h1>
            <h3>Например: Apple 35pro</h3>
            <div className={classes.wrapSelect}>
                <select value={selectedType} onChange={selectTypeMerchandise}>
                    <option value="">Выбирите тип товара</option>
                    {merchandisesTypes?.map(item => (
                        <option key={item.typeId} value={item.merchandiseTypeName}>
                            {item.merchandiseTypeName}
                        </option>
                    ))}
                </select>
                <select value={selectedBrand} onChange={selectBrandMerchandise}>
                    <option value="">Выбирите бренд товара</option>
                    {merchandisesBrands?.map(item => (
                        <option key={item.brandId} value={item.merchandiseBrandName}>
                            {item.merchandiseBrandName}
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
                            <img src={paperСlip} alt="skrepka" />
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

export default CreateMerchandise;
