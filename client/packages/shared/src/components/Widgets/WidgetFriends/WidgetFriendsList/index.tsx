import React from "react";
import WidgetFriendsItem from "../WidgetFriendsItem";
import { IUser } from "@/types/IUser";

type PropsType = {
    friends: Array<IUser>
}

const WidgetFriendsList: React.FC<PropsType> = (props) => {
    return (
        <>
            {props.friends.map( item => (
                <WidgetFriendsItem key={item.id} friends={item}/>
            ))}
        </>
    )
}
export default WidgetFriendsList;