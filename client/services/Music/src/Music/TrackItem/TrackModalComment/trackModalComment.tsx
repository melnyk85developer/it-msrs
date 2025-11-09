import React from "react";
import { Button, Col } from "antd";
import { useInput } from "@packages/shared/src/components/hooks/useInput";
import { CloseOutlined } from "@ant-design/icons";
import { commentTrackAC, getTrackAC } from "@packages/shared/src/store/MusicReducers/trackSlice";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { API_URL } from "@packages/shared/src/http";
import classes from '../styles.module.scss';

type PropsType = {
    setModalActive: any
}

const TrackModalComment: React.FC<PropsType> = ({setModalActive}) => {
    const dispatch = useAppDispatch();
    const { isAuth, authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage);
    const { track } = useAppSelector(state => state.track);
    const username = useInput('')
    const text = useInput('')

    let name: string;

    if(authorizedUser.name !== null){
        name = authorizedUser.name
    }

    const addComment = async () => {
        dispatch(commentTrackAC(name, text.value, track._id))
            .then(res => dispatch(getTrackAC(track._id)))
    }
    const click = () => {
        setModalActive(false)
    }
    return (
        <Col onClick={e => e.stopPropagation()}>
            <div className={classes.headModalComments}>
                <CloseOutlined className={classes.iconClosedComments} onClick={click}/>
            </div>
            <div className={classes.trackModal}>
                <img src={API_URL + track.picture} width={90} height={90}/>
                <div className={classes.wrapTextItemComment}>
                    <h2>Название трека - {track.name}</h2>
                    <h2>Исполнитель - {track.artist}</h2>
                    <h2>Прослушиваний - {track.listens}</h2>
                </div>
            </div>
            <Col className={classes.trackFormCommentBlock}>
                <h1>Коментарии к треку:</h1>
                {track.comments?.length ? track.comments.map((comment: any) => (
                    <div key={comment._id}>
                        <div><p>Автор: {comment.username}</p></div>
                        <div><p>Текст: {comment.text}</p></div>
                    </div>
                )) : <h3>Здесь пока нет комментариев, но Вы можете быть первым кто оставит комментарий к этому треку!</h3>}
                {}
            </Col>
            <div className={classes.blockInputComments}>
                <input {...username} className={`${classes.search} ${classes.cursor}`} type="text" name="search" placeholder="Ваше имя"/>
                <input {...text} className={`${classes.search} ${classes.cursor}`} type="text" name="search" placeholder="Комментарий"/>
                <Button onClick={addComment} style={{width: "100%"}}>Отправить</Button>
            </div>
        </Col>
    )
}
export default TrackModalComment;