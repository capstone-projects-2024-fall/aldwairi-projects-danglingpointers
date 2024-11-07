import { useEffect, useRef, useState, useContext } from "react";
import GameContext from "../../context/GameContext";
import checkForCollision from "../../scripts/check-for-collision";

export default function Pointer({ color, id, onAnimationIteration }) {
  const { gameStarted, setUserScore, userLives } = useContext(GameContext);
  const pointerRef = useRef(null);
  const [pointerLeft, setPointerLeft] = useState(0);
  // const [collisionCount, setCollisionCount] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const requestRef = useRef(null);

  // Pointer Creation
  useEffect(() => {
    if (!gameStarted) {
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
  }, [onAnimationIteration, gameStarted, shouldAnimate]);

  // Optimized Collision Detection
  useEffect(() => {
    const detectCollision = () => {
      const pointer = pointerRef.current;
      const garbageCollector = document.querySelector(".garbage-collector");
      if (pointer && garbageCollector && gameStarted) {
        const pointerRect = pointer.getBoundingClientRect();
        const garbageCollectorRect = garbageCollector.getBoundingClientRect();

        if (
          checkForCollision(pointerRect, garbageCollectorRect) &&
          !userLives.includes("💀")
        ) {
          // setCollisionCount((prevCount) => prevCount + 1);
          setUserScore((prevScore) => prevScore + 1);
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

    if (gameStarted) {
      requestRef.current = requestAnimationFrame(detectCollision);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameStarted, setUserScore, userLives]);

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
