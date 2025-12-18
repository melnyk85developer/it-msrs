import React, { useEffect, useState } from "react";
import FileUpload from "@packages/shared/src/components/FileUpload/fileUpload";
import { Button } from "antd";
import { IProfile, IUser } from "@packages/shared/src/types/IUser";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { addPhotoAlbumMyProfileAC, addPhotoMyProfileAC } from "@packages/shared/src/store/MyProfileReducers/myProfileSlice";
import MyCropperUploadMiniature from "./uploadMiniature";
import classes from './styles.module.scss'

type PropsType = {
    profile: IProfile;
    authorizedUser: IUser
    dispatch: AppDispatch;
    isDarkTheme: string;
    setModalUploadPhoto: any
}

const UploadModalPhoto: React.FC<PropsType> = React.memo(({ 
    dispatch, profile, authorizedUser, isDarkTheme, setModalUploadPhoto }) => {
    const [imgFile, setImgFile] = useState<File | null>(null)
    const [imgName, setImgName] = useState<string | null>(null)
    const [albumName, setAlbumName] = useState<string | null>('defaultAlbum')
    const [newAlbumName, setNewAlbumName] = useState<string | null>('')
    const [nameImg, setNameImg] = useState('');
    const [miniature, setMiniature] = useState<any>(null);
    const [cropper, setCropper] = useState<Cropper | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);

    const image = imgFile
    const userId = profile ? profile.userId : undefined
    const authorizedUserId = authorizedUser ? authorizedUser.id : undefined

    const handleClean = () => {
        setImgName(null)
        setNameImg('')
        setMiniature(null)
        setCroppedImage(null)
        setCropper(null)
        setImgFile(null)
        setAlbumName('defaultAlbum')
        setModalUploadPhoto(false)
    }

    const handleFileSelect = (file: File) => {
        setImgFile(file)
        setNameImg(URL.createObjectURL(file));
        const imageUrl = URL.createObjectURL(file);
        setImgName(imageUrl);
    };

    const handleSend = async () => {
        if (imgFile) {
            await handleCrop();
            dispatch(addPhotoMyProfileAC(                
                userId, 
                Number(authorizedUserId),
                image, 
                miniature,
                albumName
            )).then(() => handleClean())
        }
    }
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

    const handleAddAlbum = () => {
        dispatch(addPhotoAlbumMyProfileAC(userId, Number(authorizedUserId), newAlbumName))
        .then(() => setNewAlbumName(''))
    }

    return (
        <div className={classes.wrapUploadPhotoBlockModal}>
            <div className={classes.wrapAlbums}>
                <div className={classes.albums}>
                    <h3>Выбрать альбом</h3>
                    <select onChange={(e) => setAlbumName(e.target.value)}>
                        {/* Опция по умолчанию для defaultAlbum */}
                        {profile.photoAlbums && profile.photoAlbums.length > 0 && (
                            <option value="defaultAlbum">{profile.photoAlbums[0].albumName}</option>
                        )}
                        {/* Мапим остальные альбомы в опции */}
                        {profile.photoAlbums?.slice(1).map(album => (
                            <option key={album.albumId} value={album.albumName}>{album.albumName}</option>
                        ))}
                    </select>
                </div>
                <div className={classes.addAlbums}>
                    <h3>Coздать новый альбом</h3>
                    <input 
                        value={newAlbumName}
                        onChange={(e) => setNewAlbumName(e.target.value)}
                        className={classes.input
                    }/>
                    <Button onClick={() => handleAddAlbum()} type="primary">Добавить</Button>
                </div>
            </div>
            <div className={classes.maketCarusel}>
                {imgName && <img src={croppedImage} alt={croppedImage}/>}
            </div>
            <div className={classes.wrapMiniatureBlock}>
                { nameImg &&
                    <MyCropperUploadMiniature 
                        nameImg={nameImg}
                        setCropper={setCropper}
                    />
                }
            </div>
            <div className={classes.wrapBlockSelectPhoto}>
                <FileUpload setFile={handleFileSelect} accept="image/*">
                    <Button className={classes.uploadButton} type="primary">Выбрать фото</Button>
                </FileUpload>
                <Button className={classes.button} type="primary" onClick={() => handleCrop()}>Образать</Button>
            </div>
            <div className={classes.samplePhoto}>
                {imgName && <img src={imgName} alt="photo" />}
            </div>
            {/* <strong>Имя файла: {imgName}</strong> */}
            <div className={classes.wrapFileUpload}>
                <Button type="primary" onClick={() => handleClean()}>Отмена</Button>
                <Button className={classes.button} type="primary" onClick={() => handleSend()}>Загрузить фото</Button>
            </div>
        </div>
    )
})
export default UploadModalPhoto