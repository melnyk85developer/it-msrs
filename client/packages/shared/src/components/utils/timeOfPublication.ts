const MONTHS_RU = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

export const formatTimeOfPublication = (isoString: string): string => {
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

export const formatDayLabel = (isoString: string): string => {
    const date = new Date(isoString);
    const day = date.getDate();
    const month = MONTHS_RU[date.getMonth()];
    return `${day} ${month}`;
};

export const formatYearLabel = (isoString: string): number => {
    const date = new Date(isoString);
    return date.getFullYear();
};