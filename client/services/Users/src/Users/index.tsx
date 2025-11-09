import React, { useEffect } from "react";
import { Col } from 'antd';
import { useAppContext } from '@packages/shared/src/components/contexts/AppContext';
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import WidgetFriends from '@packages/shared/src/components/Widgets/WidgetFriends'
import WidgetPeople from '@packages/shared/src/components/Widgets/WidgetsPeople'
import WidgetPerhapsYoureFamiliar from '@packages/shared/src/components/Widgets/WidgetPerhapsYoureFamiliar'
import { getUsersAC } from "@packages/shared/src/store/UsersReducers/usersSlice";
import UsersList from "./UsersList/UsersList";
import { FOOTER_ON, setContentSpanAC, setFooterAC, setLSidebarAC, setLSidebarSpanAC, setRSidebarAC, setRSidebarSpanAC, SIDEBAR_ON } from "@packages/shared/src/store/PageElementsSlice/pageElementsSlice";
import classes from './styles.module.scss'

const Users = () => {
    const dispatch = useAppDispatch()
    const { content, setContent, setPageType } = useAppContext();
    const { isAuth, authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage)
    const { users, error } = useAppSelector(state => state.usersPage)

    const newContent = {
        contentTopNav: [] as React.ReactNode[],
        contentLsidebar: [
            <div>
                <WidgetFriends />
                <WidgetPeople />
                <WidgetPeople />
            </div>
        ],
        contentRsidebar: [
            <WidgetPerhapsYoureFamiliar />
        ],
        contentFooter: [
            <div className={`
                ${classes.wrapFooterSectionsForUsers}
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
        dispatch(getUsersAC())
        dispatch(setLSidebarAC(SIDEBAR_ON));
        dispatch(setLSidebarSpanAC(5));
        dispatch(setContentSpanAC(10));
        dispatch(setRSidebarAC(SIDEBAR_ON));
        dispatch(setRSidebarSpanAC(5));
        dispatch(setFooterAC(FOOTER_ON));
        setPageType('stretch');
    }, []);

    useEffect(() => {
        setContent(newContent);
    }, [users])

    return (
        <Col className={`${classes.wrapContentUsers} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <div className={classes.contentUsers}>
                <UsersList users={users} />
            </div>
            {error && <h1>{error}</h1>}
        </Col>
    )
}
export default Users