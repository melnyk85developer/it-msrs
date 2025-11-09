import React, { Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LSidebar from "@packages/shared/src/components/LSidebar";
import RSidebar from "@packages/shared/src/components/RSidebar";
import { useAppContext } from "../contexts/AppContext";
import { useAppSelector } from "../hooks/redux";
import AppMyAdminRout from '../../../../../services/Admin/src/router/Router'
import { routeMain as routeAdmin } from '../../../../../services/Admin/src/AdminPanel'
import MyProfileContainer, { routeMain as routeMyProfile } from '../../../../../services/MyProfile/src/MyProfile/MyProfileContainer';
import AppMessages from '../../../../../services/Message/src/router/Router';
import { routeMain as routeMessage } from '../../../../../services/Message/src/StartMessage/startMessage';
import AppSettings from '../../../../../services/SettingsMyProfile/src/router/Router';
import { routeMain as routeSettingsMyProfile } from '../../../../../services/SettingsMyProfile/src/SettingsMyProfile/SettingsProfile';
import UserProfileContainer, { routeMain as routeUserProfile } from '../../../../../services/UserProfile/src/UserProfile/UserProfileContainer';
import MyShopsContainer from '../../../../../services/MyShops/src/Shop/myShopsContainer';
import { routeMain as routeMyShop } from '../../../../../services/MyShops/src/Shop/routes';
import ShopsContainer, { routeMain as routeShop } from '../../../../../services/ShopsList/src/ShopListContainer';
import AuthContainer, { routeMain as routeAuth } from '../../../../../services/Auth/src/AuthContainer';
import Registration, { routeMain as routeRegistration } from '../../../../../services/Auth/src/pages/Registration';
import FinishRegistration, { routeMain as routeFinishRegistration } from '../../../../../services/Auth/src/pages/FinishRegistration';
import RessetPassword, { routeMain as routeRessetPassword } from '../../../../../services/Auth/src/pages/ResetPassword/sendMessagePage/sendMessageResetPassword';
import NewPssword, { routeMain as routeNewPassword } from '../../../../../services/Auth/src/pages/ResetPassword/newPasswordPage/newPasswordPage';
import UsersContainer, { routeMain as routeUsers } from '../../../../../services/Users/src/Users/UsersContainer';
import MusicContainer, { routeMain as routeMusicContainer } from "../../../../../services/Music/src/Music/MusicContainer";
import { Col, Row } from "antd";
import LeftNav from "../LeftNav";
import RightNav from "../RightNav";
import { SIDEBAR_OFF } from "../../store/PageElementsSlice/pageElementsSlice";
import Preloader from "../Priloader";
import classes from './styles.module.scss'

const MyRoutes: React.FC = () => {
    const { content, pageType } = useAppContext();
    const { contentLsidebar, contentRsidebar } = content;
    const [leftNavLocalSpan, setLeftNavLocalSpan] = useState(null);
    const [lSidebarLocalSpan, setLSidebarLocalSpan] = useState(null);
    const [contentBlockSpan, setContentBlockSpan] = useState(null);
    const [rSidebarLocalSpan, setRSidebarLocalSpan] = useState(null);
    const [rightNavLocalSpan, setRightNavLocalSpan] = useState(null);
    const {
        LeftNavSpan,
        Lsidebar,
        LsidebarSpan,
        ContentBlockSpan,
        Rsidebar,
        RsidebarSpan,
        RightNavSpan
    } = useAppSelector(state => state.page_elements)

    // console.log('pageType: - ', pageType)

    // useEffect(() => {
    //     const setVhVariable = () => {
    //         const vh = window.innerHeight * 0.01;
    //         document.documentElement.style.setProperty('--vh', `${vh}px`);
    //     };
    //     setVhVariable(); // Установить при монтировании
    //     window.addEventListener('resize', setVhVariable);
    //     return () => {
    //         window.removeEventListener('resize', setVhVariable);
    //     };
    // }, []);

    useEffect(() => {
        setLeftNavLocalSpan(LeftNavSpan ?? 2)
        setLSidebarLocalSpan(LsidebarSpan ?? 5)
        setContentBlockSpan(ContentBlockSpan ?? 10)
        setRSidebarLocalSpan(RsidebarSpan ?? 5)
        setRightNavLocalSpan(RightNavSpan ?? 2)
        // console.log('MyRoutes: - useEffect [...]', LeftNavSpan, LsidebarSpan, ContentBlockSpan, RsidebarSpan, RightNavSpan)
    }, [LeftNavSpan, LsidebarSpan, ContentBlockSpan, RsidebarSpan, RightNavSpan]);

    return (
        <Row className={`
            ${classes.wrapRoutes}
            ${pageType === 'fixed'
                ? classes.fixedOneScreen
                : classes.stretchScreen
            }`} gutter={0}
        >
            <Col span={leftNavLocalSpan}><LeftNav /></Col>

            {Lsidebar !== SIDEBAR_OFF || lSidebarLocalSpan !== 0
                ?
                (<Col className={`
                    ${classes.colAside}
                    ${pageType === 'fixed'
                        ? classes.fixed
                        : classes.stretch
                    }`} span={lSidebarLocalSpan}>
                    <aside>
                        <LSidebar>
                            {contentLsidebar?.map((item, index) => (
                                <React.Fragment key={index}>{item}</React.Fragment>
                            ))}
                        </LSidebar>
                    </aside>
                </Col>)
                :
                null
            }
            <Col className={`
                ${classes.contentBlockRoutes}
                    ${pageType === 'fixed'
                    ? classes.fixed
                    : classes.stretch
                }`} span={contentBlockSpan}
            >
                <section className={classes.section}>
                    <React.Suspense fallback="Loading">
                        <Routes>
                            <Route index element={<Navigate to={routeMyProfile()} />} />
                            <Route path={`${routeMyProfile()}/*`} element={<MyProfileContainer />} />
                            <Route path={`${routeMessage()}/*`} element={<AppMessages />} />
                            <Route path={`${routeSettingsMyProfile()}/*`} element={<AppSettings />} />
                            <Route path={`${routeUserProfile()}/*`} element={<UserProfileContainer />} />
                            <Route path={`${routeMyShop()}/*`} element={<MyShopsContainer />} />
                            <Route path={`${routeShop()}/*`} element={<ShopsContainer />} />
                            <Route path={`${routeMusicContainer()}/*`} element={<MusicContainer />} />
                            <Route path={`${routeAuth()}/*`} element={<AuthContainer />} />
                            <Route path={`${routeRegistration()}/*`} element={<Registration />} />
                            <Route path={`${routeUsers()}/*`} element={<UsersContainer />} />
                            <Route path={`${routeFinishRegistration()}/*`} element={<FinishRegistration />} />
                            <Route path={`${routeRessetPassword()}/*`} element={<RessetPassword />} />
                            <Route path={`${routeNewPassword()}/*`} element={<NewPssword />} />
                            <Route path={`${routeAdmin()}/*`} element={<AppMyAdminRout />} />
                        </Routes>
                    </React.Suspense>
                </section>
            </Col>
            {Rsidebar !== SIDEBAR_OFF || rSidebarLocalSpan !== 0
                ?
                (<Col className={`
                    ${classes.colAside}
                    ${pageType === 'fixed'
                        ? classes.fixed
                        : classes.stretch
                    }`} span={rSidebarLocalSpan}>
                    <aside>
                        <RSidebar>
                            {contentRsidebar?.map((item, index) => (
                                <React.Fragment key={index}>{item}</React.Fragment>
                            ))}
                        </RSidebar>
                    </aside>
                </Col>)
                :
                null
            }

            <Col span={rightNavLocalSpan}><RightNav /></Col>
        </Row>
    );
};
export default MyRoutes;
