import React, { useEffect, useState } from "react";
import { useInput } from "@packages/shared/src/components/hooks/useInput";
import { Button, Col } from "antd";
import FileUpload from "./fileUpload";
import defaultImg from '../../../assets/fon_avatars.png'
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import secondsToMMSS from "@packages/shared/src/components/utils/secondsToMMSS";
import { getPlaylistAC } from "@packages/shared/src/store/MusicReducers/playlistSlice";
import { useAppDispatch, useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { postTrackAC } from "@packages/shared/src/store/MusicReducers/trackSlice";
import classes from '../styles.module.scss';

type DownloadTrackModalPropsType = {
    setModalActive: any
}

const UploadTrackModal: React.FC<DownloadTrackModalPropsType> = ({setModalActive}) => {
    const dispatch = useAppDispatch();
    const { isAuth, authorizedUser, isDarkTheme } = useAppSelector(state => state.authPage);

    const { track } = useAppSelector(state => state.track);
    const [selectedAudio, setSelectedAudio] = useState<any>(null);
    const [picture, setPicture] = useState<any>(null);
    const [nameTrack, setNameTrack] = useState('');
    const [nameImg, setNameImg] = useState('');
    const [newDuration, setNewDuration] = useState<number>(0);
    const [resultUpload, setResultUpload] = useState('');
    const [icon, setIcon] = useState<any>(<CheckOutlined className={classes.olUploadItem}/>)
    const formattedDuration = (secondsToMMSS(Number(newDuration -1)))
    const artist = useInput('');
    const name = useInput('');
    const text = useInput(authorizedUser && authorizedUser.name);

    const happyEndUpload = () => {
        setResultUpload('Загрузка прошла успешно!')
        dispatch(getPlaylistAC())
    }
    const newUpload = () => {
        setResultUpload('')
    }

    const uploadTrack = () => {
        dispatch(postTrackAC(nameTrack, text.value, artist.value, picture, selectedAudio, formattedDuration))
        .then(res => happyEndUpload())
    }
    const click = () => {
        setModalActive(false)
    }
    useEffect(() => {
        newUpload()
    },[nameImg])

    return (
        <Col>
            <div className={classes.trackUploadBlockH1}>

                {
                    picture && picture.name === null || nameTrack === ''
                    ? <h1>Выберите файлы для загрузки:</h1> 
                    : <h1>Выбранные файлы</h1> 
                    &&
                    resultUpload !== ''
                    ?   <div className={classes.blockResultUpload}>
                            <h1>{resultUpload} <CheckOutlined className={classes.okUploadItem}/></h1>
                        </div>
                    : <h1>Выбранные файлы</h1>
                    
                    
                }
                <CloseOutlined className={classes.closedIconUploadTracks} onClick={click}/>
            </div>
            <Col className={classes.uploadTrackFilesBlock}>
                {
                    nameImg !== ''
                        ?   <div className={classes.selectUploadedImage}>
                                <strong className={resultUpload !== '' ? 'ok' : ''}>{icon}</strong><h1>Картинка :{picture?.name}</h1>
                            </div>
                        :   <h1>Пока нет выбранных картинок</h1>
                }
                {
                    nameTrack !== ''
                        ?   <div className={classes.selectUploadedTrack}>
                                <strong className={resultUpload !== '' ? 'ok' : ''}>{icon}</strong><h1>Трек : {nameTrack}</h1>
                            </div>
                        :   <h1>Пока нет выбранных треков</h1>
                    }
            </Col>
            <div className={classes.blockUploadTrackModal}>
                <div className={classes.blockkUploadTrackModalInput}>
                    <input {...name} className={`${classes.search} ${classes.cursor}`} type="text" name="search" placeholder="Название трека"/>
                    <input {...artist} className={`${classes.search} ${classes.cursor}`} type="text" name="search" placeholder="Имя исполнителя"/>
                    <input {...text} className={`${classes.search} ${classes.cursor}`} type="text" name="search" placeholder="Слова к треку"/>
                    <FileUpload setFile={setPicture} setNameImg={setNameImg} accept="image/*" >
                        <Button style={{width: "100%"}}>Выбрать картинку</Button>
                    </FileUpload>
                </div>
                <div className={classes.blockkUploadTrackModalButton}>
                    <FileUpload setFile={setSelectedAudio} setNameTrack={setNameTrack} setNewDuration={setNewDuration} accept="audio/*" >
                        <Button >Выбрать трек</Button>
                    </FileUpload>
                    <Button onClick={uploadTrack}>Загрузить</Button>
                </div>
            </div>
        </Col>
    )
}
export default UploadTrackModal;