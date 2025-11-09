import React, { MouseEventHandler, useState } from "react";
import { NavLink } from "react-router-dom";
import { routeMain as routeUserProfile } from "../../../../UserProfile/src/UserProfile/UserProfileContainer";
import defaultUserAvatar from "@packages/shared/src/assets/fonAvatars.png"
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { API_URL } from "@packages/shared/src/services/http";
import { IProfile, IUser } from "@packages/shared/src/types/IUser";
import ModalWindow from "@packages/shared/src/components/ModalWindows";
import SendMessageFormModal from "./ModalContentMsg/messageFormModal";
import { sendMessageAC } from "@packages/shared/src/store/MessagesReducers/messagesSlice";
import { v4 as uuidv4 } from 'uuid';
import classes from './styles.module.scss'

type PropsType = {
    user: IProfile
    // followingInProgress: Array<number>
    // unfollow: (userId: number) => void
    // follow: (userId: number) => void
    // userDetailPage: MouseEventHandler<HTMLImageElement> | undefined;
}

const UsersItem: React.FC<PropsType> = React.memo(({ user }) => {
    const dispatch = useAppDispatch()
    const { authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage)
    const [addMessageText, setAddMessageText] = useState('');
    const [openModalMessage, setOpenModalMessage] = useState(false);

    const addNewMessage = (messageText: string) => {
        const message = {
            message: messageText,
            senderId: authorizedUser.userId,
            receiverId: user.userId,
            read: false,
            createdAt: new Date().toISOString(),
            replyToMessageId: '',
            attachments: null as [],
            localId: Number(`${Date.now()}`),
        };

        dispatch(sendMessageAC(message))
        setAddMessageText('')
        setOpenModalMessage(false)
    };
    const writeAmessage = () => {
        setOpenModalMessage(true)
    }

    return (
        <section className={`${classes.wrapUsersItem} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <div className={classes.usersItem}>
                <div className={classes.wrapUserBlock_1}>
                    <NavLink to={routeUserProfile(user.userId)}>
                        <div className={classes.wrapUsersAvatar}>
                            <img
                                className={classes.usersAvatar}
                                src={user.avatar !== null ? `${API_URL}/` + user.avatar : defaultUserAvatar}
                                alt={user.avatar}
                            />
                        </div>
                    </NavLink>
                </div>
                <div className={classes.userData}>
                    <div className={classes.wrapUserBlock_2}>
                        <li className={classes.userName}>
                            <p>{user.name}{' '}{user.surname}</p>
                        </li>
                    </div>
                    <div className={classes.userFamilyStatus}>
                        <p>Status:{' '}
                            {/* {props.user.status} */}
                        </p>
                    </div>
                </div>
            </div>
            <div className={classes.wrapAllButton}>
                <div className={classes.wrapButton}>
                    {user ? (
                        <button
                            // disabled={props.followingInProgress
                            // .some( id => id === props.user.id)} 
                            //     onClick={ () => {props.unfollow(props.user.id)
                            // }} 
                            className={classes.btnFriendsTrue}>Удалить из Друзей</button>
                    ) : (
                        <button
                            // disabled={props.followingInProgress
                            // .some( id => id === props.user.id)} 
                            //     onClick={ () => {props.follow(props.user.id)
                            // }} 
                            className={classes.btnFriendsTrue}>Добавить в Друзья</button>)
                    }
                </div>
                <div className={classes.wrapBtnMsg}>
                    <button onClick={() => writeAmessage()} className={classes.btnFriendsMessage}>Написать Сообшение</button>
                </div>
                <ModalWindow modalActive={openModalMessage} setModalActive={setOpenModalMessage} isSetModal={0}>
                    <SendMessageFormModal
                        textMessage={addMessageText}
                        setTextMessage={setAddMessageText}
                        addNewMessage={addNewMessage} 
                        setModalActive={setOpenModalMessage}
                    />
                </ModalWindow>
            </div>
        </section>
    )
})
export default UsersItem;