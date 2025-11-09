import React, { useEffect, useState } from "react";
import { CommentOutlined, DeleteOutlined, DislikeOutlined, EyeOutlined, LikeOutlined } from "@ant-design/icons";
import { ITrack } from "@packages/shared/src/types/musicTypes";
import TrackModalComment from "./TrackModalComment/trackModalComment";
import ModalWindows from "@packages/shared/src/components/ModalWindows";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { getPlaylistAC } from "@packages/shared/src/store/MusicReducers/playlistSlice";
import { deleteTrackAC, getTrackAC } from "@packages/shared/src/store/MusicReducers/trackSlice";
import classes from './styles.module.scss';

type PropsType = {
    track: ITrack
}

const ClickBlockItemTrack: React.FC<PropsType> = React.memo((props) => {
    const dispatch = useAppDispatch();
    const { newComment, newListen } = useAppSelector(state => state.track);
    const [countListens, setCountListens] = useState(props.track.listens);
    const [countComments, setCountComments] = useState(props.track.comments?.length);
    const [modalActive, setModalActive] = useState(false);

    useEffect(() => {
        if(props.track.trackId === newListen){
            let newListen = props.track.listens + 1
            setCountListens(newListen)  
        }
    },[newListen])

    useEffect(() => {
        if(props.track.trackId === newComment.trackId){
            let newComment = countComments + 1
            setCountComments(newComment)
        }
    },[newComment.commentId])

    const openModal = (e: any) => {
        setModalActive(true)
        dispatch(getTrackAC(props.track.trackId))
    }
    const delTrack = () => {
        dispatch(deleteTrackAC(props.track.trackId))
        .then(res => dispatch(getPlaylistAC()))
    }

    return (
        <div className={classes.iconBlockItemTrack} onClick={e => e.stopPropagation()}>
            <div className={classes.viewsTrack}><EyeOutlined className={classes.viewsIconTrack}/><strong>{countListens}</strong></div>
            <div className={classes.likeddislikedBlock}>
                <div className={classes.likeTrack}><LikeOutlined className={classes.likeIconTrack}/><strong>{props.track.like}</strong></div>
                <div className={classes.dislikeTrack}><DislikeOutlined className={classes.dislikeIcon}/><strong>{props.track.dislike}</strong></div>
            </div>
            <div onClick={openModal} className={classes.commentsTrack}><CommentOutlined className={classes.commentsIcon} />
                <strong>{countComments}</strong>
            </div>
            <ModalWindows modalActive={modalActive} setModalActive={setModalActive}>
                <TrackModalComment setModalActive={setModalActive}/> 
            </ModalWindows>
            <div onClick={delTrack} className={classes.deleteTrack}><DeleteOutlined className={classes.deleteIcon} /></div>
        </div>
    )
})
export default ClickBlockItemTrack