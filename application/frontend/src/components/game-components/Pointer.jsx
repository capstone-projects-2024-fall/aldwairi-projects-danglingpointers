import { useEffect, useRef } from "react";
import getRandomColor from "../../scripts/get-random-color";

export default function Pointer({ id, onAnimationIteration }) {
  const pointerRef = useRef(null);
//   const collisionCount = useRef(0);

  useEffect(() => {
    const currentPointer = pointerRef.current;
    currentPointer.addEventListener("animationiteration", onAnimationIteration);

    return () => {
        currentPointer.removeEventListener("animationiteration", onAnimationIteration);
    }
  }, [onAnimationIteration]);

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
