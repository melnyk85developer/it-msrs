import { useEffect, useRef, useState } from 'react';
import { PlusOutlined, UnorderedListOutlined, ShoppingCartOutlined, EditOutlined, MenuOutlined } from "@ant-design/icons";
import { useAppSelector } from '@packages/shared/src/components/hooks/redux';
import { routeMain as routeBlog} from "../../BlogsContainer";
import classes from './styles.module.scss'
import { Col } from 'antd';
import { BlogType } from '@packages/shared/src/types/blogTypes';
import { NavLink } from 'react-router-dom';

export const BlogTopLeftNav: React.FC = () => {
    const { isAuth, authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage)
    const { blogs, error } = useAppSelector(state => state.blogsPage);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <Col className={`${classes.wrapTopLeftNavMyBlogs} ${isDarkTheme !== "light" ? classes.dark : classes.light}`} ref={dropdownRef} >
            <Col className={classes.menu_icon} onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)}>
                <MenuOutlined className={classes.icon} />
            </Col>
            <Col className={`${isOpen ? classes.topLeftNavMyBlogsActive : classes.topNavMyBlogsDisactive}`}>
                <ul className={classes.wrap_menu_options}>
                    {blogs.map(b =>
                        <li key={b.id} className={classes.li}>
                            <NavLink
                                to={routeBlog(b.id)}
                                className={({ isActive }) => (isActive ? classes.active : '')}
                                end={false}
                            >
                                <strong>{b.name}</strong>
                            </NavLink>
                        </li>
                    )}
                </ul>
            </Col>
        </Col>
    )
}