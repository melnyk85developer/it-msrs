import React, { useEffect } from "react";
import PerhapsYoureFamiliarList from "./PerhapsYoureFamiliarList";
import { useAppSelector } from "../../hooks/redux";
import classes from './styles.module.scss'
import { IoPaw, IoPawOutline } from "react-icons/io5";

const WidgetPerhapsYoureFamiliar: React.FC = () => {
    const { isDarkTheme } = useAppSelector(state => state.authPage)
    const { users } = useAppSelector(state => state.usersPage)

    let friends = users

        // < IoPaw />
        // <IoPawOutline />

    return (
        <div className={`${classes.wrapYofamiliar} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <div className={classes.borderWidgets}>
                <div className={classes.wrapTitleWidgets}>
                    <h4>Возможно Вы знакомы</h4>
                </div>
                <div className={classes.widgetFriends}>
                    {friends.length > 0 && <PerhapsYoureFamiliarList friends={friends.slice(0, 6)} />}
                </div>
            </div>
        </div>
    )
}
export default WidgetPerhapsYoureFamiliar;