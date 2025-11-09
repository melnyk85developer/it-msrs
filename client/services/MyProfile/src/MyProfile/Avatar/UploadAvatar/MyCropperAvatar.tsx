import React from "react";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import classes from './styles.module.scss'

type PropsType = {
    nameImg: any
    setCropper: any
}

const MyCropperAvatar: React.FC<PropsType> = ({ nameImg, setCropper }) => {

    return (
        <>
            {nameImg && (
                <div className={classes.blockCropper}>
                    <Cropper
                        style={{ maxWidth: '200px', maxHeight: '200px'}}
                        src={nameImg}
                        aspectRatio={1}
                        guides={false}
                        viewMode={1}
                        background={false}
                        responsive={true}
                        autoCropArea={1}
                        dragMode="move"
                        movable={true}
                        cropBoxResizable={false} // Запрещаем изменение размера
                        onInitialized={(instance) => setCropper(instance)}
                    />
                </div>
            )}

        </>
    );
}
export default MyCropperAvatar;
