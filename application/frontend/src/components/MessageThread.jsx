import Message from './Message';

const MessageThread = ({ messages, currentUser }) => {
  return (
    <div className="message-thread-container">
      {messages.map((msg, index) => (
        <Message
          key={index}
          sender={msg.sender}
          message={msg.text}
          isSender={msg.sender === currentUser}
        />
      ))}
    </div>
  );
};

export default MessageThread;