import { createContext, useState } from "react";

const GameContext = createContext({});

export const GameProvider = ({ children }) => {
  const [timer, setTimer] = useState(0);
  const [gameMode, setGameMode] = useState("");
  const [userScore, setUserScore] = useState(0);
  const [userLives, setUserLives] = useState(["❤️", "❤️", "❤️"]);
  const [userLivesCount, setUserLivesCount] = useState(3);
  const [hasGameStarted, setHasGameStarted] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [pointersOffScreen, setPointersOffScreen] = useState(false);

  const startGame = () => {
    setTimer(0);
    setUserScore(0);
    setUserLives(["❤️", "❤️", "❤️"]);
    setUserLivesCount(3);
    setIsGameOver(false);
    setHasGameStarted(true);
    setPointersOffScreen(false);
  };

  const endGame = () => {
    setIsGameOver(true);
    setHasGameStarted(false);
  };

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
        hasGameStarted,
        setHasGameStarted,
        isGameOver,
        startGame,
        endGame,
        pointersOffScreen,
        setPointersOffScreen,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
