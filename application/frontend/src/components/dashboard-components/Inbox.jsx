import { useEffect } from "react";
import InboxComponent from './InboxComponent';
import useUserAuthStore from '../../stores/userAuthStore';
import { useState } from "react";
import axios from "axios";
import { HOST_PATH } from "../../scripts/constants";

export default function Inbox() {
    const { username, userId } = useUserAuthStore(); // Ensure `userId` is available
    const [threads, setThreads] = useState([]);
    const [openThreads, setOpenThreads] = useState([]);
    const [messageInputs, setMessageInputs] = useState({});
    const [isInboxExpanded, setIsInboxExpanded] = useState(false);

    // Fetch friends list and initialize threads
    const fetchFriends = async () => {
        try {
            const response = await axios.get(`${HOST_PATH}/friends/`, {
                params: { user_id: userId },
            });
            console.log("Friends API Response:", response.data);

            // Transform friends data into threads
            const initializedThreads = response.data.map(friend => ({
                friendId: friend.id,
                friendName: friend.username,
                messages: [], // Initialize with an empty thread
            }));

            setThreads(initializedThreads);
        } catch (error) {
            console.error("Error fetching friends list:", error);
        }
    };

    useEffect(() => {
        fetchFriends(); // Fetch friends when the component mounts
    }, []);

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
                newThreads[index].messages = [
                    ...newThreads[index].messages,
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
            <div
                onClick={() => setIsInboxExpanded(!isInboxExpanded)}
                style={{ cursor: "pointer", margin: "10px 0" }}
            >
                {isInboxExpanded ? "▽ Inbox" : "▷ Inbox"}
            </div>

            {isInboxExpanded && (
                <div>
                    <h2>Inbox</h2>
                    {threads.map((thread, index) => (
                        <div key={index} className="thread">
                            <InboxComponent
                                sender={
                                    thread.messages.length
                                        ? thread.messages[thread.messages.length - 1].sender
                                        : thread.friendName
                                }
                                latestMsg={
                                    thread.messages.length
                                        ? thread.messages[thread.messages.length - 1].text
                                        : "Start a conversation"
                                }
                                messages={thread.messages}
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
            )}
        </div>
    );
}

