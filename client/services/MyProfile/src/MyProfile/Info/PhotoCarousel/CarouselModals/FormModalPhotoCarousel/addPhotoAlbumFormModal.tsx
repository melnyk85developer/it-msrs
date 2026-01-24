import React, { useState } from "react";
import { Input } from "antd";
import { addPhotoAlbumMyProfileAC } from "@packages/shared/src/store/MyProfileReducers/myProfileSlice";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { IUser } from "@packages/shared/src/types/IUser";
import classes from './styles.module.scss';

type PropsType = {
    newAlbumName: string;
    setNewAlbumName: React.Dispatch<React.SetStateAction<string | null>>
}

export const AddPhotoAlbumFormModal: React.FC<PropsType> = React.memo(({
    newAlbumName,
    setNewAlbumName,
}) => {

    return (
        <div className={classes.formContainer}>
            <h3>Coздать новый альбом</h3>
            <div className={classes.inputWrapper}>
                <label className={classes.label}>Имя альбома</label>
                <div className={classes.wrapInput}>
                    <Input
                        value={newAlbumName}
                        onChange={(e) => setNewAlbumName(e.target.value)}
                        placeholder="На пример: Новогодние"
                        className={classes.input}
                    />
                    {/* <div className={classes.rightBlock}>
                        <div
                            className={classes.button}
                            onClick={() => handleAddAlbum()}
                        >
                            Добавить
                        </div>
                    </div> */}
                </div>
                <label className={classes.label}>Добавить фотообложку альбому (не обязательно)</label>
            </div>
        </div>
    )
})
