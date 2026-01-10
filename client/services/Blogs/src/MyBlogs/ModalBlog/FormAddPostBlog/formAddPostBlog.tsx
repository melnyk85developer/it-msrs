import React from "react";
import { Col, Input, Row } from "antd";
import { IoCloseOutline, IoCloseSharp } from "react-icons/io5";
import TextArea from "antd/es/input/TextArea";
import classes from './styles.module.scss'

type PropsType = {
    setModalAddPostBlog: React.Dispatch<React.SetStateAction<boolean>>;
    setBlogName: React.Dispatch<React.SetStateAction<string>>;

    setPostBlogTitle: React.Dispatch<React.SetStateAction<string>>;
    postBlogTitle: React.Dispatch<React.SetStateAction<string>>;
    postBlogText: React.Dispatch<React.SetStateAction<string>>;
    setPostBlogText: React.Dispatch<React.SetStateAction<string>>;
    postBlogShortDescription: React.Dispatch<React.SetStateAction<string>>;
    setPostBlogShortDescription: React.Dispatch<React.SetStateAction<string>>;
    createPostBlog: () => void;
    createPostSaveAsDraft: () => void;
}

const AddPostBlogFormModal: React.FC<PropsType> = React.memo(({
    setModalAddPostBlog,
    setBlogName,
    postBlogTitle,
    setPostBlogTitle,
    postBlogText,
    setPostBlogText,
    postBlogShortDescription,
    setPostBlogShortDescription,
    createPostBlog,
    createPostSaveAsDraft
}) => {

    const closeModal = () => {
        setModalAddPostBlog(false)
        setBlogName('')
        setPostBlogTitle('')
    }

    return (
        <Row className={classes.row}>
            <Col span={24} className={classes.headerBlockUpdateMsgModal}>
                <span className={classes.title}>Создать пост или статью для текущего Блога</span>
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
                    Для создания поста или статьи Вам необходимо заполнить поля ниже.
                </span>
                <div className={classes.formContainer}>
                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>Придумайте заголовок поста или статьи</label>
                        <Input
                            placeholder="Введите название заголовка..."
                            onChange={(e) => setPostBlogTitle(e.target.value)}
                            className={classes.input}
                        />
                    </div>
                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>Придумайте заголовок поста или статьи</label>
                        <Input
                            placeholder="Введите краткое описание для превью поста..."
                            onChange={(e) => setPostBlogShortDescription(e.target.value)}
                            className={classes.input}
                        />
                    </div>
                    <div className={classes.inputWrapper}>
                        <label className={classes.label}>Описание блога</label>
                        <TextArea
                            placeholder="Текст поста или статьи..."
                            rows={4}
                            onChange={(e) => setPostBlogText(e.target.value)}
                            style={{
                                resize: 'vertical',
                                maxHeight: '50vh',
                            }}
                            className={classes.textarea}
                        />
                    </div>
                </div>
            </Col>
            <Col span={24} className={classes.futerBlockAddPostBlog}>
                <div onClick={closeModal} className={classes.butonBlock}>
                    <p>Отмена</p>
                </div>
                <div className={classes.butonBlock} onClick={() => createPostSaveAsDraft()}>
                    <p>Cохранить как черновик</p>
                </div>
                <div className={classes.butonBlock} onClick={() => createPostSaveAsDraft()}>
                    <p>Cохранить</p>
                </div>
                <div className={classes.butonBlock} onClick={() => createPostBlog()}>
                    <p>Cохранить и опубликовать</p>
                </div>
            </Col>
        </Row>
    )
})
export default AddPostBlogFormModal;