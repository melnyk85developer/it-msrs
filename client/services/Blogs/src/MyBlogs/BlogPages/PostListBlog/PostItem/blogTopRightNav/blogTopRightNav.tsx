import { useEffect, useRef, useState } from 'react';
import { PlusOutlined, UnorderedListOutlined, ShoppingCartOutlined, EditOutlined, MenuOutlined } from "@ant-design/icons";
import { useAppSelector } from '@packages/shared/src/components/hooks/redux';
import { Col } from 'antd';
import { CiMenuKebab } from 'react-icons/ci';
import classes from './styles.module.scss'

export type PropsTypeBlogTopNav = {
    deletePost: () => void;
    openModalUpdatePost: () => void;
}

export const PostItemTopRightNav: React.FC<PropsTypeBlogTopNav> = ({
    deletePost,
    openModalUpdatePost,
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
        <div className={`${classes.wrapTopRightNavMyBlogs} ${isDarkTheme !== "light" ? classes.dark : classes.light}`} ref={dropdownRef} >
            <div className={classes.menu_icon} onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)}>
                <CiMenuKebab className={classes.postItemMenu} />
            </div>
            <div className={`${isOpen ? classes.topNavMyBlogsActive : classes.topNavMyBlogsDisactive}`}>
                <ul className={classes.wrap_menu_options}>
                    <li onClick={() => openModalUpdatePost()} className={classes.li}>
                        <strong>Редактировать пост</strong>
                    </li>
                    <li className={classes.li} >
                        <strong onClick={() => deletePost()}>Удалить пост</strong>
                    </li>
                </ul>
            </div>
        </div>
    )
}