import React from "react";
import YouAreFamiliarItem from "../YouAreFamiliarItem";
import { IUser } from "@/types/IUser";

type PropsType = {
    friends: Array<IUser>
}

const PerhapsYoureFamiliarList: React.FC<PropsType> = (props) => {
    return (
        <>
            {props.friends.map( item => (
                <YouAreFamiliarItem key={item.id} friends={item}/>
            ))}
        </>
    )
}
export default PerhapsYoureFamiliarList;