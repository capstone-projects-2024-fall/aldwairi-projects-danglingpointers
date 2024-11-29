import GarbageCollector from "../game-components/GarbageCollector";
import RecyclingBin from "../game-components/RecyclingBin";
import Stack from "../game-components/Stack";
import convertSecondsToMinutes from "../../scripts/convert-seconds-to-minutes";
import { useEffect, useRef, useContext, useState } from "react";
import GameContext from "../../context/GameContext";
import axios from "axios";
import {
  CHAT_URL,
  DEFAULT_SETTINGS,
  GAME_URL,
  HOST_PATH,
  ITEM_URL,
} from "../../scripts/constants";
import setTemporaryItemState from "../../scripts/set-temp-item-state";
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
    totalPointerCount,
    pointersCleared,
    setPointersCleared,
    setIsDoubleScore,
    setIsSlowDown,
    setIsSpeedUp,
    setIsSuperCollector,
    setItemInUse,
    isPractice,
    setIsPractice,
  } = useContext(GameContext);

  const { userId } = useUserAuthStore();
  const [userItems, setUserItems] = useState({});
  const [practiceItems, setPracticeItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [finalTimer, setFinalTimer] = useState(0);
  const intervalRef = useRef(null);
  const stackRef = useRef(null);
  const garbageCollectorRef = useRef(null);
  const recyclingBinRef = useRef(null);
  const wsRef = useRef(null);
  const toggleNextItem = useRef(null);
  const useItem = useRef(null);
  const userPoints = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(GAME_URL);
    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const ws = new WebSocket(CHAT_URL);

    ws.onopen = () => {
      console.log("WebSocket connection to ChatConsumer established");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "chat") {
        console.log("Received chat message:", message);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection to ChatConsumer closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    const store = JSON.parse(sessionStorage.getItem("user-metadata-state"));
    if (store) {
      const points = store.state.points;
      userPoints.current = points;
    }
  }, [userId, userPoints]);

  useEffect(() => {}, [userScore]);

  // Function to initialize a new round
  const initializeRound = (mode) => {
    if (gameStarted || isPractice) return; // Prevent starting if game is already in progress
    setTimer(0);
    setUserScore(0);
    setUserLives(["❤️", "❤️", "❤️"]);
    setUserLivesCount(3);
    setGameMode(mode);
    mode === "Practice" ? setIsPractice(true) : setGameStarted(true);
    setPointersCleared(false); // Reset pointers cleared state when starting a new round
  };

  const togglePractice = () => {
    if (isPractice) {
      setUserItems({});
      setIsPractice(false);
      const pointerContainer =
        stackRef.current.querySelector(".pointer-container");
      pointerContainer.innerHTML = "";
    } else {
      initializeRound("Practice");
    }
  };

  // Game Timer
  useEffect(() => {
    if ((gameStarted || isPractice) && userLivesCount > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);

      intervalRef.current = intervalId;

      return () => {
        clearInterval(intervalRef.current);
      };
    } else if (
      (!gameStarted && !isPractice) ||
      userLivesCount <= 0 ||
      finalTimer == 0
    ) {
      clearInterval(intervalRef.current);
      setFinalTimer(timer);
    }
  }, [gameStarted, isPractice, finalTimer, timer, setTimer, userLivesCount]);

  // End game after all pointers are off-screen
  useEffect(() => {
    // Function to post game data to the backend after the round ends
    const postGameData = async () => {
      if (userId) {
        try {
          await axios.post(`${HOST_PATH}/games/`, {
            player_one: userId,
            player_one_score: userScore,
            game_length: finalTimer,
            mode: gameMode,
            // link: `game/game_id_${gameId}`,
            status: "Complete",
          });
          const prevPoints = userPoints.current;
          const newPoints = prevPoints + userScore;

          const store = JSON.parse(
            sessionStorage.getItem("user-metadata-state")
          );

          if (store) {
            store.state.points = newPoints;
            sessionStorage.setItem(
              "user-metadata-state",
              JSON.stringify(store)
            );
          }
        } catch (error) {
          console.error("Error posting game data:", error);
        }
      }
    };

    if (pointersCleared && userLivesCount === 0) {
      postGameData();
      gameMode === "Practice" ? setIsPractice(false) : setGameStarted(false);
    }
  }, [
    pointersCleared,
    totalPointerCount,
    setGameStarted,
    userLivesCount,
    gameMode,
    finalTimer,
    userId,
    userPoints,
    userScore,
    setIsPractice,
  ]);

  // Fetch All Items
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const itemResponse = await axios.get(`${HOST_PATH}/items`);
        setPracticeItems(itemResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllItems();
  }, []);

  // Fetch items for user
  useEffect(() => {
    const fetchUserItems = async () => {
      const store = JSON.parse(sessionStorage.getItem("user-metadata-state"));

      // Set keys for keypress events
      if (store) {
        const settings = store.state.settings;
        toggleNextItem.current = settings.toggleNextItem;
        useItem.current = settings.useItem;
      } else {
        toggleNextItem.current = DEFAULT_SETTINGS.toggleNextItem;
        useItem.current = DEFAULT_SETTINGS.useItem;
      }

      // Set user items from base item list
      try {
        if (userId) {
          const metadataResponse = await axios.get(
            `${HOST_PATH}/user-metadata?user_id=${userId}`
          );
          const userMetaDataItems = metadataResponse.data[0].items;
          const items = Object.keys(userMetaDataItems);
          const quantities = Object.values(userMetaDataItems);

          const itemsObject = {};

          for (const key in practiceItems) {
            if (items.includes(key)) {
              itemsObject[key] = {
                item: practiceItems[key],
                quantity: quantities[key],
              };
            }
          }
          setUserItems(itemsObject);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchUserItems();
  }, [userId, practiceItems]);

  // Use Items Event Listener
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === toggleNextItem.current) {
        event.preventDefault();
        const newIndex = isPractice
          ? (selectedIndex + (event.shiftKey ? -1 : 1) + practiceItems.length) %
            practiceItems.length
          : (selectedIndex +
              (event.shiftKey ? -1 : 1) +
              Object.keys(userItems).length) %
            Object.keys(userItems).length;
        setSelectedIndex(newIndex);
      } else if ((gameStarted || isPractice) && event.key === useItem.current) {
        event.preventDefault();
        switch (selectedIndex) {
          case 0:
            setTemporaryItemState(setItemInUse, setIsSlowDown);
            break;
          case 1:
            setTemporaryItemState(setItemInUse, setIsSpeedUp);
            break;
          case 2:
            if (userLives.length < 10)
              setUserLives([...userLives, userLives[0]]);
            break;
          case 3:
            setTemporaryItemState(setItemInUse, setIsSuperCollector);
            break;
          case 4:
            setTemporaryItemState(setItemInUse, setIsDoubleScore);
            break;
        }
      }
    };

    // const mainGame = gameRef.current;
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    gameStarted,
    isPractice,
    selectedIndex,
    userItems,
    setIsDoubleScore,
    setIsSlowDown,
    setIsSpeedUp,
    setIsSuperCollector,
    setItemInUse,
    setUserLives,
    userLives,
    practiceItems,
  ]);

  // Game Socket
  useEffect(() => {
    const ws = new WebSocket(ITEM_URL);

    ws.onopen = () => {
      console.log("WebSocket connection to ItemConsumer established");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "item") {
        console.log("Received item message:", message);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection to ItemConsumer closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

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
            {isPractice ? (
              <span className="item-icon">
                {practiceItems[selectedIndex].icon}
              </span>
            ) : userId && Object.keys(userItems).length > 0 ? (
              <>
                <span className="item-icon">
                  {userItems[selectedIndex].item.icon}
                </span>
                <span style={{marginBottom: "7.5px"}}>{userItems[selectedIndex].quantity} remaining</span>
              </>
            ) : userId ? (
              <p className="item-warning">You are out of items!</p>
            ) : (
              <p className="item-warning">Login or Practice to use items!</p>
            )}
          </div>
        </div>
        <div className="start-game">
          {/* Start Round Button */}
          <button
            onClick={() => initializeRound("Solo")}
            className="start-round-button"
            style={{
              background:
                !userId || gameStarted || isPractice ? "red" : "green",
              color: "white",
              cursor:
                !userId || gameStarted || isPractice
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {!userId
              ? "Login to Play"
              : gameStarted
              ? "Round In Progress"
              : "Start New Round"}
          </button>

          <button
            onClick={togglePractice}
            className="start-round-button"
            style={{
              background: isPractice || !gameStarted ? "blue" : "red",
              color: "white",
              cursor: isPractice || !gameStarted ? "pointer" : "not-allowed",
            }}
          >
            {isPractice ? "End Practice" : "Begin Practice"}
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
