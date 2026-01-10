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
import AppBlogs from '../../../../../services/Blogs/src/router/Router';
// import { routeMain as routeMyBlog } from '../../../../../services/Blogs/src/MyBlogs/HomePage/homePage';
import { routeMain as routeMyBlog } from '../../../../../services/Blogs/src/MyBlogs/BlogsContainer';
import AppSettings from '../../../../../services/SettingsMyProfile/src/router/Router';
import { routeMain as routeSettingsMyProfile } from '../../../../../services/SettingsMyProfile/src/SettingsMyProfile/SettingsProfile';
import UserProfileContainer, { routeMain as routeUserProfile } from '../../../../../services/UserProfile/src/UserProfile/UserProfileContainer';
import MyShopsContainer from '../../../../../services/MyShops/src/Shop/myShopsContainer';
import { routeMain as routeMyShop } from '../../../../../services/MyShops/src/Shop/routes';
import ShopsListContainer, { routeMain as routeShopsList } from '../../../../../services/ShopsList/src/ShopListContainer';
import BlogsListContainer, { routeMain as routeBlogsList } from '../../../../../services/BlogsList/src/BlogListContainer';
import AuthContainer, { routeMain as routeAuth } from '../../../../../services/Auth/src/AuthContainer';
import Registration, { routeMain as routeRegistration } from '../../../../../services/Auth/src/pages/Registration';
import FinishRegistration, { routeMain as routeFinishRegistration } from '../../../../../services/Auth/src/pages/FinishRegistration';
import RessetPassword, { routeMain as routeRessetPassword } from '../../../../../services/Auth/src/pages/ResetPassword/sendMessagePage/sendMessageResetPassword';
import NewPssword, { routeMain as routeNewPassword } from '../../../../../services/Auth/src/pages/ResetPassword/newPasswordPage/newPasswordPage';
import UsersContainer, { routeMain as routeUsers } from '../../../../../services/Users/src/Users/UsersContainer';
import MusicContainer, { routeMain as routeMusicContainer } from "../../../../../services/Music/src/Music/MusicContainer";
import { Col, Row, Grid } from "antd"; // Добавлен Grid
import LeftNav from "../LeftNav";
import RightNav from "../RightNav";
import { SIDEBAR_OFF } from "../../store/PageElementsSlice/pageElementsSlice";
import Preloader from "../Priloader";
import classes from './styles.module.scss'

const { useBreakpoint } = Grid;

const MyRoutes: React.FC = () => {
    const { content, pageType } = useAppContext();
    const { contentLsidebar, contentRsidebar } = content;

    // Хук для отслеживания ширины экрана
    const screens = useBreakpoint();

    const [leftNavLocalSpan, setLeftNavLocalSpan] = useState<number | null>(null);
    const [lSidebarLocalSpan, setLSidebarLocalSpan] = useState<number | null>(null);
    const [contentBlockSpan, setContentBlockSpan] = useState<number | null>(null);
    const [rSidebarLocalSpan, setRSidebarLocalSpan] = useState<number | null>(null);
    const [rightNavLocalSpan, setRightNavLocalSpan] = useState<number | null>(null);

    const {
        LeftNavSpan,
        Lsidebar,
        LsidebarSpan,
        ContentBlockSpan,
        Rsidebar,
        RsidebarSpan,
        RightNavSpan
    } = useAppSelector(state => state.page_elements)

    useEffect(() => {
        // Если AntD еще не определил размеры экрана, выходим
        if (Object.keys(screens).length === 0) return;

        // ВАЖНО: Ant Design определяет брейкпоинты как:
        // xs: < 576px
        // sm: >= 576px
        // md: >= 768px
        // lg: >= 992px
        // xl: >= 1200px
        // xxl: >= 1600px

        let navSpan = LeftNavSpan ?? 2;
        let lSideSpan = LsidebarSpan ?? 5;
        let contentSpan = ContentBlockSpan ?? 10;
        let rSideSpan = RsidebarSpan ?? 5;
        let rNavSpan = RightNavSpan ?? 2;

        const totalSpan = (navSpan + lSideSpan + contentSpan + rSideSpan + rNavSpan);
        // Если сумма Redux-колонок меньше 24 (значит, есть свободное место), 
        // мы можем распределить их пропорционально, или просто оставим как есть, 
        // но убедимся, что сумма не превышает 24.
        // Если Redux-значения корректны (сумма <= 24), то они используются как база.

        if (screens.xxl) {
            // Режим XXL (1600px+): Используем Redux-значения, без изменений
        } else if (screens.xl) {
            // Режим XL (1200px+): Полная раскладка, но можно немного сузить.
            // Например: оставляем все, но контент делаем чуть шире за счет сайдбаров
            lSideSpan = 4; // Был 5
            contentSpan = 12; // Был 10
            rSideSpan = 4; // Был 5
            // Общая сумма: 2 (LNav) + 4 (LSide) + 12 (Content) + 4 (RSide) + 2 (RNav) = 24
        } else if (screens.lg) {
            // Режим LG (992px+): Ноутбук. Убираем один сайдбар
            lSideSpan = Lsidebar !== SIDEBAR_OFF ? 5 : 0; // Левый сайдбар, если он включен
            rSideSpan = 0; // Правый сайдбар убираем
            navSpan = 2;
            rNavSpan = 0; // Правую навигацию убираем
            contentSpan = 24 - navSpan - lSideSpan; // Оставшееся место
        } else if (screens.md) {
            // Режим MD (768px+): Планшет. Убираем все сайдбары, оставляем только контент и нав.
            navSpan = 2; // Левую навигацию оставляем
            lSideSpan = 0;
            rSideSpan = 0;
            rNavSpan = 0;
            contentSpan = 22; // 24 - 2 (LNav)
        } else {
            // Режимы SM (< 768px) и XS (< 576px): Мобилка. Все на 24, все остальное скрываем.
            navSpan = 0;
            lSideSpan = 0;
            contentSpan = 24;
            rSideSpan = 0;
            rNavSpan = 0;
        }

        setLeftNavLocalSpan(navSpan);
        setLSidebarLocalSpan(lSideSpan);
        setContentBlockSpan(contentSpan);
        setRSidebarLocalSpan(rSideSpan);
        setRightNavLocalSpan(rNavSpan);

    }, [LeftNavSpan, LsidebarSpan, ContentBlockSpan, RsidebarSpan, RightNavSpan, Lsidebar, screens]);

    return (
        <Row className={`
            ${classes.wrapRoutes}
            ${pageType === 'fixed'
                ? classes.fixedOneScreen
                : classes.stretchScreen
            }`} gutter={0}
        >
            {/* Если span 0 или null, не рендерим колонку вообще */}
            {leftNavLocalSpan ? <Col span={leftNavLocalSpan}><LeftNav /></Col> : null}

            {(Lsidebar !== SIDEBAR_OFF && lSidebarLocalSpan)
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
                            <Route path={`${routeMyBlog()}/*`} element={<AppBlogs />} />

                            <Route path={`${routeSettingsMyProfile()}/*`} element={<AppSettings />} />
                            <Route path={`${routeUserProfile()}/*`} element={<UserProfileContainer />} />
                            <Route path={`${routeMyShop()}/*`} element={<MyShopsContainer />} />
                            <Route path={`${routeShopsList()}/*`} element={<ShopsListContainer />} />
                            <Route path={`${routeBlogsList()}/*`} element={<BlogsListContainer />} />
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

            {(Rsidebar !== SIDEBAR_OFF && rSidebarLocalSpan)
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

            {rightNavLocalSpan ? <Col span={rightNavLocalSpan}><RightNav /></Col> : null}
        </Row>
    );
};
export default MyRoutes;