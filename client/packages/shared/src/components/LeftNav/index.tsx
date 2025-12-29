import React from "react";
import { NavLink, useMatch } from 'react-router-dom';
import { ImFilm } from "react-icons/im";
import { RiAliensFill, RiAliensLine, RiCriminalFill, RiCriminalLine, RiHome3Line, RiHome4Fill, RiHome4Line } from "react-icons/ri";
import { GrBlog } from "react-icons/gr";
import { routeMain as routeMyProfile } from '../../../../../services/MyProfile/src/MyProfile/MyProfileContainer';
import { routeMain as routeMessages } from '../../../../../services/Message/src/StartMessage/startMessage';
import { routeMain as routeShop } from '../../../../../services/MyShops/src/Shop/myShopsContainer';
import { routeMain as routeUsers } from '../../../../../services/Users/src/Users/UsersContainer';
import { routeMain as routeSettings } from '../../../../../services/SettingsMyProfile/src/SettingsMyProfile/SettingsProfile';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { routeMain as routePlaylist } from '../../../../../services/Music/src/Music/MusicContainer';
import { HomeOutlined, MessageOutlined, ShopOutlined, TeamOutlined, SettingOutlined, UsergroupAddOutlined, CustomerServiceOutlined, VideoCameraOutlined, CommentOutlined, MailOutlined } from '@ant-design/icons';
import classes from './styles.module.scss'
import { IoMdChatboxes } from "react-icons/io";
import { MdOutlineSubscriptions } from "react-icons/md";

type Item = {
    to: string;
    icon: React.ReactNode;
    label: string;
};

const LeftNav: React.FC = () => {
    const { isAuth, authorizedUser, isDarkTheme } = useAppSelector(s => s.authPage);
    const { myshops } = useAppSelector(s => s.myShopsPage);

    const myblogs: any[] = []

    const items: Item[] = [
        {
            to: routeMyProfile(authorizedUser && authorizedUser.id),
            icon: <><RiHome4Fill className={classes.icon} /><RiHome4Line className={classes.icon} /></>, //<HomeOutlined className={classes.icon} />, //<><RiCriminalFill className={classes.icon}/><RiCriminalLine className={classes.icon}/></>, //<><RiAliensLine className={classes.icon}/><RiAliensFill className={classes.icon}/></>
            label: 'Profile',
        },
        {
            to: routeMessages(),
            // icon: <MessageOutlined className={classes.icon} />,
            icon: <MailOutlined className={classes.icon} />,
            label: 'Messages',
        },
        {
            to: routeSettings(),
            icon: <UsergroupAddOutlined className={classes.icon} />,
            label: 'Friends',
        },
        {
            to: routeShop(myshops?.[0]?.shopId || 'fallback'),
            icon: <ShopOutlined className={classes.icon} />,
            label: 'Shops',
        },
        {
            to: routeShop(myblogs?.[0]?.blogId || 'fallback'),
            icon: <GrBlog className={classes.icon} />,
            label: 'Blogs',
        },
        {
            to: routePlaylist(),
            icon: <CustomerServiceOutlined className={classes.icon} />,
            label: 'Music',
        },
        {
            to: routeSettings(),
            icon: <ImFilm className={classes.icon} />, // <MdOutlineSubscriptions className={classes.icon}/>, //<VideoCameraOutlined className={classes.icon} />,
            label: 'Video',
        },
        {
            to: routeUsers(),
            icon: <TeamOutlined className={classes.icon} />,
            label: 'Users',
        },
        {
            to: routeSettings(),
            icon: <SettingOutlined className={classes.icon} />,
            label: 'Settings',
        },
        {
            to: routeSettings(),
            icon: <IoMdChatboxes className={classes.icon} />, //<CommentOutlined className={classes.icon} />,
            label: 'Chats',
        },
    ];
    return (
        <>
            {isAuth && authorizedUser
                ?
                <nav className={`
                    ${classes.Left_nav} ${isDarkTheme !== 'light' ? classes.dark : classes.light}
                `}>
                    <div className={classes.Left_menu}>
                        <div className={classes.LSidebar_Nav}>
                            <ul>
                                {items.map(item => (
                                    <li key={item.label} >
                                        <NavLink
                                            to={item.to}
                                            className={({ isActive }) => (isActive ? classes.active : '')}
                                            end={false}
                                        >
                                            {item.icon}
                                            <span className={classes.label}>{item.label}</span>
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </nav>
                :
                <></>
            }
        </>
    );
};

export default LeftNav;

