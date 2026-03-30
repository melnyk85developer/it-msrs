import React from "react";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { useEffect, useRef, useState } from "react";
import { RiDeleteBin6Fill, RiDeleteBin6Line, RiMore2Fill, RiMore2Line, RiVideoOnFill, RiVideoOnLine } from "react-icons/ri";
import { PiBroom, PiBroomBold } from "react-icons/pi";
import { MdBlock, MdOutlineBlock } from "react-icons/md";
import { BiSearch, BiSearchAlt } from "react-icons/bi";
import { BsTelephone, BsTelephoneFill } from "react-icons/bs";
import LastSeenLabel from './getLastSeenLabel';
import { deleteAiAssistantAllMessagesAC, deleteAiAssistantDialogAC } from "@packages/shared/src/store/MyAdminReducers/myAiAssistantAdminSlice";
import classes from './styles.module.scss'

type PropsType = {
    title: string;
}

const HeaderMessagesList: React.FC<PropsType> = React.memo((props) => {
    const dispatch = useAppDispatch();
    const { isAuth, authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage);
    const { currentInterlocutor, currentChat } = useAppSelector(state => state.adminAdminAiAssistantPage);
    const [isOpen, setIsOpen] = useState(false);
    const [deleteOption, setDeleteOption] = useState<"me" | "all">("me");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // console.log('HeaderMessagesList currentChat: - dialogId', currentChat.dialogId)
    // console.log('HeaderMessagesList currentChat: - currentChat', currentChat)
    // console.log('HeaderMessagesList: - currentInterlocutor', currentInterlocutor)

    const clearChat = () => {
        setDeleteOption('all')
        dispatch(deleteAiAssistantAllMessagesAC(
            authorizedUser?.id,
            currentInterlocutor?.profileId,
            deleteOption
        ))
    }
    const deleteChat = () => {
        dispatch(deleteAiAssistantDialogAC(
            currentChat?.dialogId,
            authorizedUser?.id,
            currentInterlocutor?.profileId
        ))
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`${classes.headerMessagesList}`}>
            <div className={classes.wrapLeftBlock}>
                <span className={classes.userNameHeaderMsgList}>
                    <span>{props.title}</span>
                    <span className={classes.name}>{currentInterlocutor.name}</span>
                    <span className={classes.surname}>{currentInterlocutor.surname}</span>
                </span>
                <span className={classes.dataHeaderMessagesList}>
                    {/* <LastSeenLabel lastSeenAt={currentInterlocutor.lastSeen}/> */}
                    Current Model:
                </span>
            </div>

            <div className={classes.wrapIcon} ref={dropdownRef}>
                <span className={classes.iconWrapper} onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)}>
                    <RiMore2Line
                        className={`
                            ${classes.icon}
                            ${classes.iconNormal}
                            ${classes.iconNav}
                        `}
                    />
                    <RiMore2Fill
                        className={`
                            ${classes.icon}
                            ${classes.iconHover}
                            ${classes.iconNav}
                        `}
                    />
                </span>
                <div className={`
                    ${isOpen ? classes.navMsgActive : classes.navMsgDisactive}
                `}>
                    <div className={classes.wrapPopUpMenu}>
                        <div onClick={clearChat} className={classes.li}>
                            <span className={classes.iconWrapper}>
                                <PiBroom className={`${classes.icon} ${classes.iconNormal}`} />
                                <PiBroomBold className={`${classes.icon} ${classes.iconHover}`} />
                            </span>
                            <strong>Очистить переписку</strong>
                        </div>
                        <div onClick={deleteChat} className={classes.li}>
                            <span className={classes.iconWrapper}>
                                <RiDeleteBin6Line className={`${classes.icon} ${classes.iconNormal}`} />
                                <RiDeleteBin6Fill className={`${classes.icon} ${classes.iconHover}`} />
                            </span>
                            <strong>Удалить чат</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})
export default HeaderMessagesList