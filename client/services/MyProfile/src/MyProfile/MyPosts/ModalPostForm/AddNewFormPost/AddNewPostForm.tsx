import React, { useState } from "react";
import { Col } from "antd";
import ModalWindow from "@packages/shared/src/components/ModalWindows";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { addPostMyProfileAC } from "@packages/shared/src/store/MyProfileReducers/myProfileSlice";
import { IUser } from "@packages/shared/src/types/IUser";
import classes from './styles.module.scss';
import AddPostForAProfileOrBlogModal from "../FormAddPostForAProfileOrBlog/formAddPostForAProfileOrBlog";
import { CreatePostsType } from "@packages/shared/src/types/types";
import { createPostAsBlogAC } from "@packages/shared/src/store/BlogsReducers/blogsSlice";
import { useAppSelector } from "@packages/shared/src/components/hooks/redux";

type PropsType = {
    profileId: string
    authorizedUser: IUser;
    dispatch: AppDispatch;
    error: string
}
type Tab = 'profile' | 'blog';

const AddPostForm: React.FC<PropsType> = React.memo(({
    dispatch,
    profileId,
    authorizedUser,
    error
}) => {
    const { blogs } = useAppSelector(state => state.blogsPage);
    // const content = useInput('');
    const [tab, setTab] = useState<Tab>('profile');

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [nameImg, setNameImg] = useState<string>(null);
    const [imgFile, setImgFile] = useState<File>(null);
    const [modalActive, setModalActive] = useState(false);

    const [postBlogTitle, setPostBlogTitle] = useState(null);
    const [postBlogText, setPostBlogText] = useState(null);
    const [postBlogShortDescription, setPostBlogShortDescription] = useState(null);


    const createPostForProfile = () => {
        const post: CreatePostsType = {
            title: title,
            content: content,
            profileId: authorizedUser.id,
            image: imgFile
        }
        dispatch(addPostMyProfileAC(post))
            .then(() => setModalActive(false))
    }
    const createPostForBlog = () => {
        if (blogs.length) {
            const newPost = {
                title: postBlogTitle,
                shortDescription: postBlogShortDescription,
                content: postBlogText,
                blogId: blogs[0].id
            };
            dispatch(createPostAsBlogAC(newPost))
                .then(() => setModalActive(false))
        }
    }
    const createPost = () => {
        if (tab === 'profile') {
            createPostForProfile()
        } else {
            createPostForBlog()
        }
    }
    const createPostSaveAsDraft = () => {
        const post = {
            title: title,
            content: content,
            profileId: authorizedUser.id,
            image: imgFile,
            postedByUserId: authorizedUser.id
        }
        dispatch(addPostMyProfileAC(post))
            .then(() => setModalActive(false))
    }

    const openModal = () => {
        return setModalActive(true)
    }
    const closeModal = () => {
        setModalActive(false)
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
            <ModalWindow modalActive={modalActive} setModalActive={setModalActive} isSetModal={0}>
                <AddPostForAProfileOrBlogModal
                    tab={tab}
                    setTab={setTab}
                    title={title}
                    setTitle={setTitle}
                    content={content}
                    setContent={setContent}
                    nameImg={nameImg}
                    setNameImg={setNameImg}
                    imgFile={imgFile}
                    setImgFile={setImgFile}
                    createPost={createPost}

                    setPostBlogTitle={setPostBlogTitle}
                    setPostBlogText={setPostBlogText}
                    setPostBlogShortDescription={setPostBlogShortDescription}
                    createPostSaveAsDraft={createPostSaveAsDraft}
                    closeModal={closeModal}
                />
            </ModalWindow>
        </Col>
    )
})
export default AddPostForm;