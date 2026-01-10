import React, { useEffect, useRef, useState } from "react";
import MessageItemDialog from "./MessageItemDialog/messageItemDialog";
import SendMessageForm from "./SendMessageForm/sendMessageForm";
import HeaderMessagesList from "./HeaderMessagesList/headerMessagesList";
import { AudioOutlined, PaperClipOutlined, SendOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { getDialogMessagesAC, sendMessageAC } from "@packages/shared/src/store/MessagesReducers/messagesSlice";
import { useParams } from "react-router-dom";
import { FaRegSmile } from "react-icons/fa";
import { formatDayLabel, formatYearLabel } from "@packages/shared/src/components/utils/timeOfPublication";
import routeMain from "./routes";
import classes from './styles.module.scss'

const Dialog: React.FC = React.memo(() => {
    const dispatch = useAppDispatch()
    const { messages, interlocutors, currentInterlocutor, isSending, deletingMessages, sendingMessages, updatingMessages } = useAppSelector(state => state.messagesPage)
    const { isAuth, authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage)
    const messagesAnchorRef = useRef<HTMLDivElement>(null)
    const newMessageAnchorRef = useRef<HTMLDivElement | null>(null)
    const [isAutoScroll, setIsAutoScroll] = useState(false)
    const [addMessageText, setAddMessageText] = useState('');
    const { dialogId } = useParams();
    const renderItems: JSX.Element[] = [];
    let isNewMessageInserted = true

    // console.log('isNewMessageInserted: - ', isNewMessageInserted)
    // console.log('Dialog - currentInterlocutor', currentInterlocutor)

    const recipient = interlocutors.find(i => i.chat.dialogId === Number(dialogId));

    useEffect(() => {
        const isNewMsg = messages.find(m => m.read === false && m.senderId !== authorizedUser.id);

        const timeoutId = setTimeout(() => {
            if (isNewMsg && newMessageAnchorRef.current) {
                newMessageAnchorRef.current.scrollIntoView({ behavior: 'auto' });
            } else if (messagesAnchorRef.current) {
                messagesAnchorRef.current.scrollIntoView({ behavior: 'auto' });
            }
        }, 0);

        return () => clearTimeout(timeoutId);
    }, [messages]);

    useEffect(() => {
        if (dialogId && recipient) {
            dispatch(getDialogMessagesAC(
                Number(dialogId),
                Number(authorizedUser.id),
                Number(recipient.userId)
            ))
        }
    }, [dialogId]);

    const addNewMessage = (messageText: string) => {
        const message = {
            message: messageText,
            senderId: Number(authorizedUser.id),
            receiverId: Number(recipient.userId),
            read: false,
            createdAt: new Date().toISOString(),
            replyToMessageId: null as number,
            attachments: null as [],
            localId: Date.now(),
        };

        dispatch(sendMessageAC(message));
        setAddMessageText('')
        // setIsAutoScroll(prev => !prev)
    };

    const scrollHandler = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const element = e.currentTarget;
        if (Math.abs((element.scrollHeight - element.scrollTop) - element.clientHeight) < 300) {
            !isAutoScroll && setIsAutoScroll(true)
        } else {
            isAutoScroll && setIsAutoScroll(false)
        }
    };

    for (let i = 0; i < messages.length; i++) {
        const currentMessage = messages[i];

        const currentDayLabel = formatDayLabel(currentMessage.createdAt);
        const currentYearLabel = formatYearLabel(currentMessage.createdAt);

        // Проверка на смену года
        if (i !== 0 && formatYearLabel(messages[i - 1].createdAt) !== currentYearLabel) {
            renderItems.push(
                <div key={`year-${i}`} className={classes.yearLabel}>
                    <span className={classes.systemMsg}>
                        {`${currentYearLabel} год`}
                    </span>
                </div>
            );
        }

        // Проверка на смену дня
        if (i !== 0 && formatDayLabel(messages[i - 1].createdAt) !== currentDayLabel) {
            renderItems.push(
                <div key={`day-${i}`} className={classes.dateLabel}>
                    <span className={classes.systemMsg}>
                        {currentDayLabel}
                    </span>
                </div>
            );
        }

        // Проверка на новые сообщения
        if (!messages[i].read && authorizedUser.id !== messages[i].senderId && isNewMessageInserted) {
            renderItems.push(
                <div key={`new-msg-${i}`} className={classes.dateLabel} ref={newMessageAnchorRef}>
                    <span className={classes.systemMsg}>
                        <span>
                            Новое сообщение
                        </span>
                    </span>
                </div>
            );
            isNewMessageInserted = false
        }

        renderItems.push(
            <MessageItemDialog
                key={currentMessage.localId || currentMessage.smsId || i}
                dispatch={dispatch}
                msgId={currentMessage.msgId}
                userId={Number(authorizedUser.id)}
                interlocutorId={(recipient.userId)}
                senderId={currentMessage.senderId}
                message={currentMessage.message}
                read={currentMessage.read}
                createdAt={currentMessage.createdAt}
                updatedAt={currentMessage.updatedAt}
                attachments={currentMessage.attachments}
                avatar={currentInterlocutor.avatar}
                messages={messages}
                isSending={isSending}
                localId={currentMessage.localId}
                sendingMessages={sendingMessages}
                updatingMessages={updatingMessages}
                deletingMessages={deletingMessages}
                index={i}
            />
        );
    };

    return (
        <>
            <HeaderMessagesList />
            <div className={classes.messagesClass}>
                <div className={classes.wrapMessages} onScroll={scrollHandler}>
                    {renderItems.length > 0
                        ? renderItems
                        :
                        <div className={classes.wrapStartMessages}>
                            <div className={classes.wrapBlockOfNoPosts}>
                                <div className={classes.blockOfNoPosts}>
                                    <h1><strong>Сообщений нет пока</strong></h1>
                                    <h2>Вы еще не переписывались с
                                        <strong className={classes.strongInterlocutor}>
                                            {' '}
                                            {currentInterlocutor.name}
                                            {' '}
                                            {currentInterlocutor.surname}
                                        </strong>
                                    </h2>
                                </div>
                            </div>
                        </div>
                    }
                    <div ref={messagesAnchorRef}></div>
                </div>

                {/* {!isAutoScroll && newMessageAnchorRef.current &&
                    <button onClick={() => newMessageAnchorRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                        Перейти к новым сообщениям
                    </button>
                } */}
            </div>
            <div className={classes.wrapInputAddMessage}>
                <div className={classes.wrapLeftBlockInputAddMessage}>
                    {/* <BsPaperclip className={classes.PaperClipOutlined}/> */}
                    <PaperClipOutlined className={classes.PaperClipOutlined} />
                </div>
                <div className={classes.wrapCentrBlockInputAddMessage}>
                    <SendMessageForm
                        message={addMessageText}
                        setMessage={setAddMessageText}
                        sendMessage={() => addNewMessage(addMessageText)}
                    />
                    <SendOutlined
                        onClick={() => addNewMessage(addMessageText)}
                        className={classes.SendOutlined}
                    />
                </div>
                <div className={classes.wrapRightBlockInputAddMessage}>
                    <FaRegSmile className={classes.FaRegSmile} />
                    <AudioOutlined className={classes.AudioOutlined} />
                </div>
            </div>
        </>
    )
})
export { routeMain };
export default Dialog;