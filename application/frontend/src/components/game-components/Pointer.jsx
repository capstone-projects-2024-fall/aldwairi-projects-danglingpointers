import { useEffect, useRef, useState, useContext } from "react";
import GameContext from "../../context/GameContext";
import checkForCollision from "../../scripts/check-for-collision";
import { GAME_URL, ITEMS } from "../../scripts/constants";
import useUserAuthStore from "../../stores/userAuthStore";

export default function Pointer({ color, id, onAnimationIteration }) {
  const {
    gameStarted,
    isPractice,
    isDoubleScore,
    setUserScore,
    userLives,
    gameMode,
    pendingGame,
  } = useContext(GameContext);
  const pointerRef = useRef(null);
  const [pointerLeft, setPointerLeft] = useState(0);
  const wsGameRef = useRef(null);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const { userId } = useUserAuthStore();
  const requestRef = useRef(null);

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

  // Pointer Creation
  useEffect(() => {
    if (!gameStarted && !isPractice) {
      setShouldAnimate(false);
      return;
    }

    const game = document.querySelector(".game");
    const memory = document.querySelector(".memory");
    const currentPointer = pointerRef.current;

    setPointerLeft(
      game.getBoundingClientRect().left + memory.getBoundingClientRect().width
    );

    const handleAnimationIteration = () => {
      onAnimationIteration();
    };
    if (shouldAnimate) {
      currentPointer.addEventListener(
        "animationiteration",
        handleAnimationIteration
      );
    }

    return () => {
      currentPointer.removeEventListener(
        "animationiteration",
        handleAnimationIteration
      );
    };
  }, [onAnimationIteration, gameStarted, isPractice, shouldAnimate]);

  // Optimized Collision Detection
  useEffect(() => {
    const detectCollision = () => {
      const pointer = pointerRef.current;
      const garbageCollector = document.querySelector(".garbage-collector");
      if (pointer && garbageCollector) {
        const pointerRect = pointer.getBoundingClientRect();
        const garbageCollectorRect = garbageCollector.getBoundingClientRect();

        if (
          checkForCollision(pointerRect, garbageCollectorRect) &&
          !userLives.includes("💀")
        ) {
          setUserScore((prevScore) => {
            const newScore = isDoubleScore
              ? prevScore + ITEMS.doubleScore
              : prevScore + ITEMS.defaultScore;
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

            return newScore;
          });
          if (pointer.classList.contains("animation-three")) {
            pointer.classList.replace("animation-three", "animation-four");
          } else if (pointer.classList.contains("animation-two")) {
            pointer.classList.replace("animation-two", "animation-three");
          } else if (pointer.classList.contains("animation-one")) {
            pointer.classList.replace("animation-one", "animation-two");
          }
        }
      }
      requestRef.current = requestAnimationFrame(detectCollision);
    };

    if (gameStarted || isPractice) {
      requestRef.current = requestAnimationFrame(detectCollision);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameStarted, isPractice, isDoubleScore, setUserScore, userLives]);

  return (
    <div
      ref={pointerRef}
      className={`pointer pointer-${id} ${
        shouldAnimate ? "animation-one" : ""
      }`}
      style={{
        backgroundColor: color,
        left: `${pointerLeft}px`,
      }}
    ></div>
  );
}
