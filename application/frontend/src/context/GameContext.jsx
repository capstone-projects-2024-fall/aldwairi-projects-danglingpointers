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
  const [pointersCleared, setPointersCleared] = useState(false); // Track pointers cleared
  const [itemInUse, setItemInUse] = useState(false);
  const [isSlowDown, setIsSlowDown] = useState(false);
  const [isSpeedUp, setIsSpeedUp] = useState(false);
  const [isSuperCollector, setIsSuperCollector] = useState(false);
  const [isDoubleScore, setIsDoubleScore] = useState(false);
  const [isPractice, setIsPractice] = useState(false);

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
        currentPointerCounter,
        setCurrentPointerCounter,
        totalPointerCounter,
        setTotalPointerCounter,
        pointersCleared,
        setPointersCleared,
        itemInUse,
        setItemInUse,
        isSlowDown,
        setIsSlowDown,
        isSpeedUp,
        setIsSpeedUp,
        isSuperCollector,
        setIsSuperCollector,
        isDoubleScore,
        setIsDoubleScore,
        isPractice,
        setIsPractice,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
