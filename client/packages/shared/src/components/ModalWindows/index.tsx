import React, { ReactElement } from "react";
import classes from './styles.module.scss';

type PropsType = {
    modalActive: any;
    setModalActive?: any;
    children: ReactElement;
    isSetModal?: number;
}

const ModalWindow: React.FC<PropsType> = ({ modalActive, setModalActive, children, isSetModal = 1 }) => {

    const click = () => {
        if (isSetModal === 1) {
            setModalActive(false)
        }else{
            setModalActive(true)
        }
    }
    return (
        <div className={modalActive ? `${classes.modal} ${classes.active}` : `${classes.modal}`} onClick={click}>
            <div className={modalActive ? `${classes.modal__content} ${classes.active}` : `${classes.modal__content}`} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}
export default ModalWindow;