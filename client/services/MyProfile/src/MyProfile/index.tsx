import React from "react";
import { Col } from "antd";
import Info from "./Info";
import MyPostsContainer from "./MyPosts/MyPostsContainer";
import { useAppDispatch, useAppSelector } from "../../../../packages/shared/src/components/hooks/redux";
import { MyProfileOutletContext } from "./MyProfileOutletContext/myProfileOutletContext";
import { useOutletContext } from "react-router-dom";
import classes from './styles.module.scss';

const MyProfile: React.FC = () => {
    const {
        dispatch,
        isAuth,
        authorizedUser,
        profile,
        posts,
        error,
        isDarkTheme
    } = useOutletContext<MyProfileOutletContext>();

    // console.log('MyProfile: - isAuth 😡😡😡😡😡 ', isAuth)
    // console.log('MyProfile: - authorizedUser 😡 ', authorizedUser)
    // console.log('MyProfile: - profile 😡 ', profile)
    // console.log('MyProfile: - posts 😡 ', posts)

    return (
        <div className={`${classes.wrapContentProfiles} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <div className={classes.contentProfiles}>
                <Info
                    key={profile.id}
                    authorizedUser={authorizedUser}
                    profile={profile}
                    dispatch={dispatch}
                    error={error}
                    isDarkTheme={isDarkTheme}
                // status={myProfileStatus} 
                // updateStatus={updateMyStatus} 
                />
                <MyPostsContainer
                    dispatch={dispatch}
                    profile={profile}
                    posts={posts}
                    authorizedUser={authorizedUser}
                    isDarkTheme={isDarkTheme}
                    error={error}
                />
            </div>
        </div>
    )
}
export default MyProfile