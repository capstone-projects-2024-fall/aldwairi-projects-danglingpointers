const Message = ({ sender, message, isSender }) => {
  return (
    <div className={`message-container ${isSender ? 'sender' : 'recipient'}`}>
      <p className="message-sender">{sender}</p>
      <p className="message-text">{message}</p>
    </div>
  );
};

export default Message;