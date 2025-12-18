import React, { useEffect, useState } from "react";
import Header from "@packages/shared/src/components/Header/Header"
import Footer from "@packages/shared/src/components/Footer/Footer"
import MyRoutes from '@packages/shared/src/components/MyRoutes/MyRoutes';
import { Col, Row } from "antd";
import { useAppDispatch, useAppSelector } from '@packages/shared/src/components/hooks/redux';
import { checkAuthAC } from "../../../../packages/shared/src/store/AuthReducers/authSlice";
import { useAppContext } from "../../../../packages/shared/src/components/contexts/AppContext";
import { FOOTER_OFF, FOOTER_ON } from "@packages/shared/src/store/PageElementsSlice/pageElementsSlice";
import Preloader from "@packages/shared/src/components/Priloader";
import classes from './styles.module.scss'

const AppContainer = () => {
    const dispatch = useAppDispatch();
    const { content } = useAppContext();
    const { contentTopNav, contentLsidebar, contentRsidebar, contentFooter } = content;
    const { isLoadingAuthUser, isAuth, authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage);
    const { profile, error } = useAppSelector(state => state.myProfilePage);
    const { FooterState } = useAppSelector(state => state.page_elements)
    const [isAppInitialized, setIsAppInitialized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            dispatch(checkAuthAC()).finally(() => {
                setIsAppInitialized(true);
            });
        } else {
            setIsAppInitialized(true);
        }
    }, [dispatch]);

    return (
        <Row className={`
                ${classes.AppContent} 
                ${isDarkTheme !== "light"
                ?
                classes.dark
                :
                classes.light
            }
            `} gutter={0}
        >
            <Col span={24}>
                <Header
                    authorizedUser={authorizedUser}
                    profile={profile}
                    isAuth={isAuth}
                    error={error}
                    dispatch={dispatch}
                    isDarkTheme={isDarkTheme}
                />
            </Col>
            <Col span={22} className={classes.wrapper}>
                {!isAppInitialized
                    ?
                    <Preloader />
                    :
                    <MyRoutes />
                }
            </Col>
            {FooterState !== FOOTER_OFF
                ?
                (<Col span={24} className={classes.wrapFooter}>
                    <footer>
                        <Footer>
                            {contentFooter?.map((item, index) => <React.Fragment key={index}>{item}</React.Fragment>)}
                        </Footer>
                    </footer>
                </Col>)
                :
                null
            }
        </Row>
    )
}
export default AppContainer;