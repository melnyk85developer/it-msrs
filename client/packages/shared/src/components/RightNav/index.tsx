import React from "react";
import { NavLink } from 'react-router-dom';
import { routeMain as routeShop } from '../../../../../services/ShopsList/src/ShopListContainer';
import { routeMain as routeBlogs } from '../../../../../services/BlogsList/src/BlogListContainer';
import { routeMain as routePlaylist } from '../../../../../services/Music/src/Music/MusicContainer';
import { useAppDispatch, useAppSelector } from '@packages/shared/src/components/hooks/redux';
import { HomeOutlined, MessageOutlined, ShopOutlined, TeamOutlined, SettingOutlined, UsergroupAddOutlined, CustomerServiceOutlined, VideoCameraOutlined, CommentOutlined, MailOutlined } from '@ant-design/icons';
import { BsFillSpeakerFill } from "react-icons/bs";
import { GrBlog } from "react-icons/gr";
import classes from './styles.module.scss'

type Item = {
    to: string;
    icon: React.ReactNode;
    label: string;
};

const RightNav: React.FC = () => {
    const { isDarkTheme } = useAppSelector(state => state.authPage);

    const items: Item[] = [
        {
            to: routePlaylist(),
            icon: <BsFillSpeakerFill className={classes.icon} />,
            label: 'Music',
        },
        {
            to: routeShop(),
            icon: <ShopOutlined className={classes.icon} />,
            label: 'Shops',
        },
        {
            to: routeBlogs(),
            icon: <GrBlog className={classes.iconGrBlog} />,
            label: 'Blogs',
        },
    ];

    return (
        <nav className={`
            ${classes.Right_nav} ${isDarkTheme !== "light" ? classes.dark : classes.light}
        `}>
            <div className={classes.Right_menu}>
                <div className={classes.RSidebar_Nav}>
                    <ul>
                        {items.map(item => (
                            <li key={item.label}>
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
    )
}
export default RightNav