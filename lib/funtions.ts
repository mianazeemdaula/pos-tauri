
export function formatDate(date: number | Date | string | undefined) {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short', // "short" for "Dec", "long" for "December"
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true, // Use 12-hour format
    };

    // check if date is a string
    if (typeof date === 'string') {
        date = new Date(date);
    }

    return new Intl.DateTimeFormat('en-US', options).format(date);
};


const fetcher = (url: string | URL | Request) => fetch(url).then(r => r.json())

export { fetcher }
