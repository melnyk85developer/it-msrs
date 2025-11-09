import React from "react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { Navigate, Outlet } from "react-router-dom";
import { useAppContext } from "@packages/shared/src/components/contexts/AppContext";
import { FOOTER_OFF, FOOTER_ON, setContentSpanAC, setFooterAC, setLSidebarAC, setLSidebarSpanAC, setRSidebarAC, setRSidebarSpanAC, SIDEBAR_OFF, SIDEBAR_ON } from "@packages/shared/src/store/PageElementsSlice/pageElementsSlice";
import { routeMain as routeAuth }  from '../../../Auth/src/pages/Auth';
import { Col } from "antd";
import NavSettings from "../NavSettings/navSettings";
import routeMain from "./SettingsProfile/routes";
import classes from './styles.module.scss';

const SettingMyProfileContainer: React.FC = React.memo(() => {
    const dispatch = useAppDispatch();
    const {isAuth, authorizedUser, isDarkTheme} = useAppSelector(state => state.authPage)
    const { content, setContent, setPageType, pageType } = useAppContext();
    const { LeftNavSpan, LsidebarSpan, ContentBlockSpan, RsidebarSpan, RightNavSpan } = useAppSelector(state => state.page_elements)
    
    const newContent = {
        contentTopNav: [] as React.ReactNode[],
        contentLsidebar: [<NavSettings/>] as React.ReactNode[],
        contentRsidebar: [] as React.ReactNode[],
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
        dispatch(setLSidebarAC(SIDEBAR_ON));
        dispatch(setLSidebarSpanAC(5));
        dispatch(setContentSpanAC(15));
        dispatch(setRSidebarAC(SIDEBAR_OFF));
        dispatch(setRSidebarSpanAC(0));
        dispatch(setFooterAC(FOOTER_OFF));
        setPageType('fixed');
    }, []);

    useEffect(() => {
        setContent(newContent);
    }, [LsidebarSpan, ContentBlockSpan, RsidebarSpan]);

    return (
        <>
            {isAuth 
                ? 
                    <Outlet /> 
                : 
                    <Navigate to={routeAuth()}/>
            }
        </>
    )
})
export {routeMain};
export default SettingMyProfileContainer;