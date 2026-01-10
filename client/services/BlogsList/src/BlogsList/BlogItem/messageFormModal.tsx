import React from "react";
import { SendOutlined } from "@ant-design/icons";
import SendMessageForm from "../../../../Message/src/SendMessageForm/sendMessageForm";
import classes from './styles.module.scss'

type PropsType = {
    textMessage: string
    setTextMessage: React.Dispatch<React.SetStateAction<string>>
    addNewMessage: (message: string) => void
}

const MessageFormModal: React.FC<PropsType> = React.memo(({ textMessage, setTextMessage, addNewMessage }) => {

    return (
        <div className={classes.wrapCentrBlockInputAddMessage}>
            <SendMessageForm 
                message={textMessage}
                setMessage={setTextMessage}
                sendMessage={() => addNewMessage(textMessage)} 
            />
            <SendOutlined 
                onClick={()=> addNewMessage(textMessage)}
                className={classes.SendOutlined}
            />
        </div>
    )
})
export default MessageFormModal;