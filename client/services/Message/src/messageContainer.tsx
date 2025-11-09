import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch } from "@packages/shared/src/components/hooks/redux";
import { useAppContext } from "@packages/shared/src/components/contexts/AppContext";
import { FOOTER_OFF, setContentSpanAC, setFooterAC, setLSidebarAC, setLSidebarSpanAC, setRSidebarAC, setRSidebarSpanAC, SIDEBAR_ON } from "@packages/shared/src/store/PageElementsSlice/pageElementsSlice";
import { Col, Row } from "antd";
import { Interlocutors } from "./Interlocutor/interlocutor";
import WidgetPerhapsYoureFamiliar from "@packages/shared/src/components/Widgets/WidgetPerhapsYoureFamiliar";
import routeMain from "./StartMessage/routes";

const MessageContainer = () => {
    const dispatch = useAppDispatch()
    const { content, setContent, setPageType } = useAppContext();

    const newContent = {
        contentTopNav: [
            <Row gutter={0}>
                <Col span={2}></Col>
                <Col span={4}></Col>
                <Col span={12}></Col>
                <Col span={4}></Col>
                <Col span={2}></Col>
            </Row>
        ] as React.ReactNode[],
        contentLsidebar: [
            <Interlocutors />
        ] as React.ReactNode[],
        contentRsidebar: [
            <WidgetPerhapsYoureFamiliar />
        ] as React.ReactNode[],
        contentFooter: [
            <></>
        ] as React.ReactNode[]
    };

    useEffect(() => {
        dispatch(setLSidebarAC(SIDEBAR_ON));
        dispatch(setLSidebarSpanAC(5));
        dispatch(setContentSpanAC(10));
        dispatch(setRSidebarAC(SIDEBAR_ON));
        dispatch(setRSidebarSpanAC(5));
        dispatch(setFooterAC(FOOTER_OFF));
        setPageType('fixed');
    }, []);

    useEffect(() => {
        setContent(newContent);
    }, [])

    return <Outlet />
}
export { routeMain };
export default MessageContainer