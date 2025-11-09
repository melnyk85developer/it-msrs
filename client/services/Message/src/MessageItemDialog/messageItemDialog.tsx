import React, { useEffect, useRef, useState } from "react";
import { message as antdMessage } from 'antd';
import defaultUserAvatar from "../../../../packages/shared/src/assets/fonAvatars.png"
import { Tooltip } from "antd";
import { formatTimeOfPublication } from "../../../../packages/shared/src/components/utils/timeOfPublication";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { API_URL } from "../../../../packages/shared/src/services/http";
import { MessagesType } from "../../../../packages/shared/src/types/types";
import { RiDeleteBin6Fill, RiDeleteBin6Line, RiFileCopyFill, RiFileCopyLine, RiShareForwardFill, RiShareForwardLine } from "react-icons/ri";
import { BsEmojiSmile, BsEmojiSmileFill, BsPencil, BsPencilFill, BsPin, BsPinFill } from "react-icons/bs";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { clearMessageStateAC, deleteMessageAC, updateMessageAC, updateReadAC } from "@packages/shared/src/store/MessagesReducers/messagesSlice";
import ModalWindow from "@packages/shared/src/components/ModalWindows";
import MessageFormModal from "../ModalContentMsg/messageFormModal";
import classes from './styles.module.scss'
import DeleteMessageModal from "../ModalContentMsg/deleteMessageModal/deleteMessageModal";

type PropsType = {
    dispatch: AppDispatch;
    msgId: number;
    userId: number;
    interlocutorId: number;
    senderId: number;
    message: string;
    read: boolean;
    createdAt: string;
    updatedAt: string;
    messages: MessagesType[];
    attachments: any[];
    avatar: string;
    isSending: boolean;
    sendingMessages: number[];
    updatingMessages: number[];
    deletingMessages: number[];
    localId: number;
    index: number;
}
const MessageItemDialog: React.FC<PropsType> = (props) => {
    const { dispatch, localId, msgId, userId, senderId, interlocutorId,
        message, read, createdAt, updatedAt, avatar, index,
        messages, sendingMessages, updatingMessages } = props

    const nextMsg = messages[index + 1];
    const isLastFromSender = !nextMsg || Number(nextMsg.senderId) !== senderId;
    const [showDeletedMessageLeft, setShowDeletedMessageLeft] = useState<boolean>(false);
    const [showDeletedMessageRight, setShowDeletedMessageRight] = useState<boolean>(false);
    const [textMessage, setTextMessage] = useState<string>(message);
    const [openModalMessage, setOpenModalMessage] = useState<boolean>(false);
    const [openModalDeleteMessage, setOpenDeleteModalMessage] = useState<boolean>(false);
    const [deleteOption, setDeleteOption] = useState<"me" | "all">("me");

    const itemRef = useRef<HTMLDivElement>(null);
    const [wasRead, setWasRead] = useState(false);

    useEffect(() => {
        if (read || senderId === userId || wasRead) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !wasRead) {
                dispatch(updateReadAC(msgId, true));
                setWasRead(true);
                observer.unobserve(entry.target);
            }
        }, {
            threshold: 1.0,
        });

        if (itemRef.current) {
            observer.observe(itemRef.current);
        }

        return () => observer.disconnect();
    }, [read, senderId, userId, msgId, wasRead]);

    useEffect(() => {
        if (showDeletedMessageLeft) {
            setOpenDeleteModalMessage(false)
            const timer = setTimeout(() => {
                dispatch(clearMessageStateAC(msgId));
                setShowDeletedMessageLeft(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
        if (showDeletedMessageRight) {
            setOpenDeleteModalMessage(false)
            const timer = setTimeout(() => {
                dispatch(clearMessageStateAC(msgId));
                setShowDeletedMessageRight(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [showDeletedMessageRight, showDeletedMessageLeft]);

    const edit = (msg: string) => {
        setTextMessage(msg)
        setOpenModalMessage(true)
    }
    const addEdit = (messageText: string) => {
        const newMsg = {
            msgId,
            message: messageText,
            senderId: userId,
            receiverId: interlocutorId,
            read: false,
            createdAt: new Date().toISOString(),
            replyToMessageId: '',
            attachments: null as [],
        };
        const oldMsg = messages.filter(m => m.msgId === msgId)
        dispatch(updateMessageAC(newMsg, oldMsg))
        setTextMessage('')
        setOpenModalMessage(false)
    };
    
    const deleteMsg = async () => {
        const status = await dispatch(deleteMessageAC(msgId, deleteOption))
        if (status === 204) {
            if (userId === senderId) {
                setShowDeletedMessageRight(true)
            } else {
                setShowDeletedMessageLeft(true)
            }
        }
    };
    const copyText = (message: string) => {
        navigator.clipboard.writeText(message)
            .then(() => {
                antdMessage.config({
                    top: 120,
                });
                antdMessage.success("Скопировано в буфер!");
            })
            .catch(() => {
                antdMessage.config({
                    top: 120,
                });
                antdMessage.error("Не удалось скопировать :(");
            });
    };
    const repostMsg = () => {
        console.log("Переслать сообщение");
    };
    const pinMsg = () => {
        console.log("Закрепить сообщение");
    };
    const reaction = () => {
        console.log("Добавить реакцию");
    };

    return (
        <>
            <div ref={itemRef}
                className={`
                    ${classes.messageItem}
                    ${showDeletedMessageRight && userId === senderId ? classes.messageItemDeleteRight : ''}
                    ${showDeletedMessageLeft && userId !== senderId ? classes.messageItemDeleteLeft : ''}
                    ${userId !== senderId && !read ? classes.noRead : ''}
                `}
            >
                <div className={classes.wrapMessage}>
                    <div className={`
                        ${userId === senderId ? classes.messagRight : classes.messagLeft}
                        ${isLastFromSender && userId !== senderId ? classes.withTail : ''}
                    `}>
                        <div className={classes.textBlock}>
                            <p>{message}</p>
                        </div>
                        {userId === senderId
                            ?
                            <div className={classes.footer}>
                                {/* <span className={classes.edited}>Изменено в </span> */}
                                {sendingMessages.includes(localId) || updatingMessages.includes(msgId)
                                    ?
                                    <LoadingOutlined className={classes.svg} /> //<IoCheckmarkSharp className={classes.svg} /> //<IoCheckmark className={classes.svg}/> //<BsCheck className={classes.svg} />
                                    :
                                    <>
                                        <span className={classes.timestamp}>{formatTimeOfPublication(createdAt)}</span>
                                        <IoCheckmarkDoneSharp className={`${read ? classes.statusIcon : classes.delivered}`} />
                                    </>
                                }
                            </div>
                            :
                            <div className={classes.footer}>
                                <span className={classes.timestamp}>{formatTimeOfPublication(createdAt)}</span>
                            </div>
                        }

                        {isLastFromSender && userId !== senderId
                            ? <div className={classes.tailLeft}>
                                <div className={classes.bacgroundBorder}></div>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"

                                >
                                    <g transform="scale(-1,1) translate(-20,0)">
                                        <path
                                            d="M0,20 C0,10 10,10 10,0 L0,0 Z"
                                            fill="#252525"
                                            stroke="#606060"
                                            strokeWidth="1"
                                        />
                                    </g>
                                </svg>
                            </div>
                            :
                            <></>
                        }
                        {isLastFromSender && userId === senderId
                            ?
                            <div className={classes.tailRight}>
                                <div className={classes.bacgroundBorder}></div>
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g transform="scale(-1,-1) translate(-20,-20)">
                                        <path
                                            d="M0,20 C0,10 10,10 10,0 L0,0 Z"
                                            fill="#383838"
                                            stroke="#606060"
                                            strokeWidth="1"
                                        />
                                    </g>
                                </svg>
                            </div>
                            : <></>
                        }
                        <div className={`${classes.menuButton}
                            ${isLastFromSender ? classes.menuButtonWithTail : ''}
                        `}>
                            <Tooltip destroyTooltipOnHide title="Удалить">
                                <span className={classes.iconWrapper} onClick={() => setOpenDeleteModalMessage(true)}>
                                    <RiDeleteBin6Line className={`${classes.icon} ${classes.iconNormal}`} />
                                    <RiDeleteBin6Fill className={`${classes.icon} ${classes.iconHover}`} />
                                </span>
                            </Tooltip>
                            {
                                userId === senderId
                                    ?
                                    <Tooltip destroyTooltipOnHide title="Редактировать">
                                        <span className={classes.iconWrapper} onClick={() => edit(message)}>
                                            <BsPencil className={`${classes.icon} ${classes.iconNormal}`} />
                                            <BsPencilFill className={`${classes.icon} ${classes.iconHover}`} />
                                        </span>
                                    </Tooltip>
                                    :
                                    <></>
                            }

                            <Tooltip destroyTooltipOnHide title="Скопировать текст">
                                <span className={classes.iconWrapper} onClick={() => copyText(message)}>
                                    <RiFileCopyLine className={`${classes.icon} ${classes.iconNormal}`} />
                                    <RiFileCopyFill className={`${classes.icon} ${classes.iconHover}`} />
                                </span>
                            </Tooltip>
                            <Tooltip destroyTooltipOnHide title="Переслать сообщение">
                                <span className={classes.iconWrapper} onClick={repostMsg}>
                                    <RiShareForwardLine className={`${classes.icon} ${classes.iconNormal}`} />
                                    <RiShareForwardFill className={`${classes.icon} ${classes.iconHover}`} />
                                </span>
                            </Tooltip>
                            <Tooltip destroyTooltipOnHide title="Закрепить">
                                <span className={classes.iconWrapper} onClick={pinMsg}>
                                    <BsPin className={`${classes.icon} ${classes.iconNormal}`} />
                                    <BsPinFill className={`${classes.icon} ${classes.iconHover}`} />
                                </span>
                            </Tooltip>
                            <Tooltip destroyTooltipOnHide title="Оставить эмоцию">
                                <span className={classes.iconWrapper} onClick={reaction}>
                                    <BsEmojiSmile className={`${classes.icon} ${classes.iconNormal}`} />
                                    <BsEmojiSmileFill className={`${classes.icon} ${classes.iconHover}`} />
                                </span>
                            </Tooltip>
                        </div>
                    </div>
                </div>
                <div className={classes.wrapImg}>
                    {isLastFromSender && userId !== senderId && avatar && (
                        <img
                            className={classes.imgLeft}
                            src={avatar !== null ? `${API_URL}/` + avatar : defaultUserAvatar}
                            alt="ava"
                        />
                    )}
                </div>
            </div>
            <ModalWindow modalActive={openModalMessage} setModalActive={setOpenModalMessage} isSetModal={0}>
                <MessageFormModal
                    textMessage={textMessage}
                    setTextMessage={setTextMessage}
                    addUpdateMessage={addEdit}
                    setModalActive={setOpenModalMessage}
                />
            </ModalWindow>
            <ModalWindow modalActive={openModalDeleteMessage} setModalActive={setOpenDeleteModalMessage} isSetModal={0}>
                <DeleteMessageModal
                    userId={userId}
                    senderId={senderId}
                    deleteOption={deleteOption}
                    setDeleteOption={setDeleteOption}
                    setOpenDeleteModalMessage={setOpenDeleteModalMessage}
                    deleteMsg={deleteMsg}
                />
            </ModalWindow>
        </>
    )
}
export default MessageItemDialog;