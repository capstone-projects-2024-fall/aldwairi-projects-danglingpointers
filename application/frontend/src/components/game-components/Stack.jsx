import { forwardRef, useEffect, useState } from "react";
import Pointer from "./Pointer";

const Stack = forwardRef((_, ref) => {
  const [totalPointerCounter, setTotalPointerCounter] = useState(0);
  const [currentPointerCounter, setCurrentPointerCounter] = useState(0);
  const [pointers, setPointers] = useState([]);

  useEffect(() => {
    const updateStack = () => {
      const pointerContainer = ref.current.querySelector(".pointer-container");
      const newPointer = (
        <Pointer
          key={totalPointerCounter}
          id={totalPointerCounter}
          onAnimationIteration={() => {
            pointerContainer.removeChild(
              pointerContainer.querySelector(`.pointer-${totalPointerCounter}`)
            );
            setCurrentPointerCounter((prevCounter) => prevCounter - 1);
          }}
        />
      );

      setPointers([...pointers, newPointer]);
      setCurrentPointerCounter((prevCounter) => prevCounter + 1);
      setTotalPointerCounter((prevCounter) => prevCounter + 1);

      const container = ref.current.querySelector(".stack");
      const firstChild = container.firstChild;

      container.removeChild(firstChild);
      container.appendChild(firstChild);
    };

    const intervalId = setInterval(updateStack, 5000);

    return () => clearInterval(intervalId);
  }, [pointers, totalPointerCounter, ref]);

  return (
    <div ref={ref}>
      <section className="pointer-container">{pointers}</section>
      <section className="stack" id="stack">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className={`memory memory${index + 1}`}>
            {(totalPointerCounter * parseFloat(`0.2${index}`) *
              parseFloat(`0.1${currentPointerCounter}`)).toFixed(5)}
          </div>
        ))}
      </section>
    </div>
  );
});

Stack.displayName = "Stack";

export default Stack;
