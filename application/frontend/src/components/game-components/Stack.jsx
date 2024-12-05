import {
  forwardRef,
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import Pointer from "./Pointer";
import getRandomColor from "../../scripts/get-random-color";
import GameContext from "../../context/GameContext";
import getStackInterval from "../../scripts/get-stack-interval";
import { GAME_URL, ITEMS } from "../../scripts/constants";
import useUserAuthStore from "../../stores/userAuthStore";

const Stack = forwardRef((_, ref) => {
  const {
    setCurrentPointerCounter,
    totalPointerCounter,
    setTotalPointerCounter,
    isSlowDown,
    gameMode,
    pendingGame,
  } = useContext(GameContext);
  const [pointers, setPointers] = useState([]);
  const {
    setUserScore,
    setUserLives,
    userLivesCount,
    setUserLivesCount,
    gameStarted,
    isPractice,
    setPointersCleared,
  } = useContext(GameContext);
  const {userId} = useUserAuthStore();
  const wsGameRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(GAME_URL);
    wsGameRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connection to GameConsumer established");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log(message);
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

  useEffect(() => {
    if ((!gameStarted && !isPractice) || userLivesCount === 0) return;

    // Reset pointers cleared state when the game starts
    setPointersCleared(false);

    const pointerContainer = ref.current.querySelector(".pointer-container");

    const updateStack = () => {
      if (userLivesCount === 0) return;

      const newPointer = (
        <Pointer
          key={totalPointerCounter}
          id={totalPointerCounter}
          color={getRandomColor()}
          onAnimationIteration={() => {
            const thisPointer = pointerContainer.querySelector(
              `.pointer-${totalPointerCounter}`
            );

            if (thisPointer.classList.contains("animation-four")) {
              setUserScore((prevScore) => {
                const newScore = prevScore + ITEMS.doubleScore;
                if (
                  gameMode === "Versus" &&
                  wsGameRef.current &&
                  wsGameRef.current.readyState === WebSocket.OPEN
                ) {
                  wsGameRef.current.send(
                    JSON.stringify({
                      type: "game",
                      game_id: `score_${pendingGame.id}_${userId}_${newScore}`,
                    })
                  );
                }
                return newScore
              });
            } else {
              setUserLives((lives) => {
                let newLives = [...lives];
                newLives.pop();

                if (
                  gameMode === "Versus" &&
                  wsGameRef.current &&
                  wsGameRef.current.readyState === WebSocket.OPEN
                ) {
                  wsGameRef.current.send(
                    JSON.stringify({
                      type: "game",
                      game_id: `lives_${pendingGame.id}_${userId}_${newLives.length}`,
                    })
                  );
                }

                setUserLivesCount(newLives.length);
                return newLives.length ? newLives : ["💀"];
              });
            }

            pointerContainer.removeChild(thisPointer);
            setCurrentPointerCounter((prevCounter) => {
              const newCounter = prevCounter - 1;
              // Check if all pointers are removed
              if (newCounter === 0) {
                setTimeout(() => setPointersCleared(true), 0); //queue this as to not console log error
              }
              return newCounter;
            });
          }}
        />
      );

      // Add new pointer to the stack
      setPointers((prevPointers) => [...prevPointers, newPointer]);
      setCurrentPointerCounter((prevCounter) => prevCounter + 1);
      setTotalPointerCounter((prevCounter) => prevCounter + 1);

      // Move the stack immediately after adding a new pointer
      const container = ref.current.querySelector(".stack");
      const firstChild = container.firstChild;

      // Change the color of the first child (or any other logic for changing colors)
      if (firstChild) {
        container.removeChild(firstChild);
        container.appendChild(firstChild);
      }
    };

    const base = isSlowDown
      ? ITEMS.slowDownStackBase
      : ITEMS.defaultSpeedStackBase;

    const mod = isSlowDown
      ? ITEMS.slowDownStackMod
      : ITEMS.defaultSpeedStackMod;

    const random = getStackInterval(base, mod);
    const intervalId = setInterval(updateStack, random);

    return () => clearInterval(intervalId);
  }, [
    ref,
    setUserLives,
    setUserLivesCount,
    setUserScore,
    userLivesCount,
    gameStarted,
    isPractice,
    isSlowDown,
    setPointersCleared,
    setCurrentPointerCounter,
    totalPointerCounter,
    setTotalPointerCounter,
  ]);

  return (
    <div ref={ref}>
      <section className="pointer-container">{pointers}</section>
      <section className="stack" id="stack">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className={`memory memory${index + 1}`}></div>
        ))}
      </section>
    </div>
  );
});

Stack.displayName = "Stack";

export default Stack;
