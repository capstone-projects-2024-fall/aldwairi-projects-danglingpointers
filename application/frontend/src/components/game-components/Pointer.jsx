import { useEffect, useRef, useState } from "react";
import getRandomColor from "../../scripts/get-random-color";
import checkForCollision from "../../scripts/check-for-collision";

export default function Pointer({ id, onAnimationIteration }) {
  const pointerRef = useRef(null);
  const [pointerLeft, setPointerLeft] = useState(0);
  const [collisionCount, setCollisionCount] = useState(0);

  // Pointer Creation
  useEffect(() => {
    const game = document.querySelector(".game");
    const memory = document.querySelector(".memory");
    const currentPointer = pointerRef.current;

    setPointerLeft(
      game.getBoundingClientRect().left + memory.getBoundingClientRect().width
    );

    currentPointer.addEventListener("animationiteration", onAnimationIteration);

    return () => {
      currentPointer.removeEventListener(
        "animationiteration",
        onAnimationIteration
      );
    };
  }, [onAnimationIteration]);

  // Collision Detection
  useEffect(() => {
    const intervalId = setInterval(() => {
      const pointer = pointerRef.current;
      const garbageCollector = document.querySelector(".garbage-collector");
      if (pointer) {
        const pointerRect = pointer.getBoundingClientRect();
        const garbageCollectorRect = garbageCollector.getBoundingClientRect();

        if (checkForCollision(pointerRect, garbageCollectorRect)) {
          setCollisionCount((prevCount) => prevCount + 1);

          if (pointer.classList.contains("animation-three")) {
            pointer.classList.remove("animation-three");
            pointer.classList.add("animation-four");
          }

          if (pointer.classList.contains("animation-two")) {
            pointer.classList.remove("animation-two");
            pointer.classList.add("animation-three");
          }

          if (pointer.classList.contains("animation-one")) {
            pointer.classList.remove("animation-one");
            pointer.classList.add("animation-two");
          }
        }
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div
        ref={pointerRef}
        className={`pointer pointer-${id} animation-one`}
        style={{
          backgroundColor: getRandomColor(),
          left: `${pointerLeft}px`,
        }}
      >
        {collisionCount}
      </div>
    </>
  );
}
