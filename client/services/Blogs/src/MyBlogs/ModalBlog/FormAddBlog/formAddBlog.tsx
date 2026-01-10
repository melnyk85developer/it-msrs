import React, { Dispatch, SetStateAction } from "react";
import { Col, Input, Row, Tooltip } from "antd";
import { BsEmojiSmile, BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseOutline, IoCloseSharp } from "react-icons/io5";
// import UpdateMessageForm from "./UpdateMessageForm/updateMessageForm";
import classes from './styles.module.scss'
import TextArea from "antd/es/input/TextArea";

type PropsType = {
    setModalAddBlog: React.Dispatch<React.SetStateAction<boolean>>
    setBlogName: React.Dispatch<React.SetStateAction<string>>
    setBlogDescription: React.Dispatch<React.SetStateAction<string>>
    setWebsiteUrl: React.Dispatch<React.SetStateAction<string>>
    createBlog: () => void
}

const AddBlogFormModal: React.FC<PropsType> = React.memo(({
    setModalAddBlog, setBlogName, setBlogDescription, setWebsiteUrl, createBlog
}) => {

    const closeModal = () => {
        setModalAddBlog(false)
        setBlogName('')
        setBlogDescription('')
        setWebsiteUrl('')
    }

    return (
        <Row className={classes.row}>
            <Col span={24} className={classes.headerBlockUpdateMsgModal}>
                <span className={classes.title}>Создать Блог</span>
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
                <span className={classes.title}>
                    Для создания блога Вам необходимо заполнить поля ниже.
                </span>
                <div className={classes.formContainer}>
                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>Придумайте название Вашего блога</label>
                        <Input
                            placeholder="Введите название..."
                            onChange={(e) => setBlogName(e.target.value)}
                            className={classes.input}
                        />
                    </div>

                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>Описание блога</label>
                        <TextArea
                            placeholder="О чем ваш блог?"
                            rows={4}
                            onChange={(e) => setBlogDescription(e.target.value)}
                            style={{
                                resize: 'vertical',
                                maxHeight: '50vh',
                            }}
                            className={classes.textarea}
                        />
                    </div>

                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>URL Вашего веб-сайта (если есть)</label>
                        <Input
                            placeholder="https://example.com"
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            className={classes.input}
                        />
                    </div>
                </div>
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
                <div className={classes.rightBlock} onClick={() => createBlog()}>
                    <p>Cоздать</p>
                </div>
            </Col>
        </Row>
    )
})
export default AddBlogFormModal;