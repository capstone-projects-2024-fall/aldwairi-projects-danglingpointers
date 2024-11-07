import { forwardRef, useContext, useEffect, useState } from "react";
import Pointer from "./Pointer";
import getRandomColor from "../../scripts/get-random-color";
import GameContext from "../../context/GameContext";
import getStackInterval from "../../scripts/get-stack-interval";

const Stack = forwardRef((_, ref) => {
  const {
    setCurrentPointerCounter,
    totalPointerCounter,
    setTotalPointerCounter,
  } = useContext(GameContext);
  const [pointers, setPointers] = useState([]);
  const {
    setUserScore,
    setUserLives,
    userLivesCount,
    setUserLivesCount,
    gameStarted,
    setPointersCleared,
  } = useContext(GameContext);

  useEffect(() => {
    if (!gameStarted || userLivesCount === 0) return;

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
              setUserScore((prevScore) => prevScore + 2);
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
    const random = getStackInterval(3000, 750);
    const intervalId = setInterval(updateStack, random);

    return () => clearInterval(intervalId);
  }, [
    ref,
    setUserLives,
    setUserLivesCount,
    setUserScore,
    userLivesCount,
    gameStarted,
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
