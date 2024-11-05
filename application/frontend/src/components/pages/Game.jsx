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
  } = useContext(GameContext);

  const { userId } = useUserAuthStore();
  const [userItems, setUserItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
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
    setGameMode("solo");
    setGameStarted(true);
  };

  // Function to post game data to the backend after the round ends
  const postGameData = async () => {
    if (userId) {
      try {
        const response = await axios.post(`${HOST_PATH}/games`, {
          user_id: userId,
          score: userScore,
          time: timer,
          mode: gameMode,
        });
        console.log("Game data posted successfully:", response.data);
      } catch (error) {
        console.error("Error posting game data:", error);
      }
    }
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
    } else if (!gameStarted || userLivesCount <= 0) {
      clearInterval(intervalRef.current);
      if (userLivesCount <= 0) {
        postGameData(); // Post data when the game ends
      }
    }
  }, [gameStarted, setTimer, userLivesCount]);

  // End game after all pointers are off-screen
  useEffect(() => {
    if (pointersCleared && userLivesCount === 0) {
      setGameStarted(false); // End game once all pointers are cleared and lives are zero
    }
  }, [pointersCleared, userLivesCount]);

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

  return (
    <main className="main-game">
    <article className="details-container">
      <div className="game-details">
        <div className="timer">Timer: {convertSecondsToMinutes(timer)}</div>
        <div className="score">Score: {userScore}</div>
        <div className="lives-remaining">Lives: {userLives}</div>
        {gameMode === "versus" ? (
          <>
            <div className="opponent-score">Opponent Score: </div>
            <div className="opponent-lives">Opponent Lives: </div>
          </>
        ) : null}
      </div>
  
      {/* Item Box Section */}
      <div className="user-items">
        <div className="selected-item">
          {userItems.length > 0 ? (
            <span className="item-icon">{userItems[selectedIndex].icon}</span>
          ) : (
            <span>No items available</span> // Fallback if no items are found
          )}
        </div>
      </div>
  
      {/* Start Round Button */}
      <button
        onClick={initializeRound}
        className="start-round-button"
        disabled={gameStarted}
      >
        Start New Round
      </button>
    </article>
    
    <article className="game">
      <Stack ref={stackRef} />
      <GarbageCollector ref={garbageCollectorRef} />
      <RecyclingBin ref={recyclingBinRef} />
    </article>
  </main>
  
  );
}
