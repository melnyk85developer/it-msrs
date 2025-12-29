import React, { useEffect, useState } from "react";
import { myProfileAC } from "@packages/shared/src/store/MyProfileReducers/myProfileSlice";
import { IProfile, IUser } from "@packages/shared/src/types/IUser";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { Navigate } from "react-router-dom";
import { routeMain as routeAuth } from '../../../Auth/src/pages/Auth';
import { useAppContext } from '@packages/shared/src/components/contexts/AppContext';
import WidgetFriends from '@packages/shared/src/components/Widgets/WidgetFriends'
import WidgetPeople from '@packages/shared/src/components/Widgets/WidgetsPeople'
import WidgetPerhapsYoureFamiliar from '@packages/shared/src/components/Widgets/WidgetPerhapsYoureFamiliar'
import Avatar from "./Avatar";
import { Col } from "antd";
import Info from "./Info";
import MyPostsContainer from "./MyPosts/MyPostsContainer";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import ModalWindow from "@packages/shared/src/components/ModalWindows";
import ErrorsContent from "@packages/shared/src/components/ErrorsContent";
import { FOOTER_ON, setContentSpanAC, setFooterAC, setLSidebarAC, setLSidebarSpanAC, setRSidebarAC, setRSidebarSpanAC, SIDEBAR_OFF, SIDEBAR_ON } from "@packages/shared/src/store/PageElementsSlice/pageElementsSlice";
import classes from './styles.module.scss';

type PropsType = {
    authorizedUser: IUser;
    profile: IProfile;
    isAuth: boolean;
    error: string;
    isDarkTheme: string
    dispatch: AppDispatch;
}

const MyProfile: React.FC<PropsType> = React.memo(({ error, isDarkTheme, profile, authorizedUser, isAuth }) => {
    const dispatch = useAppDispatch();
    const { content, setContent, setPageType } = useAppContext();
    const [reloadProfile, setReloadProfile] = useState(false);
    const [modalActiveError, setModalActiveError] = useState(false);
    const authorizedUserId = authorizedUser && authorizedUser.id
    // console.log('MyProfile: - authorizedUserId 😡😡😡😡😡 ', authorizedUserId)

    const newContent = {
        contentTopNav: [] as React.ReactNode[],
        contentLsidebar: [
            <div>
                <Avatar
                    dispatch={dispatch}
                    avatar={profile.avatar}
                    profile={profile}
                    authorizedUser={authorizedUser}
                />
                <div className={classes.wrapWidgetFriendsProfile}>
                    <WidgetFriends />
                </div>
                <div className={classes.wrapWidgetPeopleProfile}>
                    <WidgetPeople />
                </div>
            </div>
        ],
        contentRsidebar: [
            <WidgetPerhapsYoureFamiliar />
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
    };

    useEffect(() => {
        if (isAuth && authorizedUserId !== undefined) {
            dispatch(myProfileAC(authorizedUserId));
            dispatch(setLSidebarAC(SIDEBAR_ON));
            dispatch(setLSidebarSpanAC(5));
            dispatch(setContentSpanAC(10));
            dispatch(setRSidebarAC(SIDEBAR_ON));
            dispatch(setRSidebarSpanAC(5));
            dispatch(setFooterAC(FOOTER_ON));
            setPageType('stretch');
        }
    }, [isAuth, reloadProfile])

    useEffect(() => {
        setContent(newContent);
    }, [isAuth, authorizedUserId, profile, setContent]);

    useEffect(() => {
        if (error) {
            setModalActiveError(true);
        }
    }, [error]);

    return (
        <div className={`${classes.wrapContentProfiles} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            {isAuth ?
                (
                    <Col className={classes.contentProfiles}>
                        <Info
                            key={profile.userId}
                            authorizedUser={authorizedUser}
                            profile={profile}
                            dispatch={dispatch}
                            error={error}
                            isDarkTheme={isDarkTheme}
                        // status={myProfileStatus} 
                        // updateStatus={updateMyStatus} 
                        />
                        <MyPostsContainer
                            dispatch={dispatch}
                            profile={profile}
                            authorizedUser={authorizedUser}
                            error={error}
                        />
                    </Col>
                ) : <Navigate to={routeAuth()} />
            }
            <ModalWindow modalActive={modalActiveError} setModalActive={setModalActiveError}>
                <ErrorsContent error={error} setReloadProfile={setReloadProfile} setModalActiveError={setModalActiveError} />
            </ModalWindow>
        </div>
    )
})
export default MyProfile