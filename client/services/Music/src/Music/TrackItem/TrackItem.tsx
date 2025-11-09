import React, { useEffect, useRef } from "react";
import { Col } from "antd";
import { ITrack } from "@packages/shared/src/types/musicTypes";
import { CaretRightOutlined, PauseOutlined } from "@ant-design/icons";
import ClickBlockItemTrack from "./clickBlockItemTrack";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { pauseTrackAC, playTrackAC } from "@packages/shared/src/store/MusicReducers/playerSlice";
import { clickTrackIdAC, onDoubleClickIdAC, setItemPauseTrackIdAC, setItemPlayTrackIdAC, setNewActiveTrackIdAC, setStatePlayPauseTrackIdAC } from "@packages/shared/src/store/MusicReducers/trackSlice";
import classes from './styles.module.scss';

type TrackPropsType = {
    track: ITrack;
}

const TrackItem: React.FC<TrackPropsType> =  React.memo(({track}) => {
    const dispatch = useAppDispatch();
    // const { active, pause, currentTime, duration, volume } = useAppSelector(state => state.player);
    const { activeTrackId, clickTrackId, setStatePlayPauseTrack } = useAppSelector(state => state.track);

    const play = (e: any) => {
        e.stopPropagation()
        dispatch(setItemPlayTrackIdAC(track.trackId)) 
        dispatch(playTrackAC())
    }
    const pause = (e: any) => {
        e.stopPropagation()
        dispatch(setItemPauseTrackIdAC(track.trackId))
        dispatch(pauseTrackAC())
    }

    // const play = () => {
    //     console.log("Play", active);
    //     if (pause) {
    //         dispatch(playTrackAC());
    //         audio.play()
    //         .catch(e => console.error("play() failed", e));
    //         dispatch(setNewActiveTrackIdAC(active?.trackId !== undefined ? active?.trackId : null));
    //         dispatch(setStatePlayPauseTrackIdAC('play'));
    //     } else {
    //         dispatch(pauseTrackAC());
    //         dispatch(setNewActiveTrackIdAC(active?.trackId !== undefined ? active?.trackId : null));
    //         dispatch(setStatePlayPauseTrackIdAC('pause'));
    //         audio.pause();
    //     }
    // };

    const onDoubleClick = () => {
        dispatch(onDoubleClickIdAC(track.trackId)) 
        dispatch(playTrackAC())
    }

    const clickTrack = (e: any) => {
        e.stopPropagation()
        dispatch(clickTrackIdAC(track.trackId))
    }   

    return (
        <>
            <div className={track.trackId === activeTrackId ? `${classes.trackActive}` : "" || clickTrackId ===  track.trackId ? `${classes.clickTrack}` : ""} onClick={clickTrack}>
                <Col className={classes.wrapTrackItem} onDoubleClick={onDoubleClick}>
                    <div className={classes.trackItem}>
                        <div className={classes.nameBlockItemTrack}>
                            {activeTrackId === track.trackId 
                                ? 
                                <button onClick={pause} className={classes.playerButton}>
                                    {setStatePlayPauseTrack === 'pause' 
                                    ?
                                        <CaretRightOutlined className={classes.iconPlayPause}/>
                                    :
                                        <PauseOutlined  className={classes.iconPlayPause}/>
                                    }
                                </button>
                                : 
                                <button onClick={play} className={classes.playerButton} >
                                    <CaretRightOutlined className={classes.iconPlayPause}/>
                                </button>
                            }
                            <div className={classes.trackName}>{track.name}{track.artist}</div>
                        </div>
                        <div className={classes.trackDuration}>{track.duration}</div>
                    </div>
                    <ClickBlockItemTrack track={track}/>
                </Col>
            </div>
        </>
    )
})
export default TrackItem