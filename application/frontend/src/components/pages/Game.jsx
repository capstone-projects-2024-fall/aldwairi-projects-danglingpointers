import GarbageCollector from "../game-components/GarbageCollector";
import RecyclingBin from "../game-components/RecyclingBin";
import Stack from "../game-components/Stack";
import convertSecondsToMinutes from "../../scripts/convert-seconds-to-minutes";
import { useEffect, useRef, useContext, useState } from "react";
import GameContext from "../../context/GameContext";
import axios from "axios";
import { HOST_PATH } from "../../scripts/constants";
import useUserAuthStore from "../../stores/userAuthStore";

export default function Game() {
  const {
    timer,
    setTimer,
    gameMode,
    setGameMode,
    userScore,
    setUserScore,
    userLives,
    setUserLives,
    userLivesCount,
    setUserLivesCount,
    gameStarted,
    setGameStarted,
    pointersCleared, // Listen for pointersCleared state
    setPointersCleared,
  } = useContext(GameContext);

  const { userId } = useUserAuthStore();
  const [userItems, setUserItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [finalTimer, setFinalTimer] = useState(0);
  const intervalRef = useRef(null);
  const stackRef = useRef(null);
  const garbageCollectorRef = useRef(null);
  const recyclingBinRef = useRef(null);

  // Function to initialize a new round
  const initializeRound = () => {
    if (gameStarted) return; // Prevent starting if game is already in progress
    setTimer(0);
    setUserScore(0);
    setUserLives(["❤️", "❤️", "❤️"]);
    setUserLivesCount(3);
    setGameMode("Solo");
    setGameStarted(true);
    setPointersCleared(false); // Reset pointers cleared state when starting a new round
  };

  // Game Timer
  useEffect(() => {
    if (gameStarted && userLivesCount > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);

      intervalRef.current = intervalId;

      return () => {
        clearInterval(intervalRef.current);
      };
    } else if (!gameStarted || userLivesCount <= 0 || finalTimer == 0) {
      clearInterval(intervalRef.current);
      setFinalTimer(timer);
    }
  }, [gameStarted, finalTimer, timer, setTimer, userLivesCount]);

  // End game after all pointers are off-screen
  useEffect(() => {
    // Function to post game data to the backend after the round ends
    const postGameData = async () => {
      if (userId) {
        try {
          const response = await axios.post(`${HOST_PATH}/games/`, {
            player_one: userId,
            player_one_score: userScore,
            game_length: finalTimer,
            mode: gameMode,
            status: "Complete",
          });
          console.log("Game data posted successfully:", response.data);
        } catch (error) {
          console.error("Error posting game data:", error);
        }
      }
    };

    if (pointersCleared && userLivesCount === 0) {
      postGameData();
      setGameStarted(false); // End game once all pointers are cleared and lives are zero
    }
  }, [
    pointersCleared,
    setGameStarted,
    userLivesCount,
    gameMode,
    finalTimer,
    userId,
    userScore,
  ]);

  // Fetch Items
  useEffect(() => {
    const fetchUserItems = async () => {
      if (userId) {
        try {
          const metadataResponse = await axios.get(
            `${HOST_PATH}/user-metadata?user_id=${userId}`
          );
          const itemIds = metadataResponse.data[0].items;

          const fetchedItems = [];

          const itemPromises = itemIds.map(async (itemId) => {
            const itemResponse = await axios.get(
              `${HOST_PATH}/items?user_id=${itemId}`
            );
            return itemResponse.data[0];
          });

          const resolvedItems = await Promise.all(itemPromises);
          fetchedItems.push(...resolvedItems); // Efficiently add fetched items

          setUserItems(fetchedItems);
        } catch (error) {
          console.error("Error fetching items:", error);
        }
      }
    };

    fetchUserItems();
  }, [userId]);

  // Use Items Event Listener
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Tab") {
        event.preventDefault();
        const newIndex =
          (selectedIndex + (event.shiftKey ? -1 : 1) + userItems.length) %
          userItems.length;
        setSelectedIndex(newIndex);
      } else if (event.key === "Enter") {
        console.log(userItems[selectedIndex].icon);
      }
    };

    // const mainGame = gameRef.current;
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, userItems]);

  return (
    <main className="main-game">
      <article className="details-container">
        <div className="game-details">
          <div className="timer">Timer: {convertSecondsToMinutes(timer)}</div>
          <div className="score">Score: {userScore}</div>
          <div className="lives-remaining">Lives: {userLives}</div>
        </div>
        <div className="user-items">
          <div className="selected-item">
            {userItems.length > 0 ? (
              <span className="item-icon">{userItems[selectedIndex].icon}</span>
            ) : (
              <p className="item-warning">Login to buy and use items!</p>
            )}
          </div>
        </div>
        <div className="start-game">
          {/* Start Round Button */}
          <button
            onClick={initializeRound}
            className="start-round-button"
            style={{ 
              background: gameStarted ? "red" : "green",
              color: "white",
              cursor: gameStarted ? "not-allowed" : "pointer" 
            }}
          >
            {gameStarted ? "Round In Progress" : "Start New Round"} 
          </button>
        </div>
      </article>

      <article className="game">
        <Stack ref={stackRef} />
        <GarbageCollector ref={garbageCollectorRef} />
        <RecyclingBin ref={recyclingBinRef} />
      </article>
    </main>
  );
}
