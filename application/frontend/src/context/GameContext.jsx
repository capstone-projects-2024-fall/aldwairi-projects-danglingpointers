// GameContext.js
import { createContext, useState } from "react";

const GameContext = createContext({});

export const GameProvider = ({ children }) => {
  const [timer, setTimer] = useState(0);
  const [gameMode, setGameMode] = useState("");
  const [userScore, setUserScore] = useState(0);
  const [userLives, setUserLives] = useState(["❤️", "❤️", "❤️"]);
  const [userLivesCount, setUserLivesCount] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [pointersCleared, setPointersCleared] = useState(false); // Track pointers cleared

  return (
    <GameContext.Provider
      value={{
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
        pointersCleared,
        setPointersCleared, // Expose pointersCleared and setPointersCleared
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
