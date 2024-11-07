import InboxComponent from './InboxComponent'
import { useState } from "react";

export default function Inbox() {
    var currUser = 'Alice'

    var threads = [
        [{sender: 'Alice', text: 'hey'}, {sender: 'Bobby', text: 'hi'}],
        [{sender: 'Alice', text: 'hello'}, {sender: 'Carla', text: 'hey!'}]
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
                        currentUser={currUser}
                        isThreadVisible={openThreads.includes(index)}
                        onClick={() => handleInboxClick(index)}
                    />
                </div>
            ))}
        </div>
    );
};
