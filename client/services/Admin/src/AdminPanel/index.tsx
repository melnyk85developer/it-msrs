import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { useAppContext } from "@packages/shared/src/components/contexts/AppContext";
import { FOOTER_OFF, FOOTER_ON, setContentSpanAC, setFooterAC, setLSidebarAC, setLSidebarSpanAC, setRSidebarAC, setRSidebarSpanAC, SIDEBAR_OFF, SIDEBAR_ON } from "@packages/shared/src/store/PageElementsSlice/pageElementsSlice";
import { NavLink, Outlet } from "react-router-dom";
import { Button, Col, Row } from "antd";
import routeMain from './routes'
import classes from './styles.module.scss';
import { AiAssistantWidgetListAdmin } from "./pages/AI-Assistant-General/AI-AssistantLSidebar/AiAssistantListWidgetAdmin/AiAssistantListAdminWidget";

const AppMyAdminContainer: React.FC = React.memo(() => {
    const dispatch = useAppDispatch()
    const { content, setContent, setPageType } = useAppContext();
    const { isAuth, isDarkTheme } = useAppSelector(state => state.authPage)
    const [typePage, setTypePage] = useState<'SMALL' | 'BIG'>('BIG');
    const [mode, setMode] = useState<'assistant' | 'navigation'>('assistant');

    // console.log('AppMyAdminContainer: - users', users)

    const setStatusMode = () => {
        setMode(prevMode => prevMode === 'assistant' ? 'navigation' : 'assistant');
    }

    const newContent = {
        contentTopNav: [
            <Row gutter={0} className={classes.adminTopNav}>
                <Col span={2} className={classes.left_1_BlockAdminTopNav}></Col>
                <Col span={4} className={classes.wrapLeft_2_BlockAdminTopNav}>
                    <div onClick={() => setStatusMode()} className={classes.left_2_BlockAdminTopNav}>{
                        mode === 'navigation'
                            ?
                            'Assistant'
                            :
                            'Admin Navigation'
                    }</div>
                </Col>
                <Col span={12} className={classes.center_BlockAdminTopNav}>
                    <h1 style={{ margin: '0 auto', color: '#FFAC00' }}>Admin</h1>
                </Col>
                <Col span={4} className={classes.right_1_BlockAdminTopNav}></Col>
                <Col span={2} className={classes.right_2_BlockAdminTopNav}></Col>
            </Row>
        ] as React.ReactNode[],
        contentLsidebar: [
            <>
                <div className={classes.wrapLeftAdminNav}>
                    <div className={classes.title_nav}>
                        <h3>{
                            mode === 'navigation'
                                ?
                                'Навигиция:'
                                :
                                'GPTermikAI'
                        }</h3>
                    </div>
                    {
                        mode === 'navigation' ?
                            <ul className={classes.ul}>
                                <li><NavLink to="/admin">Главная</NavLink></li>
                                <li><NavLink to="/admin/bots">Боты</NavLink></li>
                                <li><NavLink to="/admin/adminshops">Магазины</NavLink></li>
                            </ul>
                            :
                            <>
                                <ul className={classes.ul}>
                                    <li><NavLink to="/admin/ai-assistant/ai-messages">GPTermikAI General</NavLink></li>
                                </ul>
                                <AiAssistantWidgetListAdmin />
                            </>
                    }
                </div>
            </>
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
        dispatch(setLSidebarSpanAC(4));
        dispatch(setContentSpanAC(16));
        dispatch(setRSidebarAC(SIDEBAR_ON));
        dispatch(setRSidebarSpanAC(0));
        dispatch(setFooterAC(typePage === 'BIG' ? FOOTER_ON : FOOTER_OFF));
        setPageType('stretch');
        setContent(newContent);
    }, []);

    useEffect(() => {
        console.log('useEffect - setStatusMode: ', mode)
        dispatch(setLSidebarAC(SIDEBAR_ON));
        dispatch(setLSidebarSpanAC(4));
        dispatch(setContentSpanAC(16));
        dispatch(setRSidebarAC(SIDEBAR_ON));
        dispatch(setRSidebarSpanAC(0));
        dispatch(setFooterAC(typePage === 'BIG' ? FOOTER_ON : FOOTER_OFF));
        setPageType('stretch');
        setContent(newContent);
    }, [mode, typePage]);
    return <Outlet
        context={{
            typePage,
            setTypePage
        }}
    />
})
export { routeMain };
export default AppMyAdminContainer

