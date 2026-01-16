import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";
import { RiDiscussFill, RiDiscussLine } from "react-icons/ri";
import { PiThumbsDownBold, PiThumbsDownFill, PiThumbsUpBold, PiThumbsUpFill } from "react-icons/pi";
import { BsMegaphone, BsMegaphoneFill } from "react-icons/bs";
import { EyeOutlined, PushpinOutlined } from "@ant-design/icons";
import { API_URL } from "@packages/shared/src/http";
import { formatTimeAgo } from '@packages/shared/src/components/utils/date-time-utilite'
import { AuthorPostType, IsLikesType, PostsType } from "@packages/shared/src/types/types";
import { addLikeToPostAC } from "@packages/shared/src/store/MyProfileReducers/myProfileSlice";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import defaultUserAvatar from "@packages/shared/src/assets/fonAvatars.png"
import PostMenu from "./PostItemMenu";
import classes from './styles.module.scss';
import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";

type PropsType = {
    dispatch: AppDispatch;
    postId: string;
    post: PostsType;
    profileId: string;
    authorizedUserId: string;
    author: AuthorPostType;
    image: string;
    title: string;
    content: string;
    likes: Array<IsLikesType>;
    createdAt: string;
    updatedAt: string;
}

const PostForProfileItem: React.FC<PropsType> = React.memo(({
    dispatch,
    post,
    postId,
    profileId,
    authorizedUserId,
    author,
    image,
    title,
    content,
    createdAt,
    likes,
    updatedAt
}) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [handleDeletePostId, setHandleDeletePostId] = useState(null);
    const [showDeletedMessage, setShowDeletedMessage] = useState<boolean>(false);
    const [isPinPost, setIsPinPost] = useState<boolean>(post.pin);
    const like = likes ? likes.filter(item => item.isLike === true).length : 0;
    const dislike = likes ? likes.filter(item => item.isLike === false).length : 0;

    const handleLikeClick = () => {
        dispatch(addLikeToPostAC({ postId, userId: authorizedUserId, isLike: true }))
    }
    const handleDislikeClick = () => {
        dispatch(addLikeToPostAC({ postId, userId: authorizedUserId, isLike: false }))
    }
    const isLiked = likes && likes.some(item => item.userId === authorizedUserId && item.isLike === true);
    const isDisliked = likes && likes.some(item => item.userId === authorizedUserId && item.isLike === false);
    const formattedTime: string = formatTimeAgo(createdAt);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    }
    useEffect(() => {
        if (showDeletedMessage) {
            const timer = setTimeout(() => {
                setShowDeletedMessage(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showDeletedMessage]);

    return (
        <>
            {showDeletedMessage && (<Col className={classes.deletedMessage}><h2>Пост был успешно удален!</h2></Col>)}
            <Col className={`${classes.wrap_post} ${handleDeletePostId === postId ? classes.postItemDelete : ''}`}>
                <div className={classes.wrapHederPost}>
                    <div className={classes.avatarBlockPosts}>
                        <img
                            src={author.avatar !== null ? `${API_URL}/` + author.avatar : defaultUserAvatar}
                            alt={author.avatar}
                        />
                        <div className={classes.wrapNameDatumBlockPosts}>
                            <div className={classes.userNameBlockPosts}>
                                <strong>{author.name}</strong>
                                <strong>{author.surname}</strong>
                            </div>
                            <strong className={classes.LentenDate}>{formattedTime}</strong>
                        </div>
                    </div>
                    {isPinPost ? <PushpinOutlined /> : <></>}
                    <div className={classes.settingPost}>
                        <PostMenu
                            postId={postId}
                            post={post}
                            profileId={profileId}
                            dispatch={dispatch}
                            isPinPost={isPinPost}
                            setIsPinPost={setIsPinPost}
                            authorizedUserId={authorizedUserId}
                            setHandleDeletePostId={setHandleDeletePostId}
                            setShowDeletedMessage={setShowDeletedMessage}
                        />
                    </div>
                </div>
                <Col className={classes.wrapPostContent}>
                    <h2>{title}</h2>
                    <div className={classes.post}>
                        <div className={classes.textPost}>
                            {expanded ? <p>{content}</p> : content.slice(0, 500)}
                            {content.length > 100 && !expanded && (
                                <span onClick={toggleExpanded}>
                                    {'... '}
                                    <strong className={classes.yet}>Ещё</strong>
                                </span>
                            )}
                            {expanded && content.length > 500 && (
                                <div onClick={toggleExpanded} className={classes.wrapRollUp}>
                                    <strong>{' '}</strong>
                                    <strong className={classes.rollUp}>Свернуть</strong>
                                </div>
                            )}
                        </div>
                        <div className={classes.wrapImgPost}>
                            {image !== null ? <img src={`${API_URL}/` + image} alt="foto" /> : ''}
                        </div>
                    </div>
                    {/* <div className={classes.wrapFooterPost}>
                        <div className={classes.viewBlock}>
                            <EyeOutlined /> 34
                        </div>
                        <div className={classes.viewBlock}>
                            <BsMegaphone />
                            <BsMegaphoneFill />
                        </div>
                        <div className={classes.wrapLikesBlock}>
                            <div className={classes.likesBlock}>
                                <strong onClick={handleLikeClick} className={isLiked === true ? `${classes.activeLike}` : `${classes.like}`}>
                                    <PiThumbsUpBold />
                                    <PiThumbsUpFill />
                                    <p> {like}</p>
                                </strong>
                                <strong onClick={handleDislikeClick} className={isDisliked === true ? `${classes.activeDislike}` : `${classes.dislike}`}>
                                    <PiThumbsDownBold />
                                    <PiThumbsDownFill />
                                    <p>{dislike}</p>
                                </strong>
                            </div>
                        </div>
                        <div className={classes.commentsBlock}>
                            <strong className={classes.commentIcon}>
                                <RiDiscussFill /><RiDiscussLine />123
                            </strong>
                        </div>
                    </div> */}
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
                </Col>
            </Col>
        </>
    )
})

export default PostForProfileItem;