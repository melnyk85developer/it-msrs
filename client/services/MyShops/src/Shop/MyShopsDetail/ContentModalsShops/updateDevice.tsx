import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Devices, MyShopsType, addInfo } from "@packages/shared/src/types/shopsTypes";
import { updateDiviceAC } from "@packages/shared/src/store/MyShopsReducers/myShopsSlice";
import FileUpload from "@packages/shared/src/components/FileUpload/fileUpload";
import paperСlip from "@packages/shared/src/assets/skrepka.png"
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import classes from './styles.module.scss';

type PropsType = {
    shop: MyShopsType;
    device: Devices;
    page: number;
    dispatch: AppDispatch;
    setModalUpdateDeviceActive: any;
}

const UpdateDevice: React.FC<PropsType> = ({ shop, device, dispatch, setModalUpdateDeviceActive }) => {
    const [selectedType, setSelectedType] = useState('');
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
    const [inputNameValue, setInputNameValue] = useState('');
    const [inputPriceValue, setInputPriceValue] = useState(0);
    const [nameImg, setNameImg] = useState('')
    const [inputNameFileValue, setInputNameFileValue] = useState<File | null>(null);
    const [info, setInfo] = useState<Array<addInfo>>([]);
    const deviceId = device.deviceId

    useEffect(() => {
        if(device && shop.types){
            setSelectedType(shop.types.filter(type => type.id === device.typeId)[0]?.name)
            setSelectedTypeId(shop.types.filter(type => type.id === device.typeId)[0]?.id)
            setSelectedBrand(shop.brands.filter(brand => brand.id === device.brandId)[0]?.name)
            setSelectedBrandId(shop.brands.filter(brand => brand.id === device.brandId)[0]?.id)
            setInputNameValue(device.name)
            setInputPriceValue(device.price)
            if(device.infos?.length){
                setInfo(device.infos)
            }
        }
    }, [device])

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
            dispatch(updateDiviceAC(device))
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
        setModalUpdateDeviceActive(false);
    };

    return (
        <Col className={classes.addFormType}>
            <h1>Редактировать товар</h1>
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
                        <img src={paperСlip} alt="skrepka"/>
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

export default UpdateDevice;
