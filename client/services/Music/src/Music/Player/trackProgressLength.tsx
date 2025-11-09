import React from "react";
import { Col } from "antd";
import classes from './styles.module.scss';

type PropsType = {
    value: any
    left: string
    right: string
    onChange: (e: any) => void
}

const TrackProgressLength: React.FC<PropsType> = ({value ,left, right, onChange}) => {
    // console.log("Ползунок")
    return (
        <div className={classes.wrapInputTrackProgressLength}>
            <input className={classes.inputTrackProgressLength}
                type="range"
                min={0}
                max={right}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}
export default TrackProgressLength