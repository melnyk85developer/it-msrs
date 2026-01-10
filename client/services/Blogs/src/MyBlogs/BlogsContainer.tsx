import React, { useEffect, useState } from "react";
import { Navigate, NavLink, Outlet, useParams } from "react-router-dom";
import { Col } from "antd";
import { routeMain as routeAuth } from '../../../Auth/src/pages/Auth';
import { routeMain as routeHomePage } from './BlogPages/HomePage/homePage';
import { routeMain as routeBlogPosts } from './BlogPages/PostListBlog/postListBlog';
import { routeMain as routeAbout } from './BlogPages/About/about';
import {
    RiAliensFill,
    RiAliensLine,
    RiCriminalFill,
    RiCriminalLine,
    RiHome3Line,
    RiHome4Fill,
    RiHome4Line
} from "react-icons/ri";
import WidgetFriends from "@packages/shared/src/components/Widgets/WidgetFriends";
import WidgetPeople from "@packages/shared/src/components/Widgets/WidgetsPeople";
import WidgetPerhapsYoureFamiliar from "@packages/shared/src/components/Widgets/WidgetPerhapsYoureFamiliar";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { BlogTopNav } from "./BlogNav/topNavBlog";
import { createBlogAC, createPageForBlogAC, createPostAsBlogAC, getBlogByIdAC, getMyBlogsAC, updateBlogAC } from "@packages/shared/src/store/BlogsReducers/blogsSlice";
import { FOOTER_ON, setContentSpanAC, setFooterAC, setLSidebarAC, setLSidebarSpanAC, setRSidebarAC, setRSidebarSpanAC, SIDEBAR_OFF, SIDEBAR_ON } from "@packages/shared/src/store/PageElementsSlice/pageElementsSlice";
import { useAppContext } from "@packages/shared/src/components/contexts/AppContext";
import ModalWindow from "@packages/shared/src/components/ModalWindows";
import AddBlogFormModal from "./ModalBlog/FormAddBlog/formAddBlog";
import UpdateBlogFormModal from "./ModalBlog/FormUpdateBlog/formUpdateBlog";
import AddPostBlogFormModal from "./ModalBlog/FormAddPostBlog/formAddPostBlog";
import routeMain from "./routes";
import classes from './styles.module.scss'
import { BlogType } from "@packages/shared/src/types/blogTypes";
import AddPagesForBlogFormModal from "./ModalBlog/FormAddPagesForBlog/formAddPagesForBlog";

type Item = {
    to: string;
    icon: React.ReactNode;
    label: string;
};

const BlogsContainer = () => {
    const dispatch = useAppDispatch()
    const { content, setContent, setPageType } = useAppContext();
    const { isAuth, authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage);
    const { blogs, currentBlog, homePage, about, posts, error } = useAppSelector(state => state.blogsPage);
    const [myCurrentBlog, setMyCurrentBlog] = useState<BlogType>(null)
    const [addBlog, setModalAddBlog] = useState<boolean>(false);
    const [addPostBlog, setModalAddPostBlog] = useState<boolean>(false);
    const [isUpdateBlog, setModalIsUpdateBlog] = useState<boolean>(false);
    const [blogName, setBlogName] = useState<string>(null);
    const [blogDescription, setBlogDescription] = useState<string>(null);
    const [websiteUrl, setWebsiteUrl] = useState<string>(null);

    const [postBlogTitle, setPostBlogTitle] = useState(null);
    const [postBlogShortDescription, setPostBlogShortDescription] = useState(null);
    const [postBlogText, setPostBlogText] = useState(null);

    const [createPages, setCreatePages] = useState(false);

    const [titleHome, setTitleHome] = useState(null);
    const [subtitleHome, setSubtitleHome] = useState(null);
    const [contentHome, setContentHome] = useState(null);
    const [ctaTextHome, setCtaTextHome] = useState(null);
    const [ctaLinkHome, setCtaLinkHome] = useState(null);
    const [seoDescriptionHome, setSeoDescriptionHome] = useState(null);

    const [titleAbout, setTitleAbout] = useState(null);
    const [subtitleAbout, setSubtitleAbout] = useState(null);
    const [contentAbout, setContentAbout] = useState(null);
    const [missionAbout, setMissionAbout] = useState(null);
    const [seoDescriptionAbout, setSeoDescriptionAbout] = useState(null);

    const { blogId } = useParams();

    // console.log('BlogsContainer: - blogs', blogs)
    // console.log('BlogsContainer: - currentBlog', currentBlog)
    const openModalCreateBlog = () => {
        setModalIsUpdateBlog(false)
        setModalAddPostBlog(false)
        setCreatePages(false)
        setModalAddBlog(true)
    }
    const openModalUpdateBlog = () => {
        if (currentBlog) {
            setModalAddBlog(false)
            setModalAddPostBlog(false)
            setModalIsUpdateBlog(true)
            setCreatePages(false)
        }
    }
    const openModalCreatePagesForBlog = () => {
        setModalIsUpdateBlog(false)
        setModalAddPostBlog(false)
        setModalAddBlog(false)
        setCreatePages(true)

    }
    const openModalCreatePostForBlog = () => {
        setModalIsUpdateBlog(false)
        setModalAddBlog(false)
        setCreatePages(false)
        setModalAddPostBlog(true)
    }

    const createBlog = () => {
        const newBlog = {
            name: blogName,
            description: blogDescription,
            websiteUrl: websiteUrl,
            // isMembership: false,
            // userId: authorizedUser.id
        };
        dispatch(createBlogAC(newBlog))
            .then(() => setModalAddBlog(false))
    }
    const updateBlog = () => {
        const newBlog = {
            name: blogName,
            description: blogDescription,
            websiteUrl: websiteUrl,
            // isMembership: false,
            // userId: authorizedUser.id
        };
        dispatch(updateBlogAC(myCurrentBlog.id, newBlog))
            .then(() => setModalIsUpdateBlog(false))
    }
    const createPageForBlog = () => {
        const createPageForBlog = {
            titleHome: titleHome,
            subtitleHome: subtitleHome,
            contentHome: contentHome,
            ctaTextHome: ctaTextHome,
            ctaLinkHome: ctaLinkHome,
            seoDescriptionHome: seoDescriptionHome,

            titleAbout: titleAbout,
            subtitleAbout: subtitleAbout,
            contentAbout: contentAbout,
            missionAbout: missionAbout,
            seoDescriptionAbout: seoDescriptionAbout
        };
        dispatch(createPageForBlogAC(myCurrentBlog.id, createPageForBlog))
            .then(() => setCreatePages(false))
    }
    const createPostBlog = () => {
        const newPost = {
            title: postBlogTitle,
            shortDescription: postBlogShortDescription,
            content: postBlogText,
            blogId: myCurrentBlog.id
        };
        dispatch(createPostAsBlogAC(newPost))
            .then(() => setModalAddPostBlog(false))
    }
    const createPostSaveAsDraft = () => {
        const newPostSaveAsDraft = {
            name: blogName,
            description: blogDescription,
            websiteUrl: websiteUrl,
            // isMembership: false,
            // userId: authorizedUser.id
        };
        dispatch(createBlogAC(newPostSaveAsDraft))
            .then(() => setModalAddPostBlog(false))
    }
    const newContent = {
        contentTopNav: [
            <BlogTopNav
                openModalCreateBlog={openModalCreateBlog}
                openModalUpdateBlog={openModalUpdateBlog}
                openModalCreatePagesForBlog={openModalCreatePagesForBlog}
                openModalCreatePostForBlog={openModalCreatePostForBlog}

            />
        ] as React.ReactNode[],
        contentLsidebar: [
            <div>
                <WidgetFriends />
                <WidgetPeople />
                <WidgetPeople />
            </div>
        ] as React.ReactNode[],
        contentRsidebar: [
            <WidgetPerhapsYoureFamiliar />
        ] as React.ReactNode[],
        contentFooter: [
            <div className={`
                    ${classes.wrapFooterSectionsForUsers}
                    ${isDarkTheme !== "light"
                    ? classes.dark
                    : classes.light
                }
                `}>
                <Col className={classes.footer_sections}>
                    <p>Блок 1</p>
                </Col>
                <Col className={classes.footer_sections}>
                    <p>Блок 2</p>
                </Col>
                <Col className={classes.footer_sections}>
                    <p>Блок 3</p>
                </Col>
                <Col className={classes.footer_sections}>
                    <p>Блок 4</p>
                </Col>
            </div>
        ] as React.ReactNode[]
    };

    useEffect(() => {
        dispatch(getMyBlogsAC())
        dispatch(setLSidebarAC(SIDEBAR_ON));
        dispatch(setLSidebarSpanAC(5));
        dispatch(setContentSpanAC(10));
        dispatch(setRSidebarAC(SIDEBAR_OFF));
        dispatch(setRSidebarSpanAC(5));
        dispatch(setFooterAC(FOOTER_ON));
        setPageType('stretch');
    }, []);

    useEffect(() => {
        if (currentBlog) {
            setMyCurrentBlog(currentBlog)
            setBlogName(currentBlog.name)
            setBlogDescription(currentBlog.description)
            setWebsiteUrl(currentBlog.websiteUrl)
        }
        if (!currentBlog && blogs && blogs.length) {
            // console.log('BlogsContainer: useEffect1 - myCurrentBlog', myCurrentBlog)
            dispatch(getBlogByIdAC(blogs[0].id))
        }
    }, [])

    useEffect(() => {
        if (blogId !== null && blogId !== ':blogId') {
            // console.log('CurrentBlog - 😡 id', blogId)
            dispatch(getBlogByIdAC(blogId))
        }
        if (blogId === ':blogId' && blogs.length) {
            // console.log('BlogsContainer: useEffect2 - blogId ', blogId)
            dispatch(getBlogByIdAC(blogs[0].id))
        }
    }, [blogId])

    useEffect(() => {
        if (currentBlog) {
            setMyCurrentBlog(currentBlog)
            setBlogName(currentBlog.name)
            setBlogDescription(currentBlog.description)
            setWebsiteUrl(currentBlog.websiteUrl)
            // console.log('BlogsContainer: useEffect4|1 - currentBlog', currentBlog)
        }
    }, [currentBlog])

    useEffect(() => {
        setContent(newContent);
    }, [])

    const items: Item[] = [
        {
            to: routeHomePage(),
            icon: <span className={classes.iconProfileWrap}>
                <RiHome4Line className={classes.iconProfile} />
                <RiHome4Fill className={classes.iconProfileHover} />
            </span>, //<HomeOutlined className={classes.icon} />, //<><RiCriminalFill className={classes.icon}/><RiCriminalLine className={classes.icon}/></>, //<><RiAliensLine className={classes.icon}/><RiAliensFill className={classes.icon}/></>
            label: 'Гланая',
        },
        {
            to: routeBlogPosts(),
            icon: <span className={classes.iconProfileWrap}>
                <RiHome4Line className={classes.iconProfile} />
                <RiHome4Fill className={classes.iconProfileHover} />
            </span>, //<HomeOutlined className={classes.icon} />, //<><RiCriminalFill className={classes.icon}/><RiCriminalLine className={classes.icon}/></>, //<><RiAliensLine className={classes.icon}/><RiAliensFill className={classes.icon}/></>
            label: 'Статьи',
        },
        {
            to: routeAbout(),
            icon: <span className={classes.iconProfileWrap}>
                <RiHome4Line className={classes.iconProfile} />
                <RiHome4Fill className={classes.iconProfileHover} />
            </span>, //<HomeOutlined className={classes.icon} />, //<><RiCriminalFill className={classes.icon}/><RiCriminalLine className={classes.icon}/></>, //<><RiAliensLine className={classes.icon}/><RiAliensFill className={classes.icon}/></>
            label: 'О нас',
        },
    ]

    return (
        isAuth ?
            <div className={`${classes.wrapContentBlog} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
                {!myCurrentBlog && !blogs.length
                    ?
                    <section className={classes.wrapBlockOfNoBlogs}>
                        <div className={classes.blockOfNoBlogs}>
                            <h1>В данный момент у Вас нет ни одного блога в нашем проекте!</h1>
                            <h2>Вы можете создать собственный блог в несколько кликов, совершенно бесплатно и занять свою нишу подписчиков нашего проекта.</h2>
                        </div>
                    </section>
                    :
                    <section className={classes.sectionContentBlog}>
                        <div className={classes.headerBlog}>
                            <h1>{myCurrentBlog && myCurrentBlog.name}</h1>
                            <h2>{myCurrentBlog && myCurrentBlog.description}</h2>
                            <h4>Наш сайт: {myCurrentBlog && myCurrentBlog.websiteUrl}</h4>
                        </div>
                        <div className={classes.wrapBlogTopNav}>
                            <ul className={classes.blogTopNav}>
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
                        <Outlet
                            context={{
                                blogId,
                                blogs,
                                posts,
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
                                createPageForBlog,
                                setContentHome,
                                setCtaLinkHome,
                                setCtaTextHome,
                                setSeoDescriptionHome,
                                setSubtitleHome,
                                setTitleHome,

                                about,
                                createBlog,
                                updateBlog,
                                error
                            }}
                        />

                    </section>
                }
                <ModalWindow modalActive={addBlog} setModalActive={setModalAddBlog} isSetModal={0}>
                    <AddBlogFormModal
                        setModalAddBlog={setModalAddBlog}
                        setBlogName={setBlogName}
                        setBlogDescription={setBlogDescription}
                        setWebsiteUrl={setWebsiteUrl}
                        createBlog={createBlog}
                    />
                </ModalWindow>
                <ModalWindow modalActive={isUpdateBlog} setModalActive={setModalIsUpdateBlog} isSetModal={0}>
                    <UpdateBlogFormModal
                        myCurrentBlog={myCurrentBlog}
                        setMyCurrentBlog={setMyCurrentBlog}
                        setModalIsUpdateBlog={setModalIsUpdateBlog}
                        blogName={blogName}
                        setBlogName={setBlogName}
                        blogDescription={blogDescription}
                        setBlogDescription={setBlogDescription}
                        websiteUrl={websiteUrl}
                        setWebsiteUrl={setWebsiteUrl}
                        updateBlog={updateBlog}
                    />
                </ModalWindow>
                <ModalWindow modalActive={createPages} setModalActive={setCreatePages} isSetModal={0}>
                    <AddPagesForBlogFormModal
                        setCreatePages={setCreatePages}
                        createPageForBlog={createPageForBlog}
                        setContentHome={setContentHome}
                        setCtaLinkHome={setCtaLinkHome}
                        setCtaTextHome={setCtaTextHome}
                        setSeoDescriptionHome={setSeoDescriptionHome}
                        setSubtitleHome={setSubtitleHome}
                        setTitleHome={setTitleHome}

                        setTitleAbout={setTitleAbout}
                        setSubtitleAbout={setSubtitleAbout}
                        setContentAbout={setContentAbout}
                        setMissionAbout={setMissionAbout}
                        setSeoDescriptionAbout={setSeoDescriptionAbout}
                    />
                </ModalWindow>
                <ModalWindow modalActive={addPostBlog} setModalActive={setModalAddPostBlog} isSetModal={0}>
                    <AddPostBlogFormModal
                        setModalAddPostBlog={setModalAddPostBlog}
                        setBlogName={setBlogName}
                        postBlogTitle={postBlogTitle}
                        setPostBlogTitle={setPostBlogTitle}
                        postBlogText={postBlogText}
                        setPostBlogText={setPostBlogText}
                        postBlogShortDescription={postBlogShortDescription}
                        setPostBlogShortDescription={setPostBlogShortDescription}
                        createPostBlog={createPostBlog}
                        createPostSaveAsDraft={createPostSaveAsDraft}
                    />
                </ModalWindow>
            </div>
            :
            <Navigate to={routeAuth()} />
    )
}
export { routeMain };
export default BlogsContainer