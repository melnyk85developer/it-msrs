import React, { useState } from "react";
import { Col, Input, Row, Tooltip } from "antd";
import { BsEmojiSmile, BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseOutline, IoCloseSharp } from "react-icons/io5";
import { AddPhotoAlbumFormModal } from "./addPhotoAlbumFormModal";
import { IPhotoAlbum, IUser } from "@packages/shared/src/types/IUser";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import UploadModalPhoto from "./uploadModalPhoto";
import classes from './styles.module.scss'
import { addPhotoAlbumMyProfileAC, addPhotoMyProfileAC } from "@packages/shared/src/store/MyProfileReducers/myProfileSlice";
import MyCropperUploadMiniature from "../uploadMiniature";
import FileUpload from "@packages/shared/src/components/FileUpload/fileUpload";

type PropsType = {
    dispatch: AppDispatch;
    setAddPhotoForSlider: React.Dispatch<React.SetStateAction<boolean>>
    photoAlbums: IPhotoAlbum[];
    authorizedUser: IUser
    isDarkTheme: string;
}

type Tab = 'add-photo' | 'add-photo-album';

const PhotoCarouselFormModal: React.FC<PropsType> = React.memo(({
    dispatch,
    setAddPhotoForSlider,
    photoAlbums,
    authorizedUser,
    isDarkTheme
}) => {
    const [tab, setTab] = useState<Tab>('add-photo');
    const [imgFile, setImgFile] = useState<File | null>(null)
    const [imgName, setImgName] = useState<string | null>(null)
    const [albumName, setAlbumName] = useState<string | null>('defaultAlbum')

    const [nameImg, setNameImg] = useState('');
    const [miniature, setMiniature] = useState<any>(null);
    const [cropper, setCropper] = useState<Cropper | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);

    const [newAlbumName, setNewAlbumName] = useState<string | null>('')

    const image = imgFile

    const handleClean = () => {
        setImgName(null)
        setNameImg('')
        setMiniature(null)
        setCroppedImage(null)
        setCropper(null)
        setImgFile(null)
        setAlbumName('defaultAlbum')
        setNewAlbumName('')
        setAddPhotoForSlider(false)
    }
    const handleFileSelect = (file: File) => {
        setImgFile(file)
        setNameImg(URL.createObjectURL(file));
        const imageUrl = URL.createObjectURL(file);
        setImgName(imageUrl);
    };
    const handleCrop = async () => {
        if (cropper) {
            const croppedCanvas = cropper.getCroppedCanvas();
            if (croppedCanvas) {
                return new Promise<void>((resolve, reject) => {
                    croppedCanvas.toBlob((blob: any) => {
                        setCroppedImage(URL.createObjectURL(blob));
                        setMiniature(blob);
                        resolve()
                    });
                });
            }
        }
    }
    const closeModal = () => {
        setAddPhotoForSlider(false)
    }
    const handleSend = async () => {
        if (imgFile && tab === 'add-photo') {
            await handleCrop();
            dispatch(
                addPhotoMyProfileAC(
                    authorizedUser.id,
                    image,
                    miniature,
                    albumName,
                    // photoAlbums[0].albumId
                )
            ).then(() => handleClean())
        }
        if (tab === 'add-photo-album') {
            dispatch(
                addPhotoAlbumMyProfileAC(
                    authorizedUser.id,
                    newAlbumName,
                    miniature,
                )
            ).then(() => handleClean())
        }
    }
    return (
        <Row className={classes.row}>
            <Col span={24} className={classes.headerBlockUpdateMsgModal}>
                <span className={classes.title}>Добавить фото в слайдер</span>
                <span className={classes.topIconWrapper}>
                    <IoCloseOutline
                        className={`${classes.topIcon} ${classes.topIconNormal}`}
                        onClick={closeModal}
                    />
                    <IoCloseSharp
                        className={`${classes.topIcon} ${classes.topIconHover}`}
                        onClick={closeModal}
                    />
                </span>
            </Col>
            <Col span={24} className={classes.wrapCentrBlockInputAddMessage}>
                <span className={classes.title}>
                    Загрузить фото, и, или создать альбом.
                </span>
                <div className={classes.tabsModalAddPages}>
                    <div className={classes.wrapButtonTab}>
                        <div
                            onClick={() => setTab('add-photo')}
                            className={`${tab === 'add-photo' ? classes.buttonTabModalActive : classes.buttonTabModalInActive}`}
                        >
                            <p>Добавить фото</p>
                        </div>
                        <div
                            onClick={() => setTab('add-photo-album')}
                            className={`${tab === 'add-photo-album' ? classes.buttonTabModalActive : classes.buttonTabModalInActive}`}
                        >
                            <p>Создать ещё фотоальбом</p>
                        </div>
                    </div>
                    {tab === 'add-photo' && <UploadModalPhoto
                        setAlbumName={setAlbumName}
                        photoAlbums={photoAlbums}
                    />}
                    {tab === 'add-photo-album' && <AddPhotoAlbumFormModal
                        newAlbumName={newAlbumName}
                        setNewAlbumName={setNewAlbumName}
                    />}

                    <div className={classes.maketCarusel}>
                        {imgName && <img src={croppedImage} alt={croppedImage} />}
                    </div>

                    <div className={classes.wrapMiniatureBlock}>
                        {nameImg && <MyCropperUploadMiniature
                            nameImg={nameImg}
                            setCropper={setCropper}
                        />}
                    </div>
                    <div className={classes.wrapBlockSelectPhoto}>
                        <div className={classes.leftBlock}>
                            <FileUpload setFile={handleFileSelect} accept="image/*">
                                <div className={classes.button}>Выбрать фото</div>
                            </FileUpload>
                        </div>
                        <div className={classes.rightBlock} >
                            <div className={classes.button} onClick={() => handleCrop()}>
                                Отрезать выделенную область
                            </div>
                        </div>
                    </div>
                    {/* <div className={classes.samplePhoto}>
                        {imgName && <img
                            src={imgName}
                            alt="photo"
                            className={classes.img}
                        />}
                    </div> */}
                </div>
            </Col>
            <Col span={24} className={classes.futerBlockUpdateMsgModal}>
                <div onClick={closeModal} className={classes.leftBlock}>
                    <p>Отмена</p>
                </div>
                <div className={classes.centerBlock}>
                    <Tooltip destroyTooltipOnHide title="Оставить эмоцию">
                        <span className={classes.iconWrapper}>
                            <BsEmojiSmile className={`${classes.icon} ${classes.iconNormal}`} />
                            <BsEmojiSmileFill className={`${classes.icon} ${classes.iconHover}`} />
                        </span>
                    </Tooltip>
                </div>
                <div className={classes.rightBlock} onClick={() => handleSend()}>
                    <p>Cоздать</p>
                </div>
            </Col>
        </Row>
    )
})
export default PhotoCarouselFormModal;