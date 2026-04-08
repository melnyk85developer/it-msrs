import { useEffect, useRef } from "react";
import classes from '../styles.module.scss'

type PropsType = {
    contentRules: string;
    setContentRules: React.Dispatch<React.SetStateAction<string>>;
    sendUpdateSystemPrompt: () => void
}

const EditContentRulesForm: React.FC<PropsType> = ({
    contentRules,
    setContentRules,
    sendUpdateSystemPrompt
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                setContentRules(prev => prev + '\n');
            } else {
                e.preventDefault();
                sendUpdateSystemPrompt();
            }
        }
    };

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = 'auto';
        const MIN_HEIGHT = 30;
        const MAX_HEIGHT = 73;
        const scrollHeight = el.scrollHeight;
        const finalHeight = Math.max(MIN_HEIGHT, Math.min(scrollHeight, MAX_HEIGHT));
        el.style.height = `${finalHeight}vh`;
    }, [contentRules]);


    return (
        <textarea
            className={classes.contentRules}
            ref={textareaRef}
            value={contentRules}
            onChange={(e) => setContentRules(e.target.value)}
            onKeyDown={handleKeyDown}
            name="prompt"
            placeholder="System Prompt..."
        />
    );
};

export default EditContentRulesForm;