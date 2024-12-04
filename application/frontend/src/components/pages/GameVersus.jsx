import { useContext, useRef, useState } from "react";
import GameContext from "../../context/GameContext";
import useUserAuthStore from "../../stores/userAuthStore";
import { ITEM_URL } from "../../scripts/constants";

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

      // Versus mode receiving items through websocket
      useEffect(() => {
        const ws = new WebSocket(ITEM_URL);
        wsRef.current = ws;
    
        return () => {
          ws.close();
        };
      }, []);


      return <h1>Versus</h1>
};
