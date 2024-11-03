import GarbageCollector from "./game-components/GarbageCollector";
import RecyclingBin from "./game-components/RecyclingBin";
import Stack from "./game-components/Stack";
import convertSecondsToMinutes from "../scripts/convert-seconds-to-minutes";
import { useEffect, useRef, useContext } from "react";
import GameContext from "../context/GameContext";

export default function Game() {
  const {
    timer,
    setTimer,
    gameMode,
    setGameMode,
    userScore,
    userLives,
    userLivesCount,
    hasGameStarted,
    isGameOver,
    startGame,
    endGame,
  } = useContext(GameContext);

  const intervalRef = useRef(null);
  const stackRef = useRef(null);
  const garbageCollectorRef = useRef(null);
  const recyclingBinRef = useRef(null);

  // Initialize round (reset game state)
  const initializeRound = () => {
    startGame();
    setGameMode("solo");
  };

  // Game Timer - Only runs if the game has started and is not over
  useEffect(() => {
    if (hasGameStarted && userLivesCount > 0) {
      const intervalId = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);

      intervalRef.current = intervalId;

      return () => {
        clearInterval(intervalRef.current);
      };
    }
  }, [hasGameStarted, setTimer, userLivesCount]);

  // End game when lives reach zero
  useEffect(() => {
    if (userLivesCount <= 0) {
      endGame();
    }
  }, [userLivesCount, endGame]);

  return (
    <main className="main-game">
      {isGameOver ? (
        <div className="game-over-message">
          Game Over!
          <button onClick={initializeRound} className="start-button">
            Start Game
          </button>
        </div>
      ) : hasGameStarted ? (
        <>
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
          <article className="game">
            <Stack ref={stackRef} />
            <GarbageCollector ref={garbageCollectorRef} />
            <RecyclingBin ref={recyclingBinRef} />
          </article>
        </>
      ) : (
        <button onClick={initializeRound} className="start-button">
          Start Game
        </button>
      )}
    </main>
  );
}
