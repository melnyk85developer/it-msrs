import TrackInfo from "./trackInfo";
import VisualBlock from "./visualBlock";
import PlayBar from "./playBar";
import secondsToMMSS from "../../../../../packages/shared/src/components/utils/secondsToMMSS";
import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { API_URL } from "@packages/shared/src/http";
import { listensTrackAC, setNewActiveTrackIdAC, setStatePlayPauseTrackIdAC } from "@packages/shared/src/store/MusicReducers/trackSlice";
import { pauseTrackAC, playTrackAC, setActiveTrackAC, setCurrentTimeTrackAC, setDurationTrackAC, setVolumeTrackAC } from "@packages/shared/src/store/MusicReducers/playerSlice";
import classes from './styles.module.scss';

let audio: HTMLAudioElement;

const Player: React.FC = React.memo(() => {
    const dispatch = useAppDispatch();
    const { tracks } = useAppSelector(state => state.playlist);
    const { active, pause, currentTime, duration, volume } = useAppSelector(state => state.player);
    const { itemPauseTrackId, itemPlayTrackId, onDoubleClickId } = useAppSelector(state => state.track);
    const sliderCurrentTime = Math.round((currentTime / duration) * 100);
    const formattedDuration = secondsToMMSS(duration - 1);
    const formatCurrentTime = secondsToMMSS(currentTime);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (!audio) {
            audio = new Audio();
            setAudio();
        } else {
            setAudio();
            play();
        }
    }, [active]);

    const play = () => {
        console.log("Play", active);
        if (pause) {
            dispatch(playTrackAC());
            audio.play()
            .catch(e => console.error("play() failed", e));
            dispatch(setNewActiveTrackIdAC(active?.trackId !== undefined ? active?.trackId : null));
            dispatch(setStatePlayPauseTrackIdAC('play'));
        } else {
            dispatch(pauseTrackAC());
            dispatch(setNewActiveTrackIdAC(active?.trackId !== undefined ? active?.trackId : null));
            dispatch(setStatePlayPauseTrackIdAC('pause'));
            audio.pause();
        }
    };  
    const setAudio = () => {
        if (active) {
            const audioSrc = API_URL + '/' + active.audio;
            audio.src = audioSrc;
            audio.volume = volume / 100;
            audio.onloadedmetadata = () => {
                dispatch(setDurationTrackAC(Math.round(audio.duration)));
            };
            audio.ontimeupdate = () => {
                dispatch(setCurrentTimeTrackAC(Math.round(audio.currentTime)));
            };
            audio.onerror = () => {
                console.error(`Failed to load audio source: ${audioSrc}`);
            };
        }
    };
    const onDoubleClick = () => {
        for (let i = 0; i < tracks.length; i++) {
            console.log('onDoubleClick tracks', tracks)
            if (tracks[i].trackId === onDoubleClickId) {  
                dispatch(setActiveTrackAC(tracks[i]));
                dispatch(playTrackAC());
                play();
            }
        }
    };
    
    useEffect(() => {
        if (audio) {audio.volume = volume / 100}
    }, [volume]);
    useEffect(() => {
        onDoubleClick();
    }, [onDoubleClickId]);

    const playItemTrack = () => {
        for (let i = 0; i < tracks.length; i++) {
            if (tracks[i].trackId === itemPlayTrackId) {  
                dispatch(setActiveTrackAC(tracks[i]));
                dispatch(playTrackAC());
                play();
            }
        }
    };

    useEffect(() => {
        playItemTrack();
        console.log("playItemTrackClick");
    }, [itemPlayTrackId]);

    const pauseItemTrack = () => {
        console.log(itemPauseTrackId);
        if (active?.trackId === itemPauseTrackId) {
            dispatch(pauseTrackAC());
            play();
        }
    };

    useEffect(() => {
        pauseItemTrack();
        console.log("pauseItemTrackClick");
    }, [itemPauseTrackId]);

    const stopTrack = () => {
        dispatch(setActiveTrackAC(tracks[0]));
        dispatch(playTrackAC());
    };

    useEffect(() => {
        if (!active && tracks.length > 0) {
            dispatch(setActiveTrackAC(tracks[0]));
            dispatch(playTrackAC());
        }
    }, [tracks]);

    const prevTrack = () => {
        console.log('prevTrack')
        for (let i = 0; i < tracks.length; i++) {
            if (active?.trackId !== tracks[0].trackId) {
                if (tracks[i].trackId === active?.trackId) {
                    let numberTrack = i - 1;
                    console.log(tracks[numberTrack]);
                    dispatch(setActiveTrackAC(tracks[numberTrack]));
                    play();
                }
            } else {
                dispatch(setActiveTrackAC(tracks[0]));
                play();
            }
        }
    };
    const nextTrack = () => {
        console.log('nextTrack')
        for (let i = 0; i < tracks.length; i++) {
            if (tracks[i].trackId === active?.trackId) {
                i++;
                console.log(tracks[i]);    
                dispatch(setActiveTrackAC(tracks[i]));
                play();
            }
        }
    };

    useEffect(() => {
        if (active && currentTime === duration - 1) {
            dispatch(listensTrackAC(active.trackId));
            nextTrack();
        }
    }, [currentTime, duration]);

    const changeCurrentTime = (e: React.ChangeEvent<HTMLInputElement | any>) => {
        if (audio) {
            const time = Math.round((e.target.value / 100) * duration);
            audio.currentTime = time;
            dispatch(setCurrentTimeTrackAC(time));
        }
    };
    const changeVolume = (e: React.ChangeEvent<HTMLInputElement | any>) => {
        if (audio) {
            const newVolume = Number(e.target.value);
            audio.volume = newVolume / 100;
            dispatch(setVolumeTrackAC(newVolume));
        }
    };

    return (
        <div className={classes.wrapPlayer}>
            <TrackInfo />
            <VisualBlock 
                audioRef={audioRef} 
                active={active} 
                currentTime={currentTime} 
                duration={duration}
            />
            <PlayBar 
                pause={pause}
                volume={volume}
                sliderCurrentTime={sliderCurrentTime}
                formatCurrentTime={formatCurrentTime}
                formattedDuration={formattedDuration}
                play={play}
                stopTrack={stopTrack}
                prevTrack={prevTrack}
                nextTrack={nextTrack}
                changeVolume={changeVolume}
                changeCurrentTime={changeCurrentTime}
            />
        </div>
    );
});

export default Player;
