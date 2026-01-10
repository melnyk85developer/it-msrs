import React, { useEffect, useState } from "react"
import WidgetFriends from "@packages/shared/src/components/Widgets/WidgetFriends";
import WidgetPeople from "@packages/shared/src/components/Widgets/WidgetsPeople";
import WidgetYofamiliar from "@packages/shared/src/components/Widgets/WidgetPerhapsYoureFamiliar";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { FOOTER_ON, setContentSpanAC, setFooterAC, setLSidebarAC, setLSidebarSpanAC, setRSidebarAC, setRSidebarSpanAC, SIDEBAR_ON } from "@packages/shared/src/store/PageElementsSlice/pageElementsSlice";
import { useAppContext } from "@packages/shared/src/components/contexts/AppContext";
import { Col } from "antd";
import routeMain from './routes'
import classes from './styles.module.scss';
import BlogsList from "./BlogsList/BlogsList/BlogList";

const BlogsListContainer: React.FC = React.memo(() => {
    const dispatch = useAppDispatch()
    const { setContent, setPageType } = useAppContext();
    const { isAuth, authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage)
    const { blogs, error, isBlogsLoading } = useAppSelector(state => state.blogsPage)

    useEffect(() => {
        dispatch(setLSidebarAC(SIDEBAR_ON));
        dispatch(setLSidebarSpanAC(5));
        dispatch(setContentSpanAC(10));
        dispatch(setRSidebarAC(SIDEBAR_ON));
        dispatch(setRSidebarSpanAC(5));
        dispatch(setFooterAC(FOOTER_ON));
        setPageType('stretch');
    }, []);

    const newContent = {
        contentTopNav: [] as React.ReactNode[],
        contentLsidebar: [
            <div className={`
                ${classes.wrap_product_name}
                ${isDarkTheme !== "light"
                    ? classes.dark
                    : classes.light
                }
            `}>
            </div>,
            <div className={classes.wrapWidgetFriendsProfile}>
                <WidgetYofamiliar />
                <WidgetPeople />
                <WidgetFriends />
            </div>
        ],
        contentRsidebar: [
            <div className={classes.wrapWidgetFriendsProfile}>
                <WidgetYofamiliar />
                <WidgetPeople />
                <WidgetFriends />
            </div>
        ],
        contentFooter: [
            <div className={`
                ${classes.wrapFooterSectionsForShopsList}
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
    }, [blogs])

    return (
        <BlogsList blogs={blogs} />
    )
})
export { routeMain };
export default BlogsListContainer;