import React, { useEffect, useState } from "react"
import AdminAiAssistant from "./ai-assistant";
import { useOutletContext, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { getAiProvidersAndModelsAC, getDialogAiAssistantMessagesAC, sendNewPromptAC } from "@packages/shared/src/store/MyAdminReducers/myAiAssistantAdminSlice";
import routeMain from './routes'

const AdminAiAssistantContainer: React.FC = React.memo(() => {
    const dispatch = useAppDispatch();
    const { authorizedUser } = useAppSelector(state => state.authPage);
    const { typePage, setTypePage } = useOutletContext<any>();
    const {
        prompts,
        currentChat,
        lastMessage,
        currentInterlocutor,
        isSending,
        totalAiAssistantMessageCount,
        deletingMessages,
        sendingMessages,
        updatingMessages
    } = useAppSelector(state => state.adminAdminAiAssistantPage);
    const { userId } = useParams<string>();
    const [selectedAIProvider, setSelectedAIProvider] = useState('');
    const [selectedAIModel, setSelectedAIModel] = useState('');
    const [addMessageText, setAddMessageText] = useState('');

    const assistantId = userId

    console.log('AdminAiAssistant - selectedAIProvider', selectedAIProvider)
    console.log('AdminAiAssistant - selectedAIModel', selectedAIModel)
    // console.log('AdminAiAssistant - assistantId', assistantId)
    // console.log('AdminAiAssistant - prompts', prompts)
    // console.log('AdminAiAssistant - currentInterlocutor', currentInterlocutor)

    useEffect(() => {
        if (typePage === 'BIG') {
            setTypePage('SMALL')
        }
    }, []);

    const addNewPrompt = (messageText: string) => {
        const prompt = {
            localId: String(Date.now()),
            prompt: messageText,
            senderId: authorizedUser.id,
            receiverId: assistantId,
            dialogId: currentChat?.dialogId,
            provider: selectedAIProvider,
            model: selectedAIModel,
            createdAt: new Date().toISOString(),
            attachments: [] as any[],
        };
        dispatch(sendNewPromptAC(prompt));
        setAddMessageText('')
    };

    return (
        <AdminAiAssistant
            dispatch={dispatch}
            selectedAIProvider={selectedAIProvider}
            setSelectedAIProvider={setSelectedAIProvider}
            selectedAIModel={selectedAIModel}
            setSelectedAIModel={setSelectedAIModel}
            addNewPrompt={addNewPrompt}
            setAddMessageText={setAddMessageText}
            addMessageText={addMessageText}
            authorizedUser={authorizedUser}
            assistantId={assistantId}
            prompts={prompts}
            currentChat={currentChat}
            lastMessage={lastMessage}
            currentInterlocutor={currentInterlocutor}
            isSending={isSending}
            totalAiAssistantMessageCount={totalAiAssistantMessageCount}
            sendingMessages={sendingMessages}
            updatingMessages={updatingMessages}
            deletingMessages={deletingMessages}
        />
    )
})
export { routeMain };
export default AdminAiAssistantContainer