import { forwardRef, useContext, useEffect } from "react";
import Pointer from "./Pointer";
import getRandomColor from "../../scripts/get-random-color";
import GameContext from "../../context/GameContext";
import getStackInterval from "../../scripts/get-stack-interval";

const Stack = forwardRef((_, ref) => {
  const {
    setCurrentPointerCounter,
    pointers,
    setPointers,
    setIsSlowDown,
    isSlowDown,
    totalPointerCounter,
    setTotalPointerCounter,
  } = useContext(GameContext);
  const {
    setUserScore,
    setUserLives,
    userLivesCount,
    setUserLivesCount,
    gameStarted,
    practiceStarted,
    setPointersCleared,
  } = useContext(GameContext);

  useEffect(() => {
    let isGameStarted = true;
    if (!gameStarted || userLivesCount === 0) isGameStarted = false;
    if (!isGameStarted && !practiceStarted) return;

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

                if (newLives.length) {
                  return newLives;
                } else {
                  return ["💀"];
                }
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
    const base = isSlowDown ? 4500 : 3000;
    const mod = isSlowDown ? 500 : 750;
    const random = getStackInterval(base, mod);
    const intervalId = setInterval(updateStack, random);

    return () => clearInterval(intervalId);
  }, [
    ref,
    isSlowDown,
    setUserLives,
    setUserLivesCount,
    setUserScore,
    userLivesCount,
    gameStarted,
    setPointers,
    setPointersCleared,
    setCurrentPointerCounter,
    totalPointerCounter,
    setTotalPointerCounter,
    practiceStarted,
  ]);

  useEffect(() => {
    if (isSlowDown) {
      const timeoutId = setTimeout(() => {
        setIsSlowDown(false);
      }, 10000);

      return () => clearTimeout(timeoutId);
    }
  }, [isSlowDown, setIsSlowDown]);

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
