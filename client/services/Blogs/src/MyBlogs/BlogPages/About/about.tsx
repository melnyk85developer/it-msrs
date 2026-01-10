import React, { useEffect } from "react";
import { Navigate, useOutletContext } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { routeMain as routeBlog } from '../../BlogsContainer';
import { BlogsOutletContext } from "@/MyBlogs/BlogsOutletContext/blogsOutletContext";
import { getAboutPageBlogByIdAC } from "@packages/shared/src/store/BlogsReducers/blogsSlice";
import routeMain from "./routes";
import classes from './styles.module.scss'

const About: React.FC = React.memo(() => {
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
            dispatch(getAboutPageBlogByIdAC(myCurrentBlog.id))
        }
    }, [])

    useEffect(() => {
        if (myCurrentBlog) {
            dispatch(getAboutPageBlogByIdAC(myCurrentBlog.id))
        }
    }, [myCurrentBlog])

    console.log('About: about - 😡 ', about)
    console.log('About: myCurrentBlog - 😡 ', myCurrentBlog)

    return (
        <div className={`${classes.wrapContentBlog} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            {
                myCurrentBlog && blogId === ':blogId'
                    ?
                    <Navigate to={routeBlog(myCurrentBlog.id)} />
                    :
                    <section className={classes.sectionHomePageBlog}>
                        <div className={classes.headerBlog}>
                            <h1>{about && about.titleAbout}</h1>
                            <h2>{about && about.subtitleAbout}</h2>
                            <h3>{about && about.contentAbout}</h3>
                            <h4>{about && about.missionAbout}</h4>
                            <h5>{about && about.seoDescriptionAbout}</h5>
                        </div>
                    </section>
            }
        </div>
    )
})
export { routeMain };
export default About;