import React, { useEffect, useRef, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../../../../packages/shared/src/components/hooks/redux";
import { AudioOutlined, PaperClipOutlined, SendOutlined } from "@ant-design/icons";
import { FaRegSmile } from "react-icons/fa";
import { Navigate, useParams, useOutletContext } from "react-router-dom";
import { getDialogMessagesAC, sendMessageAC } from "../../../../../../packages/shared/src/store/MessagesReducers/messagesSlice";
import { formatDayLabel, formatYearLabel } from "../../../../../../packages/shared/src/components/utils/timeOfPublication";
import HeaderMessagesList from "./HeaderMessagesList/headerMessagesList";
import SendMessageForm from "./SendMessageForm/sendMessageForm";
import AdminAiAssistantItemDialog from "./AI-AssistantMessageItemDialog/aiAssistantMessageItemDialog";
import { getDialogAiAssistantMessagesAC, sendNewPromptAC } from "../../../../../../packages/shared/src/store/MyAdminReducers/myAiAssistantAdminSlice";
import classes from './styles.module.scss';
import routeMain from "./routes";

const AdminAiAssistant: React.FC = React.memo(() => {
    const dispatch = useAppDispatch();
    const { typePage, setTypePage } = useOutletContext<any>();
    const { authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage);
    const {
        prompts,
        currentChat,
        lastMessage,
        currentInterlocutor,
        isSending,
        deletingMessages,
        sendingMessages,
        updatingMessages
    } = useAppSelector(state => state.adminAdminAiAssistantPage);

    // console.log('AdminAiAssistant - typePage', typePage)
    console.log('AdminAiAssistant - prompts', prompts)

    const messagesAnchorRef = useRef<HTMLDivElement>(null)
    const newMessageAnchorRef = useRef<HTMLDivElement | null>(null)
    const [isAutoScroll, setIsAutoScroll] = useState(false)
    const [addMessageText, setAddMessageText] = useState('');
    const { userId } = useParams();
    const renderItems: JSX.Element[] = [];

    console.log('AdminAiAssistant - userId', userId)
    // console.log('AdminAiAssistant - dialogId', currentChat?.dialogId)
    // console.log('AdminAiAssistant - currentInterlocutor', currentInterlocutor)

    useEffect(() => {
        if (typePage === 'BIG') {
            setTypePage('SMALL')
        }
        dispatch(getDialogAiAssistantMessagesAC(userId))
    }, [userId, lastMessage]);

    // const msgs = prompts.find(i => i.chat.dialogId === currentChat.dialogId);
    // const recipient = interlocutors.find(i => i.chat.dialogId === dialogId);
    // console.log('Dialog - recipient', recipient)

    const addNewPrompt = (messageText: string) => {

        if (currentChat && currentChat.dialogId) {
            const prompt = {
                localId: String(Date.now()),
                prompt: messageText,
                senderId: authorizedUser.id,
                receiverId: userId,
                dialogId: currentChat?.dialogId,
                createdAt: new Date().toISOString(),
                // attachments: null as [],
            };
            dispatch(sendNewPromptAC(prompt));
        } else {
            const prompt = {
                localId: String(Date.now()),
                prompt: messageText,
                senderId: authorizedUser.id,
                receiverId: userId,
                createdAt: new Date().toISOString(),
                // attachments: null as [],
            };
            dispatch(sendNewPromptAC(prompt));
        }
        setAddMessageText('')
    };

    const scrollHandler = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const element = e.currentTarget;
        if (Math.abs((element.scrollHeight - element.scrollTop) - element.clientHeight) < 300) {
            !isAutoScroll && setIsAutoScroll(true)
        } else {
            isAutoScroll && setIsAutoScroll(false)
        }
    };

    if (prompts) {
        for (let i = 0; i < prompts.length; i++) {
            const currentMessage = prompts[i];
            // console.log('AdminAiAssistant - prompts[i]', prompts[i])

            const currentDayLabel = formatDayLabel(currentMessage.createdAt);
            const currentYearLabel = formatYearLabel(currentMessage.createdAt);

            // Проверка на смену года
            if (i !== 0 && formatYearLabel(prompts[i - 1].createdAt) !== currentYearLabel) {
                renderItems.push(
                    <div key={`year-${i}`} className={classes.yearLabel}>
                        <span className={classes.systemMsg}>
                            {`${currentYearLabel} год`}
                        </span>
                    </div>
                );
            }

            // Проверка на смену дня
            if (i !== 0 && formatDayLabel(prompts[i - 1].createdAt) !== currentDayLabel) {
                renderItems.push(
                    <div key={`day-${i}`} className={classes.dateLabel}>
                        <span className={classes.systemMsg}>
                            {currentDayLabel}
                        </span>
                    </div>
                );
            }

            userId && renderItems.push(
                <AdminAiAssistantItemDialog
                    key={currentMessage.localId || currentMessage.smsId || i}
                    dispatch={dispatch}
                    localId={currentMessage.localId}
                    msgId={currentMessage.msgId}
                    userId={authorizedUser.id}
                    interlocutorId={userId}
                    senderId={currentMessage.senderId}
                    message={currentMessage.message}
                    createdAt={currentMessage.createdAt}
                    updatedAt={currentMessage.updatedAt}
                    attachments={currentMessage.attachments}
                    avatar={currentInterlocutor.avatar}
                    messages={prompts}
                    isSending={isSending}
                    sendingMessages={sendingMessages}
                    updatingMessages={updatingMessages}
                    deletingMessages={deletingMessages}
                    index={i}
                />
            );
        };
    }

    return (
        <div className={`${classes.wrapAdminContent} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <div className={classes.adminContent}>
                {/* <span className={classes.title}>GPTermikAI General Admin Bot</span> */}
                <HeaderMessagesList title={currentInterlocutor?.name} />
                <div className={classes.messagesClass}>
                    <div className={classes.wrapMessages} onScroll={scrollHandler}>
                        {
                            !currentChat && !currentChat?.dialogId || currentChat.dialogId === undefined
                                ?
                                <div className={classes.wrapStartMessages}>
                                    <div className={classes.wrapBlockOfNoPosts}>
                                        <div className={classes.blockOfNoPosts}>
                                            <h1><strong>Чат переписки отсутствует в базе данных!</strong></h1>
                                            <h2>Вы еще не писали промптов: GPTermikAI General Admin Bot
                                                <strong className={classes.strongInterlocutor}>
                                                    {' '}
                                                    {currentInterlocutor?.name}
                                                </strong>
                                            </h2>
                                            {/* <Navigate to={"/admin/ai-assistant/orchestrate"} /> */}
                                        </div>
                                    </div>
                                </div>
                                :
                                renderItems.length > 0
                                    ? renderItems
                                    :
                                    <div className={classes.wrapStartMessages}>
                                        <div className={classes.wrapBlockOfNoPosts}>
                                            <div className={classes.blockOfNoPosts}>
                                                <h1><strong>Чат переписки очищен, контекстное окно свободно!</strong></h1>
                                                <h2>Весь контекст пленума моделей операется только на базу данных - пока нет переписки с добавлением контекста.
                                                    <strong className={classes.strongInterlocutor}>
                                                        {' '}
                                                        {currentInterlocutor.name}
                                                    </strong>
                                                </h2>
                                            </div>
                                        </div>
                                    </div>

                        }
                        <div ref={messagesAnchorRef}></div>
                    </div>
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
                            sendMessage={() => addNewPrompt(addMessageText)}
                        />
                        <SendOutlined
                            onClick={() => addNewPrompt(addMessageText)}
                            className={classes.SendOutlined}
                        />
                    </div>
                    <div className={classes.wrapRightBlockInputAddMessage}>
                        <FaRegSmile className={classes.FaRegSmile} />
                        <AudioOutlined className={classes.AudioOutlined} />
                    </div>
                </div>
            </div>
        </div>
    )
})
export { routeMain };
export default AdminAiAssistant