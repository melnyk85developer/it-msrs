import React, { useState } from "react";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { IPhotoAlbum, IProfile, IUser } from "@packages/shared/src/types/IUser";
import classes from './styles.module.scss'
import ProfileData from "./ProfileData/ProfileData";
import PhotoCarousel from "./PhotoCarousel/PhotoCarousel";

type PropsType = {
    profile: IProfile;
    photoAlbums: IPhotoAlbum[];
    authorizedUser: IUser
    dispatch: AppDispatch;
    error: string;
    isDarkTheme: string;
}

const Info: React.FC<PropsType> = ({
    dispatch,
    photoAlbums,
    isDarkTheme,
    profile,
    authorizedUser,
    error
}) => {
    const [modalActiveProfileData, setModalActiveProfileData] = useState(false);

    return (
        <div className={`${classes.wrapDescription} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <div className={`${classes.description}`}>
                <h3>Подробная информация</h3>
                <ProfileData
                    profile={profile}
                    dispatch={dispatch}
                    isDarkTheme={isDarkTheme}
                    authorizedUser={authorizedUser}
                    modalActiveProfileData={modalActiveProfileData}
                    setModalActiveProfileData={setModalActiveProfileData}
                />
                <h3 className={classes.more} onClick={() => setModalActiveProfileData(true)}>Подробнее...</h3>
            </div>
            <PhotoCarousel
                dispatch={dispatch}
                photoAlbums={photoAlbums}
                authorizedUser={authorizedUser}
                isDarkTheme={isDarkTheme}
            />
        </div>
    )
}
export default Info;