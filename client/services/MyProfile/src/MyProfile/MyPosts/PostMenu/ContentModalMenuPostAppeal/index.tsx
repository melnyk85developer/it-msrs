import React from "react";
import classes from './styles.module.scss';
import { Button } from "antd";
import { AppDispatch } from "@packages/shared/src/store/redux-store";

type PropsType = {
    setModalActiveAppeal: any
    dispatch: AppDispatch
}

const ContentModalMenuPostAppeal: React.FC<PropsType> = React.memo(({ dispatch, setModalActiveAppeal }) => {

    const noDeleteClick = () => {
        setModalActiveAppeal(false)
    }

    const yesDeleteClick = () => {
        setModalActiveAppeal(false)
    }

    return (
        <div className={classes.wrapModalContentMenuPost}>
            <h2>Жаловаться!</h2>
            <h3>Выберите в выпадающем списке действия на который вы хотите по жаловаться!</h3>
            <h3>Или общие основания если действия в этом списке нет.</h3>
            <div className={classes.wrapButton}>
                <Button onClick={yesDeleteClick} className={classes.button}>Пожаловаться</Button>
                <Button onClick={noDeleteClick} className={classes.button}>Отмена</Button>
            </div>
        </div>
    )
})
export default ContentModalMenuPostAppeal