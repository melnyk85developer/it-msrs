import React, { useEffect, useState } from "react";
import { useAppContext } from '@packages/shared/src/components/contexts/AppContext';
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { Navigate } from "react-router-dom";
import { routeMain as routeFinishRegistration } from "../FinishRegistration"
import { FOOTER_ON, setContentSpanAC, setFooterAC, setLSidebarAC, setLSidebarSpanAC, setRSidebarAC, setRSidebarSpanAC, SIDEBAR_OFF, SIDEBAR_ON } from "@packages/shared/src/store/PageElementsSlice/pageElementsSlice";
import { Col } from "antd";
import WidgetFriends from '@packages/shared/src/components/Widgets/WidgetFriends'
import WidgetPeople from '@packages/shared/src/components/Widgets/WidgetsPeople'
import WidgetPerhapsYoureFamiliar from '@packages/shared/src/components/Widgets/WidgetPerhapsYoureFamiliar'
import RegistrationForm from "./RegistrationForm";
import routeMain from "./routes";
import classes from './styles.module.scss';

const Registration: React.FC = () => {
    const dispatch = useAppDispatch();
    const {isAuth, isDarkTheme, error} = useAppSelector(state => state.authPage)
    const { content, setContent, setPageType } = useAppContext();
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if(redirect === true){
            <Navigate to={routeFinishRegistration()}/>
        }
    }, [redirect])

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
                ${classes.wrapFooterSectionsForSettingProfile}
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
        <>
            {redirect === true && !error
            ? 
                <Navigate to={routeFinishRegistration()}/>
            : 
                <RegistrationForm setRedirect={setRedirect}/>
            }
        </>
    )
}
export {routeMain};
export default Registration;