import React, { ReactElement, useEffect, useState } from "react";

type PropsType = {
    lastSeenAt: Date | string
};

const LastSeenLabel: React.FC<PropsType> = ({ lastSeenAt }): ReactElement => {
    const [label, setLabel] = useState<ReactElement>(() => <span></span>);
    const [countTimeout, setCountTimeout] = useState<string | number>(30 * 1000);
    const now = new Date();
    const lastSeen = new Date(lastSeenAt);

    const diffMs = now.getTime() - lastSeen.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    const hours = lastSeen.getHours().toString().padStart(2, '0');
    const minutes = lastSeen.getMinutes().toString().padStart(2, '0');
    const day = lastSeen.getDate().toString().padStart(2, '0');
    const month = (lastSeen.getMonth() + 1).toString().padStart(2, '0');
    const year = lastSeen.getFullYear();

    useEffect(() => {
        const updateLabel = () => {
            if (diffSec < 30) {
                setLabel(<span style={{ color: '#4caf50' }}>в сети</span>);
                return 30 * 1000;
            }
            if (diffSec < 60) {
                setLabel(<span>был(а) недавно</span>);
                return 30 * 1000;
            }
            if (diffMin < 60) {
                setLabel(<span>был(а) {diffMin} мин назад</span>);
                return 60 * 1000;
            }
            if (diffHours < 12) {
                setLabel(<span>был(а) {diffHours} ч назад</span>);
                return null;
            }
            if (diffHours > 12 && diffHours < 24) {
                setLabel(<span>был(а) в {hours}:{minutes}</span>);
                return null;
            }
            if (diffDays === 1) {
                setLabel(<span>был(а) вчера</span>);
                return null;
            }
            if (diffDays < 30) {
                setLabel(<span>был(а) {diffDays} дн назад</span>);
                return null;
            }

            setLabel(<span>был(а) {`${day}.${month}.${year}`}</span>);
            return null;
        };

        const timeoutDelay = updateLabel();

        if (timeoutDelay !== null && diffMin < 60) {
            const timeoutId = setTimeout(() => {
                if (diffSec < 31) {
                    setCountTimeout(1);
                    // console.log('LastSeenLabel: - IF 30 сек countTimeout', countTimeout)
                } else if (diffSec > 30 && diffSec < 60) {
                    // console.log('LastSeenLabel: - else if-1 countTimeout', countTimeout)
                    setCountTimeout(2);
                } else {
                    // console.log('LastSeenLabel: - else countTimeout', countTimeout)
                    setCountTimeout(diffMin + 2);
                }
            }, timeoutDelay);
            return () => clearTimeout(timeoutId);
        }
        console.log('LastSeenLabel: - countTimeout STOP', diffMin)
    }, [lastSeenAt, countTimeout]);

    return label;
};

export default LastSeenLabel;
