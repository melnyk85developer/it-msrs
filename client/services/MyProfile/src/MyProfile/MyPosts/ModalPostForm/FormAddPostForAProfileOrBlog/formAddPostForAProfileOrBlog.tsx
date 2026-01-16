import React, { useState } from "react";
import { Button, Col, Input, Row, Tooltip } from "antd";
import { BsEmojiSmile, BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseOutline, IoCloseSharp } from "react-icons/io5";
import AddPostForProfileFormModal from "./FormAddPostForProfile/formAddPostForProfile";
import AddPostForBlogFormModal from "./FormAddPostForBlog/formAddPostForProfile";
import paperСlip from "@packages/shared/src/assets/skrepka.png"
import FileUpload from "@packages/shared/src/components/FileUpload/fileUpload";
import classes from './styles.module.scss'

type PropsType = {
    tab: 'profile' | 'blog';
    setTab: React.Dispatch<React.SetStateAction<string>>;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
    nameImg: string;
    setNameImg: React.Dispatch<React.SetStateAction<string>>;
    imgFile: any;
    setImgFile: any;
    createPost: () => void;

    setPostBlogTitle: React.Dispatch<React.SetStateAction<string>>;
    setPostBlogText: React.Dispatch<React.SetStateAction<string>>;
    setPostBlogShortDescription: React.Dispatch<React.SetStateAction<string>>;
    createPostSaveAsDraft: () => void;
    closeModal: () => void;
}

const AddPostForAProfileOrBlogModal: React.FC<PropsType> = React.memo(({
    tab,
    setTab,
    createPost,
    closeModal,
    content,
    setContent,
    title,
    setTitle,
    nameImg,
    imgFile,
    setImgFile,
    setNameImg,
    createPostSaveAsDraft,
    setPostBlogShortDescription,
    setPostBlogText,
    setPostBlogTitle
}) => {

    const cleanUpThePhoto = () => {
        setImgFile(null)
        setNameImg('')
    }

    const customTitleForm = 'Для создания поста на стене профиля или в блоге Вам необходимо заполнить поля ниже.'

    return (
        <Row className={classes.row}>
            <Col span={24} className={classes.headerBlockModal}>
                <span className={classes.title}>Создать пост</span>
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
            <Col span={24} className={classes.wrapFormTabBlock}>
                <span className={classes.title}>
                    Во вкладках ниже выберите в каком месте Вы хотите создать пост.
                </span>
                <div className={classes.tabsModalAddPages}>
                    <div className={classes.wrapButtonTab}>
                        <div className={classes.buttonTabModal} onClick={() => setTab('profile')}><p>В профиле</p></div>
                        <div className={classes.buttonTabModal} onClick={() => setTab('blog')}><p>В блоге</p></div>
                    </div>
                    {tab === 'profile' && <AddPostForProfileFormModal
                        customTitleForm={customTitleForm}
                        title={title}
                        setTitle={setTitle}
                        content={content}
                        setContent={setContent}
                        nameImg={nameImg}
                        setNameImg={setNameImg}
                        imgFile={imgFile}
                        setImgFile={setImgFile}
                    />}
                    {tab === 'blog' && <AddPostForBlogFormModal
                        customTitleForm={customTitleForm}
                        setPostBlogTitle={setPostBlogTitle}
                        setPostBlogText={setPostBlogText}
                        setPostBlogShortDescription={setPostBlogShortDescription}
                    />}
                </div>
                <div className={classes.wrapFileblock}>
                    <Col className={classes.leftFileblock} span={7}>
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
                    </Col>
                    <Col className={classes.centerFileblock} span={10}>
                        <div className={classes.butonDraft} onClick={() => createPostSaveAsDraft()}>
                            <p>Cохранить как черновик</p>
                        </div>
                    </Col>
                    <Col className={classes.rightFileblock} span={7}>
                        <Button onClick={() => cleanUpThePhoto()} className={classes.cleanButton}>Убрать фото</Button>
                    </Col>
                </div>
            </Col>
            <Col span={24} className={classes.futerAddPostModal}>
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
                <div className={classes.rightBlock} onClick={() => createPost()}>
                    <p>Cоздать</p>
                </div>
            </Col>
        </Row>
    )
})
export default AddPostForAProfileOrBlogModal;