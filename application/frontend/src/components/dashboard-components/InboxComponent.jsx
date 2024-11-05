import MessageThread from '../MessageThread';
import React from 'react';

const InboxComponent = ({ sender, latestMsg, messages, currentUser, isThreadVisible, onClick }) => {
    return (
        <div style={{ position: 'relative' }}>
            <div
                style={{ background: "darkgrey", padding: '10px', cursor: 'pointer' }}
                onClick={onClick}
            >
                <p>Sender: {sender}</p>
                <p>Message: {latestMsg}</p>
            </div>

            {isThreadVisible && (
                <div
                    className="message-thread-popover"
                >
                    <MessageThread messages={messages} currentUser={currentUser} />
                </div>
            )}
        </div>
    );
};

export default InboxComponent;
