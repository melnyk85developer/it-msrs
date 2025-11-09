import React, { useState } from "react";
import { IProfile } from "@packages/shared/src/types/IUser";
import { EditOutlined } from "@ant-design/icons";
import ModalWindow from "@packages/shared/src/components/ModalWindows";
import AnketaModal from "../AnketaModal/anketaModal";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import classes from './styles.module.scss'

type ProfileDataPropsType = {
    profile: IProfile
    dispatch: AppDispatch
    authorizedUser: IProfile
    modalActiveProfileData: any
    setModalActiveProfileData: any
    isDarkTheme: string;
}

const ProfileData: React.FC<ProfileDataPropsType> = ({
    profile, dispatch, authorizedUser, modalActiveProfileData, setModalActiveProfileData, isDarkTheme }) => {

    return (
        <div className={`${classes.wrapProfileData} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <div className={classes.wrapName}>
                <h6>Имя : </h6>
                <strong>{profile.name}</strong>
            </div>
            <div className={classes.warapSurname}>
                <h6>Фамилия : </h6>
                <strong>{profile.surname}</strong>
            </div>
            <div className={classes.wrapILiveIn}>
                <h6>Живу в :</h6>
                <strong>{profile.liveIn}</strong>
            </div>
            <div className={classes.wrapOriginallyFrom}>
                <h6>Родом из :</h6>
                <strong>{profile.originallyFrom}</strong>
            </div>
            <div className={classes.wrapStatus}>
                <h6>Статус : </h6>
                <strong>{profile.status ? profile.status : 'Статус не указан!'}</strong>
            </div>
            <ModalWindow  modalActive={modalActiveProfileData} setModalActive={setModalActiveProfileData}>
                <AnketaModal profile={profile}/>
            </ModalWindow>
            <h3>{profile.isActivated ? 'Аккаунт подтвержден по почте': 'ПОДТВЕРДИТЕ СУКА АККАУНТ!!!'}</h3>
        </div>
    )
}
export default ProfileData