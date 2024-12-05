import { useEffect, useState } from "react";
import InboxComponent from "./InboxComponent";
import useUserAuthStore from "../../stores/userAuthStore";
import axios from "axios";
import { HOST_PATH, CHAT_URL } from "../../scripts/constants";

export default function Inbox({ isInboxOpen, setIsInboxOpen }) {
  const { username, userId } = useUserAuthStore();
  const [threads, setThreads] = useState([]);
  const [openThreads, setOpenThreads] = useState([]);
  const [messageInputs, setMessageInputs] = useState({});
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket(CHAT_URL);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "chat") {
        console.log("Received chat message:", message);
    
        const { user_id: senderId, message: newMessage, username: senderUsername, recipient_id: recipientId } = message;
    
        setThreads((prevThreads) => {
          const updatedThreads = prevThreads.map((thread) => {
            if (thread.friendId === senderId || thread.friendId === recipientId) {
              // Correctly place message in the corresponding thread
              return {
                ...thread,
                messages: [...thread.messages, { sender: senderUsername, text: newMessage }],
              };
            }
            return thread;
          });
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

  useEffect(() => {
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

    fetchFriends();
  }, [userId]);

  const fetchMessages = async (friendId, index) => {
    try {
      const response = await axios.get("http://localhost:8000/api/chat-messages/", {
        params: {
          sender: userId,
          recipient: friendId,
        },
      });
  
      const sortedMessages = response.data
        .filter((message) =>
          (message.sender === userId && message.recipient === friendId) ||
          (message.sender === friendId && message.recipient === userId)
        )
        .sort((a, b) => new Date(a.date) - new Date(b.date));
  
      // Ensure that we update the correct thread based on friendId
      setThreads((prevThreads) => {
        const updatedThreads = prevThreads.map((thread) => {
          if (thread.friendId === friendId) {
            return {
              ...thread,
              messages: sortedMessages.map((message) => ({
                sender: message.sender === userId ? username : thread.friendName,
                text: message.message,
              })),
            };
          }
          return thread;
        });
        return updatedThreads;
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };    

  const handleInboxClick = async (index) => {
    const friendId = threads[index].friendId;

    // If the thread is not already open, fetch its messages
    if (!openThreads.includes(index)) {
        await fetchMessages(friendId, index);
    }

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
      
      const messagePayload = {
        sender: userId,        // Your current user's ID
        recipient: recipientId, // The recipient's ID
        message: message,       // The message content
      };
  
      try {
        // Save the message to the API
        const response = await axios.post('http://localhost:8000/api/chat-messages/', messagePayload);
        const savedMessage = response.data; // The saved message returned by the API
  
        // Send the message via WebSocket
        ws.send(
          JSON.stringify({
            type: 'chat',
            user_id: userId,
            message: savedMessage.message, // Use savedMessage to ensure consistency
            username,
            recipient_id: recipientId, // Include recipient_id to correctly update the thread
          })
        );
  
        // Update the local state with the saved message
        setThreads((prevThreads) => {
          const newThreads = prevThreads.map((thread) => {
            if (thread.friendId === recipientId) {
              return {
                ...thread,
                messages: [...thread.messages, { sender: username, text: savedMessage.message }],
              };
            }
            return thread;
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
    <div
      key="inbox"
      className="inbox"
      style={{ background: "gray", gridColumnEnd: isInboxOpen ? -1 : 4 }}
    >
      <div>
        <div className="inbox-flex">
          <h2>Inbox</h2>
          <button onClick={() => setIsInboxOpen(!isInboxOpen)} style={{background: isInboxOpen ? "red" : "green", color: "white", padding: "5px 10px"}}>
            {isInboxOpen ? "Close" : "Open"}
          </button>
        </div>
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
                  value={messageInputs[index] || ""}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder="Type your message"
                />
                <button onClick={() => handleSendMessage(index)}>Send</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
