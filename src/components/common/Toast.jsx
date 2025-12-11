import React from 'react';
import Icon from './Icon';

const Toast = ({ message, type }) => (
    <div
        className={`toast flex items-center gap-3 px-5 py-4 rounded-xl ${
            type === 'success'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : 'bg-gradient-to-r from-red-500 to-rose-600'
        } text-white shadow-2xl`}
    >
        <Icon name={type === 'success' ? 'check_circle' : 'error'} outlined />
        <span className="font-medium">{message}</span>
    </div>
);

export default Toast;
