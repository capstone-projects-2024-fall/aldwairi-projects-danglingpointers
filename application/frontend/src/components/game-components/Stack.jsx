import { forwardRef, useEffect, useState } from "react";
import Pointer from "./Pointer";

const Stack = forwardRef((_, ref) => {
  const [pointerCounter, setPointerCounter] = useState(0);
  const [pointers, setPointers] = useState([]);

  useEffect(() => {
    const updateStack = () => {
      const pointerContainer = ref.current.querySelector(".pointer-container");
      const newPointer = (
        <Pointer
          key={pointerCounter}
          id={pointerCounter}
          onAnimationIteration={() => {
            pointerContainer.removeChild(
              pointerContainer.querySelector(`.pointer-${pointerCounter}`)
            );
            // setPointerCounter((prevCounter) => prevCounter - 1);
          }}
        />
      );

      setPointers([...pointers, newPointer]);
      setPointerCounter((prevCounter) => prevCounter + 1);

      const container = ref.current.querySelector(".stack");
      const firstChild = container.firstChild;

      container.removeChild(firstChild);
      container.appendChild(firstChild);
    };

    const intervalId = setInterval(updateStack, 5000);

    return () => clearInterval(intervalId);
  }, [pointers, pointerCounter, ref]);

  return (
    <div ref={ref}>
      <section className="pointer-container">{pointers}</section>
      <section className="stack" id="stack">
        <div className="memory memory1">1</div>
        <div className="memory memory2">2</div>
        <div className="memory memory3">3</div>
        <div className="memory memory4">4</div>
        <div className="memory memory5">5</div>
        <div className="memory memory6">6</div>
        <div className="memory memory7">7</div>
        <div className="memory memory8">8</div>
      </section>
    </div>
  );
});

Stack.displayName = "Stack";

export default Stack;
