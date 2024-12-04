import InboxComponent from './InboxComponent';
import useUserAuthStore from '../../stores/userAuthStore';
import { useState } from "react";

export default function Inbox() {
    const { username } = useUserAuthStore();
    const [threads, setThreads] = useState([
        [{ sender: username, text: 'hey' }, { sender: 'Bobby', text: 'hi' }],
        [{ sender: username, text: 'hello' }, { sender: 'Carla', text: 'hey!' }]
    ]);
    const [openThreads, setOpenThreads] = useState([]);
    const [messageInputs, setMessageInputs] = useState({}); // Track input values for each thread

    const handleInboxClick = (index) => {
        setOpenThreads((prevOpenThreads) =>
            prevOpenThreads.includes(index)
                ? prevOpenThreads.filter((i) => i !== index)
                : [...prevOpenThreads, index]
        );
    };

    const handleInputChange = (index, value) => {
        setMessageInputs((prevInputs) => ({
            ...prevInputs,
            [index]: value,
        }));
    };

    const handleSendMessage = (index) => {
        if (messageInputs[index]?.trim()) {
            setThreads((prevThreads) => {
                const newThreads = [...prevThreads];
                newThreads[index] = [
                    ...newThreads[index],
                    { sender: username, text: messageInputs[index].trim() },
                ];
                return newThreads;
            });
            setMessageInputs((prevInputs) => ({
                ...prevInputs,
                [index]: '',
            }));
        }
    };

    return (
        <div key="inbox" className="inbox" style={{ background: "grey" }}>
            <h2>Inbox</h2>
            {threads.map((thread, index) => (
                <div key={index} className="thread">
                    <InboxComponent
                        sender={thread[thread.length - 1].sender}
                        latestMsg={thread[thread.length - 1].text}
                        messages={thread}
                        currentUser={username}
                        isThreadVisible={openThreads.includes(index)}
                        onClick={() => handleInboxClick(index)}
                    />
                    {openThreads.includes(index) && (
                        <div className="message-input">
                            <input
                                type="text"
                                value={messageInputs[index] || ''}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                placeholder="Type your message"
                            />
                            <button onClick={() => handleSendMessage(index)}>Send</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

