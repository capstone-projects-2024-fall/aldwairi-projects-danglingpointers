import { useEffect, useState } from "react";
import axios from "axios";
import { HOST_PATH } from "../../scripts/constants";
import Watchlist from "../views/Watchlist";

export default function Watch() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchWatchlist = async () => {
      try {
        await axios.get(`${HOST_PATH}/api/watchlist`);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load watchlist');
        setIsLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  return (
    <main className="main-default main-watch">
      <div className="watch-container">
        {error && <div className="error-message">{error}</div>}
        {isLoading ? (
          <div className="loading">Loading watchlist...</div>
        ) : (
          <Watchlist />
        )}
      </div>
    </main>
  );
}
