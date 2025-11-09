import React, { ReactElement, useEffect } from "react";
import { LeftOutlined, RightOutlined, CloseOutlined } from "@ant-design/icons";
import { IProfile } from "@packages/shared/src/types/IUser";
import classes from './styles.module.scss';

type PropsType = {
    profile: IProfile
    modalActive: any
    setModalActive: any
    children: ReactElement
    openPhotoId: number | null
    setOpenPhotoId: (id: number) => void
}

const NoBakcgroundModalWindow: React.FC<PropsType> = ({ profile, modalActive, setModalActive, children, openPhotoId, setOpenPhotoId }) => {
    // ВСЕ ФОТО СО ВСЕХ АЛЬБОМОВ
    const photo = profile.photoAlbums?.flatMap(album => album.photos) || [];
    // ТЕКУЩИЙ ИНДЕКС
    const currentIndex = photo.findIndex(p => p.photoId === openPhotoId);
    // ПЕРЕКЛЮЧАТЕЛИ
    const handlePrevPhoto = () => {
        if(currentIndex < photo.length - 1){
            setOpenPhotoId(photo[currentIndex + 1].photoId);
        }
    };
    const handleNextPhoto = () => {
        if (currentIndex > 0) {
            setOpenPhotoId(photo[currentIndex - 1].photoId);
        }
    };
    // 🧠 Обработка нажатий клавиш
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!modalActive) return;
            if (e.key === 'ArrowLeft') {
                handlePrevPhoto();
            } else if (e.key === 'ArrowRight') {
                handleNextPhoto();
            } else if (e.key === 'Escape') {
                setModalActive(false); // Закрытие по ESC
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [modalActive, currentIndex]); // важно следить за актуальным индексом
    return (
        <div className={modalActive ? `${classes.modal} ${classes.active}` : `${classes.modal}`}>
            {/* СКРЫВАЕМ ЛЕВУЮ, ЕСЛИ МЫ НА ПЕРВОМ ФОТО */}
            {currentIndex < photo.length - 1 &&(
                <div className={classes.leftIconOpenPhoto} onClick={handlePrevPhoto}>
                    <LeftOutlined className={classes.icon} />
                </div>
            )}
            <div className={modalActive ? `${classes.modal__content__noBakcground} ${classes.active}` : `${classes.modal__content__noBakcground}`} onClick={e => e.stopPropagation()}>
                {children}
            </div>
            {/* СКРЫВАЕМ ПРАВУЮ, ЕСЛИ МЫ НА ПОСЛЕДНЕМ ФОТО */}
            {currentIndex > 0 && (
                <div className={classes.rightIconOpenPhoto} onClick={handleNextPhoto}>
                    <RightOutlined className={classes.icon} />
                </div>
            )}
        </div>
    )
}
export default NoBakcgroundModalWindow;