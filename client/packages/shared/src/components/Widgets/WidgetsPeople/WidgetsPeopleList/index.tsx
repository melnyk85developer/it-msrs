import React from "react";
import WidgetPeopleItem  from "../WidgetPeopleItem";
import { IUser } from "@/types/IUser";

export type PropsType = {
    users: Array<IUser>
}

const WidgetsPeopleList: React.FC<PropsType> = (props) => {

    return (
        <div>
            {props.users.map( (user) => (
                <WidgetPeopleItem 
                    key={user.userId}
                    user={user}
                />
            ))}
        </div> 
    )
}
export default WidgetsPeopleList;