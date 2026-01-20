import React, { useState } from "react";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { IPhotoAlbum, IUser } from "@packages/shared/src/types/IUser";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { API_URL } from "@packages/shared/src/http";
import defaultUserAvatar from "@packages/shared/src/assets/fonAvatars.png"
import OpenModalPhoto from "./openPhoto";
import NoBakcgroundModalWindow from "./modalNoBakcground";
import classes from './styles.module.scss'

type PropsType = {
    photoAlbums: IPhotoAlbum[];
    authorizedUser: IUser
    dispatch: AppDispatch;
    isDarkTheme: string;
}

const PhotoCarousel: React.FC<PropsType> = React.memo(({
    dispatch, photoAlbums, authorizedUser, isDarkTheme }) => {
    const [modalOpenPhoto, setModalOpenPhoto] = useState(false);
    const [openPhotoId, setOpenPhotoId] = useState(null);
    const defaultAlbum = photoAlbums ? photoAlbums.find(
        album => album.albumName === "defaultAlbum"
    ) : undefined;
    let totalItems = defaultAlbum ? defaultAlbum.photos : [];
    const [startIndex, setStartIndex] = useState(0);

    const openPhoto = (photoId: number) => {
        setModalOpenPhoto(true)
        setOpenPhotoId(photoId)
    }
    // Функция для перехода к предыдущим миниатюрам
    const handlePrevClick = () => {
        // Проверяем, что есть миниатюры слева от текущего диапазона
        if (startIndex > 0) {
            setStartIndex(startIndex - 6); // Уменьшаем на количество видимых миниатюр
        }
    };
    // Функция для перехода к следующим миниатюрам
    const handleNextClick = () => {
        // Проверяем, что есть миниатюры справа от текущего диапазона
        if (startIndex < totalItems.length - 6) {
            setStartIndex(startIndex + 6); // Увеличиваем на количество видимых миниатюр
        }
    };
    const defaultPhotoArray = [] as any;
    const miniatyrePhoto = [] as any;
    for (let i = 0; i < totalItems.length; i++) {
        totalItems[i].photoId
        miniatyrePhoto.push(
            <img
                onClick={() => openPhoto(totalItems[i].photoId)}
                key={i}
                src={totalItems[i].miniature !== null
                    ? `${API_URL}/` + totalItems[i].miniature
                    : defaultUserAvatar
                }
                alt={`Photo ${totalItems[i].image}`}
            />
        )
    }
    // Проверяем, сколько дефолтных фотографий нужно добавить, чтобы дополнить до 6
    const remainingDefaultPhotos = 6 - (totalItems.length % 6);
    // Добавляем необходимое количество дефолтных фотографий
    for (let i = 0; i < remainingDefaultPhotos; i++) {
        defaultPhotoArray.push(
            <img
                key={`default_${i}`}
                src={defaultUserAvatar}
                alt={`Default Photo ${i}`}
            />
        );
    }

    // Объединяем массивы фотографий и дефолтных фотографий
    const collectionsFotoWithDefaults = [...miniatyrePhoto.slice().reverse(), ...defaultPhotoArray];

    return (
        <div className={classes.wrapPhotoBlock}>
            {/* Иконка для перехода к предыдущим миниатюрам */}
            <div className={classes.leftIcon} onClick={handlePrevClick}>
                <LeftOutlined className={classes.icon} />
            </div>
            {/* Область для отображения миниатюр */}
            <div className={classes.wrapItems}>
                {collectionsFotoWithDefaults.slice(startIndex, startIndex + 6).map((photo, index) =>
                    <div key={index} className={classes.wrapImg}>
                        {photo ? photo : <img src={defaultUserAvatar} alt={`Default Photo`} />}
                    </div>
                )}
            </div>
            {/* Иконка для перехода к следующим миниатюрам */}
            <div className={classes.rightIcon} onClick={handleNextClick}>
                <RightOutlined className={classes.icon} />
            </div>
            <NoBakcgroundModalWindow
                photoAlbums={photoAlbums}
                modalActive={modalOpenPhoto}
                setModalActive={setModalOpenPhoto}
                openPhotoId={openPhotoId}
                setOpenPhotoId={setOpenPhotoId}
            >
                <OpenModalPhoto
                    dispatch={dispatch}
                    authorizedUser={authorizedUser}
                    isDarkTheme={isDarkTheme}
                    openPhotoId={openPhotoId}
                    setModalOpenPhoto={setModalOpenPhoto}
                />
            </NoBakcgroundModalWindow>
        </div>
    );
});
export default PhotoCarousel;
