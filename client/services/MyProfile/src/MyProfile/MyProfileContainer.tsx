import React, { useEffect, useState } from "react"
import MyProfile from "."
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import routeMain from './routes'
import { useAppContext } from "@packages/shared/src/components/contexts/AppContext";
import Avatar from "./Avatar";
import WidgetFriends from "@packages/shared/src/components/Widgets/WidgetFriends";
import WidgetPeople from "@packages/shared/src/components/Widgets/WidgetsPeople";
import WidgetPerhapsYoureFamiliar from "@packages/shared/src/components/Widgets/WidgetPerhapsYoureFamiliar";
import { routeMain as routeAuth } from '../../../Auth/src/pages/Auth';
import { Col } from "antd";
import { myProfileAC } from "@packages/shared/src/store/MyProfileReducers/myProfileSlice";
import { FOOTER_ON, setContentSpanAC, setFooterAC, setLSidebarAC, setLSidebarSpanAC, setRSidebarAC, setRSidebarSpanAC, SIDEBAR_ON } from "@packages/shared/src/store/PageElementsSlice/pageElementsSlice";
import { Navigate, Outlet } from "react-router-dom";
import ModalWindow from "@packages/shared/src/components/ModalWindows";
import ErrorsContent from "@packages/shared/src/components/ErrorsContent";
import classes from './styles.module.scss';

const MyProfileContainer: React.FC = React.memo(() => {
    const dispatch = useAppDispatch()
    const { content, setContent, setPageType } = useAppContext();
    const { isAuth, authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage);
    const { profile, posts, error } = useAppSelector(state => state.myProfilePage);
    const [reloadProfile, setReloadProfile] = useState(false);
    const [modalActiveError, setModalActiveError] = useState(false);

    // console.log('MyProfileContainer: - authorizedUser 😡 ', authorizedUser)
    // console.log('MyProfileContainer: - posts 😡 ', posts)

    useEffect(() => {
        if (isAuth && authorizedUser && authorizedUser.id !== undefined) {
            dispatch(myProfileAC(authorizedUser.id));
            dispatch(setLSidebarAC(SIDEBAR_ON));
            dispatch(setLSidebarSpanAC(5));
            dispatch(setContentSpanAC(10));
            dispatch(setRSidebarAC(SIDEBAR_ON));
            dispatch(setRSidebarSpanAC(5));
            dispatch(setFooterAC(FOOTER_ON));
            setPageType('stretch');
        }
    }, [])

    const newContent = {
        contentTopNav: [
            <></>
        ] as React.ReactNode[],
        contentLsidebar: [
            <div>
                <Avatar
                    dispatch={dispatch}
                    avatar={profile ? profile.avatar : null}
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
        ] as React.ReactNode[],
        contentRsidebar: [
            <>
                <WidgetPerhapsYoureFamiliar />
            </>
        ] as React.ReactNode[],
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
        ] as React.ReactNode[]
    };

    useEffect(() => {
        setContent(newContent);
    }, [isAuth, authorizedUser.id, profile, setContent]);

    useEffect(() => {
        if (error) {
            setModalActiveError(true);
        }
    }, [error]);

    return (
        isAuth && profile ?
            <>
                <Outlet
                    context={{
                        dispatch,
                        isAuth,
                        authorizedUser,
                        profile,
                        posts,
                        error,
                        isDarkTheme
                    }}
                />

                <ModalWindow modalActive={modalActiveError} setModalActive={setModalActiveError}>
                    <ErrorsContent error={error} setReloadProfile={setReloadProfile} setModalActiveError={setModalActiveError} />
                </ModalWindow>
            </>
            :
            <Navigate to={routeAuth()} />

    )
})
export { routeMain };
export default MyProfileContainer