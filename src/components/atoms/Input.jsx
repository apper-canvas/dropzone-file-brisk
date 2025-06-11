import React from 'react';

const Input = ({ type = 'text', className, ref, ...props }) => {
    return (
        <input
            type={type}
            className={className}
            ref={ref}
            {...props}
        />
    );
};

export default Input;