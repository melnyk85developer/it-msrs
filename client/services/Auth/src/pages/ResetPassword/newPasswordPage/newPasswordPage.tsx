import React, { useEffect, useState } from "react";
import routeMain from "../newPasswordPage/route";
import WidgetFriends from "@packages/shared/src/components/Widgets/WidgetFriends";
import WidgetPeople from "@packages/shared/src/components/Widgets/WidgetsPeople";
import WidgetPerhapsYoureFamiliar from "@packages/shared/src/components/Widgets/WidgetPerhapsYoureFamiliar";
import TypingEffect from "@packages/shared/src/components/TypingEffect";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { CheckOutlined, EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { routeMain as routeMyProfile } from "../../../../../MyProfile/src/MyProfile/MyProfileContainer";
import { Navigate, NavLink, useLocation, useParams } from "react-router-dom";
import { useAppContext } from "@packages/shared/src/components/contexts/AppContext";
import { FOOTER_ON, setContentSpanAC, setFooterAC, setLSidebarAC, setLSidebarSpanAC, setRSidebarAC, setRSidebarSpanAC, SIDEBAR_OFF, SIDEBAR_ON } from "@packages/shared/src/store/PageElementsSlice/pageElementsSlice";
import { sendEmailResetPasswordMyProfileAC, updatePasswordAC } from "@packages/shared/src/store/MyProfileReducers/myProfileSlice";
import { loginAC } from "@packages/shared/src/store/AuthReducers/authSlice";
import classes from "./styles.module.scss";
import { Col } from "antd";

const NewPssword: React.FC = React.memo(() => {
    const dispatch = useAppDispatch();
    const { setContent, setPageType } = useAppContext();
    const location = useLocation();
    const {isDarkTheme, authorizedUser, isAuth, isLoadingAuthUser} = useAppSelector(state => state.authPage)
    const queryParams = new URLSearchParams(location.search);
    const { error } = useAppSelector((state) => state.myProfilePage);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [showMessage, setShowMessage] = useState(false);
    const [send, setSend] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Управление видимостью пароля
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Видимость для confirmPassword
    const messages = [
        `Используйте заглавные и строчные буквы: Это усилит безопасность пароля, делая его труднее для взлома.`,
        `Добавьте цифры и специальные символы: Комбинированные символы, такие как <code>!</code>, <code>@</code>, <code>#</code>, делают пароль еще более устойчивым.`,
        `Минимум 8 символов: Чем длиннее пароль, тем сложнее его угадать. Попробуйте сделать его не менее <strong>8 символов</strong>.`,
        `Избегайте простых слов: Используйте уникальные комбинации символов и избегайте очевидных слов или последовательностей, таких как <code>"123456"</code> или <code>"password"</code>.`
    ];
    const conclusionMessage = `Создавая сильный пароль, вы помогаете защитить свои данные и аккаунт!`;
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (error) {
            setErrors(error);
            setMessage('');
        }
    }, [error, send])

    useEffect(() => {
        if (currentIndex < messages.length) {
          const typingDuration = messages[currentIndex].length * 30; // Подгоняем длительность анимации
          const timer = setTimeout(() => {
            setCurrentIndex((prev) => prev + 1); // Переход к следующему сообщению
          }, typingDuration);
    
          return () => clearTimeout(timer); // Очистка таймера при размонтировании
        }
    }, [currentIndex, messages]);

    const validatePassword = () => {
        if (!password.trim() || !confirmPassword.trim()) {
            return "Поля не должны быть пустыми!";
        }
        if (password.length < 5) {
            return "Пароль должен быть не менее 5 символов.";
        }
        if (password !== confirmPassword) {
            return "Пароли не совпадают!";
        }
        return null
    }
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        setErrors('')
        setMessage('')
        setShowMessage(false)

        const validationError = validatePassword()
        if (validationError) {
            setErrors(validationError)
            return;
        }

        dispatch(updatePasswordAC(password, queryParams.get("code")))
        .then((data: any) => {
            if (data?.message) {
                console.log('updatePasswordAC: - then', data)
                setMessage(data.message)
            }
        })
        .finally(() => {
            setSend((prevState) => !prevState)
            setShowMessage(true)
        })
    }
    const autch = () => {
        dispatch(loginAC('melnyk85developer@gmail.com', 'masikus2002vm'))
        .then(() => console.log('Переход в профиль пользователя'))
    }
    const newContent = {
        contentTopNav: [] as React.ReactNode[],
        contentLsidebar: [
            <div>
                <WidgetPerhapsYoureFamiliar/>
                <WidgetPeople />
                <WidgetFriends />
            </div>
        ],
        contentRsidebar: [
            <div>
                <WidgetPeople />
                <WidgetPerhapsYoureFamiliar/>
                <WidgetFriends />
            </div>
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
    }
    useEffect(() => {
        setContent(newContent);
        dispatch(setLSidebarAC(SIDEBAR_ON));
        dispatch(setLSidebarSpanAC(5));
        dispatch(setContentSpanAC(10));
        dispatch(setRSidebarAC(SIDEBAR_OFF));
        dispatch(setRSidebarSpanAC(5));
        dispatch(setFooterAC(FOOTER_ON));
        setPageType('stretch');
    }, [])
    return (
        <div className={classes.wrapContentRessedPassword}>
            <div className={classes.contentRessedPassword}>
                <h2>Несколько рекомендаций к созданию пароля:</h2>
                <div className={classes.wrapTitle}>
                    {messages.slice(0, currentIndex + 1).map((message, index) => (
                        <div className={classes.wrapPunktTitle} key={index}>
                            <span style={{ color: '#ff6600' }}>{index + 1}.</span>
                            <p style={{ color: 'wheat' }}>
                                <TypingEffect message={message} speed={30} />
                            </p>
                        </div>
                    ))}
                    {currentIndex === messages.length && (
                        <p style={{ color: '#ff6600', fontSize: '16px', fontWeight: 550 }}>
                            <TypingEffect message={conclusionMessage} speed={30} />
                        </p>
                    )}
                </div>
                <div className={classes.wrapMessage}>
                    {errors && 
                        <h3 className={classes.h3ErrorsMessage} style={errors ? { color: "red" } : { color: "green", fontWeight: 552 }}>
                            <TypingEffect message={errors} speed={40}/>
                        </h3>
                    }
                    {showMessage && message && 
                        <h3 className={classes.h3Sucsess}>
                            <TypingEffect message={message} speed={30}/>
                        </h3>
                    }
                </div>
                {!message 
                    ?                 
                    <form onSubmit={handleSubmit} className={classes.formRessetPassord}>
                        <label htmlFor="password" className={classes.label}>Придумайте пароль:</label>
                        <div className={classes.inputWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={classes.input}
                            />
                            <span
                                onClick={() => setShowPassword((prev) => !prev)}
                                className={classes.icon}
                            >
                                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                            </span>
                        </div>
                        <label htmlFor="confirmPassword" className={classes.label}>Повторите пароль:</label>
                        <div className={classes.inputWrapper}>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={classes.input}
                            />
                            <span
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className={classes.icon}
                            >
                                {showConfirmPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                            </span>
                        </div>
                        <button className={classes.button} type="submit">
                            Сохранить новый пароль
                        </button>
                    </form>
                    :
                    <div className={classes.bottomSection}>
                        <button onClick={autch}>Перейти в профиль пользователя</button>
                    </div>
                    }
                {isAuth ? <Navigate to={routeMyProfile(authorizedUser.userId)}/> : <></>}   
            </div>
        </div>
    );
})

export { routeMain };
export default NewPssword;
