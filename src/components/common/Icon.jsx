import React from 'react';

const Icon = ({ name, outlined = false, className = '', size = 20 }) => (
    <span
        className={`${outlined ? 'material-icons-outlined' : 'material-icons'} ${className}`}
        style={{ fontSize: size }}
    >
        {name}
    </span>
);

export default Icon;
