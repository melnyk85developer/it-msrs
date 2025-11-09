import React, { useState } from "react";
import { EditOutlined, LeftOutlined, RightOutlined } from "@ant-design/icons";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { IProfile } from "@packages/shared/src/types/IUser";
import ProfileDataForm from "./ProfileDataForm/ProfileDataForm";
import ProfileData from "./ProfileData/ProfileData";
import ModalWindow from "@packages/shared/src/components/ModalWindows";
import classes from './styles.module.scss'
import PhotoCarousel from "./PhotoCarousel/PhotoCarousel";

type PropsType = {
    profile: IProfile;
    authorizedUser: IProfile
    dispatch: AppDispatch;
    error: string;
    isDarkTheme: string;
}
const Info: React.FC<PropsType> = React.memo(({ 
    dispatch, isDarkTheme, profile, authorizedUser, error}) => {
    const [modalActiveProfileData, setModalActiveProfileData] = useState(false);
    const [modalActiveProfileDataForm, setModalActiveProfileDataForm] = useState(false);
    return (
        <div className={`${classes.wrapDescription} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <div className={classes.description}>
                <div className={classes.wrapTitleAnketa}>
                    <h3>Анкета профиля</h3>
                    <strong className={classes.editStilus}>
                        <EditOutlined onClick={() => setModalActiveProfileDataForm(true)}/>
                    </strong>
                </div>
                <ProfileData 
                    profile={profile}
                    dispatch={dispatch}
                    isDarkTheme={isDarkTheme}
                    authorizedUser={authorizedUser}
                    modalActiveProfileData={modalActiveProfileData} 
                    setModalActiveProfileData={setModalActiveProfileData}
                    modalActiveProfileDataForm={modalActiveProfileDataForm}
                    setModalActiveProfileDataForm={setModalActiveProfileDataForm}
                />
                <ModalWindow modalActive={modalActiveProfileDataForm} setModalActive={setModalActiveProfileDataForm}>
                    <ProfileDataForm 
                        dispatch={dispatch}
                        profile={profile}
                        isDarkTheme={isDarkTheme}
                        authorizedUser={authorizedUser}
                        modalActive={modalActiveProfileDataForm} 
                        setModalActive={setModalActiveProfileDataForm}
                        error={error}
                    /> 
                </ModalWindow>
                <h3 className={classes.more} onClick={() => setModalActiveProfileData(true)}>Подробнее...</h3>
            </div>
            <PhotoCarousel 
                dispatch={dispatch}
                profile={profile}
                authorizedUser={authorizedUser}
                isDarkTheme={isDarkTheme}
            />
        </div>
    )
})
export default Info;