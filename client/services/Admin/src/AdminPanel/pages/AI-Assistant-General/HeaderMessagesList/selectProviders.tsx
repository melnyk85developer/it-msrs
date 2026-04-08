import React, { useEffect } from 'react';
import { SiOllama } from "react-icons/si";
import { SiGooglegemini } from "react-icons/si";
import { AiFillOpenAI } from "react-icons/ai";
import { AiAssistantInterlocutor, AIProvidersType, GoogleProviderType, OllamaLocalProviderType, OpenAIProviderType, RulesForAIAssistantsType } from '@packages/shared/src/types/AiAssistantType';
import { IoChevronDownOutline, IoChevronUpOutline, IoCloseOutline, IoCloseSharp } from 'react-icons/io5';
import { Col, Tooltip } from 'antd';
import { BsEmojiSmile, BsEmojiSmileFill } from 'react-icons/bs';
import classes from './styles.module.scss'
import { useAppDispatch } from '@packages/shared/src/components/hooks/redux';
import { getAiProvidersAndModelsAC, getAllSystemPromptsAiAssistantsAC } from '@packages/shared/src/store/MyAdminReducers/myAiAssistantAdminSlice';

type PropsType = {
    setModalActive: React.Dispatch<React.SetStateAction<boolean>>
    providers: AIProvidersType;
    goole_provider_ai: GoogleProviderType;
    openai_provider_ai: OpenAIProviderType;
    ollama_local_provider_ai: OllamaLocalProviderType;
    currentInterlocutor: AiAssistantInterlocutor;
    selectedPrimaryAIProvider: string
    setSelectedPrimaryAIProvider: React.Dispatch<React.SetStateAction<string>>
    selectedPrimaryAIModel: string;
    setSelectedPrimaryAIModel: React.Dispatch<React.SetStateAction<string>>;
    selectedFallbackAIProvider: string
    setSelectedFallbackAIProvider: React.Dispatch<React.SetStateAction<string>>
    selectedFallbackAIModel: string
    setSelectedFallbackAIModel: React.Dispatch<React.SetStateAction<string>>
    handlePrimaryProviderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    handleFallbackProviderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    saveProviderAndModel: () => void;
    systemPromptsForTerminators: RulesForAIAssistantsType[];
    selectedPromptIds: string[];
    setSelectedPromptIds: React.Dispatch<React.SetStateAction<string[]>>
}

const SelectProviderAndModel: React.FC<PropsType> = React.memo(({
    setModalActive,
    providers,
    goole_provider_ai,
    openai_provider_ai,
    ollama_local_provider_ai,
    currentInterlocutor,
    selectedPrimaryAIProvider,
    setSelectedPrimaryAIProvider,
    selectedPrimaryAIModel,
    setSelectedPrimaryAIModel,
    selectedFallbackAIProvider,
    setSelectedFallbackAIProvider,
    selectedFallbackAIModel,
    setSelectedFallbackAIModel,
    handlePrimaryProviderChange,
    handleFallbackProviderChange,
    saveProviderAndModel,
    systemPromptsForTerminators,
    selectedPromptIds,
    setSelectedPromptIds
}) => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!systemPromptsForTerminators || systemPromptsForTerminators.length === 0) {
            dispatch(getAllSystemPromptsAiAssistantsAC());
        }
        if (!providers) {
            dispatch(getAiProvidersAndModelsAC());
        }
    }, []);
    
    const closeModal = () => {
        setModalActive(false)
    }

    const [expandedPromptId, setExpandedPromptId] = React.useState<string | null>(null);

    const togglePrompt = (id: string) => {
        setSelectedPromptIds(prev =>
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        );
    }

    const toggleAccordion = (id: string) => {
        setExpandedPromptId(expandedPromptId === id ? null : id);
    }

    // console.log('SelectProviderAndModel - systemPromptsForTerminators', systemPromptsForTerminators)
    // console.log('SelectProviderAndModel - ollama_local_provider_ai', ollama_local_provider_ai)
    return (
        <Col span={24} className={classes.wrapContentModalSettigAssistant}>
            <span className={classes.topIconWrapper}>
                <IoCloseOutline
                    className={`${classes.topIcon} ${classes.topIconNormal}`}
                    onClick={closeModal}
                />
                <IoCloseSharp
                    className={`${classes.topIcon} ${classes.topIconHover}`}
                    onClick={closeModal}
                />
            </span>
            <h3>Настройте своего ассистента для более точной работы</h3>

            <Col className={classes.selectPrimaryAPI}>
                <strong className={classes.label_1_block_api_provider}>Внешние (основные) API:</strong>
                <div className={classes.wrapSelectProvider}>
                    <strong className={classes.poroviderNameProviderLabel}>
                        Provider:
                    </strong>
                    {
                        selectedPrimaryAIProvider === 'openai'
                            ?
                            <AiFillOpenAI className={classes.iconOpenAIOutlined} />
                            :
                            selectedPrimaryAIProvider === 'ollama'
                                ?
                                <SiOllama className={classes.iconSiOllama} />
                                :
                                selectedPrimaryAIProvider === 'google'
                                    ?
                                    <SiGooglegemini className={classes.iconGooglegemini} /> // <GlobalOutlined />
                                    : <></>
                    }
                    <select
                        name="provider"
                        value={selectedPrimaryAIProvider}
                        onChange={handlePrimaryProviderChange}
                        className={classes.selectProvider}
                    >
                        {providers && Object.keys(providers).map((providerKey) => (
                            <option key={providerKey} value={providerKey}>
                                {providerKey}
                            </option>
                        ))}
                    </select>

                    <strong className={classes.poroviderNameModelLabel}>Model: </strong>
                    <select
                        className={classes.selectModel}
                        name="model"
                        value={selectedPrimaryAIModel}
                        onChange={(e) => setSelectedPrimaryAIModel(e.target.value)}
                    >
                        {selectedPrimaryAIProvider === 'google' && goole_provider_ai &&
                            [...goole_provider_ai?.free || [], ...goole_provider_ai?.paid || []].map((m: any, i: number) => (
                                <option key={i} value={m.id}>
                                    {m.name}
                                </option>
                            ))
                        }

                        {selectedPrimaryAIProvider === 'openai' && openai_provider_ai &&
                            [...openai_provider_ai?.free || [], ...openai_provider_ai?.paid || []].map((m: any, i: number) => (
                                <option key={i} value={m.id}>
                                    {m.name}
                                </option>
                            ))
                        }

                        {selectedPrimaryAIProvider === 'ollama' && Array.isArray(ollama_local_provider_ai) &&
                            ollama_local_provider_ai.map((node: any) => {
                                // Проверяем, есть ли поле free и является ли оно массивом
                                return Array.isArray(node.free) ? node.free.map((m: any, i: number) => (
                                    <option key={`${node.localPC?.name || 'node'}-${m.id || i}`} value={m.id}>
                                        [{node.localPC?.name || 'PC'}] {m.name}
                                    </option>
                                )) : null;
                            })
                        }
                    </select>
                </div>
            </Col>

            <Col className={classes.selectFallbackAPI}>
                <strong className={classes.label_1_block_api_provider}>Локальные (запасные) API:</strong>
                <div className={classes.wrapSelectProvider}>
                    <strong className={classes.poroviderNameProviderLabel}>
                        Provider:
                    </strong>
                    {
                        selectedFallbackAIProvider === 'openai'
                            ?
                            <AiFillOpenAI className={classes.iconOpenAIOutlined} />
                            :
                            selectedFallbackAIProvider === 'ollama'
                                ?
                                <SiOllama className={classes.iconSiOllama} />
                                :
                                selectedFallbackAIProvider === 'google'
                                    ?
                                    <SiGooglegemini className={classes.iconGooglegemini} /> // <GlobalOutlined />
                                    : <></>
                    }
                    <select
                        name="provider"
                        value={selectedFallbackAIProvider}
                        onChange={handleFallbackProviderChange}
                        className={classes.selectProvider}
                    >
                        {providers && Object.keys(providers).map((providerKey) => (
                            <option key={providerKey} value={providerKey}>
                                {providerKey}
                            </option>
                        ))}
                    </select>

                    <strong className={classes.poroviderNameModelLabel}>Model: </strong>
                    <select
                        className={classes.selectModel}
                        name="model"
                        value={selectedFallbackAIModel}
                        onChange={(e) => setSelectedFallbackAIModel(e.target.value)}
                    >
                        {selectedFallbackAIProvider === 'google' && goole_provider_ai &&
                            [...goole_provider_ai?.free || [], ...goole_provider_ai?.paid || []].map((m: any, i: number) => (
                                <option key={i} value={m.id}>
                                    {m.name}
                                </option>
                            ))
                        }

                        {selectedFallbackAIProvider === 'openai' && openai_provider_ai &&
                            [...openai_provider_ai?.free || [], ...openai_provider_ai?.paid || []].map((m: any, i: number) => (
                                <option key={i} value={m.id}>
                                    {m.name}
                                </option>
                            ))
                        }

                        {selectedFallbackAIProvider === 'ollama' && Array.isArray(ollama_local_provider_ai) &&
                            ollama_local_provider_ai.map((node: any) => {
                                // Проверяем, есть ли поле free и является ли оно массивом
                                return Array.isArray(node.free) ? node.free.map((m: any, i: number) => (
                                    <option key={`${node.localPC?.name || 'node'}-${m.id || i}`} value={m.id}>
                                        [{node.localPC?.name || 'PC'}] {m.name}
                                    </option>
                                )) : null;
                            })
                        }
                    </select>
                </div>
            </Col>

            <Col span={24} className={classes.systemPromptsSection}>
                <strong className={classes.label_1_block_api_provider}>Системные правила (Instructions):</strong>
                <div className={classes.promptsListWrapper}>
                    {systemPromptsForTerminators && systemPromptsForTerminators.map((prompt: any) => (
                        <div key={prompt._id} className={classes.promptAccordionItem}>
                            <div className={classes.promptHeader}>
                                <div className={classes.promptTitleRow} onClick={() => toggleAccordion(prompt._id)}>
                                    <span className={classes.promptTitle}>{prompt.titleRules}</span>
                                    {expandedPromptId === prompt._id ? <IoChevronUpOutline /> : <IoChevronDownOutline />}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={selectedPromptIds.includes(prompt._id)}
                                    onChange={() => togglePrompt(prompt._id)}
                                />
                            </div>
                            {expandedPromptId === prompt._id && (
                                <div className={classes.promptContentBody}>
                                    <pre className={classes.promptPretext}>{prompt.contentRules}</pre>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Col>

            <Col span={24} className={classes.futerBlockUpdateProviderModal}>
                <div onClick={closeModal} className={classes.leftBlock}>
                    <p>Отмена</p>
                </div>
                <div className={classes.rightBlock} onClick={() => saveProviderAndModel()}>
                    <p>Cохранить</p>
                </div>
            </Col>
        </Col>
    )
})
export default SelectProviderAndModel