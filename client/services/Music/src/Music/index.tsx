import React, { useEffect, useState } from "react";
import WidgetFriends from "@packages/shared/src/components/Widgets/WidgetFriends";
import WidgetPeople from "@packages/shared/src/components/Widgets/WidgetsPeople";
import WidgetYofamiliar from "@packages/shared/src/components/Widgets/WidgetPerhapsYoureFamiliar";
import TrackList from "./TrackList/TrackList";
import Player from "./Player/player";
import { UploadOutlined } from "@ant-design/icons";
import UploadTrackModal from "./UploadTrackModal/uploadTrackModal";
import { useAppContext } from "@packages/shared/src/components/contexts/AppContext";
import ModalWindows from "@packages/shared/src/components/ModalWindows";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { getPlaylistAC, searchTracksAC } from "@packages/shared/src/store/MusicReducers/playlistSlice";
import { setContentSpanAC, setFooterAC, setLSidebarAC, setLSidebarSpanAC, setRSidebarAC, setRSidebarSpanAC, SIDEBAR_ON, FOOTER_ON } from "@packages/shared/src/store/PageElementsSlice/pageElementsSlice";
import { Col } from "antd";
import routeMain from "./routes";
import classes from './styles.module.scss';

const Music: React.FC =  React.memo(() => {
    const dispatch = useAppDispatch();
    const { setContent } = useAppContext();
    const { isDarkTheme } = useAppSelector(state => state.authPage);
    const { tracks, error } = useAppSelector(state => state.playlist);
    const [query, setQuery] = useState<string>('')
    const [timer, setTimer] = useState<any>(null)
    const [modalActive, setModalActive] = useState(false);

console.log("Music",  tracks)

    useEffect(() => {
        dispatch(getPlaylistAC())
        dispatch(setLSidebarAC(SIDEBAR_ON));
        dispatch(setLSidebarSpanAC(5));
        dispatch(setContentSpanAC(10));
        dispatch(setRSidebarAC(SIDEBAR_ON));
        dispatch(setRSidebarSpanAC(5));
        dispatch(setFooterAC(FOOTER_ON));
    }, [])

    if(error){
        console.error(error)
    }
    const openModal = () => {
        setModalActive(true)
    }
    const search = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
        if(timer){
            clearTimeout(timer)
        }
        setTimer(
            setTimeout( async () => {
                await dispatch(searchTracksAC(e.target.value))
            }, 500)
        )
    }
    const newContent = () => ({
        contentTopNav: [
            <div className={classes.wrapPlayerTopNav}>
                <div className={classes.leftBlockTopNavMusic}></div>
                {/* <Player/> */}
                <div className={classes.rightBlockTopNavMusic}></div>
            </div>
        ] as React.ReactNode[],
        contentLsidebar: [
            <div className={classes.wrapWidgetFriendsProfile}>
                {/* <WidgetYofamiliar />
                <WidgetPeople />
                <WidgetFriends /> */}
            </div>
        ],
        contentRsidebar: [
            <div className={classes.wrapWidgetFriendsProfile}>
                {/* <WidgetYofamiliar />
                <WidgetPeople />
                <WidgetFriends /> */}
            </div>
        ],
        contentFooter: [
            <div className={`
                ${classes.wrapFooterSectionsForMusic}
                ${isDarkTheme !== "light" 
                    ? classes.dark 
                    : classes.light 
                }
            `}>
                <Col className={classes.footer_sections}>
                    <p>Блок 1</p>
                </Col>
                <Col className={classes.footer_sections}>
                    <p>Блок 2</p>
                </Col>
                <Col className={classes.footer_sections}>
                    <p>Блок 3</p>
                </Col>
                <Col className={classes.footer_sections}>
                    <p>Блок 4</p>
                </Col>
            </div>
        ]
    });

    useEffect(() => {
        setContent(newContent);
    }, []);

    return (
        <>
            <div className={classes.wrapContentPlaylist}>
                <Player/>
                <div className={classes.wrapPlaylist}>
                    <input 
                        value={query} 
                        onChange={search} 
                        className={classes.searchMusic} 
                        type="text" 
                        name="search" 
                        placeholder="Поиск треков"
                    />
                    <TrackList 
                        tracks={tracks}   
                    />
                </div>
                <div className={classes.blockUploadButtonTrack} onClick={openModal}>
                    <h3>Дополнить плейлист <UploadOutlined className={classes.uploadTrackIcan}/></h3>
                </div>
            </div>
            <ModalWindows modalActive={modalActive} setModalActive={setModalActive}>
                <UploadTrackModal setModalActive={setModalActive}/>
            </ModalWindows>
        </>
    )
})
export {routeMain};
export default Music;
