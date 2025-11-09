import { Col } from "antd";
import React, { ReactElement } from "react";
import { IComment, ITrack } from "@packages/shared/src/types/musicTypes";
import TrackItem from "../TrackItem/TrackItem";
import classes from './styles.module.scss';

type TrackListPropsType = {
    tracks: ITrack[]
}

const TrackList: React.FC<TrackListPropsType> = React.memo(({tracks}) => {
    return (
        <div className={classes.playlist}>
            {tracks?.map(track => 
                <TrackItem 
                    key={track.trackId}
                    track={track}      
                />
            )}
        </div>
    )
})
export default TrackList;