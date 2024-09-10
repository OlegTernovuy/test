export const getDate = (timestamp: number) => {
    const fullDate = new Date(timestamp * 1000);
    const year = fullDate.toLocaleDateString('uk-UA', {
        year: 'numeric',
    });
    const month = fullDate.toLocaleDateString('uk-UA', {
        month: '2-digit',
    });
    const day = fullDate.toLocaleDateString('uk-UA', {
        day: '2-digit',
    });
    const time = fullDate.toLocaleTimeString('uk-UA', {
        hour12: false,
        hour: 'numeric',
        minute: 'numeric',
    });
    return `${year}.${month}.${day}\n${time}`;
};
