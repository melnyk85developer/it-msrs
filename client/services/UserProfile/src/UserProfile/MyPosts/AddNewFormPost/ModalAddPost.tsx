import React, { useState } from "react";
import { Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { PaperClipOutlined } from "@ant-design/icons";
import paperСlip from "@packages/shared/src/assets/skrepka.png"
import classes from './styles.module.scss';
import FileUpload from "@packages/shared/src/components/FileUpload/fileUpload";

type PropsType = {
    title: any;
    setTitle: any;
    content: any;
    setContent: any;
    nameImg: any;
    setNameImg: any;
    imgFile: any;
    setImgFile: any;
    setModalActive: any;
    setPost: (content: string, title?: string) => void;
    titleModal: string
}

const ModalAddPost: React.FC<PropsType> = React.memo(({
    setModalActive, setPost, content, setContent, title, setTitle, nameImg, setImgFile, setNameImg, titleModal}) => {

    const cleanUpThePhoto = () => {
        setImgFile(null)
        setNameImg('')
    }

    const addPost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
          alert('Текст поста должен быть обязательно заполнен.');
          return;
        }
        setPost(title, content);
        setTitle('');
        setContent('');
    }
    const closeModal = () => {
        return setModalActive(false)
    }
    return (
        <div className={classes.wrapModalAddPost}>
            <div className={classes.headerModalAddPost}>
                <h2>{titleModal}</h2>
                <CloseOutlined className={classes.closedModalIcon} onClick={closeModal}/>
            </div>
            <form onSubmit={addPost}>
                <div className={classes.wrapTitleInputModalPost}>
                    <strong>Текст заголовка не обязательно писать, это пожеланию.</strong>
                    <input
                        type="text"
                        placeholder="Заголовок"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={classes.inputTitleModalPostProfile}
                    />
                </div>
                <div className={classes.wrapTextAreaModalPost}>
                    <strong>Текст поста должен быть обязательно.</strong>
                    <textarea
                        placeholder="Текст"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className={classes.inputTextModalPostProfile}
                    />
                </div>
                <div className={classes.wrapFileblock}>
                    <FileUpload setFile={setImgFile} setNameImg={setNameImg}>
                        <div className={classes.fileBlock}>
                            {/* <PaperClipOutlined /> */}
                            <img src={paperСlip} alt="skrepka"/>
                            <strong>Прикрепить фото</strong>
                        </div>
                    </FileUpload>
                    <div className={classes.fileNameImg}>
                        {nameImg !== null ? <p>Файл {nameImg}</p> : null}
                    </div>
                    <Button onClick={() => cleanUpThePhoto()} className={classes.cleanButton}>Убрать фото</Button>
                </div>
                <Button htmlType="submit" className="ant-btn-primary">Опубликовать пост</Button>
            </form>
        </div>
    )
})
export default ModalAddPost