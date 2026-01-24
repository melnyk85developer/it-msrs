import React, { useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { useAppSelector } from "@packages/shared/src/components/hooks/redux";
import { API_URL } from "@packages/shared/src/http";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import defaultUserAvatar from "@packages/shared/src/assets/fonAvatars.png"
import { getPhotoByIdForCarouselMyProfileAC } from "@packages/shared/src/store/MyProfileReducers/myProfileSlice";
import classes from '../styles.module.scss'

type PropsType = {
    dispatch: AppDispatch;
    setModalOpenPhoto: any
    openPhotoId: string
}

const OpenModalPhoto: React.FC<PropsType> = React.memo(({ 
    dispatch, 
    openPhotoId, 
    setModalOpenPhoto 
}) => {
    const {openPhoto, error} = useAppSelector(state => state.myProfilePage);

    const click = () => {
        setModalOpenPhoto(false)
    }

    useEffect(() => {
        if(openPhotoId){
            dispatch(getPhotoByIdForCarouselMyProfileAC(openPhotoId))
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