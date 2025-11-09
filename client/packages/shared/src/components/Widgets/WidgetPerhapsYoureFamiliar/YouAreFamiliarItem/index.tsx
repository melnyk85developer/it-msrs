import React from "react";
import { NavLink } from "react-router-dom";
import { routeMain as routeUserProfile } from "../../../../../../../services/UserProfile/src/UserProfile/UserProfileContainer";
import { API_URL } from "../../../../http";
import defaultUserAvatar from "../../../../assets/fonAvatars.png"
import { IUser } from "@/types/IUser";
import { useAppSelector } from "../../../../components/hooks/redux";
import classes from './styles.module.scss'

type PropsType = {
    friends: IUser;
}

const YouAreFamiliarItem: React.FC<PropsType> = (props) => {
    const {isDarkTheme} = useAppSelector(state => state.authPage)

    return (
        <div className={`${classes.wrapFriendsWidget} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <NavLink to={routeUserProfile(props.friends.userId)}>
                <div className={classes.friendItem}>
                    <img  
                        src={props.friends.avatar != null 
                        ? `${API_URL}/` + props.friends.avatar
                        : defaultUserAvatar} 
                        alt="ava"
                        className={classes.miniAvatarFriend}
                    />
                    <div className={classes.blockNameFriendItemWidget}>
                        <p>{props.friends.name}</p>
                        <p>{props.friends.surname}</p>
                    </div>
                </div>
            </NavLink>
        </div>
    )
}

export default YouAreFamiliarItem;