import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GameContext from "../../context/GameContext";
import useUserAuthStore from "../../stores/userAuthStore";
import { GAME_URL, HOST_PATH, ITEM_URL } from "../../scripts/constants";
import convertSecondsToMinutes from "../../scripts/convert-seconds-to-minutes";
import Stack from "../game-components/Stack";
import GarbageCollector from "../game-components/GarbageCollector";
import RecyclingBin from "../game-components/RecyclingBin";

export default function GameVersus() {
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
    pendingGame,
    setPendingGame,
  } = useContext(GameContext);

  const { userId } = useUserAuthStore();
  const [userItems, setUserItems] = useState({});
  const [allItems, setAllItems] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [finalTimer, setFinalTimer] = useState(0);
  const intervalRef = useRef(null);
  const stackRef = useRef(null);
  const garbageCollectorRef = useRef(null);
  const recyclingBinRef = useRef(null);
  const wsItemRef = useRef(null);
  const wsGameRef = useRef(null);
  const toggleNextItem = useRef(null);
  const useItem = useRef(null);
  const userPoints = useRef(null);
  const [isPlayerOne, setIsPlayerOne] = useState(false);
  const [isPlayerTwo, setIsPlayerTwo] = useState(false);
  const [isOpponentPresent, setIsOpponentPresent] = useState(false);
  const [playerTwoId, setPlayerTwoId] = useState(null);
  const [playerTwoUserName, setPlayerTwoUserName] = useState(null);
  const [playerTwoScore, setPlayerTwoScore] = useState(0);
  const [playerTwoLivesCount, setPlayerTwoLivesCount] = useState(3);
  const [playerTwoLives, setPlayerTwoLives] = useState([]);
  const [isWinner, setIsWinner] = useState(false);
  const [currGameId, setCurrGameId] = useState(null);
  const { search } = useLocation();
  const navigate = useNavigate();

  // Set player one and player two, notify opponent with websocket
  useEffect(() => {
    const fetchPendingGames = async () => {
      const queryParams = new URLSearchParams(search);
      const newGameId = queryParams.get("game_id");
      setCurrGameId(newGameId);

      try {
        const response = await axios.get(`${HOST_PATH}/games/?lobby=true`);
        const findGameByQueryString = response.data.find(
          (x) => x.id == newGameId
        );

        const initiator = findGameByQueryString.player_one;

        if (initiator == userId) setIsPlayerOne(true);
        else setIsPlayerTwo(true);

        setPendingGame(findGameByQueryString);

        if (
          wsGameRef.current &&
          wsGameRef.current.readyState === WebSocket.OPEN
        ) {
          wsGameRef.current.send(
            JSON.stringify({
              type: "game",
              game_id: `${newGameId}_${initiator}_${userId}`,
            })
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPendingGames();
  }, []);

  // Listen for opponent to be present in session
  useEffect(() => {
    const putActiveGameData = async (mode) => {
      try {
        const payload = {
          player_one: userId,
          player_two: playerTwoId,
          mode: mode,
          status: "Active",
        };

        const response = await axios.put(
          `${HOST_PATH}/games/${currGameId}/`,
          payload
        );

        if (response.data && response.data.id) {
          console.log("Active game data posted, gameId:", response.data.id);

          // Send WebSocket message
          if (
            wsGameRef.current &&
            wsGameRef.current.readyState === WebSocket.OPEN
          ) {
            wsGameRef.current.send(
              JSON.stringify({
                type: "game",
                game_id: currGameId,
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
    };

    // Function to initialize a new round
    const initializeRound = async (mode) => {
      if (gameStarted) return; // Prevent starting if game is already in progress
      setTimer(0);
      setUserScore(0);
      setPlayerTwoScore(0);
      setUserLives(["❤️", "❤️", "❤️"]);
      setPlayerTwoLives(["❤️", "❤️", "❤️"]);
      setUserLivesCount(3);
      setPlayerTwoLivesCount(3);
      setGameMode(mode);
      setGameStarted(true);
      setPointersCleared(false); // Reset pointers cleared state when starting a new round

      if (userId == pendingGame.player_one) putActiveGameData(mode);
    };

    if (
      pendingGame &&
      (isPlayerOne || isPlayerTwo) &&
      isOpponentPresent &&
      playerTwoId &&
      currGameId
    )
      initializeRound("Versus");
  }, [
    pendingGame,
    isPlayerOne,
    isPlayerTwo,
    isOpponentPresent,
    playerTwoId,
    currGameId,
  ]);

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

  // Set current user points
  useEffect(() => {
    const store = JSON.parse(sessionStorage.getItem("user-metadata-state"));
    if (store) {
      const points = store.state.points;
      userPoints.current = points;
    }
  }, [userId, userPoints]);

  // Fetch All Items
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const itemResponse = await axios.get(`${HOST_PATH}/items`);
        setAllItems(itemResponse.data);
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

          for (const key in allItems) {
            if (itemKeys.includes(key)) {
              itemsObject[key] = {
                item: allItems[key],
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
  }, [userId, allItems]);

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
        const newIndex =
          (selectedIndex +
            (event.shiftKey ? -1 : 1) +
            Object.keys(userItems).length) %
          Object.keys(userItems).length;
        setSelectedIndex(newIndex);
      } else if (gameStarted && event.key === useItem.current) {
        event.preventDefault();

        const currentQuantity = userItems[selectedIndex]?.quantity || 0;

        if (currentQuantity <= 0) {
          return;
        }

        decrementItemInStorage(selectedIndex);

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
            if (
              wsGameRef.current &&
              wsGameRef.current.readyState === WebSocket.OPEN
            ) {
              wsGameRef.current.send(
                JSON.stringify({
                  type: "game",
                  game_id: `lives_${newGameId}_${userId}_${
                    userLives.length + 1
                  }`,
                })
              );
            }
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

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    gameStarted,
    selectedIndex,
    userItems,
    setIsDoubleScore,
    setIsSlowDown,
    setIsSpeedUp,
    setIsSuperCollector,
    setItemInUse,
    setUserLives,
    userLives,
    allItems,
  ]);

  //   End game after all pointers are off-screen
  useEffect(() => {
    // Function to post game data to the backend after the round ends
    const postGameData = async () => {
      if (userId == pendingGame.player_one && currGameId) {
        const payload = {
          player_one: userId,
          player_one_score: userScore,
          player_two: playerTwoId,
          player_two_score: playerTwoScore,
          game_length: finalTimer,
          mode: gameMode,
          winner: isWinner ? userId : playerTwoId,
          status: "Complete",
        };

        try {
          await axios.put(`${HOST_PATH}/games/${currGameId}/`, payload);
        } catch (error) {
          console.error("Error posting game data:", error);
        }
      }

      if (userId && currGameId) {
        const prevPoints = userPoints.current;
        const newPoints = prevPoints + userScore;

        const store = JSON.parse(sessionStorage.getItem("user-metadata-state"));

        if (store) {
          store.state.points = newPoints;
          sessionStorage.setItem("user-metadata-state", JSON.stringify(store));
        }

        // Send WebSocket message
        wsGameRef.current.send(
          JSON.stringify({
            type: "game",
            game_id: currGameId,
          })
        );
      }
    };

    if (pointersCleared && userLivesCount === 0) {
      postGameData();
      setGameStarted(false);
      navigate("/");
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
  ]);

  // Game web socket
  useEffect(() => {
    const ws = new WebSocket(GAME_URL);
    wsGameRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection to GameConsumer established");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "game" && message.game_id.includes("score")) {
        const parts = message.game_id.split("_");
        const socketGameId = parts[1];
        const initiatorId = parts[2];
        const newScore = parts[3];
        console.log(userId);

        if (userId != initiatorId) {
          setPlayerTwoScore(newScore);
        }
      } else if (message.type === "game" && message.game_id.includes("lives")) {
        const parts = message.game_id.split("_");
        const socketGameId = parts[1];
        const initiatorId = parts[2];
        const newLives = parts[3];
        if (userId != initiatorId) {

          if (newLives < playerTwoLivesCount) {
            setPlayerTwoLives((lives) => {
              let newLives = [...lives];
              newLives.pop();
              return newLives.length ? newLives : ["💀"];
            });
          } else {
            setPlayerTwoLives([...playerTwoLives, playerTwoLives[0]]);
          }

          setPlayerTwoLivesCount(newLives);
        }
      } else if (message.type === "game" && message.game_id.includes("_")) {
        const parts = message.game_id.split("_");
        const socketGameId = parts[0];
        const initiatorId = parts[1];
        const senderId = parts[2];

        if (senderId != userId) {
          const queryParams = new URLSearchParams(search);
          const newGameId = queryParams.get("game_id");
          setCurrGameId(newGameId);

          if (socketGameId == newGameId) {
            setPlayerTwoId(senderId);
            setIsOpponentPresent(true);
          }
        } else if (senderId != initiatorId) {
          setPlayerTwoId(initiatorId);
          setIsOpponentPresent(true);
        }
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

  // Versus mode item websocket
  useEffect(() => {
    const ws = new WebSocket(ITEM_URL);
    wsItemRef.current = ws;

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
            {userId && Object.keys(userItems).length > 0 ? (
              <>
                <span className="item-icon">
                  {userItems[selectedIndex]?.item.icon}
                </span>
                <span style={{ marginBottom: "7.5px" }}>
                  {userItems[selectedIndex]?.quantity} remaining
                </span>
              </>
            ) : userId ? (
              <p className="item-warning">You are out of items!</p>
            ) : (
              <p className="item-warning">Login or Practice to use items!</p>
            )}
          </div>
        </div>
        <div className="opponent-details">
          <div>Opponent</div>
          <div className="score">{playerTwoScore}</div>
          <div className="lives-remaining">{playerTwoLives}</div>
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
