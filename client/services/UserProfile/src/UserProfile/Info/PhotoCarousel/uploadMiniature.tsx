import React from "react";
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import classes from './styles.module.scss'

type PropsType = {
    nameImg: any
    setCropper: any
}

const MyCropperUploadMiniature: React.FC<PropsType> = ({ nameImg, setCropper }) => {
    return (
        <>
            {nameImg && (
                <div className={classes.blockCropperMiniature}>
                    <Cropper
                        style={{ maxWidth: '115px', maxHeight: '115px'}}
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
export default MyCropperUploadMiniature