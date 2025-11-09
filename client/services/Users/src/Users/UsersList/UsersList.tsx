import React from "react";
import UsersItem from "../UserItem/UsersItem";
import { IUser } from "@packages/shared/src/types/IUser";


export type PropsType = {
    users: Array<IUser>
    // followingInProgress: Array<number>
    // unfollow: (userId: number) => void
    // follow: (userId: number) => void
}

const UsersList: React.FC<PropsType> = React.memo((props) => {

    return (
        <div className="wrapFriendsList">
            {props.users.map( (user) => (
                <UsersItem 
                    key={user.userId}
                    user={user}

                    // followingInProgress={props.followingInProgress} 
                    // follow={props.follow}
                    // unfollow={props.unfollow}
                />
            ))}
        </div> 
    )
})
export default UsersList;