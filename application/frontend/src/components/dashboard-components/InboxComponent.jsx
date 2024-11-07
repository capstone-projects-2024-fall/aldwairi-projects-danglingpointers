import MessageThread from "../MessageThread";

const InboxComponent = ({
  sender,
  latestMsg,
  messages,
  currentUser,
  isThreadVisible,
  onClick,
}) => {
  return (
    <div>
      <div className="inbox-component">
        <div onClick={onClick} style={{ cursor: "pointer" }}>
          {isThreadVisible ? "▽" : "▷"}
        </div>
        <div>
          <p>Sender: {sender}</p>
          <p>Message: {latestMsg}</p>
        </div>
      </div>

      {isThreadVisible && (
        <div className="message-thread-popover">
          <MessageThread messages={messages} currentUser={currentUser} />
        </div>
      )}
    </div>
  );
};

export default InboxComponent;
