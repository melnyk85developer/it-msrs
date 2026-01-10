import { useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { Col } from "antd";
import { BlogTopLeftNav } from "./blogTopLeftNav/blogTopLeftNav";
import { BlogTopRightNav } from "./blogTopRightNav/blogTopRightNav";
import classes from './styles.module.scss'

export type PropsTypeBlogTopNav = {
    openModalCreateBlog: () => void;
    openModalUpdateBlog: () => void;
    openModalCreatePagesForBlog: () => void;
    openModalCreatePostForBlog: () => void;
}

export const BlogTopNav: React.FC<PropsTypeBlogTopNav> = ({ 
    openModalCreateBlog, 
    openModalUpdateBlog,
    openModalCreatePagesForBlog,
    openModalCreatePostForBlog
}) => {
    const { isAuth, authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage)
    const { blogs, error } = useAppSelector(state => state.blogsPage);

    return (
        <Col className={`${classes.wrapTopNavBlog} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <BlogTopLeftNav />
            <BlogTopRightNav
                openModalCreatePostForBlog={openModalCreatePostForBlog}
                openModalCreateBlog={openModalCreateBlog}
                openModalUpdateBlog={openModalUpdateBlog}
                openModalCreatePagesForBlog={openModalCreatePagesForBlog}
            />
        </Col>
    )
}