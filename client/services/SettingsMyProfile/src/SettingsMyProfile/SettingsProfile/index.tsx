import React from "react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { Navigate } from "react-router-dom";
import { routeMain as routeLogin } from "../../../../Auth/src/pages/Auth"
import { deleteMyProfileAC } from "@packages/shared/src/store/MyProfileReducers/myProfileSlice";
import { setContentSpanAC, setFooterAC, setLSidebarAC, setLSidebarSpanAC, setRSidebarAC, setRSidebarSpanAC, SIDEBAR_OFF, SIDEBAR_ON } from "@packages/shared/src/store/PageElementsSlice/pageElementsSlice";
import { useAppContext } from "@packages/shared/src/components/contexts/AppContext";
import { Col } from "antd";
import NavSettings from "../../NavSettings/navSettings";
import routeMain from "./routes";
import classes from './styles.module.scss';

const SettingMyProfile: React.FC = React.memo(() => {
    const dispatch = useAppDispatch();
    const { content, setContent, setPageType } = useAppContext();
    const { profile, error } = useAppSelector(state => state.myProfilePage);
    const { isAuth, authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage);
    const { LeftNavSpan, LsidebarSpan, ContentBlockSpan, RsidebarSpan, RightNavSpan } = useAppSelector(state => state.page_elements)
    const [redirect, setRedirect] = useState(false);

    const deleteAccount = () => {
        dispatch(deleteMyProfileAC(profile.userId))
            .then(() => setRedirect(true))
    }

    return (
        <>
            {redirect === true
                ?
                <Navigate to={routeLogin()} />
                :
                <div className={classes.wrapContentSettingsMyProfile}>
                    <div className={classes.contentSettingsMyProfile}>
                        <h1>Настройки профиля</h1>
                        <div className={classes.deleteProfile}>
                            <div className={classes.title}>
                                <h2>Удаление аккаунта</h2>
                            </div>
                            <div className={classes.body}>
                                <strong>Даное действие отменить будет не возможно!</strong>
                                <button onClick={() => deleteAccount()}>Удалить мой аккаунт</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
})
export { routeMain };
export default SettingMyProfile;
