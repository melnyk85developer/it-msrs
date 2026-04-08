import React, { Dispatch, SetStateAction } from "react";
import { Col, Row, Tooltip } from "antd";
import { BsEmojiSmile, BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseOutline, IoCloseSharp } from "react-icons/io5";
import AddAssistantRulesForm from "./UpdateSettingForAIForm/addAssistantRulesForm";
import AddAssistantMissionForm from "./UpdateSettingForAIForm/addMissionForAssistantRulesForm";
import EmploymentContextForm from "./UpdateSettingForAIForm/employmentContextForm";
import ProjectContextRulesForm from "./UpdateSettingForAIForm/projectConrextRulesForm";
import classes from './styles.module.scss'
import AddTitleRulesForm from "./UpdateSettingForAIForm/addTitleRulesForm";
import AddContentRulesForm from "./UpdateSettingForAIForm/addContentRulesForm";

type PropsType = {
    titleRules: string;
    setTitleRules: React.Dispatch<React.SetStateAction<string>>;
    contentRules: string;
    setContentRules: React.Dispatch<React.SetStateAction<string>>;

    globalRules: string
    setGlobalRules: React.Dispatch<React.SetStateAction<string>>
    currentMission: string
    setCurrentMission: React.Dispatch<React.SetStateAction<string>>
    projectContext: string
    setProjectContext: React.Dispatch<React.SetStateAction<string>>
    employmentContext: string
    setEmploymentContext: React.Dispatch<React.SetStateAction<string>>

    addNewSettingForTerminator: () => void
    setModalActive: Dispatch<SetStateAction<boolean>>
}

const SettingForAIFormModal: React.FC<PropsType> = React.memo(({
    titleRules,
    setTitleRules,
    contentRules,
    setContentRules,
    globalRules,
    setGlobalRules,
    addNewSettingForTerminator,
    setModalActive
}) => {

    const closeModal = () => {
        setModalActive(false)
        setGlobalRules('')
    }

    return (
        <Row className={classes.row}>
            <Col span={24} className={classes.headerBlockUpdateMsgModal}>
                <span className={classes.title}>Системные промпты Терминаторов Пленума</span>
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
            </Col>
            <Col span={24} className={classes.wrapCentrBlockInputAddMessage}>
                <span className={classes.labelForm}>Заголовок системного промпта</span>
                <AddTitleRulesForm
                    titleRules={titleRules}
                    setTitleRules={setTitleRules}
                    sendUpdateMessage={() => addNewSettingForTerminator()}
                />
                <span className={classes.labelForm}>Системный промпт</span>
                <AddContentRulesForm
                    contentRules={contentRules}
                    setContentRules={setContentRules}
                    sendUpdateMessage={() => addNewSettingForTerminator()}
                />
            </Col>
            <Col span={24} className={classes.futerBlockUpdateMsgModal}>
                <div onClick={closeModal} className={classes.leftBlock}>
                    <p>Отмена</p>
                </div>
                <div className={classes.centerBlock}>
                    <Tooltip destroyTooltipOnHide title="Оставить эмоцию">
                        <span className={classes.iconWrapper}>
                            <BsEmojiSmile className={`${classes.icon} ${classes.iconNormal}`} />
                            <BsEmojiSmileFill className={`${classes.icon} ${classes.iconHover}`} />
                        </span>
                    </Tooltip>
                </div>
                <div className={classes.rightBlock} onClick={() => addNewSettingForTerminator()}>
                    <p>Cохранить</p>
                </div>
            </Col>
        </Row>
    )
})
export default SettingForAIFormModal;