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
}

const MyPosts: React.FC<PropsType> = React.memo(({dispatch, profile, authorizedUser}) => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (profile && profile.posts) {
            setPosts(profile.posts);
        }
    }, [profile]);

    const postsLoaded = posts && posts.length > 0;
    const invertedPosts = posts ? posts.slice().reverse() : [];

    return (
        <>
            <AddPostForm dispatch={dispatch} profileId={profile.userId} authorizedUserId={authorizedUser.userId} />
            <Col className={classes.borderPosts} style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                {postsLoaded && (
                    <Col className={classes.posts} >
                        {invertedPosts.map(item => (
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
                                authorizedUserId={authorizedUser.userId}              
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

