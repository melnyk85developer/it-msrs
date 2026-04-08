import React from "react";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { useEffect, useRef, useState } from "react";
import { FaRegSave, FaEdit } from "react-icons/fa";
import { getAllSystemPromptsAiAssistantsAC, updateSystemPromptForAiAssistantsAC } from "@packages/shared/src/store/MyAdminReducers/myAiAssistantAdminSlice";
import { AddSystemPrompts } from "./modalAddNewSystemPrompt/addNewSystemPrompt";
import EditContentRulesForm from "./modalAddNewSystemPrompt/editInputSystemPropt";
import classes from './styles.module.scss'

const SettingSystemProptsForAssistants: React.FC = React.memo(() => {
    const dispatch = useAppDispatch();
    const { systemPromptsForTerminators } = useAppSelector(state => state.adminAdminAiAssistantPage);
    const [openId, setOpenId] = useState<string | null>(null);
    const [statePage, setStatePage] = useState<'EDIT' | 'DEFAULT'>('DEFAULT');
    const [contentRules, setContentRules] = useState();

    useEffect(() => {
        dispatch(getAllSystemPromptsAiAssistantsAC());
    }, [dispatch]);

    const sendUpdateSystemPrompt = () => {
        dispatch(updateSystemPromptForAiAssistantsAC(contentRules))
    }

    const toggleAccordion = (_id: string) => {
        setOpenId(prev => (prev === _id ? null : _id));
    };

    const editSystemPromt = () => {
        if (statePage !== 'EDIT') {
            setStatePage('EDIT')
        } else {
            setStatePage('DEFAULT')
        }
    }

    return (
        <div className={classes.wrapContentSettingAI}>
            <span className={classes.titleSettingAI}>
                Настройки системных промптов ассистентов.
            </span>

            <AddSystemPrompts />

            {
                systemPromptsForTerminators?.length ? (
                    systemPromptsForTerminators.map((p: any) => {
                        const isOpen = openId === p._id;

                        return (
                            <div key={p._id} className={classes.contentSettingAI}>
                                <div
                                    className={classes.titleRules}
                                    onClick={() => toggleAccordion(p._id)}
                                >
                                    {p.titleRules}
                                </div>
                                {isOpen && (<div className={classes.headerSystemPrompt}>
                                    <div onClick={() => editSystemPromt()} className={classes.wrapIcon}>
                                        {
                                            statePage === 'DEFAULT'
                                                ?
                                                <>
                                                    <span className={classes.labelIcon}>Редактировать </span>
                                                    <FaEdit className={classes.icon} />
                                                </>
                                                :
                                                <>
                                                    <span className={classes.labelIcon}>Сохранить </span>
                                                    <FaRegSave className={classes.icon} />
                                                </>
                                        }
                                    </div>
                                </div>)}
                                {isOpen && (
                                    statePage === 'DEFAULT'
                                        ?
                                        <div className={classes.contentRules}>
                                            {p.contentRules}
                                        </div>
                                        :
                                        <EditContentRulesForm
                                            contentRules={p.contentRules}
                                            setContentRules={setContentRules}
                                            sendUpdateSystemPrompt={sendUpdateSystemPrompt}
                                        />
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div>Системных промптов нет</div>
                )
            }
        </div>
    );
});
export default SettingSystemProptsForAssistants;