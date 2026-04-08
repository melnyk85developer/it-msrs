import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@packages/shared/src/components/hooks/redux'
import { createSystemPromptAiAssistantsAC } from '@packages/shared/src/store/MyAdminReducers/myAiAssistantAdminSlice'
import { IoMdSettings } from 'react-icons/io'
import ModalWindow from '@packages/shared/src/components/ModalWindows'
import SettingForAIFormModal from '../../ModalAddSettingForAI/settingForAIFormModal'
import classes from './styles.module.scss'

export const AddSystemPrompts: React.FC = React.memo(() => {
    const dispatch = useAppDispatch();
    const { isDarkTheme } = useAppSelector(state => state.authPage);

    const [titleRules, setTitleRules] = useState<string>('');
    const [contentRules, setContentRules] = useState<string>('');
    const [globalRules, setGlobalRules] = useState<string>('');
    const [currentMission, setCurrentMission] = useState<string>('');
    const [projectContext, setProjectContext] = useState<string>('');
    const [employmentContext, setEmploymentContext] = useState<string>('');
    const [modalActive, setModalActive] = useState(false);

    const openSettingForTerminator = () => {
        setModalActive(true)
    }
    const closeSettingForTerminator = () => {
        setTitleRules('')
        setContentRules('')
        setGlobalRules('')
        setCurrentMission('')
        setProjectContext('')
        setEmploymentContext('')
        setModalActive(false)
    }
    const addNewSettingForTerminator = () => {
        const addRules = {
            titleRules,
            contentRules
        }
        console.log('AiAssistantGeneratorContainer - addRules', addRules)
        dispatch(createSystemPromptAiAssistantsAC(addRules))
            .then(() => closeSettingForTerminator())
    }
    return (
        <div className={classes.wrapAddNewSystemPromptForTerminator}>
            <div className={classes.addNewSystemPromptAI}>
                <div className={classes.labelAddNewSystemPropt} onClick={() => openSettingForTerminator()}>Добавить новый</div>
                <IoMdSettings className={classes.ioMdSettings} onClick={() => openSettingForTerminator()}/>
            </div>
            <div  className={classes.wrapLabelSettingsForTerminator}>
            </div>
            <ModalWindow modalActive={modalActive} setModalActive={setModalActive} isSetModal={0}>
                <SettingForAIFormModal
                    titleRules={titleRules}
                    setTitleRules={setTitleRules}
                    contentRules={contentRules}
                    setContentRules={setContentRules}

                    globalRules={globalRules}
                    setGlobalRules={setGlobalRules}
                    currentMission={currentMission}
                    setCurrentMission={setCurrentMission}
                    projectContext={projectContext}
                    setProjectContext={setProjectContext}
                    employmentContext={employmentContext}
                    setEmploymentContext={setEmploymentContext}

                    setModalActive={setModalActive}
                    addNewSettingForTerminator={addNewSettingForTerminator}
                />
            </ModalWindow>
        </div>
    )
})