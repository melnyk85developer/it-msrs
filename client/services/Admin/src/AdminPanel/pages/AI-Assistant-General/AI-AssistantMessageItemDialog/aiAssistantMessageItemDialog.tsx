import React, { useEffect, useRef, useState } from "react";
import { message as antdMessage } from 'antd';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Tooltip } from "antd";
import rehypeHighlight from 'rehype-highlight';
import defaultUserAvatar from "../../../../../../../packages/shared/src/assets/fonAvatars.png"
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";
import { formatTimeOfPublication } from "@packages/shared/src/components/utils/timeOfPublication";
import { RiDeleteBin6Fill, RiDeleteBin6Line, RiFileCopyFill, RiFileCopyLine, RiShareForwardFill, RiShareForwardLine } from "react-icons/ri";
import { BsEmojiSmile, BsEmojiSmileFill, BsPencil, BsPencilFill, BsPin, BsPinFill } from "react-icons/bs";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import ModalWindow from "@packages/shared/src/components/ModalWindows";
import MessageFormModal from "../ModalContentMsg/messageFormModal";
import DeleteMessageModal from "../ModalContentMsg/deleteMessageModal/deleteMessageModal";
import { API_URL } from "@packages/shared/src/http";
import { ChatType, MsgAiAssistantType } from "@packages/shared/src/types/AiAssistantType";
import 'highlight.js/styles/github-dark.css'; // Тема для кода
import classes from './styles.module.scss'
import { clearAiAssistantMessageStateAC, deleteAiAssistantMessageAC, updateAiAssistantMessageAC } from "@packages/shared/src/store/MyAdminReducers/myAiAssistantAdminSlice";

type PropsType = {
    dispatch: AppDispatch;
    msgId: string;
    userId: string;
    interlocutorId: string;
    currentChat: ChatType;
    senderId: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    messages: MsgAiAssistantType[];
    attachments: any[];
    avatar: string;
    isSending: boolean;
    sendingMessages: string[];
    updatingMessages: string[];
    deletingMessages: string[];
    localId: string;
    index: number;
}
const AdminAiAssistantItemDialog: React.FC<PropsType> = (props) => {
    const {
        dispatch, localId, msgId, userId, senderId, interlocutorId,
        currentChat, messages, message, avatar, index, createdAt,
        updatedAt, sendingMessages, updatingMessages
    } = props

    // console.log('AdminAiAssistantItemDialog: - message', message)

    const nextMsg = messages[index + 1];
    const isLastFromSender = !nextMsg || nextMsg.senderId !== senderId;
    const [showDeletedMessageLeft, setShowDeletedMessageLeft] = useState<boolean>(false);
    const [showDeletedMessageRight, setShowDeletedMessageRight] = useState<boolean>(false);
    const [textMessage, setTextMessage] = useState<string>(message);
    const [openModalMessage, setOpenModalMessage] = useState<boolean>(false);
    const [openModalDeleteMessage, setOpenDeleteModalMessage] = useState<boolean>(false);
    const [deleteOption, setDeleteOption] = useState<"me" | "all">("me");

    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (showDeletedMessageLeft) {
            setOpenDeleteModalMessage(false)
            const timer = setTimeout(() => {
                dispatch(clearAiAssistantMessageStateAC(msgId));
                setShowDeletedMessageLeft(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
        if (showDeletedMessageRight) {
            setOpenDeleteModalMessage(false)
            const timer = setTimeout(() => {
                dispatch(clearAiAssistantMessageStateAC(msgId));
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
            prompt: messageText,
            senderId: userId,
            receiverId: interlocutorId,
            dialogId: currentChat?.dialogId,
            createdAt: createdAt,
            attachments: [] as any[],
        };
        const oldMsg = messages.filter(m => m.msgId === msgId)
        dispatch(updateAiAssistantMessageAC(newMsg, oldMsg))
        setTextMessage('')
        setOpenModalMessage(false)
    };

    const deleteMsg = async () => {
        const status = await dispatch(deleteAiAssistantMessageAC(msgId, deleteOption))
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

    return (
        <>
            <div ref={itemRef}
                data-ai-message-id={msgId || localId}
                className={`
                    ${classes.messageItem}
                    ${showDeletedMessageRight && userId === senderId ? classes.messageItemDeleteRight : ''}
                    ${showDeletedMessageLeft && userId !== senderId ? classes.messageItemDeleteLeft : ''}
                `}
            >
                <div className={classes.wrapMessage}>
                    <div className={`
                        ${userId === senderId ? classes.messagRight : classes.messagLeft}
                        ${isLastFromSender && userId !== senderId ? classes.withTail : ''}
                    `}>
                        <div className={classes.textBlock}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeHighlight]}
                                components={{
                                    // Добавь этот блок:
                                    p: ({ node, ...props }) => <div {...props} />,

                                    code(props: any) {
                                        const { inline, children, ...rest } = props;
                                        const codeText = String(children).replace(/\n$/, '');

                                        if (inline) {
                                            return <code {...rest}>{children}</code>;
                                        }

                                        const copy = () => {
                                            navigator.clipboard.writeText(codeText);
                                        };

                                        return (
                                            <div className={classes.codeBlockWrapper}>
                                                <button
                                                    type="button"
                                                    className={classes.copyBtn}
                                                    onClick={copy}
                                                >
                                                    Copy
                                                </button>
                                                <pre>
                                                    <code {...rest}>{children}</code>
                                                </pre>
                                            </div>
                                        );
                                    }
                                }}
                            >
                                {message}
                            </ReactMarkdown>
                        </div>
                        {
                            userId === senderId
                                ?
                                <div className={classes.footer}>
                                    {/* <span className={classes.edited}>Изменено в </span> */}
                                    {sendingMessages.includes(localId) || updatingMessages.includes(msgId)
                                        ?
                                        <LoadingOutlined className={classes.svg} /> //<IoCheckmarkSharp className={classes.svg} /> //<IoCheckmark className={classes.svg}/> //<BsCheck className={classes.svg} />
                                        :
                                        <>
                                            <span className={classes.timestamp}>{formatTimeOfPublication(createdAt)}</span>
                                            {/* <IoCheckmarkDoneSharp className={`${read ? classes.statusIcon : classes.delivered}`} /> */}
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
                                            fill="#282828"
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
                                            fill="#202020"
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
export default AdminAiAssistantItemDialog;