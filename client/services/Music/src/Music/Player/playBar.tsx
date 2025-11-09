import React from "react";
import { BackwardOutlined, BorderOutlined, CaretRightOutlined, FastBackwardOutlined, FastForwardOutlined, ForwardOutlined, PauseOutlined } from "@ant-design/icons";
import TrackProgressLength from "./trackProgressLength";
import TrackProgressVolume from "./trackProgressVolume";
import { FaPause, FaPlay, FaSquare } from "react-icons/fa6";
import { GrChapterNext, GrChapterPrevious } from "react-icons/gr";
import { TbPlayerPause, TbPlayerPauseFilled, TbPlayerPlay, TbPlayerPlayFilled, TbPlayerStop, TbPlayerStopFilled, TbPlayerTrackNext, TbPlayerTrackNextFilled, TbPlayerTrackPrev, TbPlayerTrackPrevFilled } from "react-icons/tb"
import classes from './styles.module.scss';

type PropsType = {
    volume: number
    sliderCurrentTime: number
    formatCurrentTime: string
    formattedDuration: string
    pause: boolean
    play: () => void
    stopTrack: () => void
    prevTrack: () => void
    nextTrack: () => void
    changeCurrentTime: (e: any) => void
    changeVolume: (e: React.ChangeEvent<HTMLInputElement | any>) => void
    // audioRef: React.RefObject<HTMLAudioElement>
}

const PlayBar: React.FC<PropsType> = (props) => {
    const { sliderCurrentTime, formatCurrentTime, formattedDuration, pause,
        play, stopTrack, prevTrack, nextTrack, changeCurrentTime, changeVolume, volume } = props;

    return (
        <div className={classes.wrappPlayBar}>
            <div className={classes.playBar}>
                <TrackProgressLength
                    value={!isNaN(sliderCurrentTime) ? sliderCurrentTime : 0}
                    left={formatCurrentTime}
                    right={formattedDuration}
                    onChange={changeCurrentTime}
                />
                <div className={classes.wrapPlayerButton}>
                    <div className={classes.playerButtonPanel}>
                        {pause
                            ?
                            <button onClick={play} className={classes.playerButton}>
                                {/* <FaPlay className={classes.iconPlayPause} /> */}
                                <TbPlayerPlay className={classes.iconPlayPause} />
                                <TbPlayerPlayFilled className={classes.iconPlayPause} />
                            </button>
                            :
                            <button onClick={play} className={classes.playerButton}>
                                {/* <FaPause className={classes.iconPlayPause} /> */}
                                <TbPlayerPause className={classes.iconPlayPause} />
                                <TbPlayerPauseFilled className={classes.iconPlayPause} />
                            </button>
                        }
                        <button onClick={stopTrack} className={classes.playerButton}>
                            {/* <FaSquare className={classes.iconStopMusic} /> */}
                            <TbPlayerStop className={classes.iconStopMusic} />
                            <TbPlayerStopFilled className={classes.iconStopMusic} />
                        </button>
                        <button onClick={prevTrack} className={classes.playerButton}>
                            {/* <GrChapterPrevious className={classes.iconPlayPause}/> */}
                            <TbPlayerTrackPrev className={classes.iconPlayPause}/>
                            <TbPlayerTrackPrevFilled className={classes.iconPlayPause} />
                        </button>
                        <button onClick={nextTrack} className={classes.playerButton}>
                            {/* <GrChapterNext className={classes.iconPlayPause}/> */}
                            <TbPlayerTrackNext className={classes.iconPlayPause} />
                            <TbPlayerTrackNextFilled className={classes.iconPlayPause} />
                        </button>
                        <div className={classes.trackProgressNumberLength}>{formatCurrentTime} / {formattedDuration}</div>
                        <TrackProgressVolume left={volume} right={100} onChange={changeVolume} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayBar;
