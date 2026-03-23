import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { routeMain as routeAiAssistant } from "../../ai-assistant";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { formatTimeOfPublication } from "@packages/shared/src/components/utils/timeOfPublication";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { LoadingOutlined } from "@ant-design/icons";
import { ChatType, MessagesType } from "@packages/shared/src/types/types";
import { API_URL } from "@packages/shared/src/http";
import defaultUserAvatar from "@packages/shared/src/assets/fonAvatars.png"
import classes from './styles.module.scss'

type PropsType = {
    assistantId: string;
    avatar: string;
    name: string;
}

const AiAssistantAdminItemWidget: React.FC<PropsType> = ({ assistantId, avatar, name }) => {
    const [currentTitle, setCurrentTitle] = useState<MessagesType>()

    // console.log('CompanionItem: - lastSeen', lastSeen)
    // console.log('CompanionItem: - avatar, name, surname, dialogId, msg', avatar, name, surname, dialogId, msg)


    // console.log('CompanionItem: - currentChat', currentChat)
    return (
        <li className={classes.companion}>
            <NavLink
                to={`${routeAiAssistant(assistantId)}`}
                className={({ isActive }) =>
                    `${classes.linkBase} ${isActive ? classes.active : ''}`
                }
            >
                <span className={classes.companionItem}>
                    <img
                        src={avatar !== null ? `${API_URL}/` + avatar : defaultUserAvatar}
                        alt={`${name}`}
                        className={classes.miniAvatarMsg}
                    />
                    <span className={classes.wrapDescription}>
                        <span className={classes.topRow}>
                            <span className={classes.leftBlock}>
                                <span className={classes.userName}>{name}</span>
                            </span>
                            {/* <span className={classes.wrapIconBlock}>
                                {'HARDCODE'}
                            </span> */}
                        </span>
                        <span className={classes.wrapTitle}>
                            <span className={classes.title}>{currentTitle && currentTitle.message}</span>
                        </span>
                    </span>
                </span>
            </NavLink>
        </li>
    );
}
export default AiAssistantAdminItemWidget;