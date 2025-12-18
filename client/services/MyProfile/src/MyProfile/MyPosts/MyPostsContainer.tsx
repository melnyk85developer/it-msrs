import React from 'react';
import MyPosts from './MyPosts';
import { AppDispatch } from '@packages/shared/src/store/redux-store';
import { PostsType } from '@packages/shared/src/types/types';
import { IProfile, IUser } from '@packages/shared/src/types/IUser';

type PropsType = {
    profile: IProfile;
    authorizedUser: IUser;
    dispatch: AppDispatch;
    error: string
}

const MyPostsContainer: React.FC<PropsType> = React.memo(({dispatch, profile, authorizedUser, error}) => {
    return (
        <MyPosts 
            profile={profile}
            authorizedUser={authorizedUser}
            dispatch={dispatch}
            error={error}
        />
    )
})
export default MyPostsContainer;