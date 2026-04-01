import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { useAppContext } from "@packages/shared/src/components/contexts/AppContext";
import { FOOTER_OFF, FOOTER_ON, setContentSpanAC, setFooterAC, setLSidebarAC, setLSidebarSpanAC, setRSidebarAC, setRSidebarSpanAC, SIDEBAR_OFF, SIDEBAR_ON } from "@packages/shared/src/store/PageElementsSlice/pageElementsSlice";
import { NavLink, Outlet } from "react-router-dom";
import { Button, Col, Row } from "antd";
import routeMain from './routes'
import classes from './styles.module.scss';
import { AiAssistantWidgetListAdmin } from "./pages/AI-Assistant-General/AI-AssistantLSidebar/AiAssistantListWidgetAdmin/AiAssistantListAdminWidget";
import { AdminTopRightNav } from "./AdminTopNav/adminTopRightNav/adminTopRightNav";
import { AdminLSidebar, AdminPagesTypeContent } from "./AdminLSidebar/AdminLSidebar";
import { getAiProvidersAndModelsAC } from "@packages/shared/src/store/MyAdminReducers/myAiAssistantAdminSlice";


const AppMyAdminContainer: React.FC = React.memo(() => {
    const dispatch = useAppDispatch()
    const { content, setContent, setPageType } = useAppContext();
    const { isAuth, isDarkTheme } = useAppSelector(state => state.authPage)
    const [typePage, setTypePage] = useState<'SMALL' | 'BIG'>('BIG');
    const [typeContent, setTypeContent] = useState<AdminPagesTypeContent>('HALLO_ADMIN');

    // console.log('AppMyAdminContainer: - users', users)
    console.log('AppMyAdminContainer: - typeContent', typeContent)


    const newContent = {
        contentTopNav: [
            <Row gutter={0} className={classes.adminTopNav}>
                <Col span={2}></Col>
                <Col span={4}></Col>
                <Col span={12} className={classes.center_BlockAdminTopNav}>
                    <h1 style={{ margin: '0 auto', color: '#FFAC00' }}>Admin</h1>
                </Col>
                <Col span={4}></Col>
                <Col span={2}>
                    <AdminTopRightNav
                        typeContent={typeContent}
                        setTypeContent={setTypeContent}
                    />
                </Col>
            </Row>
        ] as React.ReactNode[],
        contentLsidebar: [
            <AdminLSidebar
                typeContent={typeContent}
                setTypeContent={setTypeContent}
            />
        ] as React.ReactNode[],
        contentRsidebar: [<></>] as React.ReactNode[],
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
        dispatch(getAiProvidersAndModelsAC())
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
        dispatch(getAiProvidersAndModelsAC())
        dispatch(setLSidebarAC(SIDEBAR_ON));
        dispatch(setLSidebarSpanAC(4));
        dispatch(setContentSpanAC(16));
        dispatch(setRSidebarAC(SIDEBAR_ON));
        dispatch(setRSidebarSpanAC(0));
        dispatch(setFooterAC(typePage === 'BIG' ? FOOTER_ON : FOOTER_OFF));
        setPageType('stretch');
        setContent(newContent);
    }, [typeContent, typePage]);

    return <Outlet
        context={{
            typePage,
            setTypePage
        }}
    />
})
export { routeMain };
export default AppMyAdminContainer

