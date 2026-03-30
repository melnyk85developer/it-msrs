import { useEffect, useRef, useState } from 'react';
import { PlusOutlined, UnorderedListOutlined, ShoppingCartOutlined, EditOutlined, MenuOutlined } from "@ant-design/icons";
import { useAppSelector } from '@packages/shared/src/components/hooks/redux';
import { Col } from 'antd';
import { NavLink } from 'react-router-dom';
import classes from './styles.module.scss'

export const AdminTopRightNav: React.FC = () => {
    const { isAuth, authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage)
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
        <Col className={`${classes.wrapTopRightNavMyBlogs} ${isDarkTheme !== "light" ? classes.dark : classes.light}`} ref={dropdownRef} >
            <Col className={classes.menu_icon} onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)}>
                <MenuOutlined className={classes.icon} />
            </Col>
            <Col className={`${isOpen ? classes.topNavMyBlogsActive : classes.topNavMyBlogsDisactive}`}>
                <ul className={classes.wrap_menu_options}>
                    <li className={classes.li}>
                        <NavLink to="/admin/ai-assistant/generator" className={({ isActive }) => `${isActive ? classes.active : classes.button}`}>
                            AiAssistants
                        </NavLink>
                    </li>
                    <li className={classes.li}>
                        <NavLink to="/admin" className={({ isActive }) => `${isActive ? classes.active : classes.button}`}>
                            Главная
                        </NavLink>
                    </li>
                    <li className={classes.li}>
                        <NavLink to="/admin/adminshops" className={({ isActive }) => `${isActive ? classes.active : classes.button}`}>
                            Магазины
                        </NavLink>
                    </li>
                </ul>
            </Col>
        </Col>
    )
}