import { createContext, useState } from "react";

const GameContext = createContext({});

export const GameProvider = ({ children }) => {
  const [timer, setTimer] = useState(0);
  const [gameMode, setGameMode] = useState("");
  const [userScore, setUserScore] = useState(0);
  const [userLives, setUserLives] = useState(["❤️", "❤️", "❤️"]);
  const [userLivesCount, setUserLivesCount] = useState(3);

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
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
