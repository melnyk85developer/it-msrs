import React, { useEffect, useState } from "react";
import { BiDownvote } from "react-icons/bi";
import { IoDuplicate, IoDuplicateOutline } from "react-icons/io5";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { IUser } from "@packages/shared/src/types/IUser";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { API_URL } from "@packages/shared/src/http";
import ModalWindow from "@packages/shared/src/components/ModalWindows";
import defaultUserAvatar from "@packages/shared/src/assets/fonAvatars.png"
import OpenModalPhoto from "./CarouselModals/openPhoto";
import NoBakcgroundModalWindow from "./CarouselModals/modalNoBakcground";
import PhotoCarouselFormModal from "./CarouselModals/FormModalPhotoCarousel/addPhotoCarouselFormModal";
import classes from './styles.module.scss'

type PropsType = {
    authorizedUser: IUser
    dispatch: AppDispatch;
    isDarkTheme: string;
}

const PhotoCarousel: React.FC<PropsType> = React.memo(({
    dispatch,
    authorizedUser,
    isDarkTheme
}) => {
    const { photoAlbums, photos, carouselPhotos } = useAppSelector(state => state.myProfilePage);
    const [modalOpenPhoto, setModalOpenPhoto] = useState(false);
    const [openPhotoId, setOpenPhotoId] = useState(null);
    const [allPhotos, setAllPhotos] = useState(carouselPhotos);

    const [addPhotoForSlider, setAddPhotoForSlider] = useState(false);

    // console.log('PhotoCarousel: carouselPhotos 😡 ', carouselPhotos)
    // console.log('PhotoCarousel: photos 😡 ', photos)
    // console.log('PhotoCarousel: photoAlbums 😡 ', photoAlbums)

    // useEffect(() => {
    //     if (carouselPhotos.length > 0) {
    //         setAllPhotos(carouselPhotos)
    //     }
    // }, [])

    useEffect(() => {
        if (carouselPhotos.length > 0) {
            setAllPhotos(carouselPhotos)
        }
    }, [carouselPhotos])

    // const defaultAlbum = photoAlbums ? photoAlbums.find(
    //     album => album.albumName === "defaultAlbum"
    // ) : undefined;

    // console.log('PhotoCarousel: defaultAlbum 😡 ', defaultAlbum)

    let totalItems = allPhotos ? allPhotos : [];
    const [startIndex, setStartIndex] = useState(0);

    const openPhoto = (photoId: string) => {
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
                src={
                    totalItems[i].miniature !== null
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
                {/* Область для загрузки фотографий */}
                <div onClick={() => setAddPhotoForSlider(true)} className={classes.wrapImgPlus}>
                    <img src={defaultUserAvatar} alt={`Default Photo`} />
                    <div className={classes.wrapBlockIconsPlusphoto}>
                        {/* <UploadOutlined className={classes.uploadIcon} />  */}
                        <BiDownvote className={classes.uploadIcon} />
                        <div className={classes.IconPlusPhoto}>
                            {/* <PlusOutlined /> */}
                            {/* <BiDuplicate /> */}
                            <IoDuplicateOutline />
                            <IoDuplicate />
                            <strong>Фото</strong>
                        </div>
                    </div>
                </div>
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
                // photoAlbums={photoAlbums}
                allPhotos={allPhotos}
                modalActive={modalOpenPhoto}
                setModalActive={setModalOpenPhoto}
                openPhotoId={openPhotoId}
                setOpenPhotoId={setOpenPhotoId}
            >
                <OpenModalPhoto
                    dispatch={dispatch}
                    openPhotoId={openPhotoId}
                    setModalOpenPhoto={setModalOpenPhoto}
                />
            </NoBakcgroundModalWindow>
            <ModalWindow modalActive={addPhotoForSlider} setModalActive={setAddPhotoForSlider} isSetModal={0}>
                <PhotoCarouselFormModal
                    setAddPhotoForSlider={setAddPhotoForSlider}
                    dispatch={dispatch}
                    photoAlbums={photoAlbums}
                    authorizedUser={authorizedUser}
                    isDarkTheme={isDarkTheme}
                />
            </ModalWindow>
        </div>
    );
});
export default PhotoCarousel;
