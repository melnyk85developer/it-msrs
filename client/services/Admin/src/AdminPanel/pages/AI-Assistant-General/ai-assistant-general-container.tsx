import React, { useEffect, useState } from "react"
import AdminAiAssistant from "./ai-assistant";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { getAiProvidersAndModelsAC, getDialogAiAssistantMessagesAC, sendNewPromptAC } from "@packages/shared/src/store/MyAdminReducers/myAiAssistantAdminSlice";
import routeMain from './routes'

const PAGE_SIZE = 20;
const WINDOW_SIZE = 40;

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
    const [selectedPrimaryAIProvider, setSelectedPrimaryAIProvider] = useState('google');
    const [selectedPrimaryAIModel, setSelectedPrimaryAIModel] = useState('');
    const [selectedFallbackAIProvider, setSelectedFallbackAIProvider] = useState('ollama');
    const [selectedFallbackAIModel, setSelectedFallbackAIModel] = useState('');
    const [addMessageText, setAddMessageText] = useState('');
    const { userId } = useParams<string>();
    const navigate = useNavigate();

    const assistantId = userId

    // console.log('AdminAiAssistant - selectedAIProvider', selectedAIProvider)
    // console.log('AdminAiAssistant - selectedAIModel', selectedAIModel)
    // console.log('AdminAiAssistant - assistantId', assistantId)
    // console.log('AdminAiAssistant - prompts', prompts)
    // console.log('AdminAiAssistant - currentInterlocutor', currentInterlocutor)

    useEffect(() => {
        if (typePage === 'BIG') {
            setTypePage('SMALL')
        }
    }, []);

    useEffect(() => {
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
            else {
                navigate(`/admin/ai-assistant/${assistantId}`, {
                    replace: true
                });
            }
        }

    }, [assistantId, currentChat?.dialogId]);

    const addNewPrompt = (messageText: string) => {
        // console.trace('addNewPrompt_CALLED');
        const prompt = {
            localId: String(Date.now()),
            prompt: messageText,
            senderId: authorizedUser.id,
            receiverId: assistantId,
            dialogId: currentChat?.dialogId,
            createdAt: new Date().toISOString(),
            attachments: [] as any[],
        };
        dispatch(sendNewPromptAC(prompt));
        setAddMessageText('')
    };

    return (
        <AdminAiAssistant
            dispatch={dispatch}
            selectedPrimaryAIProvider={selectedPrimaryAIProvider}
            setSelectedPrimaryAIProvider={setSelectedPrimaryAIProvider}
            selectedPrimaryAIModel={selectedPrimaryAIModel}
            setSelectedPrimaryAIModel={setSelectedPrimaryAIModel}

            selectedFallbackAIProvider={selectedFallbackAIProvider}
            setSelectedFallbackAIProvider={setSelectedFallbackAIProvider}
            selectedFallbackAIModel={selectedFallbackAIModel}
            setSelectedFallbackAIModel={setSelectedFallbackAIModel}

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