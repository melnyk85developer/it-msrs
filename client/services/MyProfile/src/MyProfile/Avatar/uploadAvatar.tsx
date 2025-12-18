import React, { useState } from "react";
import FileUpload from "@packages/shared/src/components/FileUpload/fileUpload";
import { Button } from "antd";
import MyCropperAvatar from "./UploadAvatar/MyCropperAvatar";
import NewAvatar from "./UploadAvatar/newAvatar";
import { IProfile, IUser } from "@packages/shared/src/types/IUser";
import { updateAvatarMyProfileAC } from "@packages/shared/src/store/MyProfileReducers/myProfileSlice";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import classes from './styles.module.scss'

type PropsType = {
    profile: IProfile
    dispatch: AppDispatch;
    setModalActive: any;
    authorizedUser: IUser;
}

const UploadAvatar: React.FC<PropsType> = React.memo(({
    profile, dispatch, setModalActive, authorizedUser }) => {
    const [nameImg, setNameImg] = useState('');
    const [avatar, setAvatar] = useState<any>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [cropper, setCropper] = useState<Cropper | null>(null);
    const [originalFileName, setOriginalFileName] = useState('');

    const userId = profile ? profile.userId : undefined
    const authorizedUserId = authorizedUser ? authorizedUser.id : undefined

    const handleFileSelect = (file: File) => {
        setNameImg(URL.createObjectURL(file));
        setOriginalFileName(file.name); // <--- тут сохраняем имя
    };

    const handleCrop = () => {
        if (cropper) {
            const croppedCanvas = cropper.getCroppedCanvas();
            if (croppedCanvas) {
                croppedCanvas.toBlob((blob) => {
                    if (!blob) return;

                    // Получаем оригинальное расширение
                    const ext = originalFileName.split('.').pop();
                    const fileName = ext ? `${originalFileName.split('.')[0]}.${ext}` : 'avatar.jpg';

                    // Делаем нормальный File
                    const croppedFile = new File([blob], fileName, {
                        type: blob.type || 'image/jpeg',
                    });

                    setCroppedImage(URL.createObjectURL(blob));
                    setAvatar(croppedFile); // ✅ А НЕ blob
                }, 'image/jpeg'); // можно заменить на image/png если хочешь
            }
        }
    };

    const onFinish = async () => {
        dispatch(updateAvatarMyProfileAC(userId, Number(authorizedUserId), avatar))
            .then(() => setModalActive(false))
    };

    return (
        <div className={classes.wrapUploadAvatar}>
            <h2>Загрузить аватар</h2>
            <div className={classes.wrapAvatar}>
                <NewAvatar avatar={croppedImage} />
            </div>
            <div>
                <div className={classes.uploadBlockCropperAvatar}>
                    <MyCropperAvatar
                        nameImg={nameImg}
                        setCropper={setCropper}
                    />
                </div>
            </div>
            <h3>Выберите область на фото для аватара</h3>
            <div className={classes.uploadBlock}>
                <FileUpload setFile={handleFileSelect} accept="image/*">
                    <Button>Выбрать аватар</Button>
                </FileUpload>
                <Button className={classes.trim} type="primary" onClick={handleCrop}>Обрезать</Button>
                <Button onClick={() => onFinish()}>Загрузить</Button>
            </div>
        </div>
    )
})
export default UploadAvatar