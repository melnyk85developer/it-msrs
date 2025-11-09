import React, { useEffect, useState } from "react";
import { userProfileAC } from "@packages/shared/src/store/UserProfileReducers/userProfileSlice";
import { IProfile, IUser } from "@packages/shared/src/types/IUser";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { useParams } from "react-router-dom";
import { useAppContext } from '@packages/shared/src/components/contexts/AppContext';
import WidgetFriends from '@packages/shared/src/components/Widgets/WidgetFriends'
import WidgetPeople from '@packages/shared/src/components/Widgets/WidgetsPeople'
import WidgetPerhapsYoureFamiliar from '@packages/shared/src/components/Widgets/WidgetPerhapsYoureFamiliar'
import Preloader from "@packages/shared/src/components/Priloader";
import Avatar from "./Avatar";
import { Col } from "antd";
import Info from "./Info";
import MyPostsContainer from "./MyPosts/MyPostsContainer";
import { useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { FOOTER_ON, setContentSpanAC, setFooterAC, setLSidebarAC, setLSidebarSpanAC, setRSidebarAC, setRSidebarSpanAC, SIDEBAR_ON } from "@packages/shared/src/store/PageElementsSlice/pageElementsSlice";
import ModalWindow from "@packages/shared/src/components/ModalWindows";
import ErrorsContent from "@packages/shared/src/components/ErrorsContent";
import classes from './styles.module.scss'

type PropsType = {
    authorizedUser: IUser;
    profile: IProfile;
    isAuth: boolean;
    error: string;
    isDarkTheme: string
    dispatch: AppDispatch;
}

const UserProfile: React.FC<PropsType> = React.memo(({dispatch, error, profile}) => {
    const { content, setContent, setPageType } = useAppContext();
    const {isAuth, authorizedUser, isDarkTheme} = useAppSelector(state => state.authPage)
    const {id} = useParams();
    let userId = Number(id);

    const [reloadProfile, setReloadProfile] = useState(false);
    const [modalActiveError, setModalActiveError] = useState(false);

    const newContent = {
        contentTopNav: [] as React.ReactNode[],
        contentLsidebar: [
            <div> 
                <Avatar 
                    key={profile?.userId}
                    avatar={profile.avatar} 
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
            <WidgetPerhapsYoureFamiliar/>
        ],
        contentFooter: [
            <div className={`
                ${classes.wrapFooterSectionsForUserProfile}
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
        if(userId){
            dispatch(userProfileAC(userId))
            dispatch(setLSidebarAC(SIDEBAR_ON));
            dispatch(setLSidebarSpanAC(5));
            dispatch(setContentSpanAC(10));
            dispatch(setRSidebarAC(SIDEBAR_ON));
            dispatch(setRSidebarSpanAC(5));
            dispatch(setFooterAC(FOOTER_ON));
            setPageType('stretch');
        }
    },[userId, reloadProfile])

    useEffect(() => {
        setContent(newContent);
    }, [profile, setContent]);

    useEffect(() => {
        if (error) {
          setModalActiveError(true);
        }
    }, [error]);

    return (
        <div className={`${classes.wrapContentProfiles} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            {profile ? 
                (
                    <Col className={classes.contentProfiles}>
                        <Info 
                            key={profile.userId}
                            authorizedUser={authorizedUser}
                            profile={profile}
                            dispatch={dispatch}
                            error={error}
                            isDarkTheme={isDarkTheme}
                        />
                        <MyPostsContainer 
                            dispatch={dispatch} 
                            profile={profile} 
                            authorizedUser={authorizedUser}
                        />
                    </Col>
                ) : <Preloader />
            } 
            <ModalWindow modalActive={modalActiveError} setModalActive={setModalActiveError}>
                <ErrorsContent error={error} setReloadProfile={setReloadProfile} setModalActiveError={setModalActiveError}/>
            </ModalWindow>
        </div>

    )
})
export default UserProfile

