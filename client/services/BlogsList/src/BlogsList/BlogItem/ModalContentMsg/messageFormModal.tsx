import React, { Dispatch, SetStateAction } from "react";
import { Col, Row, Tooltip } from "antd";
import { BsEmojiSmile, BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseOutline, IoCloseSharp } from "react-icons/io5";
import UpdateMessageForm from "./UpdateMessageForm/updateMessageForm";
import classes from './styles.module.scss'

type PropsType = {
    textMessage: string
    setTextMessage: React.Dispatch<React.SetStateAction<string>>
    addNewMessage: (message: string) => void
    setModalActive: Dispatch<SetStateAction<boolean>>
}

const SendMessageFormModal: React.FC<PropsType> = React.memo(({ textMessage, setTextMessage, addNewMessage, setModalActive }) => {

    const closeModal = () => {
        setModalActive(false)
        setTextMessage('')
    }

    return (
        <Row className={classes.row}>
            <Col span={24} className={classes.headerBlockUpdateMsgModal}>
                <span className={classes.title}>Написать сообщения</span>
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
                <UpdateMessageForm
                    message={textMessage}
                    setMessage={setTextMessage}
                    sendUpdateMessage={() => addNewMessage(textMessage)}
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
                <div className={classes.rightBlock} onClick={() => addNewMessage(textMessage)}>
                    <p>Отправить</p>
                </div>
            </Col>
        </Row>
    )
})
export default SendMessageFormModal;