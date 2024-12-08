import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import GameContext from "../../context/GameContext";
import {
  CHAT_URL,
  DEFAULT_SETTINGS,
  GAME_URL,
  HOST_PATH,
  ITEM_URL,
} from "../../scripts/constants";
import convertSecondsToMinutes from "../../scripts/convert-seconds-to-minutes";
import setTemporaryItemState from "../../scripts/set-temp-item-state";
import useUserAuthStore from "../../stores/userAuthStore";
import GarbageCollector from "../game-components/GarbageCollector";
import RecyclingBin from "../game-components/RecyclingBin";
import Stack from "../game-components/Stack";

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
  const [currGameId, setCurrGameId] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(GAME_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection to GameConsumer established");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "game") {
        console.log("Received game message:", message);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection to GameConsumer closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  // Set current user points
  useEffect(() => {
    const store = JSON.parse(sessionStorage.getItem("user-metadata-state"));
    if (store) {
      const points = store.state.points;
      userPoints.current = points;
    }
  }, [userId, userPoints]);

  const postActiveGameData = async (mode) => {
    if (userId) {
      try {
        const payload = {
          player_one: userId,
          mode: mode,
          status: "Active",
        };
        
        const response = await axios.post(`${HOST_PATH}/games/`, payload);
        
        if (response.data && response.data.id) {
          setCurrGameId(response.data.id);
          console.log("Active game data posted, gameId:", response.data.id);

          // Send WebSocket message
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(
              JSON.stringify({
                type: "game",
                game_id: response.data.id,
              })
            );
          }
        } else {
          console.error("Game ID not found in response");
        }
      } catch (error) {
        console.error("Error posting active game data:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
        }
      }
    }
  };

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

    if (mode !== "Practice") {
      postActiveGameData(mode); // Post active game data when not in practice mode
    }
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
      if (userId && currGameId) {
        try {
          await axios.put(`${HOST_PATH}/games/${currGameId}/`, {
            player_one: userId,
            player_one_score: userScore,
            game_length: finalTimer,
            mode: gameMode,
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

          // Send WebSocket message
          wsRef.current.send(
            JSON.stringify({
              type: "game",
              game_id: currGameId,
            })
          );
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
    currGameId,
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
          const store = JSON.parse(
            sessionStorage.getItem("user-metadata-state")
          );
          const items = store.state.items;

          const itemKeys = Object.keys(items);
          const quantities = Object.values(items);

          const itemsObject = {};

          for (const key in practiceItems) {
            if (itemKeys.includes(key)) {
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
    function decrementItemInStorage(selectedIndex) {
      const store = JSON.parse(sessionStorage.getItem("user-metadata-state"));
      const items = store.state.items;

      items[selectedIndex] -= 1;
      userItems[selectedIndex].quantity -= 1;
      store.state.items = items;

      console.log(store);

      sessionStorage.setItem("user-metadata-state", JSON.stringify(store));
    }

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
    
        const currentQuantity = isPractice
          ? practiceItems[selectedIndex]?.quantity || 0
          : userItems[selectedIndex]?.quantity || 0;
    
        if (!isPractice && currentQuantity <= 0) {
          return;
        }
    
        // Only decrement item quantity if not in practice mode
        if (!isPractice) {
          decrementItemInStorage(selectedIndex);
        }
    
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

  return (
    <main className="main-game">
      <article className="details-container">
        <div className="game-details">
          <div id="game-timer" className="timer">
            Timer: {convertSecondsToMinutes(timer)}
          </div>
          <div id="game-score" className="score">
            Score: {userScore}
          </div>
          <div id="game-lives" className="lives-remaining">
            Lives: {userLives}
          </div>
        </div>
        <div id="game-items" className="user-items">
          <div id="selected-item" className="selected-item">
            {isPractice ? (
              <span id="practice-item-icon" className="item-icon">
                {practiceItems[selectedIndex]?.icon}
              </span>
            ) : userId && Object.keys(userItems).length > 0 ? (
              <>
                <span id="user-item-icon" className="item-icon">
                  {userItems[selectedIndex]?.item.icon}
                </span>
                <span id="item-quantity" style={{ marginBottom: "7.5px" }}>
                  {userItems[selectedIndex]?.quantity} remaining
                </span>
              </>
            ) : userId ? (
              <p id="no-items-warning" className="item-warning">You are out of items!</p>
            ) : (
              <p id="login-warning" className="item-warning">Login or Practice to use items!</p>
            )}
          </div>
        </div>
        <div id="start-game" className="start-game">
          {/* Start Round Button */}
          <button
            onClick={() => initializeRound("Solo")}
            id="start-round-button"
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
            id="start-pround-button"
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
