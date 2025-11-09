import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { API_URL } from "@packages/shared/src/services/http";
import { routeMain as routeDialog } from "../index";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { formatTimeOfPublication } from "@packages/shared/src/components/utils/timeOfPublication";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { LoadingOutlined } from "@ant-design/icons";
import defaultUserAvatar from "@packages/shared/src/assets/fonAvatars.png"
import classes from './styles.module.scss'
import { MessagesType } from "@packages/shared/src/types/types";

type PropsType = {
    avatar: string;
    name: string;
    surname: string;
    dialogId: number;
    msg: MessagesType
    // read: boolean
}

const CompanionItem: React.FC<PropsType> = ({ avatar, name, surname, dialogId, msg }) => {
    const { messages, lastMessage, sendingMessages, updatingMessages, currentChat } = useAppSelector(state => state.messagesPage);
    const [currentTitle, setCurrentTitle] = useState<MessagesType>()
    const lastSeen = new Date(msg?.createdAt);
    const day = lastSeen.getDate().toString().padStart(2, '0');
    const month = (lastSeen.getMonth() + 1).toString().padStart(2, '0');
    const year = lastSeen.getFullYear();

    // console.log('CompanionItem: - lastSeen', lastSeen)

    useEffect(() => {
        if (msg) {
            setCurrentTitle(msg);
        }
    }, [msg]);

    useEffect(() => {
        if (!messages || messages.length === 0) return;

        const lastMsg = messages[messages.length - 1];
        // console.log('CompanionItem: - lastMsg', lastMsg)

        if (lastMsg.dialogId === dialogId) {
            setCurrentTitle(lastMsg);
        }
    }, [messages, dialogId]);

    // console.log('CompanionItem: - currentMsg', currentMsg)
    return (
        <li className={classes.companion}>
            <NavLink
                to={`/messages/${routeDialog(dialogId)}`}
                className={({ isActive }) =>
                    `${classes.linkBase} ${isActive ? classes.active : ''}`
                }
            >
                <span className={classes.companionItem}>
                    <img
                        src={avatar !== null ? `${API_URL}/` + avatar : defaultUserAvatar}
                        alt={`${name} ${surname}`}
                        className={classes.miniAvatarMsg}
                    />
                    <span className={classes.wrapDescription}>
                        <span className={classes.topRow}>
                            <span className={classes.leftBlock}>
                                <span className={classes.userName}>{name}</span>
                                <span className={classes.userSurname}>{surname}</span>
                            </span>
                            {day && month && year
                                ?
                                <span className={classes.rightBlock}>
                                    <span className={classes.deliveryDate}>
                                        {`${day}.${month}.${year}`}
                                    </span>
                                </span>
                                : <></>
                            }
                            <span className={classes.wrapIconBlock}>
                                {
                                    currentChat.dialogId === dialogId
                                        &&
                                        sendingMessages.includes(lastMessage.localId)
                                        ||
                                        updatingMessages.includes(lastMessage.msgId)
                                        ?
                                        <LoadingOutlined className={classes.svg} />
                                        :
                                        <>
                                            {
                                                msg
                                                    ?
                                                    <IoCheckmarkDoneSharp className={`${msg.read ? classes.statusIcon : classes.delivered}`} />
                                                    :
                                                    <></>
                                            }
                                        </>
                                }
                            </span>
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
export default CompanionItem;