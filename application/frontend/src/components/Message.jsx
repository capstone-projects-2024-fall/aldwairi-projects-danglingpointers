const generateMessageId = (sender, message) => {
  if (!sender || !message) return "message-unknown";
  const truncatedMsg = message.toString().slice(0, 10).replace(/\s+/g, '-');
  return `message-${sender}-${truncatedMsg}`;
};

const Message = ({ sender, message, isSender }) => {
  return (
    <div 
      id={generateMessageId(sender, message)}
      className={`message-container ${isSender ? 'sender' : 'recipient'}`}
    >
      <p className="message-sender">{sender}</p>  
      <p className="message-text">{message}</p>
    </div>
  );
};

export default Message;