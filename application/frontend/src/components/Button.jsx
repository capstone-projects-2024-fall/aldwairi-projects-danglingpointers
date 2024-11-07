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

export default Button;
