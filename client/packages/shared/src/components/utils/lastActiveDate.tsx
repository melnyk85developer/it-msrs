export const formatLastActive = (timestampInSeconds: number): string => {
    const date = new Date(timestampInSeconds * 1000);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (isNaN(date.getTime())) return 'Неверная дата';

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const isYesterday =
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear();

    if (diff < 60 * 1000) {
        return 'только что';
    }

    if (diff < 60 * 60 * 1000) {
        const minutes = Math.floor(diff / (60 * 1000));
        return `${minutes} мин назад`;
    }

    if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
        const hours = Math.floor(diff / (60 * 60 * 1000));
        return `${hours} ч назад`;
    }

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
    };

    const dateOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
    };

    if (isYesterday) {
        return `вчера в ${date.toLocaleTimeString('ru-RU', timeOptions)}`;
    }

    return `${date.toLocaleDateString('ru-RU', dateOptions)} в ${date.toLocaleTimeString('ru-RU', timeOptions)}`;
};
