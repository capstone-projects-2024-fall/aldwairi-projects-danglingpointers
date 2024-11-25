// GameContext.js
import { createContext, useState } from "react";

const GameContext = createContext({});

export const GameProvider = ({ children }) => {
  const [timer, setTimer] = useState(0);
  const [gameMode, setGameMode] = useState("");
  const [userScore, setUserScore] = useState(0);
  const [currentPointerCounter, setCurrentPointerCounter] = useState(0);
  const [totalPointerCounter, setTotalPointerCounter] = useState(0);
  const [userLives, setUserLives] = useState(["❤️", "❤️", "❤️"]);
  const [userLivesCount, setUserLivesCount] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [practiceStarted, setPracticeStarted] = useState(false);
  const [pointers, setPointers] = useState([]);
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
        practiceStarted,
        setPracticeStarted,
        pointers,
        setPointers,
        currentPointerCounter,
        setCurrentPointerCounter,
        totalPointerCounter,
        setTotalPointerCounter,
        pointersCleared,
        setPointersCleared, // Expose pointersCleared and setPointersCleared
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
