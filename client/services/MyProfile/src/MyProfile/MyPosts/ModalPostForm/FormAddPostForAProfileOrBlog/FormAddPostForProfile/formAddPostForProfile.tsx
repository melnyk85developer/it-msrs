import React from "react";
import { Col, Input, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import classes from './styles.module.scss'

type PropsType = {
    customTitleForm: string;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
    nameImg: any;
    setNameImg: any;
    imgFile: any;
    setImgFile: any;
}

const AddPostForProfileFormModal: React.FC<PropsType> = React.memo(({
    customTitleForm,
    setContent,
    setTitle,
    content,
    title,
    nameImg,
    setImgFile,
    setNameImg,
}) => {

    return (
        <div className={classes.addPostForProfileFormModal}>
            <span className={classes.title}>
                {customTitleForm}
            </span>
            <div className={classes.formContainer}>
                <div className={classes.inputWrapper}>
                    <label className={classes.label}>Заголовок поста (не обязательно)</label>
                    <Input
                        placeholder="Введите название заголовка..."
                        onChange={(e) => setTitle(e.target.value)}
                        className={classes.input}
                    />
                </div>
                <div className={classes.inputWrapper}>
                    <label className={classes.label}>Текст поста (обязательно)</label>
                    <TextArea
                        placeholder="Текст поста..."
                        rows={4}
                        onChange={(e) => setContent(e.target.value)}
                        style={{
                            resize: 'vertical',
                            maxHeight: '50vh',
                        }}
                        className={classes.textarea}
                    />
                </div>
            </div>
        </div>
    )
})
export default AddPostForProfileFormModal;