export default function Button({ type = 'button', children, onClick }) {
    return (
      <button type={type} onClick={onClick} style={{ padding: '10px 20px', fontSize: '16px' }}>
        {children}
      </button>
    );
  }
  