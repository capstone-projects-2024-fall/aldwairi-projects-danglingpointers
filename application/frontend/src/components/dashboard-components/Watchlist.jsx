import React, { useState, useEffect } from "react";
import WatchPreview from "../entries/WatchPreview";
import "../styles/WatchList.scss";

export default function WatchList() {
  const [watchPreviews, setWatchPreviews] = useState([]);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = () => {
      const data = [
        { users: [{ id: 1, name: "User1" }, { id: 2, name: "User2" }], status: "Complete", gameLink: "/game/1", additionalInfo: "Exciting gameplay and close calls!" },
        { users: [{ id: 3, name: "User3" }, { id: 4, name: "User4" }], status: "Complete", gameLink: "/game/2", additionalInfo: "A thrilling finish to the match!" },
      ];
      setWatchPreviews(data);
    };

    fetchData();
  }, []);

  return (
    <div className="watchlist-container">
      <div>
        <h1 className="watchtitle">Game Replays</h1>
        <p className="watchlist-description">View previous games!</p>
      </div>
      <article className="watchlist">
        {watchPreviews.map((preview, index) => (
          <WatchPreview
            key={index}
            users={preview.users}
            status={preview.status}
            gameLink={preview.gameLink}
            additionalInfo={preview.additionalInfo}
          />
        ))}
      </article>
    </div>
  );
}
