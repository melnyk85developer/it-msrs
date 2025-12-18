import React, { useState } from "react";
import defaultUserAvatar from "@packages/shared/src/assets/fonAvatars.png"
import editTheAvatar from "@packages/shared/src/assets/editTheAvatar.png"
import { CameraOutlined } from "@ant-design/icons";
import { API_URL } from "@packages/shared/src/http";
import { useAppSelector } from "@packages/shared/src/components/hooks/redux";
import ModalWindow from "@packages/shared/src/components/ModalWindows";
import UploadAvatar from "./uploadAvatar";
import { IProfile, IUser } from "@packages/shared/src/types/IUser";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import classes from './styles.module.scss'

type PropsType = {
    avatar: string;
    profile: IProfile
    dispatch: AppDispatch
    authorizedUser: IUser;

}

const Avatar: React.FC<PropsType> = ({ dispatch, profile, avatar, authorizedUser }) => {
    const { isDarkTheme } = useAppSelector(state => state.authPage)
    const [modalActive, setModalActive] = useState(false);

    const handleUpdateAvatar = () => {
        setModalActive(true)
    }
    console.log('Avatar: - `${API_URL}/${avatar}`', `${API_URL}/${avatar}`)

    return (
        <div className={`${classes.avatar} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <div className={classes.wrapAvatarBlock}>
                <div className={classes.shahta_avatars}>
                    <div className={classes.podium_avatars}>
                        <div className={classes.wrapAvatar}>
                            <img
                                className={classes.avatarImage}
                                src={avatar !== null ? `${API_URL}/${avatar}` : defaultUserAvatar}
                                alt={avatar}
                            />
                            <div className={classes.wrapEditBlockAvatar} onClick={() => handleUpdateAvatar()}>
                                <div className={classes.editBlockAvatar}>
                                    <CameraOutlined className={classes.cameraEditAvatar} />
                                    <strong className={classes.textUploadAvetar}>{avatar === null ? 'Загрузить Аватар' : 'Заменить Аватар'}</strong>
                                    <img className={classes.editTheAvatar} src={editTheAvatar} alt={editTheAvatar} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalWindow modalActive={modalActive} setModalActive={setModalActive}>
                <UploadAvatar profile={profile} authorizedUser={authorizedUser} setModalActive={setModalActive} dispatch={dispatch} />
            </ModalWindow>
        </div>
    )
}
export default Avatar;