import React, { useEffect, useRef } from "react";
import classes from './styles.module.scss';

type PropsType = {
    message: string
    setMessage: React.Dispatch<React.SetStateAction<string>>
    sendUpdateMessage: () => void
}

const UpdateMessageForm: React.FC<PropsType> = ({ message, setMessage, sendUpdateMessage }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                setMessage(prev => prev + '\n');
            } else {
                e.preventDefault();
                sendUpdateMessage();
            }
        }
    };

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        const MIN_HEIGHT = 30;
        const MAX_HEIGHT = 120;
        const scrollHeight = el.scrollHeight;
        const finalHeight = Math.max(MIN_HEIGHT, Math.min(scrollHeight, MAX_HEIGHT));
        el.style.height = `${finalHeight}px`;
    }, [message]);
    

    return (
        <div className={classes.wrapInput}>
            <textarea 
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className={classes.input} 
                name="message" 
                placeholder="Сообщение..."
            />
        </div>
    );
};

export default UpdateMessageForm;
