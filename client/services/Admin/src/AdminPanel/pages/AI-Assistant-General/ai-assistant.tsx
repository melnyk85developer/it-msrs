import React, { useEffect, useRef, useState } from "react"
import { FaRegSmile } from "react-icons/fa";
import { useAppSelector } from "../../../../../../packages/shared/src/components/hooks/redux";
import { AudioOutlined, PaperClipOutlined, SendOutlined } from "@ant-design/icons";
import { AiAssistantInterlocutor, ChatType, MsgAiAssistantType } from '../../../../../../packages/shared/src/types/AiAssistantType'
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { IUser } from "@packages/shared/src/types/IUser";
import HeaderMessagesList from "./HeaderMessagesList/headerMessagesList";
import SendMessageForm from "./SendMessageForm/sendMessageForm";
import { getDialogAiAssistantMessagesAC } from "@packages/shared/src/store/MyAdminReducers/myAiAssistantAdminSlice";
import routeMain from "./routes";
import classes from './styles.module.scss';
import MessagesList from "./MessagesList/MessagesList";
import { useNavigate } from "react-router-dom";

type PropsType = {
    dispatch: AppDispatch;
    addNewPrompt: (messageText: string) => void
    setAddMessageText: React.Dispatch<React.SetStateAction<string>>
    addMessageText: string;
    authorizedUser: IUser
    assistantId: string;
    prompts: MsgAiAssistantType[];
    currentChat: ChatType;
    lastMessage: MsgAiAssistantType;
    currentInterlocutor: AiAssistantInterlocutor;
    isSending: boolean;
    sendingMessages: string[];
    totalAiAssistantMessageCount: number
    updatingMessages: string[];
    deletingMessages: string[];
}

type ScrollAnchorType = {
    messageId: string;
    offsetTop: number;
}

const PAGE_SIZE = 20;
const WINDOW_SIZE = 40;

const AdminAiAssistant: React.FC<PropsType> = React.memo((props) => {
    const {
        dispatch, addNewPrompt, setAddMessageText, sendingMessages, authorizedUser,
        assistantId, prompts, currentInterlocutor, currentChat, lastMessage, isSending,
        totalAiAssistantMessageCount, updatingMessages, deletingMessages, addMessageText
    } = props;

    const navigate = useNavigate();
    const { isDarkTheme } = useAppSelector(state => state.authPage);
    const messagesAnchorRef = useRef<HTMLDivElement>(null);
    const fetchingRef = useRef(false);
    const windowStartRef = useRef(0);
    const isWindowInitializedRef = useRef(false);
    const [isAutoScroll, setIsAutoScroll] = useState(false);

    // console.log('AdminAiAssistant - currentInterlocutor', currentInterlocutor)
    // console.log('AdminAiAssistant - assistantId', assistantId)
    // console.log('AdminAiAssistant - dialogId', currentChat?.dialogId)
    // console.log('AdminAiAssistant - prompts.length', prompts.length)

    const getInitialWindowStart = () => Math.max(totalAiAssistantMessageCount - Math.min(PAGE_SIZE, totalAiAssistantMessageCount), 0);
    const getMaxWindowStart = () => Math.max(totalAiAssistantMessageCount - Math.min(WINDOW_SIZE, totalAiAssistantMessageCount), 0);

    const getPageNumberForMessageIndex = (messageIndex: number) => {
        if (totalAiAssistantMessageCount <= 0) {
            return 1;
        }

        const boundedIndex = Math.min(Math.max(messageIndex, 0), totalAiAssistantMessageCount - 1);
        const reverseIndex = totalAiAssistantMessageCount - 1 - boundedIndex;

        return Math.floor(reverseIndex / PAGE_SIZE) + 1;
    };
    const getScrollAnchor = (container: HTMLDivElement): ScrollAnchorType | null => {
        const messageElements = Array.from(container.querySelectorAll<HTMLElement>('[data-ai-message-id]'));
        const currentScrollTop = container.scrollTop;

        for (const element of messageElements) {
            const elementTop = element.offsetTop;
            const elementBottom = elementTop + element.offsetHeight;
            const messageId = element.dataset.aiMessageId;

            if (elementBottom > currentScrollTop && messageId) {
                return {
                    messageId,
                    offsetTop: elementTop - currentScrollTop,
                };
            }
        }

        return null;
    };
    const restoreScrollAnchor = (container: HTMLDivElement, anchor: ScrollAnchorType | null, fallbackBottomGap: number) => {
        if (!anchor) {
            container.scrollTop = Math.max(0, container.scrollHeight - container.clientHeight - fallbackBottomGap);
            return;
        }

        const messageElements = Array.from(container.querySelectorAll<HTMLElement>('[data-ai-message-id]'));
        const anchorElement = messageElements.find(element => element.dataset.aiMessageId === anchor.messageId);

        if (!anchorElement) {
            container.scrollTop = Math.max(0, container.scrollHeight - container.clientHeight - fallbackBottomGap);
            return;
        }

        container.scrollTop = Math.max(0, anchorElement.offsetTop - anchor.offsetTop);
    };

    useEffect(() => {
        messagesAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [lastMessage]);

    useEffect(() => {
        fetchingRef.current = false;
        windowStartRef.current = 0;
        isWindowInitializedRef.current = false;
        messagesAnchorRef.current?.scrollIntoView({ behavior: 'auto' });

        if (assistantId) {
            dispatch(getDialogAiAssistantMessagesAC(assistantId, {
                pageSize: PAGE_SIZE,
                pageNumber: 1
            }, 'init'));
            if (currentChat && currentChat.dialogId) {
                navigate(`/admin/ai-assistant/${assistantId}/dialog/${currentChat.dialogId}`, {
                    replace: true
                });
            }
        }

    }, [assistantId, currentChat?.dialogId]);

    useEffect(() => {
        if (!assistantId || isWindowInitializedRef.current) return;
        if (prompts.length === 0 && totalAiAssistantMessageCount === 0) return;

        windowStartRef.current = getInitialWindowStart();
        isWindowInitializedRef.current = true;

        requestAnimationFrame(() => {
            messagesAnchorRef.current?.scrollIntoView({ behavior: 'auto' });
        });
    }, [assistantId, prompts.length, totalAiAssistantMessageCount]);

    const scrollHandler = (e: React.UIEvent<HTMLDivElement>) => {
        const el = e.currentTarget;

        const AUTO_SCROLL_THRESHOLD = 100;
        const LOAD_THRESHOLD = 20;

        const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < AUTO_SCROLL_THRESHOLD;
        const isNearBottomForLoad = el.scrollHeight - el.scrollTop - el.clientHeight < LOAD_THRESHOLD;

        const currentWindowStart = windowStartRef.current;
        const currentWindowEnd = currentWindowStart + prompts.length;

        if (isAutoScroll !== isAtBottom) {
            setIsAutoScroll(isAtBottom);
        }

        if (fetchingRef.current) return;

        // 🔼 ВВЕРХ
        if (el.scrollTop < 50 && currentWindowStart > 0) {
            const nextWindowStart = Math.max(currentWindowStart - PAGE_SIZE, 0);
            const nextOlderPage = getPageNumberForMessageIndex(nextWindowStart);

            const scrollAnchor = getScrollAnchor(el);

            fetchingRef.current = true;

            dispatch(getDialogAiAssistantMessagesAC(assistantId, {
                pageSize: PAGE_SIZE,
                pageNumber: nextOlderPage
            }, 'older'))
                .then(() => {
                    windowStartRef.current = nextWindowStart;

                    requestAnimationFrame(() => {
                        restoreScrollAnchor(el, scrollAnchor, 0);
                        fetchingRef.current = false;
                    });
                })
                .catch(() => {
                    fetchingRef.current = false;
                });

            return;
        }

        // 🔽 ВНИЗ
        if (isNearBottomForLoad && currentWindowEnd < totalAiAssistantMessageCount) {
            const nextWindowStart = Math.min(currentWindowStart + PAGE_SIZE, getMaxWindowStart());
            const nextWindowEnd = Math.min(
                nextWindowStart + Math.min(WINDOW_SIZE, totalAiAssistantMessageCount),
                totalAiAssistantMessageCount
            );

            const nextNewerPage = getPageNumberForMessageIndex(nextWindowEnd - 1);

            const prevBottomGap = el.scrollHeight - el.scrollTop - el.clientHeight;
            const scrollAnchor = getScrollAnchor(el);

            fetchingRef.current = true;

            dispatch(getDialogAiAssistantMessagesAC(assistantId, {
                pageSize: PAGE_SIZE,
                pageNumber: nextNewerPage
            }, 'newer'))
                .then(() => {
                    windowStartRef.current = nextWindowStart;

                    requestAnimationFrame(() => {
                        restoreScrollAnchor(el, scrollAnchor, prevBottomGap);
                        fetchingRef.current = false;
                    });
                })
                .catch(() => {
                    fetchingRef.current = false;
                });
        }
    };

    return (
        <div className={`${classes.wrapContentAiAssistantAdmin} ${isDarkTheme !== "light" ? classes.dark : classes.light}`}>
            <div className={classes.aiAssistantContent}>
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
                                        </div>
                                    </div>
                                </div>
                                :
                                <MessagesList
                                    dispatch={dispatch}
                                    authorizedUser={authorizedUser}
                                    assistantId={assistantId}
                                    currentChat={currentChat}
                                    lastMessage={lastMessage}
                                    prompts={prompts}
                                    currentInterlocutor={currentInterlocutor}
                                    isSending={isSending}
                                    sendingMessages={sendingMessages}
                                    updatingMessages={updatingMessages}
                                    deletingMessages={deletingMessages}
                                />
                        }
                        <div ref={messagesAnchorRef}></div>
                    </div>
                </div>
            </div>
            <div className={classes.wrapInputAddMessage}>
                <div className={classes.inputAddMessage}>
                    <div className={classes.wrapLeftBlockInputAddMessage}>
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
