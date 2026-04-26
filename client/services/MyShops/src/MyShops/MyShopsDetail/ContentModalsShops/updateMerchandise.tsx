import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Merchandise, MerchandisesBrands, MerchandisesTypes, MyShopsType, ShopBrands, ShopTypes, addInfo } from "@packages/shared/src/types/shopsTypes";
import { updateMerchandiseAC } from "@packages/shared/src/store/MyShopsReducers/myShopsSlice";
import FileUpload from "@packages/shared/src/components/FileUpload/fileUpload";
import paperСlip from "@packages/shared/src/assets/skrepka.png"
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import classes from './styles.module.scss';

type PropsType = {
    dispatch: AppDispatch;
    shop: MyShopsType;
    shopTypes: ShopTypes[];
    shopBrands: ShopBrands[];
    merchandise: Merchandise;
    pageNumber: number;
    setModalUpdateDeviceActive: any;
}

const UpdateMerchandise: React.FC<PropsType> = ({
    shop,
    shopTypes,
    shopBrands,
    merchandise,
    dispatch,
    setModalUpdateDeviceActive
}) => {
    const [selectedType, setSelectedType] = useState('');
    const [selectedTypeId, setSelectedTypeId] = useState<string | null>(null);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
    const [inputNameValue, setInputNameValue] = useState('');
    const [inputPriceValue, setInputPriceValue] = useState(0);
    const [nameImg, setNameImg] = useState('')
    const [inputNameFileValue, setInputNameFileValue] = useState<File | null>(null);
    const [info, setInfo] = useState<Array<addInfo>>([]);
    const deviceId = merchandise.merchandiseId

    useEffect(() => {
        if (merchandise && shopTypes) {
            setSelectedType(shopTypes.filter(type => type.typeId === merchandise.typeId)[0]?.typeName)
            setSelectedTypeId(shopTypes.filter(type => type.typeId === merchandise.typeId)[0]?.typeId)
            setSelectedBrand(shopBrands.filter(brand => brand.brandId === merchandise.brandId)[0]?.brandName)
            setSelectedBrandId(shopBrands.filter(brand => brand.brandId === merchandise.brandId)[0]?.brandId)
            setInputNameValue(merchandise.merchandiseName)
            setInputPriceValue(merchandise.price)
            if (merchandise.infos?.length) {
                setInfo(merchandise.infos)
            }
        }
    }, [merchandise])

    const addPropertyField = () => {
        setInfo([...info, { title: '', description: '' }]);
    };

    const removePropertyField = (index: number) => {
        setInfo(info.filter((_, i) => i !== index));
    };

    const submitForm = () => {
        if (inputNameValue !== '' && inputPriceValue !== 0 && inputNameFileValue && selectedType !== '' && selectedBrand !== '') {
            const device = {
                deviceId: deviceId,
                name: inputNameValue,
                price: inputPriceValue,
                brandId: selectedBrandId,
                typeId: selectedTypeId,
                file: inputNameFileValue,
                info: info,
                shopId: shop.shopId
            };
            dispatch(updateMerchandiseAC(device))
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
        const selectedItem = shopTypes.find(item => item.typeId === selectedName);
        if (selectedItem) {
            setSelectedTypeId(selectedItem.typeId);
        }
    };

    const selectBrandDevice = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedName = e.target.value;
        setSelectedBrand(selectedName);
        const selectedItem = shopBrands.find(item => item.brandName === selectedName);
        if (selectedItem) {
            setSelectedBrandId(selectedItem.brandName);
        }
    };

    const clearForm = () => {
        setSelectedType('');
        setSelectedBrand('');
        setInputNameValue('');
        setInputPriceValue(0);
        setInputNameFileValue(null);
        setInfo([]);
        setModalUpdateDeviceActive(false);
    };

    return (
        <Col className={classes.addFormType}>
            <h1>Редактировать товар</h1>
            <div className={classes.wrapSelect}>
                <select value={selectedType} onChange={selectTypeDevice}>
                    <option value="">Выбирите тип товара</option>
                    {shopTypes?.map(item => (
                        <option key={item.typeId} value={item.typeName}>
                            {item.typeName}
                        </option>
                    ))}
                </select>
                <select value={selectedBrand} onChange={selectBrandDevice}>
                    <option value="">Выбирите бренд товара</option>
                    {shopBrands?.map(item => (
                        <option key={item.brandId} value={item.brandName}>
                            {item.brandName}
                        </option>
                    ))}
                </select>
            </div>
            <Input
                value={inputNameValue}
                onChange={(e) => setInputNameValue(e.target.value)}
                placeholder="Введите название устройства"
                className={classes.addFormTypeInput}
            />
            <Input
                value={inputPriceValue}
                onChange={(e) => setInputPriceValue(Number(e.target.value))}
                type="number"
                placeholder="Введите стоимость устройства"
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
            {info.map((prop, index) => (
                <div key={index} className={classes.propertyField}>
                    <Input
                        value={prop.title}
                        onChange={(e) => setInfo(info.map((p, i) => i === index ? { ...p, title: e.target.value } : p))}
                        placeholder="Название свойства"
                    />
                    <Input
                        value={prop.description}
                        onChange={(e) => setInfo(info.map((p, i) => i === index ? { ...p, description: e.target.value } : p))}
                        placeholder="Описание свойства"
                    />
                    <MinusCircleOutlined onClick={() => removePropertyField(index)} />
                </div>
            ))}
            <Button
                type="dashed"
                onClick={addPropertyField}
                block icon={<PlusOutlined />}
                className={classes.buttonAddForm}
            >
                Добавить свойство товара
            </Button>

            <div className={classes.wrapButtonAddFormType}>
                <Button onClick={clearForm}>Очистить все формы</Button>
                <Button type="primary" onClick={submitForm}>Сохранить</Button>
            </div>
        </Col>
    );
};

export default UpdateMerchandise;
