import React from "react";
import { IProfile } from "@packages/shared/src/types/IUser";
import classes from './styles.module.scss'

type PropsType = {
    profile: IProfile
}

const AnketaModal: React.FC<PropsType> = React.memo((props) => {
    return (
        <div className={classes.DetailedQuestionnaire}>
            <h2>Подробная аткета</h2>
            <div className={classes.wrapName}>
                <h6>Имя : </h6>
                <strong>{props.profile.name}</strong>
            </div>
            <div className={classes.warapSurname}>
                <h6>Фамилия : </h6>
                <strong>{props.profile.surname}</strong>
            </div>
            <div className={classes.wrapILiveIn}>
                <h6>Живу в :</h6>
                <strong>{props.profile.liveIn}</strong>
            </div>
            <div className={classes.wrapOriginallyFrom}>
                <h6>Родом из :</h6>
                <strong>{props.profile.originallyFrom}</strong>
            </div>
            <div className={classes.wrapStatus}>
                <h6>Статус :</h6>
                <strong>{props.profile.status}</strong>
            </div>
            <div className={classes.wrapGenderSelect}>
                <h6>Пол :</h6>
                <strong>{props.profile.gender}</strong>
            </div>
            <div className={classes.wrapImWorkingIn}>
                <h6>Работаю в :</h6>
                <strong>{props.profile.imWorkingIn}</strong>
            </div>
            <div className={classes.wrapLookingForAJob}>
                <h6>Ищу работу :</h6>
                <strong>{props.profile.lookingForAJob ? "yes" : "От работы кони дохнут"}</strong>
            </div>
            <div className={classes.wrapLookingForAJobDescription}>
                <h6>Мои профессиональные навыки :</h6>
                <strong>{props.profile.lookingForAJobDescription}</strong>
            </div>
            <div className={classes.wrapAboutMe}>
                <h6>Обо мне :</h6>
                <strong>{props.profile.aboutMe}</strong>
            </div>
            <div className={classes.wrapContacts}>
                <h6>Мои контакты : </h6>
                <div className={classes.contacts}>
                    <strong>{props.profile.telephone}</strong>
                </div>
                <div className={classes.contacts}>
                    <strong>{props.profile.email}</strong>
                </div>
                <div className={classes.contacts}>
                    <strong>{props.profile.website}</strong>
                </div>
            </div>
            <h3>{props.profile.isConfirmed ? 'Аккаунт подтвержден по почте': 'ПОДТВЕРДИТЕ СУКА АККАУНТ!!!'}</h3>
        </div>
    )
})
export default AnketaModal