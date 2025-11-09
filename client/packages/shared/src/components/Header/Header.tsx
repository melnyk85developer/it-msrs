import React, { useContext, useEffect } from 'react'
import { useAppContext } from "../contexts/AppContext"; // Импортируем хук для работы с контекстом
import { NavLink } from "react-router-dom";
import { Col, Row, Space } from 'antd';
import { ImExit } from "react-icons/im";
import { checkAuthAC, isDarkThemeAC, logoutAC } from '../../store/AuthReducers/authSlice';
import { routeMain as routeAuth } from '../../../../../services/Auth/src/pages/Auth';
import { routeMain as routeAdmin } from '../../../../../services/Admin/src/AdminPanel';
import { routeMain as routeMyProfile } from '../../../../../services/MyProfile/src/MyProfile/MyProfileContainer';
import { LoginOutlined, LogoutOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import { API_URL } from '../../http';
import { IProfile, IUser } from '@/types/IUser';
import { AppDispatch } from '@/store/redux-store';
import defaultAvatar from '../../assets/fonAvatars.png'
import GorizontalNaw from '../GorizontalNaw';
import { useAppSelector } from '../hooks/redux';
import { Navigate } from 'react-router-dom';
import classes from './styles.module.scss'
import marsLogo from "@packages/shared/src/assets/mars.png"
import { IoIosLogIn, IoIosLogOut, IoIosPlanet, IoMdPlanet } from 'react-icons/io';
import { IoPlanet, IoPlanetOutline } from 'react-icons/io5';
import { RiLoginBoxFill, RiLoginBoxLine, RiLogoutBoxFill, RiLogoutBoxRFill, RiLogoutBoxRLine } from 'react-icons/ri';
import { TbPlanet } from 'react-icons/tb';

type PropsType = {
    authorizedUser: IUser;
    profile: IProfile;
    isAuth: boolean;
    error: string;
    isDarkTheme: string
    dispatch: AppDispatch;
}

const Header: React.FC<PropsType> = React.memo(({ authorizedUser, dispatch, isAuth, isDarkTheme, profile }) => {
    const { content } = useAppContext(); // Получаем объект content из контекста
    const { contentTopNav } = content;

    const changeTheme = () => {
        dispatch(isDarkThemeAC(isDarkTheme !== "light" ? "light" : "dark"))
    }

    const redirect = () => {
        console.log('Выход' + authorizedUser)
        return (<Navigate to={routeAuth()} />)
    }

    const logouting = () => {
        dispatch(logoutAC())
        // .then( () => redirect())
    }

    return (
        <header className={`${classes.header} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <Row gutter={0}>
                <Col span={1}></Col>
                <Col span={22} className={classes.wrapper_logo_search}>
                    <div className={classes.centrBlockHeader}>
                        <Row gutter={0} className={classes.row}>
                            <Col span={2} className={classes.logoBlock}>
                                <NavLink to={routeMyProfile(profile.userId)}>
                                    <div className={classes.wrapImg}>
                                        {/* <img className={classes.logoImg} src={marsLogo} alt={'logo'} /> */}
                                        {/* <IoMdPlanet /> */}
                                        {/* <IoIosPlanet /> */}
                                        {/* <IoPlanet />
                                        <IoPlanetOutline /> */}
                                        {/* <TbPlanet /> */}
                                    </div>
                                    <div className={classes.logo}>
                                        <span className={classes.span1}>
                                            {/* Euro */}
                                            My
                                        </span>
                                        <span className={classes.span2}>
                                            Social
                                            {/* Life */}
                                            {/* Mars */}
                                        </span>
                                    </div>
                                </NavLink>
                            </Col>
                            <Col span={5} className={classes.wrapSearch}>
                                <input className={classes.search} type="text" name="search" />
                            </Col>
                            <Col span={10} className={classes.headerCentrBlock}>
                                <h1>Player</h1>
                            </Col>
                            <Col span={5} className={classes.blockProfile}>
                                {
                                    isDarkTheme === "light"
                                        ?
                                        <>
                                            <MoonOutlined onClick={changeTheme} className={classes.iconTheme} />
                                            <strong className={classes.nameWrap}>
                                                <li><strong className={classes.nameHeader}>{profile.name}</strong></li>
                                                <li><NavLink to={routeAdmin()}><strong>Admin</strong></NavLink></li>
                                            </strong>
                                            <img
                                                src={profile.avatar !== null ? `${API_URL}/` + profile.avatar : defaultAvatar}
                                                alt={"avatar"}
                                                className={classes.img}
                                            />
                                        </>
                                        :
                                        <>
                                            <SunOutlined onClick={changeTheme} className={classes.iconTheme} />
                                            <strong className={classes.nameWrap}>
                                                <li><strong className={classes.nameHeader}>{profile.name}</strong></li>
                                                <li><NavLink to={routeAdmin()}><strong>Admin</strong></NavLink></li>
                                            </strong>
                                            <img
                                                src={profile.avatar !== null ? `${API_URL}/` + profile.avatar : defaultAvatar}
                                                alt={"avatar"}
                                                className={classes.img}
                                            />
                                        </>
                                }
                            </Col>
                            <Col span={2} className={classes.iconInputOutpuBlock}>
                                {!isAuth
                                    ?
                                    <div className={classes.iconInputOutputWrapButton}>
                                        <strong className={classes.inputOutputButton}>
                                            <RiLoginBoxLine className={classes.iconInputOutput}/>
                                            <RiLoginBoxFill className={classes.iconInputOutput}/>
                                            <NavLink to={routeAuth()}>Вход</NavLink>
                                        </strong>
                                    </div>
                                    :
                                    <div className={classes.iconInputOutputWrapButton}>
                                        <strong onClick={logouting} className={classes.inputOutputButton}>
                                            <RiLogoutBoxRFill className={classes.iconInputOutput}/>
                                            <RiLogoutBoxRLine className={classes.iconInputOutput}/>Выход
                                        </strong>
                                    </div>
                                }
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col span={1}></Col>
            </Row>
            <Row gutter={0} className={classes.wrapper_b_sroka_header}>
                <Col span={24}>
                    <div className={classes.stroka_header}>
                        <div className={classes.runningTextContainer}>
                            <div className={classes.runningText}>
                                .::: Тут могла быть твоя реклама ! :::.
                                .::: Тут могла быть твоя реклама ! :::.
                                .::: Тут могла быть твоя реклама ! :::.
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <GorizontalNaw>
                {contentTopNav?.map((item, index) => <React.Fragment key={index}>{item}</React.Fragment>)}
            </GorizontalNaw>
        </header>
    )
})

export default Header

