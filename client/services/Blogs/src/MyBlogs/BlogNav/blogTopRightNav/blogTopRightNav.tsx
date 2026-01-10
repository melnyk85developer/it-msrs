import { useEffect, useRef, useState } from 'react';
import { PlusOutlined, UnorderedListOutlined, ShoppingCartOutlined, EditOutlined, MenuOutlined } from "@ant-design/icons";
import { useAppSelector } from '@packages/shared/src/components/hooks/redux';
import classes from './styles.module.scss'
import { Col } from 'antd';

export type PropsTypeBlogTopNav = {
    openModalCreatePostForBlog: () => void;
    openModalCreateBlog: () => void;
    openModalUpdateBlog: () => void;
    openModalCreatePagesForBlog: () => void;
}

export const BlogTopRightNav: React.FC<PropsTypeBlogTopNav> = ({ 
    openModalCreatePostForBlog, 
    openModalCreateBlog, 
    openModalUpdateBlog,
    openModalCreatePagesForBlog
}) => {
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
                    <li onClick={() => openModalCreateBlog()} className={classes.li}>
                        <strong>Создать Блог</strong>
                    </li>
                    <li onClick={() => openModalUpdateBlog()} className={classes.li}>
                        <strong>Редактировать Блог</strong>
                    </li>
                    <li onClick={() => openModalCreatePostForBlog()} className={classes.li}>
                        <strong>Создать Пост</strong>
                    </li>
                    <li onClick={() => openModalCreatePagesForBlog()} className={classes.li}>
                        <strong>Создать Страницу</strong>
                    </li>
                    <li className={classes.li} >
                        <strong>Удалить Блог</strong>
                    </li>
                </ul>
            </Col>

        </Col>
    )
}