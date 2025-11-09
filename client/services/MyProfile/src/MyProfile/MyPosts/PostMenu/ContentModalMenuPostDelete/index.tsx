import React, { Dispatch } from "react";
import classes from './styles.module.scss';
import { Button } from "antd";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { deletePostMyProfileAC } from "@packages/shared/src/store/MyProfileReducers/myProfileSlice";

type PropsType = {
    postId: number
    setModalActive: any
    authorizedUserId: number
    dispatch: AppDispatch
    setHandleDeletePostId: Dispatch<number>
    setShowDeletedMessage: Dispatch<boolean>
}

const ContentModalMenuPostDelete: React.FC<PropsType> = React.memo(({ dispatch, postId, authorizedUserId, setModalActive, setHandleDeletePostId, setShowDeletedMessage }) => {

    const happyEndDeletePost = () => {
        console.log('HAPPY END')
        setModalActive(false)
        setHandleDeletePostId(postId)
        setShowDeletedMessage(true);
    }

    const noDeleteClick = () => {
        setModalActive(false)
    }

    const yesDeleteClick = () => {
        dispatch(deletePostMyProfileAC(postId, authorizedUserId))
        .then(() => happyEndDeletePost())

    }

    return (
        <div className={classes.wrapModalContentMenuPost}>
            <h2>Вы точно уверены, что хотите удалить этот пост?</h2>
            <h3>Поскольку отменить это действие будет не возможно!</h3>
            <h3>Из корзины не востановите, её тут нет.</h3>
            <div className={classes.wrapButton}>
                <Button onClick={yesDeleteClick} className={classes.button}>Да</Button>
                <Button onClick={noDeleteClick} className={classes.button}>Нет</Button>
            </div>
        </div>
    )
})
export default ContentModalMenuPostDelete