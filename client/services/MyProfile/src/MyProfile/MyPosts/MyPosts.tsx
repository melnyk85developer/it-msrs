import React, { useEffect, useRef, useState } from "react";
import { Col } from "antd";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { IProfile, IUser } from "@packages/shared/src/types/IUser";
import classes from './styles.module.scss';
import PostItemForBlog from "./PostItemForBlog/postItemForBlog";
import PostForProfileItem from "./PostItemForProfile";
import { PostBlogType } from "@packages/shared/src/types/blogTypes";
import { PostsType } from "@packages/shared/src/types/types";

type PropsType = {
    profile: IProfile;
    authorizedUser: IUser;
    dispatch: AppDispatch;
    postsProfileLoaded: boolean;
    postsBlogLoaded: boolean;
    combinedPostsForProfile: any[]
    combinedPostsForBlog: any[]
    isDarkTheme: string;
    error: string
}
type FeedItem =
    | {
        type: 'blog';
        createdAt: string;
        data: PostBlogType;
    }
    | {
        type: 'profile';
        createdAt: string;
        data: PostsType;
    };

const MyPosts: React.FC<PropsType> = React.memo(({
    dispatch,
    authorizedUser,
    profile,
    postsProfileLoaded,
    postsBlogLoaded,
    combinedPostsForProfile,
    combinedPostsForBlog,
    isDarkTheme,
    error
}) => {

    const feed: FeedItem[] = [
        ...combinedPostsForBlog.map(post => ({
            type: 'blog' as const,
            createdAt: post.createdAt,
            data: post,
        })),
        ...combinedPostsForProfile.map(post => ({
            type: 'profile' as const,
            createdAt: post.createdAt,
            data: post,
        })),
    ];

    feed.sort(
        (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
    );
    {
        feed.map(item => {
            switch (item.type) {
                case 'blog':
                    return (
                        <PostItemForBlog
                            key={item.data.id}
                            post={item.data}
                            isDarkTheme={isDarkTheme}
                        />
                    );

                case 'profile':
                    return (
                        <PostForProfileItem
                            key={item.data.postId}
                            post={item.data}
                            dispatch={dispatch}
                            postId={item.data.postId}
                            title={item.data.title}
                            likes={item.data.likes}
                            image={item.data.image}
                            content={item.data.content}
                            author={item.data.authorPost}
                            createdAt={item.createdAt}
                            updatedAt={item.data.updatedAt}
                            profileId={profile.id}
                            authorizedUserId={authorizedUser.id}
                        />
                    );

                default:
                    return null;
            }
        })
    }

    // console.log('MyPosts: - profile 😡 ', profile)
    // console.log('MyPosts: - combinedPostsForProfile 😡 ', combinedPostsForProfile)

    return (
        <Col className={classes.borderPosts} style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
            {postsProfileLoaded && (
                <Col className={classes.posts}>
                    {feed.map(item => {
                        if (item.type === 'blog') {
                            return (
                                <PostItemForBlog
                                    key={item.data.id}
                                    post={item.data}
                                    isDarkTheme={isDarkTheme}
                                />
                            );
                        }

                        return (
                            <PostForProfileItem
                                key={item.data.postId}
                                post={item.data}
                                dispatch={dispatch}
                                postId={item.data.postId}
                                title={item.data.title}
                                likes={item.data.likes}
                                image={item.data.image}
                                content={item.data.content}
                                author={item.data.authorPost}
                                createdAt={item.data.createdAt}
                                updatedAt={item.data.updatedAt}
                                profileId={profile.id}
                                authorizedUserId={authorizedUser.id}
                            />
                        );
                    })}

                </Col>
            )}
            {!postsProfileLoaded && (
                <div className={classes.wrapBlockOfNoPosts}>
                    <div className={classes.blockOfNoPosts}>
                        <h1>В данный момент у Вас нет ни одного поста!</h1>
                        <h2>Создайте какой-нибудь пост на стене профиля, чтобы ваши
                            друзья могли почитать ваши мысли или новости.</h2>
                    </div>
                </div>
            )}
        </Col>
    )
})

export default MyPosts;

