import React, { useEffect } from "react";
import { Navigate, useOutletContext } from "react-router-dom";
import { BlogType } from "@packages/shared/src/types/blogTypes";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { getBlogByIdAC, getHomePageBlogByIdAC } from "@packages/shared/src/store/BlogsReducers/blogsSlice";
import { routeMain as routeBlog } from '../../BlogsContainer';
import { BlogsOutletContext } from "@/MyBlogs/BlogsOutletContext/blogsOutletContext";
import routeMain from "./routes";
import classes from './styles.module.scss'

const HomePage: React.FC = React.memo(() => {
    const dispatch = useAppDispatch()
    const {
        blogId,
        blogs,
        myCurrentBlog,
        setMyCurrentBlog,
        addBlog,
        setModalAddBlog,
        isUpdateBlog,
        setModalIsUpdateBlog,
        blogName,
        setBlogName,
        blogDescription,
        setBlogDescription,
        websiteUrl,
        setWebsiteUrl,
        homePage,
        about,
        posts,
        createBlog,
        updateBlog,
        error,
        isDarkTheme
    } = useOutletContext<BlogsOutletContext>();

    useEffect(() => {
        if (myCurrentBlog) {
            dispatch(getHomePageBlogByIdAC(myCurrentBlog.id))
        }
    }, [])

    useEffect(() => {
        if (myCurrentBlog) {
            dispatch(getHomePageBlogByIdAC(myCurrentBlog.id))
        }
    }, [myCurrentBlog])

    console.log('HomePage: - homePage', homePage)
    console.log('HomePage: - myCurrentBlog', myCurrentBlog)

    return (
        <div className={`${classes.wrapHomePageBlog} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            {
                myCurrentBlog && blogId === ':blogId'
                    ?
                    <Navigate to={routeBlog(myCurrentBlog.id)} />
                    :
                    <section className={classes.sectionHomePageBlog}>
                        <div className={classes.headerBlog}>
                            <h1>{homePage && homePage.titleHome}</h1>
                            <h2>{homePage && homePage.subtitleHome}</h2>
                            <h3>{homePage && homePage.ctaTextHome}</h3>
                            <h4>{homePage && homePage.ctaLinkHome}</h4>
                            <h5>{homePage && homePage.seoDescriptionHome}</h5>
                        </div>
                    </section>
            }
        </div>
    )
})
export { routeMain };
export default HomePage;