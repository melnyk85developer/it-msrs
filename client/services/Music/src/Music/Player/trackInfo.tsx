import React from "react";
import { useAppSelector } from "@packages/shared/src/components/hooks/redux";
import classes from './styles.module.scss';

const TrackInfo: React.FC =  React.memo((props) => {
    const { active } = useAppSelector(state => state.player);

    return (
        <div className={classes.wrapTickerPlayer}>
            <div className={classes.tickerPlayer}>
                <div className={classes.runningTextContainer}>
                <div className={classes.runningText}>
                    <strong>.::: {active?.name} :::.</strong>
                </div>
                </div>
            </div>
        </div>
    );
});

export default TrackInfo;