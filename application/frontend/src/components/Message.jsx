const Message = ({ sender, message, isSender }) => {
  // Create a unique ID using sender and truncated message
  const messageId = `${sender}-${message.substring(0, 10).replace(/\s+/g, '-')}`;
  
  return (
    <div 
      id={`message-${messageId}`}
      className={`message-container ${isSender ? 'sender' : 'recipient'}`}
    >
      <p id={`sender-${messageId}`} className="message-sender">
        {sender}
      </p>
      <p id={`text-${messageId}`} className="message-text">
        {message}
      </p>
    </div>
  );
};

export default Message;