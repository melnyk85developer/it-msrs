import React, { Dispatch, SetStateAction, useEffect } from "react";
import { Col, Input, Row, Tooltip } from "antd";
import { BsEmojiSmile, BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseOutline, IoCloseSharp } from "react-icons/io5";
import classes from './styles.module.scss'
import TextArea from "antd/es/input/TextArea";
import { BlogType } from "@packages/shared/src/types/blogTypes";

type PropsType = {
    myCurrentBlog: BlogType;
    setMyCurrentBlog: React.Dispatch<React.SetStateAction<BlogType>>
    setModalIsUpdateBlog: React.Dispatch<React.SetStateAction<boolean>>
    blogName: string;
    setBlogName: React.Dispatch<React.SetStateAction<string>>
    blogDescription: string;
    setBlogDescription: React.Dispatch<React.SetStateAction<string>>
    websiteUrl: string;
    setWebsiteUrl: React.Dispatch<React.SetStateAction<string>>
    updateBlog: () => void
}

const UpdateBlogFormModal: React.FC<PropsType> = React.memo(({
    myCurrentBlog,
    setModalIsUpdateBlog,
    blogName,
    setBlogName,
    blogDescription,
    setBlogDescription,
    websiteUrl,
    setWebsiteUrl,
    updateBlog
}) => {

    if (!myCurrentBlog) return null;

    const closeModal = () => {
        setModalIsUpdateBlog(false)
    }

    return (
        <Row className={classes.row}>
            <Col span={24} className={classes.headerBlockUpdateMsgModal}>
                <span className={classes.title}>Редактировать Блог</span>
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
                    Отредактируйте поля Вашего блога.
                </span>
                <div className={classes.formContainer}>
                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>Редактировать название блога</label>
                        <input
                            placeholder="Введите название..."
                            value={blogName}
                            onChange={(e) => setBlogName(e.target.value)}
                            className={classes.input}
                        />
                    </div>
                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>Описание блога</label>
                        <textarea
                            placeholder="О чем ваш блог?"
                            value={blogDescription}
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
                        <input
                            placeholder="https://example.com"
                            value={websiteUrl}
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
                <div className={classes.rightBlock} onClick={() => updateBlog()}>
                    <p>Сохранить</p>
                </div>
            </Col>
        </Row>
    )
})
export default UpdateBlogFormModal;