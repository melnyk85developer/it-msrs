import React, { useState } from "react";
import { SoundOutlined, StopOutlined } from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { Col } from "antd";
import { MdVolumeOff, MdVolumeUp } from "react-icons/md";
import { IoVolumeHighSharp, IoVolumeMute } from "react-icons/io5";
import classes from './styles.module.scss';
import { setVolumeTrackAC } from "@packages/shared/src/store/MusicReducers/playerSlice";

type PropsType = {
    left: number
    right: number
    onChange: (e: any) => void
}

const TrackProgressVolume: React.FC<PropsType> = ({left, right, onChange}) => {
    const dispatch = useAppDispatch();
    const [numberVolume, setNumberVolume] = useState(0);

    const maxVolume = () => {
        dispatch(setVolumeTrackAC(100))
    } 
    const yesVolume = () => {
        dispatch(setVolumeTrackAC(numberVolume))
    }
    const noVolume = () => {
        dispatch(setVolumeTrackAC(0))
        setNumberVolume(left)
    }

    return (
        <div className={classes.wrapInputTrackProgressVolume}>
            <div className={classes.wrapIconsPlayerVolume}>
                {
                    left > 0 
                    ? <MdVolumeOff className={classes.iconPlayerVolumeNone} onClick={noVolume}/> //<IoVolumeHighSharp className={classes.iconPlayerVolumeActive} onClick={noVolume} /> // <IoVolumeHighOutline /> <IoVolumeHigh />
                    : <MdVolumeUp className={classes.iconPlayerVolumeActive} onClick={yesVolume} /> //<IoVolumeMuteOutline /><IoVolumeMuteSharp />
                }
            </div>
            <input className={classes.inputTrackProgressVolume}
                type="range"
                min={0}
                max={right}
                value={left}
                onChange={onChange}
            />
            <div className={classes.trackProgressNumberVolume} onClick={maxVolume}>{left}</div>
        </div>
    )
}
export default TrackProgressVolume