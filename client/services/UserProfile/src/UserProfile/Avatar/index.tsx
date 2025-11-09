import React from "react";
import defaultUserAvatar from "@packages/shared/src/assets/fonAvatars.png"
import classes from './styles.module.scss'
import { API_URL } from "@packages/shared/src/http";
import { useAppSelector } from "@packages/shared/src/components/hooks/redux";


type PropsType = {
    avatar: string;
}

const Avatar: React.FC<PropsType> = (props) => {
    const {isDarkTheme} = useAppSelector(state => state.authPage)

    return (
        <div className={`${classes.avatar} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <div className={classes.wrapAvatarBlock}>
                <div className={classes.shahta_avatars}>
                    <div className={classes.podium_avatars}>
                        <div className={classes.wrapAvatar}>
                            <strong>
                                <img 
                                    className={classes.avatarImage} 
                                    src={props.avatar !== null ? `${API_URL}/` + props.avatar : defaultUserAvatar} 
                                    alt={props.avatar}
                                />
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Avatar;