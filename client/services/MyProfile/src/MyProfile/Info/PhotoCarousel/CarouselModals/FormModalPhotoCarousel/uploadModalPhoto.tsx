import React from "react";
import FileUpload from "@packages/shared/src/components/FileUpload/fileUpload";
import { IPhotoAlbum } from "@packages/shared/src/types/IUser";
import MyCropperUploadMiniature from "../uploadMiniature";
import classes from './styles.module.scss'

type PropsType = {
    photoAlbums: IPhotoAlbum[];
    setAlbumName: React.Dispatch<React.SetStateAction<string>>
}

const UploadModalPhoto: React.FC<PropsType> = React.memo(({
    setAlbumName,
    photoAlbums,
}) => {

    return (
        <div className={classes.formContainer}>
            <h3>Добавить фото</h3>
            <div className={classes.inputWrapper}>
                <label className={classes.label}>Выбрать альбом (не обязательно)</label>
                <select className={classes.select} onChange={(e) => setAlbumName(e.target.value)}>
                    {/* Опция по умолчанию для defaultAlbum */}
                    {photoAlbums && photoAlbums.length > 0 && (
                        <option
                            value="defaultAlbum"
                            className={classes.option}
                        >
                            {photoAlbums[0].albumName}
                        </option>
                    )}
                    {/* Мапим остальные альбомы в опции */}
                    {photoAlbums?.slice(1).map(album => (
                        <option
                            key={album.albumId}
                            value={album.albumName}
                            className={classes.option}
                        >
                            {album.albumName}
                        </option>
                    ))}
                </select>
                <label className={classes.label}>Пример вырезанной области фото</label>
            </div>
        </div>
    )
})
export default UploadModalPhoto