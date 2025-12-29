import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { useAppContext } from "@packages/shared/src/components/contexts/AppContext";
import { FOOTER_ON, setContentSpanAC, setFooterAC, setLSidebarAC, setLSidebarSpanAC, setRSidebarAC, setRSidebarSpanAC, SIDEBAR_OFF, SIDEBAR_ON } from "@packages/shared/src/store/PageElementsSlice/pageElementsSlice";
import { sendEmailResetPasswordMyProfileAC } from "@packages/shared/src/store/MyProfileReducers/myProfileSlice";
import { Col } from "antd";
import TypingEffect from "@packages/shared/src/components/TypingEffect";
import WidgetFriends from "@packages/shared/src/components/Widgets/WidgetFriends";
import WidgetPeople from "@packages/shared/src/components/Widgets/WidgetsPeople";
import WidgetPerhapsYoureFamiliar from "@packages/shared/src/components/Widgets/WidgetPerhapsYoureFamiliar";
import routeMain from "./route";
import classes from "./styles.module.scss";

const SendResetPassword: React.FC = () => {
    const dispatch = useAppDispatch();
    const { isDarkTheme, systemMsg } = useAppSelector(state => state.authPage)
    const { error } = useAppSelector((state) => state.myProfilePage)
    const { setContent, setPageType } = useAppContext()
    const [email, setEmail] = useState('')
    const [errors, setErrors] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [showMessage, setShowMessage] = useState(false)
    const [send, setSend] = useState(false)
    const [timer, setTimer] = useState(0)
    const [currentIndex, setCurrentIndex] = useState(0)

    const messages = [
        `<p>Чтобы сбросить пароль, убедитесь, что у вас есть доступ к указанному в аккаунте E-Mail.</p>`,
        `<p><strong>${message}</strong></p><p><span>Если письмо не пришло на почту, то повторная отправка письма возможна через:<span></p>`,
        `<p>Если письмо не пришло на почту, то можно отправить повторно!</p>`
    ]
    const errorMessage = [
        `<p><strong>${errors}</strong></p><p>В связи с чрезмерным колличеством отправленных сообщений за короткий промежуток времени, 
        Вы не сможете отправлять сообщения для сброса пароля в течении указанного ниже времени:</p>`,
        `<p><strong>${errors}</strong></p>`,
        `<p>Блокировка снята, Вы можете повторно подать запрос на сброс пароля!</p>`
    ]

    const newContent = {
        contentTopNav: [] as React.ReactNode[],
        contentLsidebar: [
            <div>
                <WidgetPerhapsYoureFamiliar />
                <WidgetPeople />
                <WidgetFriends />
            </div>
        ],
        contentRsidebar: [
            <div>
                <WidgetPeople />
                <WidgetPerhapsYoureFamiliar />
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
        setErrors('');
        setMessage('');
        setContent(newContent);
        dispatch(setLSidebarAC(SIDEBAR_ON));
        dispatch(setLSidebarSpanAC(5));
        dispatch(setContentSpanAC(10));
        dispatch(setRSidebarAC(SIDEBAR_ON));
        dispatch(setRSidebarSpanAC(5));
        dispatch(setFooterAC(FOOTER_ON));
        setPageType('stretch');
    }, []);

    useEffect(() => {
        if (error) {
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
        if (currentIndex < messages.length) {
            const typingDuration = messages[currentIndex].length * 30;
            const timer = setTimeout(() => {
                setCurrentIndex((prev) => prev + 1); // Переход к следующему сообщению
            }, typingDuration);
            return () => clearTimeout(timer); // Очистка таймера при размонтировании
        }
    }, [currentIndex]);
    useEffect(() => {
        if (timer > 0) {
            const intervalId = setInterval(() => {
                setTimer((prev) => prev - 1); // Счётчик таймера
            }, 1000);
            return () => clearInterval(intervalId); // Очистка интервала
        }
    }, [timer]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setErrors('');
        setMessage('');
        setShowMessage(false);
        const validationError = validateEmail(email);
        if (validationError) {
            setErrors(validationError);
            return;
        }
        dispatch(sendEmailResetPasswordMyProfileAC(email))
            .then((data: any) => {
                if (data) {
                    // console.log('SendResetPassword: 👽👽😡👽👽 systemMsg then', data)
                    const extractISODate = (message: string): string | null => {
                        const isoDatePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;
                        const match = message.match(isoDatePattern);
                        return match ? match[0] : null;
                    };
                    const isoDate = extractISODate(data);
                    const currentTime = Date.now();
                    const expirationTime = new Date(isoDate).getTime();
                    const remainingTimeInSeconds = Math.floor((expirationTime - currentTime) / 1000);
                    const textWithoutDate = data.split('2025-')[0].trim();
                    // console.log('SendResetPassword: 👽👽😡👽👽 textWithoutDate', textWithoutDate)
                    setMessage(textWithoutDate);
                    setTimer(remainingTimeInSeconds);
                    setErrors('');
                }
            })
            .finally(() => {
                // console.log('SendResetPassword: 👽👽😡👽👽 systemMsg finally', systemMsg)
                setSend((prevState) => !prevState);
                setShowMessage(true);
            });
    }
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    }
    const validateEmail = (value: string) => {
        if (!value.trim()) {
            return "Поле E-Mail не должно быть пустым!";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return "Введите корректный E-Mail!";
        }
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
        <div className={classes.wrapContentRessedPassword}>
            <div className={classes.contentRessedPassword}>
                <h2>Сброс пароля</h2>
                <div className={classes.wrapMessage}>
                    <div className={classes.wrapTitle}>
                        {!showMessage && !message && !errors && (
                            <>
                                <strong style={{ marginLeft: 7 }}></strong>
                                {renderMessages([0])}
                            </>
                        )}
                        {!errors && showMessage && message && (
                            <>
                                <strong style={{ marginLeft: 7 }}></strong>
                                {timer > 0 && renderMessages([1])}
                                <strong style={{ marginLeft: 7 }}></strong>
                                {timer === 0 && (
                                    renderMessages([2])
                                )
                                }
                            </>
                        )}
                        {errors && errors !== "" && error &&
                            <div className={classes.errorMessages}>
                                <>
                                    <strong style={{ marginLeft: 7 }}></strong>
                                    {timer > 0 && renderErrors([0])}
                                    <strong style={{ marginLeft: 7 }}></strong>
                                    {timer === 0 && renderErrors([2])}
                                </>
                            </div>
                        }
                        {!error && errors &&
                            <div className={classes.errorMessages}>
                                <strong style={{ marginLeft: 7 }}></strong>
                                {renderErrors([1])}
                            </div>
                        }
                    </div>
                </div>

                {timer > 0
                    ?
                    <div className={classes.nextSendSMS}>
                        <strong style={errors ? { color: "rgb(161, 3, 3)" } : { color: "rgb(4, 153, 4)" }}>
                            {` ${formatTime(timer)}`}
                        </strong>
                    </div>
                    :
                    <div className={classes.nextSendSMS}>
                        <label htmlFor="email" className={classes.label}>
                            Введите E-Mail адрес:
                        </label>
                        <div className={classes.inputBlock}>
                            <form onSubmit={handleSubmit} className={classes.formRessetPassord}>
                                <input
                                    type="text"
                                    autoComplete="off"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={classes.input}
                                />
                                <button
                                    className={classes.button}
                                    type="submit"
                                >
                                    Сбросить пароль
                                </button>
                            </form>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
};

export { routeMain };
export default SendResetPassword;

// const defaultMessage = [
//     `Чтобы сбросить пароль, убедитесь, что у вас есть доступ к указанному в аккаунте E-Mail.`,
// ]
// const messages = [
//     `<strong>${message}</strong>`,
// ]
// const errorServerMessage = [
//     `<strong>${errors}</strong>`,
// ]
// const errorLocalMessage = [
//     `<strong>${errors}</strong>`,
// ]

// {!showMessage && !message && !errors && (
//     <p style={{ color: 'wheat' }} className={classes.errorMessages}>
//         <strong style={{marginLeft: 7}}></strong>
//         <TypingEffect message={defaultMessage[0]} speed={30} />
//     </p>
// )}

// {!errors && showMessage && message && (
//     <>
//         {timer > 0 && messages.slice(0, currentIndex + 1).map((message, index) => (
//             <p key={index} style={{ color: 'rgb(4, 153, 4)'}} className={classes.errorMessages}>
//                 <strong style={{marginLeft: 7}}></strong>
//                 <TypingEffect message={message} speed={30} />
//             </p>
//         ))}
//         {timer > 0 && currentIndex === messages.length && (
//             <p style={{ color: 'wheat' }} className={classes.errorMessages}>
//                 <strong style={{marginLeft: 7}}></strong>
//                 <TypingEffect message={`<span>Если письмо не пришло на почту, то повторная отправка письма возможна через:</span>`} speed={30} />
//             </p>
//         )}
//         {timer === 0 && (
//             <p style={{ color: 'wheat' }} className={classes.errorMessages}>
//                 <strong style={{marginLeft: 7}}></strong>
//                 <TypingEffect message={`Если письмо не пришло на почту, то можно отправить повторно!`} speed={30} />
//             </p>
//         )}

//     </>
// )}  
// {errors && errors !== "" && error &&  
//     <>
//         {timer > 0 && errorServerMessage.slice(0, currentIndex + 1).map((message, index) => (
//             <p  key={index} className={classes.errorMessages}>
//                 <strong style={{marginLeft: 7}}></strong>
//                 <TypingEffect message={message} speed={30} />
//             </p>
//         ))}
//         {timer > 0 && currentIndex === errorServerMessage.length && (
//             <p style={{ color: 'wheat' }} className={classes.errorMessages}>
//                 <strong style={{marginLeft: 7}}></strong>
//                 <TypingEffect message={`<span>В связи с чрезмерным колличеством отправленных сообщений за короткий промежуток времени, Вы не сможете отправлять сообщения для сброса пароля в течении указанного ниже времени:</span>`} speed={30} />
//             </p>
//         )}
//         {timer === 0 && (
//             <p style={{ color: 'wheat' }} className={classes.errorMessages}>
//                 <strong style={{marginLeft: 7}}></strong>
//                 <TypingEffect message={`<span>Блокировка снята, Вы можете повторно подать запрос на сброс пароля!</span>`} speed={30} />
//             </p>
//         )}
//     </>
// }
// {!error && errors && (
//     <>
//         {errorLocalMessage.slice(0, currentIndex + 1).map((message, index) => (
//             <p key={index} className={classes.errorMessages}>
//                 <strong style={{marginLeft: 7}}></strong>
//                 <TypingEffect message={message} speed={30} />
//             </p>
//         ))}
//     </>
// )}