import GarbageCollector from "../game-components/GarbageCollector";
import RecyclingBin from "../game-components/RecyclingBin";
import Stack from "../game-components/Stack";
import convertSecondsToMinutes from "../../scripts/convert-seconds-to-minutes";
import { useEffect, useRef, useContext, useState, useCallback } from "react";
import GameContext from "../../context/GameContext";
import axios from "axios";
import { GAME_URL, HOST_PATH } from "../../scripts/constants";
import useUserAuthStore from "../../stores/userAuthStore";
import AuthContext from "../../auth/AuthContext";

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
    practiceStarted,
    setPracticeStarted,
    totalPointerCount,
    pointersCleared, // Listen for pointersCleared state
    setPointersCleared,
    setIsSlowDown,
    setIsSpeedUp,
    setIsSuperCollector,
    setIsDoubleScore,
  } = useContext(GameContext);

  // TODO: Database
  const { setUserMoney } = useContext(AuthContext);

  const { userId } = useUserAuthStore();

  const [finalTimer, setFinalTimer] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [userItems, setUserItems] = useState([]);

  const intervalRef = useRef(null);
  const stackRef = useRef(null);
  const garbageCollectorRef = useRef(null);
  const recyclingBinRef = useRef(null);
  const btnPlayRef = useRef(null);
  const btnPracticeRef = useRef(null);
  const wsRef = useRef(null);

  // Set web sockets
  useEffect(() => {
    const ws = new WebSocket(GAME_URL);
    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, []);

  const resetGameContext = useCallback(
    (mode) => {
      setTimer(0);
      setUserScore(0);
      setUserLives(["❤️", "❤️", "❤️"]);
      setUserLivesCount(3);
      setGameMode(mode);
      mode === "Practice" ? setPracticeStarted(true) : setGameStarted(true);
      setPointersCleared(false); // Reset pointers cleared state when starting a new round
      // TODO: JSON
      // TODO: Post to Game
    },
    [
      setGameMode,
      setGameStarted,
      setPointersCleared,
      setPracticeStarted,
      setTimer,
      setUserLives,
      setUserLivesCount,
      setUserScore,
    ]
  );

  // Function to initialize a new round
  function initializeRound() {
    if (gameStarted || practiceStarted) return;
    // TODO: Post game to database in versus mode

    btnPlayRef.current.blur();
    resetGameContext("Solo");
  }

  function initializePractice() {
    if (gameStarted || practiceStarted) return;
    btnPracticeRef.current.blur();
    resetGameContext("Practice");
  }

  const terminatePractice = () => {
    setPracticeStarted(false);
    const pointerContainer = stackRef.current.querySelector('.pointer-container');
    pointerContainer.innerHTML = '';
  };

  // TODO: Sockets
  // const terminateRound = () => {
  //   const gameMessage = {
  //     type: "game",
  //     game_id: 1,
  //   };

  //   console.log(gameMessage);

  //   wsRef.current.send(JSON.stringify(gameMessage));
  // };

  // Game Timer
  useEffect(() => {
    if ((gameStarted || practiceStarted) && userLivesCount > 0) {
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
  }, [
    gameStarted,
    practiceStarted,
    finalTimer,
    timer,
    setTimer,
    userLivesCount,
  ]);

  // End game after all pointers are off-screen
  useEffect(() => {
    // Function to post game data to the backend after the round ends
    const postGameData = async () => {
      if (userId) {
        try {
          const response = await axios.post(`${HOST_PATH}/create-game/`, {
            player_one: userId,
            player_one_score: userScore,
            game_length: finalTimer,
            mode: gameMode,
            status: "Complete",
          });
          setUserMoney((prevMoney) => prevMoney + userScore);

          console.log("Game data posted successfully:", response.data);
        } catch (error) {
          console.error("Error posting game data:", error);
        }
      }
    };

    if (pointersCleared && userLivesCount === 0) {
      if (gameStarted) {
        postGameData();
        setGameStarted(false); // End game once all pointers are cleared and lives are zero
      }
      if (practiceStarted) {
        resetGameContext("Practice");
      }
    }
  }, [
    pointersCleared,
    totalPointerCount,
    setGameStarted,
    userLivesCount,
    gameMode,
    gameStarted,
    practiceStarted,
    resetGameContext,
    finalTimer,
    userId,
    userScore,
    setUserMoney,
  ]);

  // Fetch User by Id
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userId) {
          const metadataResponse = await axios.get(
            `${HOST_PATH}/user-metadata?user_id=${userId}`
          );
          const itemIds = metadataResponse.data[0].items;

          const fetchedItems = [];

          const itemPromises = itemIds.map(async (itemId) => {
            const itemResponse = await axios.get(
              `${HOST_PATH}/items?user_id=${itemId}`
            );
            return itemResponse.data[itemId];
          });

          const resolvedItems = await Promise.all(itemPromises);
          fetchedItems.push(...resolvedItems);

          setUserItems(fetchedItems);
        } else {
          const itemResponse = await axios.get(`${HOST_PATH}/items/`);
          setUserItems(itemResponse.data);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchUser();
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
        switch (selectedIndex) {
          case 0:
            setIsSlowDown(true);
            if (gameStarted) {
              console.log("-1");
            }
            break;
          case 1:
            setIsSpeedUp(true);
            if (gameStarted) {
              console.log("-1");
            }
            break;
          case 2:
            setUserLives([...userLives, "❤️"]);
            if (gameStarted) {
              console.log("-1");
            }
            break;
          case 3:
            setIsSuperCollector(true);
            if (gameStarted) {
              console.log("-1");
            }
            break;
          case 4:
            setIsDoubleScore(true);
            if (gameStarted) {
              console.log("-1");
            }
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
    setUserLives,
    userLives,
    selectedIndex,
    userItems,
    setIsSlowDown,
    setIsSpeedUp,
    setIsDoubleScore,
    setIsSuperCollector,
  ]);

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
            ref={btnPlayRef}
            onClick={initializeRound}
            className="start-round-button"
            style={{
              background: gameStarted || practiceStarted ? "red" : "green",
              color: "white",
              cursor:
                gameStarted || practiceStarted || !userId
                  ? "not-allowed"
                  : "pointer",
            }}
            aria-label={
              userId ? null : "Login to start round, see game stats, and more!"
            }
          >
            {gameStarted ? "Round In Progress" : "Start New Round"}
          </button>

          <button
            ref={btnPracticeRef}
            onClick={practiceStarted ? terminatePractice : initializePractice}
            className="start-round-button"
            style={{
              background: gameStarted ? "red" : "blue",
              color: "white",
              cursor: gameStarted ? "not-allowed" : "pointer",
            }}
          >
            {practiceStarted ? "End Practice" : "Practice"}
          </button>
        </div>
      </article>

      <article className="game">
        <Stack practiceStarted={practiceStarted} ref={stackRef} />
        <GarbageCollector ref={garbageCollectorRef} />
        <RecyclingBin ref={recyclingBinRef} />
      </article>
    </main>
  );
}
