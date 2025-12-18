import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import AdminPanel from ".";
import { useAppContext } from "@packages/shared/src/components/contexts/AppContext";
import { FOOTER_ON, setContentSpanAC, setFooterAC, setLSidebarAC, setLSidebarSpanAC, setRSidebarAC, setRSidebarSpanAC, SIDEBAR_OFF, SIDEBAR_ON } from "@packages/shared/src/store/PageElementsSlice/pageElementsSlice";
import { NavLink, Outlet } from "react-router-dom";
import { Col } from "antd";
import routeMain from './routes'
import classes from './styles.module.scss';

const AppMyAdminContainer: React.FC = React.memo(() => {
    const dispatch = useAppDispatch()
    const { content, setContent, setPageType } = useAppContext();
    const {isAuth, isDarkTheme} = useAppSelector(state => state.authPage)

    const newContent = {
        contentTopNav: [<h1 style={{ margin: '0 auto', color: '#FFAC00' }}>Admin</h1>] as React.ReactNode[],
        contentLsidebar: [
            <div className={classes.wrapLeftAdminNav}> 
                <div className={classes.title_nav}>
                    <h3>Навигиция:</h3>
                </div>
                <ul className={classes.ul}>
                    <li><NavLink to="/admin">Главная</NavLink></li>
                    <li><NavLink to="/admin/bots">Боты</NavLink></li>
                    <li><NavLink to="/admin/adminshops">Магазины</NavLink></li>
                </ul>
            </div>
        ],
        contentRsidebar: [<></>],
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
        dispatch(setLSidebarAC(SIDEBAR_ON));
        dispatch(setLSidebarSpanAC(5));
        dispatch(setContentSpanAC(15));
        dispatch(setRSidebarAC(SIDEBAR_ON));
        dispatch(setRSidebarSpanAC(0));
        dispatch(setFooterAC(FOOTER_ON));
        setPageType('stretch');
        setContent(newContent);
    }, []);
    return <Outlet />
})
export {routeMain};
export default AppMyAdminContainer

