import React from "react";
import classes from './styles.module.scss';
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { IUser } from "@packages/shared/src/types/IUser";
import { AiAssistantInterlocutor, ChatType, MsgAiAssistantType } from "@packages/shared/src/types/AiAssistantType";
import { formatDayLabel, formatYearLabel } from "@packages/shared/src/components/utils/timeOfPublication";
import AdminAiAssistantItemDialog from "../AI-AssistantMessageItemDialog/aiAssistantMessageItemDialog";

type PropsType = {
    dispatch: AppDispatch;
    authorizedUser: IUser
    assistantId: string;
    currentChat: ChatType;
    prompts: MsgAiAssistantType[];
    lastMessage: MsgAiAssistantType;
    currentInterlocutor: AiAssistantInterlocutor;
    isSending: boolean;
    sendingMessages: string[];
    updatingMessages: string[];
    deletingMessages: string[];
}

const MessagesList: React.FC<PropsType> = React.memo((props) => {
    const {
        dispatch, sendingMessages, authorizedUser, assistantId,
        currentChat, prompts, currentInterlocutor, lastMessage, isSending,
        updatingMessages, deletingMessages
    } = props;

    const renderItems: JSX.Element[] = [];

    // console.log('MessageContainer: - interlocutor & messages')

    if (prompts) {
        for (let i = 0; i < prompts.length; i++) {
            const currentMessage = prompts[i];
            // console.log('AdminAiAssistant - currentMessage', currentMessage)

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

            assistantId && renderItems.push(
                <AdminAiAssistantItemDialog
                    key={`${currentMessage.senderId}-${currentMessage.msgId || currentMessage.localId || i}`}
                    dispatch={dispatch}
                    localId={currentMessage.localId}
                    msgId={currentMessage.msgId}
                    userId={authorizedUser.id}
                    interlocutorId={assistantId}
                    currentChat={currentChat}
                    senderId={currentMessage.senderId}
                    message={currentMessage.prompt}
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

    return renderItems.length > 0
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
});
export default MessagesList