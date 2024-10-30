import { useEffect, useRef } from "react";
import getRandomColor from "../../scripts/get-random-color";
import checkForCollision from "../../scripts/check-for-collision"

export default function Pointer({ id, onAnimationIteration }) {
  const pointerRef = useRef(null);
  //   const collisionCount = useRef(0);

  useEffect(() => {
    const currentPointer = pointerRef.current;
    currentPointer.addEventListener("animationiteration", onAnimationIteration);

    return () => {
      currentPointer.removeEventListener(
        "animationiteration",
        onAnimationIteration
      );
    };
  }, [onAnimationIteration]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const pointer = pointerRef.current;
      const garbageCollector = document.querySelector(".garbage-collector");
      if (pointer) {
        const pointerRect = pointer.getBoundingClientRect();
        const garbageCollectorRect = garbageCollector.getBoundingClientRect();

        checkForCollision(pointerRect, garbageCollectorRect);
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div
        ref={pointerRef}
        className={`pointer pointer-${id} animation-down`}
        style={{ backgroundColor: getRandomColor, left: "265px" }}
      >
        {id}
      </div>
    </>
  );
}
