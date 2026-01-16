import React from "react";
import { Col, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import classes from './styles.module.scss'

type PropsType = {
    customTitleForm: string;
    setPostBlogTitle: React.Dispatch<React.SetStateAction<string>>;
    setPostBlogText: React.Dispatch<React.SetStateAction<string>>;
    setPostBlogShortDescription: React.Dispatch<React.SetStateAction<string>>;
}

const AddPostForBlogFormModal: React.FC<PropsType> = React.memo(({
    customTitleForm,
    setPostBlogTitle,
    setPostBlogText,
    setPostBlogShortDescription
}) => {

    return (
        <div className={classes.addPostForBlogFormModal}>
            <span className={classes.title}>
                {customTitleForm}
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
        </div>
    )
})
export default AddPostForBlogFormModal;