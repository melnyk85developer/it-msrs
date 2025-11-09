import React, { useState, useEffect, ChangeEvent } from "react";
import { IProfile, IUpdateStatus } from "@packages/shared/src/types/IUser";
import { AppDispatch } from "@packages/shared/src/store/redux-store";
import { updateStatusMyProfileAC } from "@packages/shared/src/store/MyProfileReducers/myProfileSlice";
import classes from './styles.module.scss'

type PropsType = {
    profile: IProfile
    dispatch: AppDispatch
    authorizedUser: IProfile
}
const ProfileStatus: React.FC<PropsType> = React.memo(({ 
    profile, dispatch, authorizedUser }) => {
    const [editMode, setEditMode] = useState(false);
    const [status, setStatus] = useState(profile.status || '');

    const userId = profile ? profile.userId : undefined
    const authorizedUserId = authorizedUser ? authorizedUser.userId : undefined

    const activateEditMode = () => {
        if (!editMode) {
            setEditMode(true);
        }
    }
    const deactivateEditMode = () => {
        dispatch(updateStatusMyProfileAC(userId, authorizedUserId, status))
        setEditMode(false);
    }
    const onStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
        setStatus(e.currentTarget.value);
    }
    return (
        <div className={classes.statusBlock}>
            {!editMode && <span onDoubleClick={activateEditMode}>{status || "NO STATUS"}</span>}
            {editMode && <input onChange={onStatusChange} autoFocus={true} onBlur={deactivateEditMode} value={status}/>}
        </div>
    )
})
export default ProfileStatus;