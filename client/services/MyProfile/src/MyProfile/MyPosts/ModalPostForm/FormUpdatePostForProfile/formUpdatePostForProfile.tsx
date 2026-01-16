import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Button, Col, Input, Row, Tooltip } from "antd";
import { BsEmojiSmile, BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseOutline, IoCloseSharp } from "react-icons/io5";
import paperСlip from "@packages/shared/src/assets/skrepka.png"
import FileUpload from "@packages/shared/src/components/FileUpload/fileUpload";
import classes from './styles.module.scss'

type PropsType = {
    title: string;
    content: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>
    setContent: React.Dispatch<React.SetStateAction<string>>

    nameImg: any;
    setNameImg: any;
    imgFile: any;
    setImgFile: any;
    setModalActive: any;
    setPost: () => void;
}

const UpdatePostForProfileFormModal: React.FC<PropsType> = React.memo(({
    title,
    setTitle,
    content,
    setContent,

    imgFile,
    nameImg,
    setImgFile,
    setModalActive,
    setNameImg,
    setPost
}) => {

    const cleanUpThePhoto = () => {
        setImgFile(null)
        setNameImg('')
    }

    const closeModal = () => {
        return setModalActive(false)
    }

    return (
        <Row className={classes.row}>
            <Col span={24} className={classes.headerBlockUpdateMsgModal}>
                <span className={classes.title}>Редактировать Пост</span>
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
                    Отредактируйте поля Вашего поста или статьи.
                </span>
                <div className={classes.formContainer}>
                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>Редактировать название поста или статьи</label>
                        <input
                            placeholder="Введите заголовок..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={classes.input}
                        />
                    </div>
                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>Редактировать пост или статью</label>
                        <textarea
                            placeholder="Текст поста или статьи?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{
                                resize: 'vertical',
                                maxHeight: '50vh',
                            }}
                            className={classes.textarea}
                        />
                    </div>
                </div>
            </Col>
            <Col span={24} className={classes.wrapFileblock}>
                <FileUpload setFile={setImgFile} setNameImg={setNameImg}>
                    <div className={classes.fileBlock}>
                        {/* <PaperClipOutlined /> */}
                        <img src={paperСlip} alt="skrepka" />
                        <strong>Прикрепить фото</strong>
                    </div>
                </FileUpload>
                <div className={classes.fileNameImg}>
                    {nameImg !== null ? <p>Файл {nameImg}</p> : null}
                </div>
                <Button onClick={() => cleanUpThePhoto()} className={classes.cleanButton}>Убрать фото</Button>
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
                <div className={classes.rightBlock} onClick={() => setPost()}>
                    <p>Сохранить</p>
                </div>
            </Col>
        </Row>
    )
})
export default UpdatePostForProfileFormModal;