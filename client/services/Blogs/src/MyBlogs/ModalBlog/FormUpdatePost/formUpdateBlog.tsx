import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Col, Input, Row, Tooltip } from "antd";
import { BsEmojiSmile, BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseOutline, IoCloseSharp } from "react-icons/io5";
import classes from './styles.module.scss'
import TextArea from "antd/es/input/TextArea";
import { BlogType, PostBlogType } from "@packages/shared/src/types/blogTypes";

type PropsType = {
    updatePost: () => void;
    myCurrentPost: PostBlogType;
    setMyCurrentPost: React.Dispatch<React.SetStateAction<PostBlogType>>
    setModalIsUpdatePost: React.Dispatch<React.SetStateAction<boolean>>
    title: string;
    description: string;
    content: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>
    setDescription: React.Dispatch<React.SetStateAction<string>>
    setContent: React.Dispatch<React.SetStateAction<string>>
}

const UpdatePostFormModal: React.FC<PropsType> = React.memo(({
    title,
    setTitle,
    description,
    setDescription,
    content,
    setContent,
    updatePost,
    myCurrentPost,
    setMyCurrentPost,
    setModalIsUpdatePost
}) => {

    if (!myCurrentPost) return null;

    const closeModal = () => {
        setModalIsUpdatePost(false)
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
                        <label className={classes.label}>Редактировать подзаголовок</label>
                        <input
                            placeholder="Введите подзаголовок..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
                <div className={classes.rightBlock} onClick={() => updatePost()}>
                    <p>Сохранить</p>
                </div>
            </Col>
        </Row>
    )
})
export default UpdatePostFormModal;