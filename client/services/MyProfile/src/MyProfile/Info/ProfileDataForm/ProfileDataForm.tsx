import React, { useState } from "react";
import { IProfile } from "@packages/shared/src/types/IUser";
import { Button } from 'antd';
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { updateMyProfileAC } from "@packages/shared/src/store/MyProfileReducers/myProfileSlice";
import classes from './styles.module.scss'

type PropsType = {
    dispatch: AppDispatch;
    profile: IProfile;
    authorizedUser: IProfile;
    modalActive: any;
    setModalActive: any;
    isDarkTheme: string;
    error: string;
}

const ProfileDataForm: React.FC<PropsType> = ({
    dispatch, isDarkTheme, profile, authorizedUser, setModalActive}) => {
    const [name, setName] = useState(profile.name);
    const [surname, setSurname] = useState(profile.surname);
    const [gender, setGender] = useState(profile.gender || '');
    const [liveIn, setLiveIn] = useState(profile.liveIn || '');
    const [originallyFrom, setOriginallyFrom] = useState(profile.originallyFrom || '');
    const [imWorkingIn, setImWorkingIn] = useState(profile.imWorkingIn || '');
    const [lookingForAJob, setLookingForAJob] = useState(profile.lookingForAJob || false);
    const [lookingForAJobDescription, setLookingForAJobDescription] = useState(profile.lookingForAJobDescription || '');
    const [aboutMe, setAboutMe] = useState(profile.aboutMe || '');
    const [telephone, setTelephone] = useState(profile.telephone || '');
    const [email, setEmail] = useState(profile.email || '');
    const [website, setWebsite] = useState(profile.website || '');

    const sendAPicture = () => {
        const profileQuestionnaire = {
            userId: profile.userId, 
            authorizedUserId: authorizedUser.userId,
            name,
            surname,
            gender,
            liveIn,
            originallyFrom,
            imWorkingIn,
            lookingForAJob,
            lookingForAJobDescription,
            aboutMe,
            telephone,
            email,
            website
        }
        dispatch(updateMyProfileAC(profileQuestionnaire))
        setModalActive(false)
    }
    const handleGenderChange = (e: any) => {
        setGender(e.target.value);
    };
    const handleTelephoneChange = (e: any) => {
        setTelephone(e.target.value); // Обновление состояния при изменении значения
    };
  
    return (
        <div className={`${classes.wrapProfileDataFormBlock} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <h2>Полные анкетные данные</h2>
            <h3>Редактировать или заполнить анкету</h3>
            <div className={classes.wrapProfileDataForm}>
                <div className={classes.wrapName}>
                    <h6>Имя : </h6>
                    <input 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={classes.input}
                    />
                </div>
                <div className={classes.wrapSurname}>
                    <h6>Фамилия : </h6>
                    <input 
                        value={surname}
                        onChange={(e) => setSurname(e.target.value)}
                        className={classes.input
                    }/>
                </div>
                <div className={classes.wrapGenderSelect}>
                    <h6>Пол :</h6>
                    <select className={classes.select} value={gender} onChange={handleGenderChange}>
                        <option value="" disabled hidden className={classes.option}>Выберите пол</option>
                        <option value="Мужчина" className={classes.option}>Мужчина</option>
                        <option value="Женщина" className={classes.option}>Женщина</option>
                        <option value="Гей" className={classes.option}>Гей</option>
                        <option value="Лисбиянка" className={classes.option}>Лисбиянка</option>
                        <option value="Би" className={classes.option}>Би</option>
                        <option value="Оно" className={classes.option}>Оно</option>
                        <option value="Не скажу" className={classes.option}>Не скажу</option>
                    </select>
                </div>
                <div className={classes.wrapILiveIn}>
                    <h6>Живу в : </h6>
                    <input 
                        value={liveIn}
                        onChange={(e) => setLiveIn(e.target.value)}
                        className={classes.input
                    }/>
                </div>
                <div className={classes.wrapOriginallyFrom}>
                    <h6>Родом из : </h6>
                    <input 
                        value={originallyFrom}
                        onChange={(e) => setOriginallyFrom(e.target.value)}
                        className={classes.input
                    }/>
                </div>
                <div className={classes.wrapImWorkingIn}>
                    <h6>Работаю в : </h6>
                    <input 
                        value={imWorkingIn}
                        onChange={(e) => setImWorkingIn(e.target.value)}
                        className={classes.input
                    }/>
                </div>
                <div className={classes.wrapLookingForAJob}>
                    <h6>Ищу работу : </h6>
                    <input
                        type="checkbox" 
                        checked={lookingForAJob}
                        onChange={(e) => setLookingForAJob(e.target.checked)}
                        className={classes.input}
                    />
                </div>
                <div className={classes.wrapLookingForAJobDescription}>
                    <h6>Мои профессиональные навыки : </h6>
                    <textarea 
                        value={lookingForAJobDescription}
                        onChange={(e) => setLookingForAJobDescription(e.target.value)}
                        className={classes.textarea}
                    />
                </div>
                <div className={classes.wrapAboutMe}>
                    <h6>Обо мне : </h6>
                    <textarea 
                        value={aboutMe}
                        onChange={(e) => setAboutMe(e.target.value)}
                        className={classes.textarea}
                    />
                </div>
                <h6>Мои контакты :</h6>
                <div className={classes.wrapContacts}>
                    <div className={classes.wrapInputTel}>
                        <div className={classes.title}>
                            <strong>Номер телефона:</strong>
                        </div>
                        <div className={classes.wrapSelect}>
                            <select className={classes.select} value={telephone} onChange={handleTelephoneChange}>
                                <option
                                    value="+38" 
                                    className={classes.option}>+38</option>
                                <option 
                                    value="+34" 
                                    className={classes.option}>+34</option>
                            </select>
                            <input 
                                value={telephone}
                                onChange={(e) => setTelephone(e.target.value)}
                                placeholder="Тел:" 
                                className={classes.inputNumberTel}
                            />
                        </div>
                    </div>
                    <div className={classes.wrapInputEmail}>
                        <div className={classes.title}>
                            <strong>Электронная почта:</strong>
                        </div>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="E-Mail" 
                            className={classes.inputEmail}
                        />
                    </div>
                    <div className={classes.wrapInputWebsite}>
                        <div className={classes.title}>
                            <strong>Вебсайт:</strong>
                        </div>
                        <input 
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="mysite.com" 
                            className={classes.inputWebsite}
                        />
                    </div>
                </div>
            </div>
            <Button style={{width: '100%'}} type="primary" htmlType="submit" onClick={() => sendAPicture()}>Сохранить</Button>
        </div>
    )
}

export default ProfileDataForm;