// Date utilities using dayjs
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const formatDate = (date, format = 'MMM D, YYYY') => {
    return dayjs(date).format(format);
};

export const formatTime = (date, format = 'h:mm A') => {
    return dayjs(date).format(format);
};

export const formatDateTime = (date, format = 'MMM D, YYYY h:mm A') => {
    return dayjs(date).format(format);
};

export const formatRelativeTime = (date) => {
    return dayjs(date).fromNow();
};

export const isUpcoming = (date) => {
    return dayjs(date).isAfter(dayjs());
};

export const isPast = (date) => {
    return dayjs(date).isBefore(dayjs());
};

export const isToday = (date) => {
    return dayjs(date).isSame(dayjs(), 'day');
};

export const getDaysUntil = (date) => {
    return dayjs(date).diff(dayjs(), 'day');
};

export const getDateRange = (startDate, endDate) => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (start.isSame(end, 'day')) {
        return start.format('MMM D, YYYY');
    }

    if (start.isSame(end, 'month')) {
        return `${start.format('MMM D')} - ${end.format('D, YYYY')}`;
    }

    return `${start.format('MMM D')} - ${end.format('MMM D, YYYY')}`;
};
