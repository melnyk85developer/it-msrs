import React, { useEffect, useState } from 'react';
import MyPosts from './MyPosts';
import { AppDispatch } from '@packages/shared/src/store/redux-store';
import { PostsType } from '@packages/shared/src/types/types';
import { IProfile, IUser } from '@packages/shared/src/types/IUser';
import { getAllPostsForProfileAC } from '@packages/shared/src/store/MyProfileReducers/myProfileSlice';
import AddPostForm from './ModalPostForm/AddNewFormPost/AddNewPostForm';
import { useAppSelector } from '@packages/shared/src/components/hooks/redux';
import { getAllPostsForBlogAC } from '@packages/shared/src/store/BlogsReducers/blogsSlice';
import { Col } from 'antd';
import classes from './styles.module.scss';

type PropsType = {
    profile: IProfile;
    posts: PostsType[];
    authorizedUser: IUser;
    dispatch: AppDispatch;
    isDarkTheme: string;
    error: string
}

const MyPostsContainer: React.FC<PropsType> = React.memo(({
    dispatch,
    profile,
    posts,
    authorizedUser,
    isDarkTheme,
    error
}) => {

    const { blogs, currentBlog, posts: postsForBlog, } = useAppSelector(state => state.blogsPage);

    const [postsProfileContent, setPostsProfileContent] = useState([]);
    const [postsBlogContent, setPostsBlogContent] = useState([]);

    useEffect(() => {
        dispatch(getAllPostsForProfileAC());
        if (blogs.length) {
            dispatch(getAllPostsForBlogAC(blogs[0].id))
        }
    }, []);

    useEffect(() => {
        if (posts) {
            setPostsProfileContent(posts);
        }
        if (postsForBlog) {
            setPostsBlogContent(postsForBlog);
        }
    }, [profile, posts, postsForBlog]);

    const postsProfileLoaded = postsProfileContent && postsProfileContent.length > 0;
    const postsBlogLoaded = postsBlogContent && postsBlogContent.length > 0;
    // Фильтрация постов на закрепленные и обычные посты
    const pinnedPostsForProfile = postsProfileContent.filter(post => post.pin);
    const regularPostsForProfile = postsProfileContent.filter(post => !post.pin);

    // Фильтрация постов на закрепленные и обычные посты
    const pinnedPostsForBlog = postsBlogContent.filter(post => post.pin);
    const regularPostsForBlog = postsBlogContent.filter(post => !post.pin);

    // Инверсия порядка закрепленных постов и обычных постов
    const invertedPinnedPostsForProfile = pinnedPostsForProfile.slice().reverse();
    const invertedRegularPostsForProfile = regularPostsForProfile.slice().reverse();

    // Инверсия порядка закрепленных постов и обычных постов
    const invertedPinnedPostsForBlog = pinnedPostsForBlog.slice().reverse();
    const invertedRegularPostsForBlog = regularPostsForBlog.slice().reverse();

    const combinedPostsForProfile = [...invertedPinnedPostsForProfile, ...invertedRegularPostsForProfile];
    const combinedPostsForBlog = [...invertedPinnedPostsForBlog, ...invertedRegularPostsForBlog];

    // console.log('MyPostsContainer: - posts 😡 ', posts)

    return (
        <>
            <AddPostForm
                dispatch={dispatch}
                profileId={profile.id}
                authorizedUser={authorizedUser}
                error={error}
            />
            <Col className={classes.borderPosts} style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
                <MyPosts
                    profile={profile}
                    authorizedUser={authorizedUser}
                    dispatch={dispatch}
                    postsProfileLoaded={postsProfileLoaded}
                    postsBlogLoaded={postsBlogLoaded}
                    combinedPostsForProfile={combinedPostsForProfile}
                    combinedPostsForBlog={combinedPostsForBlog}
                    isDarkTheme={isDarkTheme}
                    error={error}
                />
            </Col>
        </>
    )
})
export default MyPostsContainer;