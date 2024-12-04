import InboxComponent from './InboxComponent'
import useUserAuthStore from '../../stores/userAuthStore';
import { useState } from "react";

export default function Inbox() {
    var { username } = useUserAuthStore();

    var threads = [
        [{sender: username, text: 'hey'}, {sender: 'Bobby', text: 'hi'}],
        [{sender: username, text: 'hello'}, {sender: 'Carla', text: 'hey!'}]
    ];

    const [openThreads, setOpenThreads] = useState([]);

    const handleInboxClick = (index) => {
        setOpenThreads((prevOpenThreads) =>
            prevOpenThreads.includes(index)
                ? prevOpenThreads.filter((i) => i !== index)
                : [...prevOpenThreads, index]
        );
    };

    return (
        <div key="inbox" className="inbox" style={{ background: "grey" }}>
            <h2>Inbox</h2>
            {threads.map((thread, index) => (
                <div key={index}>
                    <InboxComponent
                        sender={thread[thread.length - 1].sender}
                        latestMsg={thread[thread.length - 1].text}
                        messages={thread}
                        currentUser={username}
                        isThreadVisible={openThreads.includes(index)}
                        onClick={() => handleInboxClick(index)}
                    />
                </div>
            ))}
        </div>
    );
};
