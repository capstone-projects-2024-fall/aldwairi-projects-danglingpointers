import PropTypes from 'prop-types';
import React from 'react';

const Button = ({ text, href, onClick }) => {
    return href ? (
        <a href={href} className="button">
            {text}
        </a>
    ) : (
        <button onClick={onClick} className="button">
            {text}
        </button>
    );
};

Button.defaultProps = {
    href: null,
    onClick: null,
};

Button.propTypes = {
    text: PropTypes.string.isRequired,
    href: PropTypes.string,
    onClick: PropTypes.func,
};

export default Button;
