const Button = ({ id, text, href, onClick }) => {
    return href ? (
        <a 
            id={id}
            href={href} 
            className="button"
        >
            {text}
        </a>
    ) : (
        <button 
            id={id}
            onClick={onClick} 
            className="button"
        >
            {text}
        </button>
    );
};

export default Button;
