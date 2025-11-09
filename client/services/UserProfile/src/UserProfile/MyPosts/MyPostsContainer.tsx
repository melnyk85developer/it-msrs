import React from 'react';
import MyPosts from './MyPosts';
import { AppDispatch } from '@packages/shared/src/store/redux-store';
import { PostsType } from '@packages/shared/src/types/types';
import { IUser } from '@packages/shared/src/types/IUser';

type PropsType = {
    profile: IUser;
    authorizedUser: IUser;
    dispatch: AppDispatch;
}

const MyPostsContainer: React.FC<PropsType> = React.memo(({dispatch, profile, authorizedUser}) => {
    return (
        <MyPosts 
            profile={profile}
            authorizedUser={authorizedUser}
            dispatch={dispatch}
        />
    )
})
export default MyPostsContainer;