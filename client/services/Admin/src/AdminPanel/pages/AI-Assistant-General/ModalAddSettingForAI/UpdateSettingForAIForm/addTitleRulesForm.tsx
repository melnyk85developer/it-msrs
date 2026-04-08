import React, { useEffect, useRef } from "react";
import classes from './styles.module.scss';

type PropsType = {
    titleRules: string;
    setTitleRules: React.Dispatch<React.SetStateAction<string>>;
    sendUpdateMessage: () => void
}

const AddTitleRulesForm: React.FC<PropsType> = ({ 
    titleRules, 
    setTitleRules, 
    sendUpdateMessage 
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                setTitleRules(prev => prev + '\n');
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
    }, [titleRules]);
    

    return (
        <div className={classes.wrapInputTitle}>
            <textarea 
                ref={textareaRef}
                value={titleRules}
                onChange={(e) => setTitleRules(e.target.value)}
                onKeyDown={handleKeyDown}
                className={classes.inputTitle} 
                name="message" 
                placeholder="System Prompt..."
            />
        </div>
    );
};

export default AddTitleRulesForm;
