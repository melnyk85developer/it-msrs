import React, { Dispatch, SetStateAction, useState } from "react";
import { Col, Row, Checkbox, Button } from "antd";
import { IoCloseOutline, IoCloseSharp } from "react-icons/io5";
import classes from "./styles.module.scss";

type PropsType = {
    userId: number;
    senderId: number;
    deleteOption: string;
    setDeleteOption: Dispatch<SetStateAction<"me" | "all">>;
    setOpenDeleteModalMessage: Dispatch<SetStateAction<boolean>>;
    deleteMsg: () => void;
};

const DeleteMessageModal: React.FC<PropsType> = React.memo(({ userId, senderId, deleteOption, setDeleteOption, setOpenDeleteModalMessage, deleteMsg }) => {
    const setDelete = (param: SetStateAction<"me" | "all">) => {
        setDeleteOption(param)
    }

    return (
        <Row className={classes.row}>
            <Col span={24} className={classes.headerBlockDeleteMsgModal}>
                <span className={classes.title}>Удаление сообщения</span>
                <span className={classes.topIconWrapper}>
                    <IoCloseOutline
                        className={`${classes.topIcon} ${classes.topIconNormal}`}
                        onClick={() => setOpenDeleteModalMessage(false)}
                    />
                    <IoCloseSharp
                        className={`${classes.topIcon} ${classes.topIconHover}`}
                        onClick={() => setOpenDeleteModalMessage(false)}
                    />
                </span>
            </Col>
            <Col span={24} className={classes.wrapCentrBlockDeleteMessage}>
                {
                    userId !== senderId
                        ?
                        <Checkbox
                            checked={deleteOption === "all"}
                            onChange={() => setDelete("all")}
                            className={classes.checkbox}
                            disabled
                        >
                            <span>
                                Удалить у всех
                            </span>
                        </Checkbox>
                        :
                        <Checkbox
                            checked={deleteOption === "all"}
                            onChange={() => setDelete("all")}
                            className={classes.checkbox}
                        >
                            <span>
                                Удалить у всех
                            </span>
                        </Checkbox>
                }
                <Checkbox
                    checked={deleteOption === "me"}
                    onChange={() => setDelete("me")}
                    className={classes.checkbox}
                >
                    <span>
                        Удалить только у меня
                    </span>
                </Checkbox>
            </Col>

            <Col span={24} className={classes.footerBlock}>
                <Button
                    type="primary"
                    danger
                    disabled={!deleteOption}
                    onClick={deleteMsg}
                    className={classes.button}
                >
                    Удалить
                </Button>
            </Col>
        </Row>
    );
}
);
export default DeleteMessageModal;