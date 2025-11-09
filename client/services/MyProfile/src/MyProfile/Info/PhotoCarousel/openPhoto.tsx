import React, { useEffect, useState } from "react";
import { CloseOutlined, LeftOutlined, RightOutlined, PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { API_URL } from "@packages/shared/src/http";
import { IProfile } from "@packages/shared/src/types/IUser";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { addPhotoAlbumMyProfileAC, addPhotoMyProfileAC, setPhotoCarouselMyProfileAC } from "@packages/shared/src/store/MyProfileReducers/myProfileSlice";
import defaultUserAvatar from "@packages/shared/src/assets/fonAvatars.png"
import classes from './styles.module.scss'

type PropsType = {
    profile: IProfile;
    authorizedUser: IProfile
    dispatch: AppDispatch;
    isDarkTheme: string;
    setModalOpenPhoto: any
    openPhotoId: number
}

const OpenModalPhoto: React.FC<PropsType> = React.memo(({ 
    dispatch, openPhotoId, profile, authorizedUser, isDarkTheme, setModalOpenPhoto }) => {
    const {openPhoto, error} = useAppSelector(state => state.myProfilePage);

    const click = () => {
        setModalOpenPhoto(false)
    }

    useEffect(() => {
        if(openPhotoId){
            dispatch(setPhotoCarouselMyProfileAC(openPhotoId))
        }
    }, [openPhotoId]);
   
    return (
        <div className={classes.wrapContentOpenPhoto}>
            <div className={classes.wrapOpenPhotoBlockModal}>
                <img src={openPhoto ? `${API_URL}/` +  openPhoto  : defaultUserAvatar} alt={`Default Photo`} />
            </div>
            <CloseOutlined className={classes.closedIconUploadTracks} onClick={click}/>
        </div>
    )
})
export default OpenModalPhoto