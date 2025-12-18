import React, { useEffect, useState } from "react";
import FileUpload from "@packages/shared/src/components/FileUpload/fileUpload";
import WidgetFriends from '@packages/shared/src/components/Widgets/WidgetFriends'
import WidgetPeople from '@packages/shared/src/components/Widgets/WidgetsPeople'
import WidgetPerhapsYoureFamiliar from '@packages/shared/src/components/Widgets/WidgetPerhapsYoureFamiliar'
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { registrationAC, successfulRegistrationAC } from "@packages/shared/src/store/AuthReducers/authSlice";
import MyCropperAvatar from "./UploadAvatar/UploadAvatar";
import NewAvatar from "./NewAvatar/NewAvatar";
import { useAppContext } from '@packages/shared/src/components/contexts/AppContext';
import TypingEffect from "@packages/shared/src/components/TypingEffect";
import classes from './styles.module.scss'
import { Col } from "antd";

type PropsType = {
    setRedirect: any
}

const RegistrationForm: React.FC<PropsType> = React.memo(({ setRedirect }) => {
    const dispatch = useAppDispatch()
    const { isAuth, error } = useAppSelector(state => state.authPage)
    const { content, setContent } = useAppContext();
    const { isDarkTheme } = useAppSelector(state => state.authPage)
    const [avatar, setAvatar] = useState<any>(null);
    const [nameImg, setNameImg] = useState('');
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [cropper, setCropper] = useState<Cropper | null>(null);
    const [message, setMessage] = useState<string>(`Регистрация прошла успешно!`);
    const [errors, setErrors] = useState<string>(error);
    const [timer, setTimer] = useState(3 * 60)
    const [showMessage, setShowMessage] = useState(false);
    const [send, setSend] = useState(false);

    useEffect(() => {
        if (error) {
            console.log('ERROR RegistrationForm: - ', error)

            setMessage('');
            const extractISODate = (message: string): string | null => {
                const isoDatePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;
                const match = message.match(isoDatePattern);
                return match ? match[0] : null;
            };
            const isoDate = extractISODate(error);
            const currentTime = Date.now();
            const expirationTime = new Date(isoDate).getTime();
            const remainingTimeInSeconds = Math.floor((expirationTime - currentTime) / 1000);

            const textWithoutDate = error.split('2024-')[0].trim();
            setErrors(textWithoutDate)
            setTimer(remainingTimeInSeconds)
        }
    }, [error, send]);

    useEffect(() => {
        setContent(newContent);
    }, [croppedImage])

    useEffect(() => {
        if (errors) { setErrors('') }
    }, [])

    const newContent = {
        contentTopNav: [] as React.ReactNode[],
        contentLsidebar: [
            <div>
                <NewAvatar
                    avatar={croppedImage}
                />
                <div className={classes.wrapWidgetFriendsProfile}>
                    {/* <WidgetFriends /> */}
                </div>
                <div className={classes.wrapWidgetPeopleProfile}>
                    {/* <WidgetPeople /> */}
                </div>
            </div>
        ],
        contentRsidebar: [
            <WidgetPerhapsYoureFamiliar />
        ],
        contentFooter: [
            <div className={`
                ${classes.wrapFooterSectionsForSettingProfile}
                ${isDarkTheme !== "light"
                    ? classes.dark
                    : classes.light
                }
            `}>
                <Col className={classes.footer_sections}>
                    <p>Блок 1</p>
                </Col>
                <Col className={classes.footer_sections}>
                    <p>Блок 2</p>
                </Col>
                <Col className={classes.footer_sections}>
                    <p>Блок 3</p>
                </Col>
                <Col className={classes.footer_sections}>
                    <p>Блок 4</p>
                </Col>
            </div>
        ]
    };
    const handleFileSelect = (file: File) => {
        setNameImg(URL.createObjectURL(file));
    };
    const handleCrop = () => {
        if (cropper) {
            const croppedCanvas = cropper.getCroppedCanvas();
            if (croppedCanvas) {
                croppedCanvas.toBlob((blob: any) => {
                    setCroppedImage(URL.createObjectURL(blob));
                    setAvatar(blob);
                });
            }
        }
    };
    const [formValues, setFormValues] = useState({
        login: '',
        email: '',
        password: '',
        confirm: '',
        name: '',
        surname: ''
    });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };
    const validateForm = () => {
        let errors: any = {};

        if (!formValues.login) {
            errors.login = 'Пожалуйста, придумайте свой Login!';
            setErrors(errors.login); // Сетим первую ошибку
            return false; // Останавливаем дальнейшую валидацию
        }

        if (!formValues.email) {
            errors.email = 'Пожалуйста, введите свой E-mail!';
            setErrors(errors.email); // Сетим первую ошибку
            return false; // Останавливаем дальнейшую валидацию
        }

        if (!formValues.password) {
            errors.password = 'Пожалуйста, введите свой пароль!';
            setErrors(errors.password); // Сетим ошибку для пароля
            return false;
        }

        if (formValues.password !== formValues.confirm) {
            errors.confirm = 'Новый пароль, который вы ввели, не совпадает!';
            setErrors(errors.confirm); // Сетим ошибку для подтверждения пароля
            return false;
        }

        // if (!formValues.name) {
        //     errors.name = 'Пожалуйста, введите Ваше имя!';
        //     setErrors(errors.name); // Сетим ошибку для имени
        //     return false;
        // }

        // if (!formValues.surname) {
        //     errors.surname = 'Пожалуйста, введите Вашу фамилию!';
        //     setErrors(errors.surname); // Сетим ошибку для фамилии
        //     return false;
        // }

        return true;
    };
    const onFinish = async () => {
        setErrors('')
        setMessage('')
        const newUser = {
            login: formValues.login,
            email: formValues.email,
            name: formValues.name,
            surname: formValues.surname,
            password: formValues.password,
            avatar: avatar
        };
        dispatch(registrationAC(newUser.login, newUser.name, newUser.surname, newUser.email, newUser.password, newUser.avatar))
            .then(() => dispatch(successfulRegistrationAC(formValues.email)))
            .then((data: any) => {
                if (data?.message) {
                    dispatch(successfulRegistrationAC(formValues.email))
                    console.log('RegistrationForm: - ', data?.message)
                    const extractISODate = (message: string): string | null => {
                        const isoDatePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;
                        const match = message.match(isoDatePattern);
                        return match ? match[0] : null;
                    };
                    const isoDate = extractISODate(data.message);
                    const currentTime = Date.now();
                    const expirationTime = new Date(isoDate).getTime();
                    const remainingTimeInSeconds = Math.floor((expirationTime - currentTime) / 1000);
                    const textWithoutDate = data.message.split('2024-')[0].trim();
                    setMessage(textWithoutDate);
                    setErrors('');
                    setRedirect(true)
                }
            })
            .then(() => setRedirect(true))
            .finally(() => {
                setSend((prevState) => !prevState)
                setShowMessage(true)
            })
    }
    return (
        <div className={`${classes.wrapRegistration} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <div className={classes.contentRegistration}>
                <h1>Регистрация</h1>
                <div className={classes.errorMessages}>
                    {errors && errors !== "" && error &&
                        <p className={classes.message}>
                            <TypingEffect message={errors} speed={30} />
                        </p>
                    }
                    {!error && errors &&
                        <p className={classes.message}>
                            <TypingEffect message={errors} speed={30} />
                        </p>
                    }
                </div>
                <div className={classes.wrapForm}>
                    <h3>Ваш Login:</h3>
                    <input type="login" name="login" value={formValues.login} onChange={handleChange} />
                    <h3>Ваш E-mail:</h3>
                    <input type="email" name="email" value={formValues.email} onChange={handleChange} />
                    <h3>Придумайте Ваш пароль:</h3>
                    <input type="password" name="password" value={formValues.password} onChange={handleChange} />
                    <h3>Подтвердите Ваш придуманный пароль:</h3>
                    <input type="password" name="confirm" value={formValues.confirm} onChange={handleChange} />
                    <h3>Ваше Имя:</h3>
                    <input name="name" value={formValues.name} onChange={handleChange} />
                    <h3>Ваша фамилия:</h3>
                    <input name="surname" value={formValues.surname} onChange={handleChange} />
                    {nameImg &&
                        <div className={classes.blockCropperAvatar}>
                            <MyCropperAvatar
                                nameImg={nameImg}
                                setCropper={setCropper}
                            />
                        </div>
                    }
                    <div className={classes.wrapButtonBlockRegistration}>
                        <FileUpload setFile={handleFileSelect} accept="image/*">
                            <button>Выбрать Avatar</button>
                        </FileUpload>
                        {nameImg &&
                            <button type="button" className={classes.trim} onClick={handleCrop}>Обрезать</button>}
                        <div className={classes.wrapButtonRegistration}>
                            <button type="button" onClick={() => { if (validateForm()) onFinish(); }}>
                                Зарегистрироваться
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default RegistrationForm;
