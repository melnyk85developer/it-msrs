import React, { useState } from "react";
import { Col } from "antd";
import ModalWindow from "@packages/shared/src/components/ModalWindows";
import ModalAddPost from "./ModalAddPost";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { addPostMyProfileAC } from "@packages/shared/src/store/MyProfileReducers/myProfileSlice";
import { IUser } from "@packages/shared/src/types/IUser";
import classes from './styles.module.scss';

type PropsType = {
    profileId: number
    authorizedUser: IUser;
    dispatch: AppDispatch;
    error: string
}

const AddPostForm: React.FC<PropsType> = React.memo(({dispatch, profileId, authorizedUser, error}) => {
    // const content = useInput('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [nameImg, setNameImg] = useState<string>(null);
    const [imgFile, setImgFile] = useState<File>(null);
    const [modalActive, setModalActive] = useState(false);

    const setPost = (title: string, content: string) => {
        const post = {
            title,
            content,
            profileId,
            image: imgFile,
            // postedByUserId: authorizedUser.userId
        }
        dispatch(addPostMyProfileAC(post))
        .then(() => setModalActive(false))
    }

    const openModal = () => {
        return setModalActive(true)
    }

    return (
        <Col className={classes.wrapMyPost}>
            <div onClick={() => openModal()} className={classes.wrapInputFormPost}>
                <input 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={classes.inputPostProfile} 
                    type="text" 
                    name="text" 
                    placeholder="Что у Вас нового?"
                />
            </div>
            <ModalWindow modalActive={modalActive} setModalActive={setModalActive}>
                <ModalAddPost 
                    setPost={setPost}
                    title={title}
                    setTitle={setTitle}
                    content={content}
                    setContent={setContent}
                    nameImg={nameImg}
                    setNameImg={setNameImg}
                    imgFile={imgFile}
                    setImgFile={setImgFile}
                    setModalActive={setModalActive}
                    titleModal={'Написать пост'}
                />
            </ModalWindow>
        </Col>
    )
})
export default AddPostForm;