import React, { useEffect, useState } from "react";
import WidgetFriends from "@packages/shared/src/components/Widgets/WidgetFriends";
import WidgetPeople from "@packages/shared/src/components/Widgets/WidgetsPeople";
import WidgetPerhapsYoureFamiliar from "@packages/shared/src/components/Widgets/WidgetPerhapsYoureFamiliar";
import TypingEffect from "@packages/shared/src/components/TypingEffect";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { routeMain as routeMyProfile } from "../../../../../services/MyProfile/src/MyProfile/MyProfileContainer";
import { NavLink } from "react-router-dom";
import { registrationEmailResendingAC } from "@packages/shared/src/store/AuthReducers/authSlice";
import { useAppContext } from "@packages/shared/src/components/contexts/AppContext";
import { FOOTER_ON, setContentSpanAC, setFooterAC, setLSidebarAC, setLSidebarSpanAC, setRSidebarAC, setRSidebarSpanAC, SIDEBAR_ON } from "@packages/shared/src/store/PageElementsSlice/pageElementsSlice";
import { Col } from "antd"
import routeMain from "./route";
import classes from "./styles.module.scss";

const FinishRegistration: React.FC = React.memo(() => {
    const dispatch = useAppDispatch();
    const { setContent, setPageType } = useAppContext();
    const { isAuth, authorizedUser, isDarkTheme } = useAppSelector((state) => state.authPage);
    const { successfulRegistration } = useAppSelector((state) => state.authPage);
    const { error } = useAppSelector((state) => state.authPage);
    const [errors, setErrors] = useState<string>(error);
    const [message, setMessage] = useState<string>(`Регистрация прошла успешно!`);
    const [send, setSend] = useState(false);
    const [timer, setTimer] = useState(3 * 60)
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
    const [showMessage, setShowMessage] = useState(false);
    const [currentMassageIndex, setCurrentMassageIndex] = useState(0);
    const [currentEndMessageIndex, setCurrentEndMessageIndex] = useState(0);
    const [currentWarningIndex, setCurrentWarningIndex] = useState(0);
    // const [startMassage, setStartMassage] = useState(false);
    const [startEndMessage, setStartEndMessage] = useState(false);
    const [startWarning, setStartWarning] = useState(false);

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
                ${classes.wrapFooterSectionsForProfile}
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

    const messages = [
        `<strong>${message}</strong><p>На E-Mail<strong>${successfulRegistration}</strong> было отправлено сообщение для подтверждения регистрации!</p>
        <p><strong></strong>Проверьте пожалуйста почту и следуйте дальнейшим инструкциям в письме.</p>`,
        `<p><strong>${message}</strong></p>`,
    ]
    const errorMessage = [
        `<p><strong>${errors}</strong></p><p>В связи с чрезмерным колличеством отправленных сообщений за короткий промежуток времени, 
        Вы не сможете отправлять сообщения для подтверждения регистрации в течении указанного ниже времени:</p>`,
        `<p><strong>${errors}</strong></p>`,
        `<p>Блокировка снята, Вы можете повторно подать запрос на активацию аккаунта!</p>`
    ]
    let conclusionMessage = `Если письмо не пришло на почту, то повторная отправка письма возможна через:`;
    let endMessage = [`Если письмо не пришло на почту, то можна совершить повторную отправку!</p>`];
    let warning = [
        `<strong>К сожалению, без активации аккаунта Ваши возможности на проекте будут ограничены!</strong>`,
        `<p><span>Если у Вас доступ к электронной почте ${successfulRegistration} временно недоступен, то Вы можете 
        подтвердить регистрацию позже, а в данный момент пользоваться проектом:</span>`
    ]

    useEffect(() => {
        // console.log('errors: ', errors)
        if (error) {
            console.log('FinishRegistration: - errors', errors)
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

            const textWithoutDate = error.split('2025-')[0].trim(); 
            setErrors(textWithoutDate)
            setTimer(remainingTimeInSeconds)
        }
    }, [error, send]);

    useEffect(() => {
        if (currentMassageIndex < messages.length) {
            const typingDuration = messages[currentMassageIndex].length * 30;
            const timer = setTimeout(() => {
                setCurrentMassageIndex((prev) => prev + 1); // Переход к следующему сообщению
            }, typingDuration);
            return () => clearTimeout(timer);
        } else if (!startEndMessage) {
            setStartEndMessage(true);
        }
    
        if (startEndMessage && currentEndMessageIndex < endMessage.length) {
            const typingDuration = endMessage[currentEndMessageIndex].length * 30;
            const timer = setTimeout(() => {
                setCurrentEndMessageIndex((prev) => prev + 1); // Переход к следующему сообщению в блоке endMessage
            }, typingDuration);
            return () => clearTimeout(timer);
        } else if (startEndMessage && !startWarning) {
            setStartWarning(true);
        }
    
        if (startWarning && currentWarningIndex < warning.length) {
            const typingDuration = warning[currentWarningIndex].length * 30;
            const timer = setTimeout(() => {
                setCurrentWarningIndex((prev) => prev + 1); // Переход к следующему сообщению в блоке warning
            }, typingDuration);
            return () => clearTimeout(timer);
        }
    }, [currentMassageIndex, currentEndMessageIndex, currentWarningIndex, startEndMessage, startWarning, send]);    
    
    useEffect(() => {
        if (timer > 0) {
            const intervalId = setInterval(() => {
                setTimer((prev) => prev - 1); // Счётчик таймера
            }, 1000);
            return () => clearInterval(intervalId); // Очистка интервала
        }
    }, [timer]); 
    
    useEffect(() => {
        setContent(newContent);
        dispatch(setLSidebarAC(SIDEBAR_ON));
        dispatch(setLSidebarSpanAC(5));
        dispatch(setContentSpanAC(10));
        dispatch(setRSidebarAC(SIDEBAR_ON));
        dispatch(setRSidebarSpanAC(5));
        dispatch(setFooterAC(FOOTER_ON));
        setPageType('stretch');
    }, []);   

    const sendSms = (successfulRegistration: string) => {
        event.preventDefault();
        setErrors('')
        setMessage('')
        setShowMessage(false)
        setCurrentMassageIndex(0);
        setCurrentEndMessageIndex(0);
        setCurrentWarningIndex(0);
        setStartEndMessage(false);
        setStartWarning(false);
        
        dispatch(registrationEmailResendingAC(successfulRegistration))
        .then((data: any) => {
            console.log('then: ', data)
            if (data?.message) {
                const extractISODate = (message: string): string | null => {
                    const isoDatePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;
                    const match = message.match(isoDatePattern);
                    return match ? match[0] : null;
                };
                const isoDate = extractISODate(data.message);
                const currentTime = Date.now();
                const expirationTime = new Date(isoDate).getTime();
                const remainingTimeInSeconds = Math.floor((expirationTime - currentTime) / 1000);
                const textWithoutDate = data.message.split('2025-')[0].trim();
                setMessage(textWithoutDate);
                setTimer(remainingTimeInSeconds);
                setErrors('');
            }
        })
        .finally(() => {
            setSend((prevState) => !prevState)
            setShowMessage(true)
        })
    }
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
    }
    const renderMessages = (indices: number[]) => {
        return indices.map((index) => (
            <TypingEffect key={`message-${index}`} message={messages[index]} speed={30} />
        ));
    };
    const renderErrors = (indices: number[]) => {
        return indices.map((index) => (
            <TypingEffect key={`error-${index}`} message={errorMessage[index]} speed={40} />
        ));
    };
    
    return (
        <div className={classes.wrapFinishRegistration}>
            <div className={classes.wrapMessage}>
                <div className={classes.wrapTitle}>
                    <h2>Завершение регистрации</h2>
                    {errors && errors !== "" && error &&  
                        <div className={classes.errorMessages}>
                            <>
                                <strong style={{marginLeft: 7}}></strong>
                                {timer > 0 ? renderErrors([0]) : renderErrors([1])}
                                <strong style={{marginLeft: 7}}></strong>
                                {timer === 0 && renderErrors([2])}
                            </>
                        </div>
                    }
                    {!error && errors && 
                        <div className={classes.errorMessages}>
                            <strong style={{marginLeft: 7}}></strong>
                            {renderErrors([1])}
                            <TypingEffect message={errors} speed={30} />
                        </div>
                    }
                    {!errors &&
                        <>
                            {timer > 0 && 
                                <p className={classes.message}>
                                    <TypingEffect message={messages[0]} speed={30} />
                                </p>
                            }
                            {timer > 0 && startEndMessage && !error && !errors &&(
                                <p className={classes.pAfter} style={{marginTop: 7}}>
                                    <strong style={{marginLeft: 7}}></strong>
                                    <TypingEffect message={conclusionMessage} speed={30} />
                                </p>
                            )}
                            {timer === 0 && endMessage.slice(0, currentEndMessageIndex + 1).map((endMes, index) => (
                                <div key={index} className={classes.warningMessage}>
                                    <TypingEffect message={endMes} speed={30} />
                                </div>
                            ))}
                        </>                        
                    }
                </div>
                <div className={classes.wrapButtonSendSMS}>
                    {timer > 0 && currentMassageIndex === messages.length && 
                        <div className={classes.timerBlock}>
                            <strong style={errors ? { color: "rgb(161, 3, 3)"} : {color: "rgb(4, 153, 4)"}}>
                                {` ${formatTime(timer)}`}
                            </strong>
                        </div>
                    }
                    {timer === 0 && currentEndMessageIndex === endMessage.length &&
                        <div className={classes.timerBlock}>
                            <button className={classes.bottom} onClick={() => {sendSms(successfulRegistration)}}>
                                Отправить ещё раз
                            </button>
                        </div>
                    }
                </div>
                {startWarning === true && currentEndMessageIndex === endMessage.length && !error && !errors &&
                    <div className={classes.wrapWarningMessage}>
                        <h2>Внимание!</h2>
                        {warning.slice(0, currentWarningIndex + 1).map((warning, index) => (
                            <div key={index} className={classes.warningMessage}>
                                <TypingEffect message={warning} speed={30} />
                            </div>
                        ))}
                        {currentWarningIndex === warning.length &&
                            <section className={classes.bottomSection}>
                                <div className={classes.bottomLeftTitlte}>
                                    <label className={classes.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={isCheckboxChecked}
                                            onChange={(e) => setIsCheckboxChecked(e.target.checked)}
                                            className={classes.checkbox}
                                        />
                                        <strong>Я позже завершу регистрацию</strong>
                                    </label>
                                    <NavLink
                                        className={`${classes.navLink} ${!isCheckboxChecked ? classes.disabledLink : ""}`}
                                        to={isCheckboxChecked ? routeMyProfile(authorizedUser?.userId) : "#"}
                                        onClick={(e) => {
                                            if (!isCheckboxChecked) e.preventDefault()
                                        }}
                                    >
                                        <button className={classes.bottom} disabled={!isCheckboxChecked}>
                                            Перейти в мой профиль
                                        </button>
                                    </NavLink>
                                </div>
                            </section>
                        }
                    </div>
                }
            </div>
        </div>
    );
});

export { routeMain };
export default FinishRegistration;
