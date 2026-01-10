import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { routeMain as routeUserProfile } from "../../../../UserProfile/src/UserProfile/UserProfileContainer";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { BlogType } from "@packages/shared/src/types/blogTypes";
import classes from './styles.module.scss'

type PropsType = {
    blog: BlogType
    // followingInProgress: Array<number>
    // unfollow: (userId: number) => void
    // follow: (userId: number) => void
    // userDetailPage: MouseEventHandler<HTMLImageElement> | undefined;
}

const BlogItem: React.FC<PropsType> = React.memo(({ blog }) => {
    const dispatch = useAppDispatch()
    const { authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage)
    const [addMessageText, setAddMessageText] = useState('');
    const [openModalMessage, setOpenModalMessage] = useState(false);

    // const addNewMessage = (messageText: string) => {
    //     const message = {
    //         message: messageText,
    //         senderId: authorizedUser.id,
    //         receiverId: user.id,
    //         read: false,
    //         createdAt: new Date().toISOString(),
    //         replyToMessageId: '',
    //         attachments: null as [],
    //         localId: Number(`${Date.now()}`),
    //     };

    //     dispatch(sendMessageAC(message))
    //     setAddMessageText('')
    //     setOpenModalMessage(false)
    // };
    const writeAmessage = () => {
        setOpenModalMessage(true)
    }
    // console.log('Avatar: - `${API_URL}/${avatar}`', `${API_URL}/${user.avatar}`)
    return (
        <section className={`${classes.wrapUsersItem} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <div className={classes.usersItem}>
                <div className={classes.wrapUserBlock_1}>
                    <NavLink to={routeUserProfile(blog.id)}>
                        <div className={classes.wrapUsersAvatar}>
                            {/* <img
                                className={classes.usersAvatar}
                                src={blog.avatar !== null ? `${API_URL}/` + blog.avatar : defaultUserAvatar}
                                alt={blog.avatar}
                            /> */}
                        </div>
                    </NavLink>
                </div>
                <div className={classes.userData}>
                    <div className={classes.wrapUserBlock_2}>
                        <li className={classes.userName}>
                            <p>{blog.name}</p>
                        </li>
                    </div>
                    <div className={classes.userFamilyStatus}>
                        <p>Описание:{' '}</p>{blog.description}
                    </div>
                </div>
            </div>
            <div className={classes.wrapAllButton}>
                <div className={classes.wrapButton}>
                    {blog ? (
                        <button
                            // disabled={props.followingInProgress
                            // .some( id => id === props.user.id)} 
                            //     onClick={ () => {props.unfollow(props.user.id)
                            // }} 
                            className={classes.btnFriendsTrue}>Подписаться</button>
                    ) : (
                        <button
                            // disabled={props.followingInProgress
                            // .some( id => id === props.user.id)} 
                            //     onClick={ () => {props.follow(props.user.id)
                            // }} 
                            className={classes.btnFriendsTrue}>Отписаться</button>)
                    }
                </div>
            </div>
        </section>
    )
})
export default BlogItem;