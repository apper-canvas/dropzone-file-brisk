import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ onClick, children, className, whileHover, whileTap, type = 'button' }) => {
    return (
        <motion.button
            type={type}
            onClick={onClick}
            className={className}
            whileHover={whileHover}
            whileTap={whileTap}
        >
            {children}
        </motion.button>
    );
};

export default Button;