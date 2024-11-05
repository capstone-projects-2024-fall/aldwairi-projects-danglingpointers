import { forwardRef, useContext, useEffect, useState } from "react";
import Pointer from "./Pointer";
import GameContext from "../../context/GameContext";

const Stack = forwardRef((_, ref) => {
  const [totalPointerCounter, setTotalPointerCounter] = useState(0);
  const [currentPointerCounter, setCurrentPointerCounter] = useState(0);
  const [pointers, setPointers] = useState([]);
  const { setUserScore, setUserLives, userLivesCount, setUserLivesCount, gameStarted, setPointersCleared } =
    useContext(GameContext);

  useEffect(() => {
    if (!gameStarted || userLivesCount === 0) return;

    setPointersCleared(false); // Reset to false when the game starts

    const updateStack = () => {
      if (userLivesCount === 0) return;

      const pointerContainer = ref.current.querySelector(".pointer-container");

      const newPointer = (
        <Pointer
          key={totalPointerCounter}
          id={totalPointerCounter}
          onAnimationIteration={() => {
            const thisPointer = pointerContainer.querySelector(
              `.pointer-${totalPointerCounter}`
            );

            if (thisPointer.classList.contains("animation-four")) {
              setUserScore((score) => score + 1);
            } else {
              setUserLives((lives) => {
                let newLives = [...lives];
                newLives.pop();
                setUserLivesCount(newLives.length);
                return newLives.length ? newLives : ["💀"];
              });
            }

            pointerContainer.removeChild(thisPointer);
            setCurrentPointerCounter((prevCounter) => {
              const newCounter = prevCounter - 1;
              if (newCounter === 0) {
                setPointersCleared(true); // Set pointersCleared to true when all pointers are removed
              }
              return newCounter;
            });
          }}
        />
      );

      setPointers((prevPointers) => [...prevPointers, newPointer]);
      setCurrentPointerCounter((prevCounter) => prevCounter + 1);
      setTotalPointerCounter((prevCounter) => prevCounter + 1);
    };

    const intervalId = setInterval(updateStack, 2250);

    return () => clearInterval(intervalId);
  }, [
    ref,
    setUserLives,
    setUserLivesCount,
    setUserScore,
    userLivesCount,
    gameStarted,
    setPointersCleared,
    totalPointerCounter,
  ]);

  return (
    <div ref={ref}>
      <section className="pointer-container">{pointers}</section>
      <section className="stack" id="stack">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className={`memory memory${index + 1}`}>
            {(
              totalPointerCounter *
              parseFloat(`0.2${index}`) *
              parseFloat(`0.1${currentPointerCounter}`)
            ).toFixed(5)}
          </div>
        ))}
      </section>
    </div>
  );
});

Stack.displayName = "Stack";

export default Stack;
