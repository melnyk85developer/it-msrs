import React, { useEffect, useRef, useState } from "react";
import AddPostForm from "./AddNewFormPost/AddNewPostForm";
import { Col } from "antd";
import PostItem from "./PostItem";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { IProfile, IUser } from "@packages/shared/src/types/IUser";
import classes from './styles.module.scss';

type PropsType = {
    profile: IProfile;
    authorizedUser: IUser;
    dispatch: AppDispatch;
    error: string
}

const MyPosts: React.FC<PropsType> = React.memo(({dispatch, authorizedUser, profile, error}) => {
    const [posts, setPosts] = useState([]);


    useEffect(() => {
        if (profile && profile.posts) {
            setPosts(profile.posts);
        }
    }, [profile, profile.posts]);

    const postsLoaded = posts && posts.length > 0;
    // Фильтрация постов на закрепленные и обычные посты
    const pinnedPosts = posts.filter(post => post.pin);
    const regularPosts = posts.filter(post => !post.pin);

    // Инверсия порядка закрепленных постов и обычных постов
    const invertedPinnedPosts = pinnedPosts.slice().reverse();
    const invertedRegularPosts = regularPosts.slice().reverse();

    // Объединение закрепленных и обычных постов
    const combinedPosts = [...invertedPinnedPosts, ...invertedRegularPosts];

    return (
        <>
            <AddPostForm dispatch={dispatch} profileId={profile.userId} authorizedUser={authorizedUser} error={error}/>
            <Col className={classes.borderPosts} style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                {postsLoaded && (
                    <Col className={classes.posts} >
                        {combinedPosts.map(item => (
                            <PostItem 
                                key={item.postId}
                                post={item}
                                dispatch={dispatch} 
                                postId={item.postId} 
                                title={item.title}
                                likes={item.likes}
                                image={item.image}
                                content={item.content}
                                author={item.authorPost}
                                createdAt={item.createdAt}
                                updatedAt={item.updatedAt}
                                profileId={profile.userId}
                                authorizedUserId={Number(authorizedUser.id)}              
                            />
                        ))}
                    </Col>
                )}
                {!postsLoaded && (
                    <div className={classes.wrapBlockOfNoPosts}>
                        <div className={classes.blockOfNoPosts}>
                            <h1>В данный момент у Вас нет ни одного поста!</h1>
                            <h2>Создайте какой-нибудь пост на стене профиля, чтобы ваши 
                                друзья могли почитать ваши мысли или новости.</h2>
                        </div>
                    </div>
                )}
            </Col>
        </>
    )
})

export default MyPosts;

