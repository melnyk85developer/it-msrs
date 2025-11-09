export const formatTimeAgo = (isoString: string): string => {
    const postDate: Date = new Date(isoString);
    const now: Date = new Date();
    const diff: number = now.getTime() - postDate.getTime();

    // Если разница менее минуты
    if (diff < 1000 * 60) {
        return `опубликовано только что`;
    }

    // Если разница менее 12 часов
    if (diff < 1000 * 60 * 60 * 12) {
        const minutes: number = Math.floor(diff / (1000 * 60));
        if (minutes < 60) {
            return `опубликовано ${minutes} минут назад`;
        } else {
            const hours: number = Math.floor(minutes / 60);
            return `опубликовано ${hours} часов назад`;
        }
    } else {
        // Конвертировать время в формат "опубликованно DD ММММ YYYY г."
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        return `опубликованно ${postDate.toLocaleDateString('ru-RU', options)}`;
    }
}
