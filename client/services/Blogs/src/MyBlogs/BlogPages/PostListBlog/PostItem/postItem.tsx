import React, { useState } from "react";
import { RiDiscussFill, RiDiscussLine } from "react-icons/ri";
import { TfiLayoutMenuSeparated } from "react-icons/tfi";
import { BsMegaphone, BsMegaphoneFill } from "react-icons/bs";
import { CiMenuKebab } from "react-icons/ci";
import { EyeOutlined, PushpinOutlined } from "@ant-design/icons";
import { Navigate, NavLink, useOutletContext } from "react-router-dom";
import { BlogsOutletContext } from "@/MyBlogs/BlogsOutletContext/blogsOutletContext";
import { PostBlogType } from "@packages/shared/src/types/blogTypes";
import { routeMain as routePostDetail } from '../postDetailBlog/postDetailBlog';
import { Col, Row } from "antd";
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";
import { PostItemTopRightNav } from "./blogTopRightNav/blogTopRightNav";
import ModalWindow from "@packages/shared/src/components/ModalWindows";
import UpdatePostFormModal from "../../../../MyBlogs/ModalBlog/FormUpdatePost/formUpdateBlog";
import classes from './styles.module.scss'
import { useAppDispatch } from "@packages/shared/src/components/hooks/redux";
import { deletePostAsBlogAC, updatePostAsBlogAC } from "@packages/shared/src/store/BlogsReducers/blogsSlice";
import { formatTimeAgo } from "@packages/shared/src/components/utils/date-time-utilite";

export type PropsType = {
    post: PostBlogType;
    // followingInProgress: Array<number>
    // unfollow: (userId: number) => void
    // follow: (userId: number) => void
}

const PostItem: React.FC<PropsType> = React.memo(({ post }) => {
    const dispatch = useAppDispatch()

    const {
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
        createBlog,
        updateBlog,
        error,
        isDarkTheme
    } = useOutletContext<BlogsOutletContext>();

    const [myCurrentPost, setMyCurrentPost] = useState(post);
    const [modalIsUpdatePost, setModalIsUpdatePost] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const formattedTime: string = formatTimeAgo(myCurrentPost.createdAt);

    console.log('PostItem: - newestLikes', myCurrentPost.extendedLikesInfo.newestLikes)

    const openModalUpdatePost = () => {
        if (myCurrentPost) {
            setTitle(myCurrentPost.title)
            setDescription(myCurrentPost.shortDescription)
            setContent(myCurrentPost.content)
            setModalIsUpdatePost(true)
        }
    }

    const updatePost = () => {
        const updatedPost = {
            id: myCurrentPost.id,
            title,
            shortDescription: description,
            content,
            blogId
        }
        dispatch(updatePostAsBlogAC(updatedPost))
            .then(() => setModalIsUpdatePost(false))
    }
    const deletePost = () => {
        if (myCurrentPost && myCurrentPost.id) {
            dispatch(deletePostAsBlogAC(myCurrentPost.id))
                .then(() => setModalIsUpdatePost(false))
        }
    }

    const handleLikeClick = () => {
        // dispatch(addLikeToPostAC({ postId, userId: authorizedUserId, isLike: true }))
    }
    const handleDislikeClick = () => {
        // dispatch(addLikeToPostAC({ postId, userId: authorizedUserId, isLike: false }))
    }

    return (
        <section className={`${classes.wrapPostItemForBlog} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <div className={classes.postItem}>
                <div className={classes.postData}>
                    <div className={classes.wrapHeaderPost}>
                        <div className={classes.headerPost}>
                            <PostItemTopRightNav
                                deletePost={deletePost}
                                openModalUpdatePost={openModalUpdatePost}
                            />
                        </div>
                        <h1 className={classes.h1}>
                            {post.title}
                        </h1>
                    </div>
                    <div className={classes.wrapImgBlock}>
                        <NavLink to={routePostDetail(post.id)}>
                            <div className={classes.wrapImg}>
                                {/* <img
                                className={classes.usersAvatar}
                                src={blog.avatar !== null ? `${API_URL}/` + blog.avatar : defaultUserAvatar}
                                alt={blog.avatar}
                            /> */}
                            </div>
                        </NavLink>
                    </div>
                    <div className={classes.shortDescription}>
                        <p>{post.shortDescription}</p>
                    </div>
                    <div className={classes.postContent}>
                        <p>{post.content}</p>
                        <div className={classes.wrapLentenDate}>
                            <strong>newestLikes {myCurrentPost.extendedLikesInfo.newestLikes.length}</strong>
                            <strong className={classes.lentenDate}>{formattedTime}</strong>
                        </div>
                    </div>
                </div>
                <Row className={classes.wrapFooterPost} gutter={0}>
                    <Col className={classes.wrapLeftBlok} span={8}>
                        <div className={classes.repostBlock}>
                            <span className={classes.wrapRepostIcon}>
                                <BsMegaphone className={classes.repostIcon} />
                                <BsMegaphoneFill className={classes.repostIconHover} />
                            </span>
                        </div>
                        <div className={classes.viewBlock}>
                            <EyeOutlined className={classes.iconEyeOutlined} />
                            <strong className={classes.countViews}>34</strong>
                        </div>
                    </Col>
                    <Col className={classes.wrapCenterBlock} span={8}>
                        <div className={classes.wrapLikesBlock}>
                            <div className={classes.likesBlock}>
                                <strong onClick={handleLikeClick} className={
                                    post.extendedLikesInfo.myStatus === 'Like' ? `${classes.activeLike}` : `${classes.like}`
                                }>
                                    {
                                        post.extendedLikesInfo.myStatus === 'Like'
                                            ?
                                            <BiSolidLike className={classes.piThumbsUpFill} />
                                            :
                                            <BiLike className={classes.piThumbsUpBold} />
                                    }
                                    <strong className={classes.countLike}>
                                        {post.extendedLikesInfo.likesCount}
                                    </strong>
                                </strong>
                                <strong onClick={handleDislikeClick} className={
                                    post.extendedLikesInfo.myStatus === 'Dislike' ? `${classes.activeDislike}` : `${classes.dislike}`
                                }>
                                    {
                                        post.extendedLikesInfo.myStatus === 'Dislike'
                                            ?
                                            <BiSolidDislike className={classes.piThumbsDownFill} />
                                            :
                                            <BiDislike className={classes.piThumbsDownBold} />

                                    }
                                    <strong className={classes.countDislike}>
                                        {post.extendedLikesInfo.dislikesCount}
                                    </strong>
                                </strong>
                            </div>
                        </div>
                    </Col>
                    <Col className={classes.commentIcon} span={8}>
                        <Col className={classes.wrapCommentCount} span={4}>
                            <strong className={classes.commentCount}>123</strong>
                        </Col>
                        <Col className={classes.wrapIcon} span={4}>
                            <RiDiscussFill className={classes.iconRiDiscussFill} />
                            <RiDiscussLine className={classes.iconRiDiscussLine} />
                        </Col>
                    </Col>
                </Row>
            </div>
            <ModalWindow modalActive={modalIsUpdatePost} setModalActive={setModalIsUpdatePost} isSetModal={0}>
                <UpdatePostFormModal
                    title={title}
                    setTitle={setTitle}
                    description={description}
                    setDescription={setDescription}
                    content={content}
                    setContent={setContent}
                    updatePost={updatePost}
                    myCurrentPost={myCurrentPost}
                    setMyCurrentPost={setMyCurrentPost}
                    setModalIsUpdatePost={setModalIsUpdatePost}
                />
            </ModalWindow>
        </section>
    )
})
export default PostItem;