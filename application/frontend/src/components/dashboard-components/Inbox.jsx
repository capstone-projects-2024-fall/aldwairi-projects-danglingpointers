import { useEffect, useState } from "react";
import InboxComponent from './InboxComponent';
import useUserAuthStore from '../../stores/userAuthStore';
import axios from "axios";
import { HOST_PATH, CHAT_URL } from "../../scripts/constants";

export default function Inbox() {
    const { username, userId } = useUserAuthStore();
    const [threads, setThreads] = useState([]);
    const [openThreads, setOpenThreads] = useState([]);
    const [messageInputs, setMessageInputs] = useState({});
    const [isInboxExpanded, setIsInboxExpanded] = useState(false);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const socket = new WebSocket(CHAT_URL);
    
        socket.onopen = () => {
            console.log("WebSocket connection established");
        };
    
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === "chat") {
                console.log("Received chat message:", message);
                const { user_id, message: newMessage, username: senderUsername } = message;
    
                // Update threads with the new message
                setThreads((prevThreads) => {
                    const updatedThreads = [...prevThreads];
                    const threadIndex = updatedThreads.findIndex(
                        (thread) => thread.friendId === user_id
                    );
                    if (threadIndex !== -1) {
                        updatedThreads[threadIndex].messages.push({
                            sender: senderUsername,
                            text: newMessage,
                        });
                    }
                    return updatedThreads;
                });
            }
        };
    
        socket.onclose = () => {
            console.log("WebSocket connection closed");
        };
    
        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };
    
        setWs(socket);
    
        return () => {
            socket.close();
        };
    }, [userId, username]);    

    // Fetch friends list and initialize threads
    const fetchFriends = async () => {
        try {
            const response = await axios.get(`${HOST_PATH}/friends/`, {
                params: { user_id: userId },
            });
            console.log("Friends API Response:", response.data);

            const initializedThreads = response.data.map((friend) => ({
                friendId: friend.id,
                friendName: friend.username,
                messages: [],
            }));

            setThreads(initializedThreads);
        } catch (error) {
            console.error("Error fetching friends list:", error);
        }
    };

    useEffect(() => {
        fetchFriends();
    }, [userId]);

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

    const handleSendMessage = async (index) => {
        if (messageInputs[index]?.trim()) {
            const message = messageInputs[index].trim();
            const recipientId = threads[index].friendId;
    
            // Create the message object
            const messagePayload = {
                sender: userId,        // Your current user's ID
                recipient: recipientId, // The recipient's ID
                message: message,       // The message content
            };
    
            try {
                // Save the message to the API
                const response = await axios.post(
                    'http://localhost:8000/api/chat-messages/',
                    messagePayload
                );
                const savedMessage = response.data; // The saved message returned by the API
    
                // Send the message via WebSocket
                ws.send(
                    JSON.stringify({
                        type: 'chat',
                        user_id: userId,
                        message: savedMessage.message, // Use savedMessage to ensure consistency
                        username,
                    })
                );
    
                // Update the local state with the saved message
                setThreads((prevThreads) => {
                    const newThreads = [...prevThreads];
                    newThreads[index].messages.push({
                        sender: username, // Your username
                        text: savedMessage.message, // The message content
                    });
                    return newThreads;
                });
    
                // Clear the input field
                setMessageInputs((prevInputs) => ({
                    ...prevInputs,
                    [index]: '',
                }));
            } catch (error) {
                console.error("Error saving or sending message:", error);
            }
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


