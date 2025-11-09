import React, { useEffect, useState } from "react";

const TypingEffect = ({ message, speed, onComplete }: { message: string, speed: number, onComplete?: () => void }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [index, setIndex] = useState(0);

    useEffect(() => {
        setDisplayedText("");
        setIndex(0);
    }, [message]);

    useEffect(() => {
        if (index < message.length) {
            const timer = setTimeout(() => {
                setDisplayedText((prev) => prev + message[index]);
                setIndex((prev) => prev + 1);
            }, speed);

            return () => clearTimeout(timer);
        } else {
            // Сообщаем об окончании
            if (onComplete) onComplete();
        }
    }, [index, message, speed, onComplete]);

    return <span dangerouslySetInnerHTML={{ __html: displayedText }} />;
};

export default TypingEffect;



// import React, { useEffect, useState } from "react";

// const TypingEffect = ({ messages, speed }: { messages: string[], speed: number }) => {
//     const [displayedText, setDisplayedText] = useState(""); // Что сейчас показывается
//     const [currentIndex, setCurrentIndex] = useState(0); // Какое сообщение сейчас
//     const [charIndex, setCharIndex] = useState(0); // Какая буква в сообщении

//     useEffect(() => {
//         if (currentIndex < messages.length) {
//             const message = messages[currentIndex]; // Текущее сообщение

//             if (charIndex < message.length) {
//                 const timer = setTimeout(() => {
//                     setDisplayedText((prev) => prev + message[charIndex]); // Добавляем букву
//                     setCharIndex((prev) => prev + 1); // Переходим к следующей букве
//                 }, speed);

//                 return () => clearTimeout(timer); // Очищаем таймер
//             } else {
//                 // Закончили текущее сообщение — ждём перед следующим
//                 const delay = setTimeout(() => {
//                     setCharIndex(0); // Обнуляем индекс символа
//                     setDisplayedText(""); // Очищаем текст для нового сообщения
//                     setCurrentIndex((prev) => prev + 1); // Переходим к следующему сообщению
//                 }, 1000); // Задержка между сообщениями (1 секунда)

//                 return () => clearTimeout(delay);
//             }
//         }
//     }, [charIndex, currentIndex, messages, speed]);

//     return <span>{displayedText}</span>;
// };

// export default TypingEffect;