import React from "react";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { useEffect, useRef, useState } from "react";
import { RiDeleteBin6Fill, RiDeleteBin6Line, RiMore2Fill, RiMore2Line, RiVideoOnFill, RiVideoOnLine } from "react-icons/ri";
import { PiBroom, PiBroomBold } from "react-icons/pi";
import { MdBlock, MdOutlineBlock } from "react-icons/md";
import { BiSearch, BiSearchAlt } from "react-icons/bi";
import { BsTelephone, BsTelephoneFill } from "react-icons/bs";
import LastSeenLabel from './getLastSeenLabel';
import { deleteAiAssistantAllMessagesAC, deleteAiAssistantDialogAC, getAiProvidersAndModelsAC } from "@packages/shared/src/store/MyAdminReducers/myAiAssistantAdminSlice";
import classes from './styles.module.scss'

type PropsType = {
    title: string;
    selectedAIProvider: string
    setSelectedAIProvider: React.Dispatch<React.SetStateAction<string>>
    selectedAIModel: string
    setSelectedAIModel: React.Dispatch<React.SetStateAction<string>>
}

const HeaderMessagesList: React.FC<PropsType> = React.memo((props) => {
    const { selectedAIProvider, setSelectedAIProvider, selectedAIModel, setSelectedAIModel, title } = props;
    const dispatch = useAppDispatch();
    const { authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage);
    const {
        providers,
        goole_provider_ai,
        openai_provider_ai,
        ollama_local_provider_ai,
        currentInterlocutor,
        currentChat
    } = useAppSelector(state => state.adminAdminAiAssistantPage);
    const [isOpen, setIsOpen] = useState(false);
    const [deleteOption, setDeleteOption] = useState<"me" | "all">("me");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Обработчик смены провайдера (сбрасываем модель при смене)
    const handleProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAIProvider(e.target.value);
        setSelectedAIModel(''); // Сброс модели
    };

    // console.log('HeaderMessagesList currentChat: - dialogId', currentChat.dialogId)
    // console.log('HeaderMessagesList currentChat: - currentChat', currentChat)
    // console.log('HeaderMessagesList: - goole_provider_ai', goole_provider_ai)
    // console.log('HeaderMessagesList: - openai_provider_ai', openai_provider_ai)
    // console.log('HeaderMessagesList: - ollama_local_provider_ai', ollama_local_provider_ai)

    let models: any[] = [];

    if (selectedAIProvider === 'google') {
        models = [...goole_provider_ai?.free, ...goole_provider_ai?.paid];
    }

    if (selectedAIProvider === 'openai') {
        models = [...openai_provider_ai?.free, ...openai_provider_ai?.paid];
    }

    if (selectedAIProvider === 'ollama') {
        models = (ollama_local_provider_ai || []).flatMap((node: any) =>
            (node.free || []).map((m: any) => ({
                ...m,
                node: node.localPC.node,
                pcName: node.localPC.name
            }))
        );
    }

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

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`${classes.headerMessagesList}`}>
            <div className={classes.wrapLeftBlock}>
                <span className={classes.userNameHeaderMsgList}>
                    <span>{title}</span>
                    <span className={classes.name}>{currentInterlocutor.name}</span>
                    <span className={classes.surname}>{currentInterlocutor.surname}</span>
                    <span><LastSeenLabel lastSeenAt={currentInterlocutor.lastSeen} /></span>
                </span>
                <div className={classes.dataHeaderMessagesList}>
                    {/* СЕЛЕКТ ПРОВАЙДЕРА */}
                    <strong className={classes.poroviderNameProviderLabel}>Provider: </strong>
                    <select
                        name="provider"
                        value={selectedAIProvider}
                        onChange={handleProviderChange}
                        className={classes.select}
                    >
                        <option value="">Select Provider</option>
                        {Object.keys(providers || {}).map((providerKey) => (
                            <option key={providerKey} value={providerKey}>
                                {providerKey}
                            </option>
                        ))}
                    </select>

                    {/* СЕЛЕКТ МОДЕЛИ */}
                    <strong className={classes.poroviderNameModelLabel}>Model: </strong>
                    <select
                        className={classes.select}
                        name="model"
                        value={selectedAIModel} // Привязываем стейт модели
                        onChange={(e) => setSelectedAIModel(e.target.value)} // Сохраняем выбор модели
                    >
                        <option value="">Select Model</option>

                        {/* Логика Google */}
                        {selectedAIProvider === 'google' &&
                            [...(goole_provider_ai?.free || []), ...(goole_provider_ai?.paid || [])].map((m: any, i: number) => (
                                <option key={i} value={m.id}>
                                    {m.name}
                                </option>
                            ))
                        }

                        {/* Логика OpenAI */}
                        {selectedAIProvider === 'openai' &&
                            [...(openai_provider_ai?.free || []), ...(openai_provider_ai?.paid || [])].map((m: any, i: number) => (
                                <option key={i} value={m.id}>
                                    {m.name}
                                </option>
                            ))
                        }

                        {/* Логика Ollama */}
                        {selectedAIProvider === 'ollama' &&
                            ollama_local_provider_ai.flatMap((node: any) =>
                                (node.free || []).map((m: any, i: number) => (
                                    <option key={`${node.localPC.name}-${i}`} value={m.id}>
                                        [{node.localPC.name}] {m.name}
                                    </option>
                                ))
                            )
                        }
                    </select>
                </div>
            </div>

            <div className={classes.wrapIcon} ref={dropdownRef}>
                <span className={classes.iconWrapper} onClick={() => setIsOpen(prevIsOpen => !prevIsOpen)}>
                    <RiMore2Line
                        className={`
                            ${classes.icon}
                            ${classes.iconNormal}
                            ${classes.iconNav}
                        `}
                    />
                    <RiMore2Fill
                        className={`
                            ${classes.icon}
                            ${classes.iconHover}
                            ${classes.iconNav}
                        `}
                    />
                </span>
                <div className={`
                    ${isOpen ? classes.navMsgActive : classes.navMsgDisactive}
                `}>
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