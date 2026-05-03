import React, { ChangeEvent, ChangeEventHandler } from "react";
import { IoMdSettings } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { useEffect, useRef, useState } from "react";
import { RiDeleteBin6Fill, RiDeleteBin6Line, RiMore2Fill, RiMore2Line, RiVideoOnFill, RiVideoOnLine } from "react-icons/ri";
import { PiBroom, PiBroomBold } from "react-icons/pi";
import { deleteAiAssistantAllMessagesAC, deleteAiAssistantDialogAC, getAiProvidersAndModelsAC, saveDesignatedProviderAndModelAC } from "@packages/shared/src/store/MyAdminReducers/myAiAssistantAdminSlice";
import SelectProviderAndModel from "./selectProviders";
import ModalWindow from "@packages/shared/src/components/ModalWindows";
import classes from './styles.module.scss'
import LastSeenLabel from "./getLastSeenLabel";

type PropsType = {
    title: string;
    selectedPrimaryAIProvider: string
    setSelectedPrimaryAIProvider: React.Dispatch<React.SetStateAction<string>>
    selectedPrimaryAIModel: string
    setSelectedPrimaryAIModel: React.Dispatch<React.SetStateAction<string>>

    selectedFallbackAIProvider: string
    setSelectedFallbackAIProvider: React.Dispatch<React.SetStateAction<string>>
    selectedFallbackAIModel: string
    setSelectedFallbackAIModel: React.Dispatch<React.SetStateAction<string>>
}

const HeaderMessagesList: React.FC<PropsType> = React.memo((props) => {
    const {
        selectedPrimaryAIProvider,
        setSelectedPrimaryAIProvider,
        selectedPrimaryAIModel,
        setSelectedPrimaryAIModel,
        selectedFallbackAIProvider,
        setSelectedFallbackAIProvider,
        selectedFallbackAIModel,
        setSelectedFallbackAIModel,
        title
    } = props;
    const dispatch = useAppDispatch();
    const { authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage);
    const {
        providers,
        goole_provider_ai,
        openai_provider_ai,
        ollama_local_provider_ai,
        currentInterlocutor,
        currentChat,
        systemPromptsForTerminators
    } = useAppSelector(state => state.adminAdminAiAssistantPage);
    const [deleteOption, setDeleteOption] = useState<"me" | "all">("me");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [modalActive, setModalActive] = useState(false);
    const [selectedPromptIds, setSelectedPromptIds] = React.useState<string[]>([]);
    const [ipAddress, setIpAddress] = useState(''); // Сюда придет значение из бэка или пустота

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    // console.log('HeaderMessagesList - currentInterlocutor', currentInterlocutor)
    // console.log('HeaderMessagesList - selectedPromptIds', selectedPromptIds)
    console.log('HeaderMessagesList - ipAddress', ipAddress)

    const saveProviderAndModel = () => {
        const data = {
            id: currentInterlocutor.userId,
            provider1: selectedPrimaryAIProvider,
            model1: selectedPrimaryAIModel,
            provider2: selectedFallbackAIProvider,
            model2: selectedFallbackAIModel,
            node: ipAddress,
            systemPrompts: selectedPromptIds
        }
        dispatch(saveDesignatedProviderAndModelAC(data))
            .then(() => setModalActive(false))
    }

    const handlePrimaryProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newProvider = e.target.value;
        setSelectedPrimaryAIProvider(newProvider);

        // Берем список моделей для нового провайдера
        let firstModelId = '';
        if (newProvider === 'google' && goole_provider_ai) {
            const models = [...(goole_provider_ai.free || []), ...(goole_provider_ai.paid || [])];
            if (models.length > 0) firstModelId = models[0].id;
        } else if (newProvider === 'openai' && openai_provider_ai) {
            const models = [...(openai_provider_ai.free || []), ...(openai_provider_ai.paid || [])];
            if (models.length > 0) firstModelId = models[0].id;
        } else if (newProvider === 'ollama' && Array.isArray(ollama_local_provider_ai)) {
            // Берем первый доступный ID из первого узла
            const firstNode = ollama_local_provider_ai[0];
            if (firstNode?.free?.length > 0) firstModelId = firstNode.free[0].id;
        }

        setSelectedPrimaryAIModel(firstModelId);
    };

    const handleFallbackProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newProvider = e.target.value;
        setSelectedFallbackAIProvider(newProvider);

        // Аналогичная логика для Fallback
        let firstModelId = '';
        if (newProvider === 'google' && goole_provider_ai) {
            const models = [...(goole_provider_ai.free || []), ...(goole_provider_ai.paid || [])];
            if (models.length > 0) firstModelId = models[0].id;
        } else if (newProvider === 'openai' && openai_provider_ai) {
            const models = [...(openai_provider_ai.free || []), ...(openai_provider_ai.paid || [])];
            if (models.length > 0) firstModelId = models[0].id;
        } else if (newProvider === 'ollama' && Array.isArray(ollama_local_provider_ai)) {
            const firstNode = ollama_local_provider_ai[0];
            if (firstNode?.free?.length > 0) firstModelId = firstNode.free[0].id;
        }

        setSelectedFallbackAIModel(firstModelId);
    };

    const handleIpChange = (e: ChangeEvent<HTMLInputElement>) => {
        setIpAddress(e.target.value);
    };

    const clearChat = () => {
        setDeleteOption('all')
        dispatch(deleteAiAssistantAllMessagesAC(
            authorizedUser?.id,
            currentInterlocutor?.profileId,
            deleteOption
        ))
    }

    const deleteChat = () => {
        dispatch(deleteAiAssistantDialogAC(
            currentChat?.dialogId,
            authorizedUser?.id,
            currentInterlocutor?.profileId
        ))
    }

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    return (
        <div className={`${classes.headerMessagesList}`}>
            <div className={classes.wrapLeftBlock}>
                <span className={classes.userNameHeaderMsgList}>
                    <span className={classes.title}>{title}</span>
                    <span className={classes.wrapAssistantData}>
                        <span className={classes.name}>{currentInterlocutor.name}</span>
                    </span>
                    <span className={classes.wrapLastSeen}>
                        <LastSeenLabel lastSeenAt={currentInterlocutor.lastSeen} />
                    </span>
                    <ModalWindow modalActive={modalActive} setModalActive={setModalActive} isSetModal={0}>
                        <SelectProviderAndModel
                            setModalActive={setModalActive}
                            providers={providers}
                            goole_provider_ai={goole_provider_ai}
                            openai_provider_ai={openai_provider_ai}
                            ollama_local_provider_ai={ollama_local_provider_ai}
                            currentInterlocutor={currentInterlocutor}
                            selectedPrimaryAIProvider={selectedPrimaryAIProvider}
                            setSelectedPrimaryAIProvider={setSelectedPrimaryAIProvider}
                            selectedPrimaryAIModel={selectedPrimaryAIModel}
                            setSelectedPrimaryAIModel={setSelectedPrimaryAIModel}

                            selectedFallbackAIProvider={selectedFallbackAIProvider}
                            setSelectedFallbackAIProvider={setSelectedFallbackAIProvider}
                            selectedFallbackAIModel={selectedFallbackAIModel}
                            setSelectedFallbackAIModel={setSelectedFallbackAIModel}

                            ipAddress={ipAddress}
                            handleIpChange={handleIpChange}

                            handlePrimaryProviderChange={handlePrimaryProviderChange}
                            handleFallbackProviderChange={handleFallbackProviderChange}
                            saveProviderAndModel={saveProviderAndModel}

                            systemPromptsForTerminators={systemPromptsForTerminators}
                            selectedPromptIds={selectedPromptIds}
                            setSelectedPromptIds={setSelectedPromptIds}
                        />
                    </ModalWindow>
                </span>
                <span className={classes.wrapHeaderProviderData}>
                    <span className={classes.provider}>Provider: {currentInterlocutor.provider1}</span>
                    <span className={classes.model}>Model: {currentInterlocutor.model1}</span>
                    <span className={classes.model}>Node: {currentInterlocutor.node}</span>
                    <span className={classes.wrapEditProvider} onClick={() => setModalActive(prevIsOpen => !prevIsOpen)}>
                        <span className={classes.labelEditProvider}>Настроить</span>
                        <IoMdSettings className={classes.icon} />
                    </span>
                </span>
            </div>
            <div className={classes.wrapIcon} ref={dropdownRef}>
                <span className={classes.iconWrapper} onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)}>
                    <RiMore2Line className={`${classes.icon} ${classes.iconNormal} ${classes.iconNav}`} />
                    <RiMore2Fill className={`${classes.icon} ${classes.iconHover} ${classes.iconNav}`} />
                </span>
                <div className={`${isOpen ? classes.navMsgActive : classes.navMsgDisactive}`}>
                    <div className={classes.wrapPopUpMenu}>
                        <div onClick={clearChat} className={classes.li}>
                            <span className={classes.iconWrapper}>
                                <PiBroom className={`${classes.icon} ${classes.iconNormal}`} />
                                <PiBroomBold className={`${classes.icon} ${classes.iconHover}`} />
                            </span>
                            <strong>Очистить переписку</strong>
                        </div>
                        <div onClick={deleteChat} className={classes.li}>
                            <span className={classes.iconWrapper}>
                                <RiDeleteBin6Line className={`${classes.icon} ${classes.iconNormal}`} />
                                <RiDeleteBin6Fill className={`${classes.icon} ${classes.iconHover}`} />
                            </span>
                            <strong>Удалить чат</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})
export default HeaderMessagesList