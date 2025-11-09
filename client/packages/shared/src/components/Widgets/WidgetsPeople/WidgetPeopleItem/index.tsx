import React from "react";
import { NavLink } from "react-router-dom";
import { routeMain as routeUserProfile } from "../../../../../../../services/UserProfile/src/UserProfile/UserProfileContainer";
import defaultUserAvatar from "../../../../assets/fonAvatars.png"
import { IUser } from "@/types/IUser";
import { API_URL } from "../../../../http";
import { useAppSelector } from "../../../../components/hooks/redux";
import classes from './styles.module.scss'

type PropsType = {
    user: IUser;
}
const WidgetPeopleItem: React.FC<PropsType>  = (props) => {
    const {isDarkTheme} = useAppSelector(state => state.authPage)
    
    return (
        <div className={`${classes.wrapFriendsWidget} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <NavLink to={routeUserProfile(props.user.userId)}>
                <div className={classes.friendItem}>
                    <img  
                            src={props.user.avatar != null 
                            ? `${API_URL}/` + props.user.avatar
                            : defaultUserAvatar} 
                            alt="ava"
                            className={classes.miniAvatarFriend}
                        />
                    <div className={classes.blockNameFriendItemWidget}>
                        <p>{props.user.name}</p>
                        <p>{props.user.surname}</p>
                    </div>
                </div>
            </NavLink>
        </div>
    )
}

export default WidgetPeopleItem;