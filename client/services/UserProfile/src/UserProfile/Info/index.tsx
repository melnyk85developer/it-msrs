import React, { useState } from "react";
// import ProfileStatusWithHooks from "./ProfileStatusWithHooks";
// import ProfileDataForm from "./ProfileDataForm";
// import { ContactsType, ProfileType } from "types/types";
// import { saveMyProfile } from "store/MyProfileReducer/myProfileReducer";
// import { TypedDispatch } from "store/reduxStore";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { IProfile, IUser } from "@packages/shared/src/types/IUser";
import classes from './styles.module.scss'
import ModalWindow from "@packages/shared/src/components/ModalWindows";
import AnketaModal from "./AnketaModal/anketaModal";
import ProfileData from "./ProfileData/ProfileData";
import PhotoCarousel from "./PhotoCarousel/PhotoCarousel";

type PropsType = {
    profile: IProfile;
    authorizedUser: IUser
    dispatch: AppDispatch;
    error: string;
    isDarkTheme: string;
}

const Info: React.FC<PropsType> = ({ 
    dispatch, isDarkTheme, profile, authorizedUser, error}) => {
        const [modalActiveProfileData, setModalActiveProfileData] = useState(false);
        const [modalActiveProfileDataForm, setModalActiveProfileDataForm] = useState(false);
        
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
                profile={profile}
                authorizedUser={authorizedUser}
                isDarkTheme={isDarkTheme}
            />
        </div>
    )
}
export default Info;