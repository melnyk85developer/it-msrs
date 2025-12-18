import React, { useEffect } from 'react';
import LoginForm from '../LoginForm';
import { useAppContext } from '@packages/shared/src/components/contexts/AppContext';
import WidgetFriends from '@packages/shared/src/components/Widgets/WidgetFriends'
import WidgetPeople from '@packages/shared/src/components/Widgets/WidgetsPeople'
import WidgetPerhapsYoureFamiliar from '@packages/shared/src/components/Widgets/WidgetPerhapsYoureFamiliar'
import { routeMain as routeMyProfile }  from '../../../../MyProfile/src/MyProfile/MyProfileContainer';
import { IUser } from '@packages/shared/src/types/IUser';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@packages/shared/src/components/hooks/redux';
import { FOOTER_ON, setContentSpanAC, setFooterAC, setLSidebarAC, setLSidebarSpanAC, setRSidebarAC, setRSidebarSpanAC, SIDEBAR_ON } from '@packages/shared/src/store/PageElementsSlice/pageElementsSlice';
import { Col } from 'antd';
import routeMain  from './route';
import classes from './styles.module.scss'

type PropsType = {
    isAuth: boolean;
    isDarkTheme: string;
    authorizedUser: IUser;
    isLoadingAuthUser: boolean;
}

const Auth: React.FC<PropsType> = React.memo(() => {
    const dispatch = useAppDispatch();
    const { content, setContent, setPageType } = useAppContext();
    const {isDarkTheme, authorizedUser, isAuth, isLoadingAuthUser} = useAppSelector(state => state.authPage)

    // console.log('Auth: - authorizedUser', authorizedUser)

    if(isLoadingAuthUser){
        return <h1>Идет загрузка...</h1>
    }

    const newContent = {
        contentTopNav: [] as React.ReactNode[],
        contentLsidebar: [
            <div>
                {/* <WidgetPerhapsYoureFamiliar/>
                <WidgetPeople />
                <WidgetFriends /> */}
            </div>
        ],
        contentRsidebar: [
            <div>
                {/* <WidgetPerhapsYoureFamiliar/>
                <WidgetPeople />
                <WidgetFriends /> */}
            </div>
        ],
        contentFooter: [
            <div className={`
                ${classes.wrapFooterSectionsForAuth}
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
        setContent(newContent);
        dispatch(setLSidebarAC(SIDEBAR_ON));
        dispatch(setLSidebarSpanAC(5));
        dispatch(setContentSpanAC(10));
        dispatch(setRSidebarAC(SIDEBAR_ON));
        dispatch(setRSidebarSpanAC(5));
        dispatch(setFooterAC(FOOTER_ON));
        setPageType('stretch');
    }, []);

    return (
        <div className={`${classes.wrapContentAuth} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <div className={classes.contentAuth}>
                <h1>Авторизация</h1>
                {isAuth === true && authorizedUser && authorizedUser.id ? <Navigate to={routeMyProfile(authorizedUser.id)}/> : <LoginForm />}  
            </div>
        </div>
    );
})
export { routeMain };
export default Auth