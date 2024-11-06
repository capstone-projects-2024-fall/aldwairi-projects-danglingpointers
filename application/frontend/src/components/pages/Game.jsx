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
    userLives,
    userLivesCount,
  } = useContext(GameContext);

  const { userId } = useUserAuthStore();
  const [userItems, setUserItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const intervalRef = useRef(null);
  const gameRef = useRef(null);
  const stackRef = useRef(null);
  const garbageCollectorRef = useRef(null);
  const recyclingBinRef = useRef(null);

  // Game Timer
  useEffect(() => {
    if (userLivesCount > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);

      intervalRef.current = intervalId;

      return () => {
        clearInterval(intervalRef.current);
      };
    }
  }, [setTimer, userLivesCount]);

  // TODO: Game Mode
  useEffect(() => {
    setGameMode("solo");
  }, [setGameMode]);

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
      event.preventDefault();
      if (event.key === "Tab") {
        const newIndex =
          (selectedIndex + (event.shiftKey ? -1 : 1) + userItems.length) %
          userItems.length;
        setSelectedIndex(newIndex);
      } else if (event.key === "Enter") {
        console.log(userItems[selectedIndex].icon);
      }
    };

    const mainGame = gameRef.current;
    mainGame.addEventListener("keydown", handleKeyDown);

    return () => {
      mainGame.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, userItems]);

  return (
    <main className="main-game" ref={gameRef}>
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
        <div className="user-items">
          <div className="selected-item">
            {userItems.length > 0 ? (
              <span className="item-icon">{userItems[selectedIndex].icon}</span>
            ) : null}
          </div>
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
