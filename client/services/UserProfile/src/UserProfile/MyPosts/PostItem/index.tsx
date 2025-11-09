import React, { useEffect, useState } from "react";
import { Col } from "antd";
import { CommentOutlined, DeleteOutlined, DislikeOutlined, EyeOutlined, LikeOutlined } from "@ant-design/icons";
import { API_URL } from "@packages/shared/src/http";
import defaultUserAvatar from "@packages/shared/src/assets/fonAvatars.png"
import { formatTimeAgo } from '@packages/shared/src/components/utils/date-time-utilite'
import { AuthorPostType, IsLikesType, PostsType } from "@packages/shared/src/types/types";
import { addLikeToPostAC } from "@packages/shared/src/store/UserProfileReducers/userProfileSlice";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import PostMenu from "../PostMenu";
import classes from './styles.module.scss';
import { useAppSelector } from "@packages/shared/src/components/hooks/redux";
import ModalWindow from "@packages/shared/src/components/ModalWindows";

type PropsType = {
    postId: number
    post: PostsType
    profileId: number
    authorizedUserId: number
    author: AuthorPostType
    image: string
    title: string
    content: string
    likes: Array<IsLikesType>
    createdAt: string
    updatedAt: string
    dispatch: AppDispatch
}

const PostItem: React.FC<PropsType> = React.memo(({
    dispatch, post, postId, profileId, authorizedUserId, author, image, title, content, createdAt, likes, updatedAt}) => {
    const [expanded, setExpanded] = useState(false);
    const [handleDeletePostId, setHandleDeletePostId] = useState(null)
    const [showDeletedMessage, setShowDeletedMessage] = useState(false);
    const like = likes ? likes.filter(item => item.isLike === true).length : 0;
    const dislike = likes ? likes.filter(item => item.isLike === false).length : 0;

    const handleLikeClick = () => {
        dispatch(addLikeToPostAC({postId, userId: authorizedUserId, isLike: true}))
    }
    const handleDislikeClick = () => {
        dispatch(addLikeToPostAC({postId, userId: authorizedUserId, isLike: false}))
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
            {showDeletedMessage && (<Col className={classes.deletedMessage}><h1>Пост был успешно удален!</h1></Col>)}
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
                    <div className={classes.settingPost}>
                        <PostMenu 
                            postId={postId} 
                            post={post}
                            profileId={profileId}
                            dispatch={dispatch} 
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
                            {image !== null ? <img src={`${API_URL}/` + image} alt="foto"/> : ''}
                        </div>
                    </div>
                    <div className={classes.wrapFooterPost}>
                        <div className={classes.viewBlock}>
                            <EyeOutlined /> 34
                        </div>
                        <div className={classes.wrapLikesBlock}>
                            <div className={classes.likesBlock}>
                                <strong onClick={handleLikeClick} className={isLiked === true ? `${classes.activeLike}` : `${classes.like}`}>
                                    <LikeOutlined />
                                    <p> {like}</p>
                                </strong>
                                <strong onClick={handleDislikeClick} className={isDisliked === true ? `${classes.activeDislike}` : `${classes.dislike}`}>
                                    <DislikeOutlined />
                                    <p>{dislike}</p>
                                </strong>
                            </div>
                        </div>
                        <div className={classes.commentsBlock}>
                            <strong className={classes.commentIcon}>
                                <CommentOutlined /> 123
                            </strong>
                        </div>
                    </div>
                </Col>
            </Col>
        </>
    )
})

export default PostItem;