import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { EllipsisOutlined, FrownOutlined, ExclamationOutlined, MoreOutlined, DeleteOutlined, EditOutlined, PushpinOutlined, RestOutlined } from "@ant-design/icons";
import editThePostMarker from "@packages/shared/src/assets/editTheAvatar.png"
import ModalWindow from '@packages/shared/src/components/ModalWindows';
import ContentModalMenuPostDelete from './ContentModalMenuPostDelete/index'
import classes from './styles.module.scss';
import ContentModalMenuPostAppeal from './ContentModalMenuPostAppeal';
import { AppDispatch } from '@packages/shared/src/store/redux-store';
import { IProfile } from '@packages/shared/src/types/IUser';
import { AuthorPostType, PostsType } from '@packages/shared/src/types/types';
import { addPostMyProfileAC, pinPostMyProfileAC, updatePostMyProfileAC } from '@packages/shared/src/store/MyProfileReducers/myProfileSlice';
import ModalAddPost from '../AddNewFormPost/ModalAddPost';

type PropsType = {
    postId: number
    post: PostsType
    isPinPost: boolean
    profileId: number
    authorizedUserId: number
    dispatch: AppDispatch
    setIsPinPost: Dispatch<boolean>
    setHandleDeletePostId: Dispatch<number>
    setShowDeletedMessage: Dispatch<boolean>
}

const PostMenu: React.FC<PropsType> = React.memo(({ 
    dispatch, postId, post, profileId, authorizedUserId, isPinPost, setIsPinPost, setHandleDeletePostId, setShowDeletedMessage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalActiveDelete, setModalActiveDelete] = useState(false);
    const [modalActiveAppeal, setModalActiveAppeal] = useState(false);

    const [modalActiveUpdatePost, setModalActiveUpdatePost] = useState(false);
    const menuRef = useRef(null);

    const [title, setTitle] = useState(post.title);
    const [content, setContent] = useState(post.content);
    const [nameImg, setNameImg] = useState<string>(post.image);
    const [imgFile, setImgFile] = useState<File>(null);

    const handleToggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const setPost = (title?: string, content?: string) => {
        const post = {
            title,
            content,
            postId,
            profileId,
            image: imgFile,
            pin: isPinPost,
            authorizedUserId
        }
        dispatch(updatePostMyProfileAC(post))
        .then(() => setModalActiveUpdatePost(false))
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
    
        document.addEventListener('click', handleClickOutside);
    
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);


    const handlePinPost = () => {
        const newPinValue = !isPinPost;
        setIsPinPost(newPinValue);
        const pinPost = {
            pin: newPinValue,
            postId,
            authorizedUserId
        };
        dispatch(pinPostMyProfileAC(pinPost));
    };
    const handleEditPost = () => {
        setModalActiveUpdatePost(true)
    };

    const handleAppealPost = () => {
        setModalActiveAppeal(true)
    };

    const handleDeletePost = () => {
        setModalActiveDelete(true)
    };

  return (
    <div className={classes.post_menu}  ref={menuRef} onClick={handleToggleMenu}>
        <div className={classes.menu_icon_toggle} >
            {/* <EllipsisOutlined /> */}
            <MoreOutlined />
        </div>
        {isOpen && (
            <ul className={classes.wrap_menu_options}>
                {!isPinPost 
                    ? 
                    <div className={classes.li} onClick={handlePinPost}>
                        <strong>Закрепить пост</strong>
                        <PushpinOutlined />
                    </div>
                    : 
                    <div className={classes.li} onClick={handlePinPost}>
                        <strong>Открепить пост</strong>
                        <PushpinOutlined />
                    </div>
                }
                {authorizedUserId === post.postedByUserId
                    ?
                    <div className={classes.li} onClick={handleEditPost}>
                        <strong>Редактировать пост</strong>
                        <EditOutlined />
                    </div>
                    :
                    <></>
                }
                {authorizedUserId !== post.postedByUserId
                    ?
                    <div className={classes.li} onClick={handleAppealPost}>
                        <strong>Пожаловаться</strong>
                        <FrownOutlined />
                        {/* <ExclamationOutlined /> */}
                    </div>
                    :
                    <></>
                }
                <div className={classes.li} onClick={handleDeletePost}>
                    <strong>Удалить пост</strong>
                    <DeleteOutlined />
                    {/* <RestOutlined /> */}
                </div>
            </ul>
        )}
        <ModalWindow modalActive={modalActiveDelete} setModalActive={setModalActiveDelete}>
            <ContentModalMenuPostDelete 
                postId={postId} 
                dispatch={dispatch} 
                authorizedUserId={authorizedUserId} 
                setModalActive={setModalActiveDelete}
                setHandleDeletePostId={setHandleDeletePostId}
                setShowDeletedMessage={setShowDeletedMessage}
            />
        </ModalWindow>
        <ModalWindow modalActive={modalActiveUpdatePost} setModalActive={setModalActiveUpdatePost}>
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
                setModalActive={setModalActiveUpdatePost}
                titleModal={'Редактировать пост'}
            />
        </ModalWindow>
        <ModalWindow modalActive={modalActiveAppeal} setModalActive={setModalActiveAppeal}>
            <ContentModalMenuPostAppeal dispatch={dispatch} setModalActiveAppeal={setModalActiveAppeal}/>
        </ModalWindow>
    </div>
  );
});

export default PostMenu;
