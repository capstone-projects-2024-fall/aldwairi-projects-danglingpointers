import { forwardRef, useEffect, useState } from "react";
import Pointer from "./Pointer";

const Stack = forwardRef((props, ref) => {
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
            const thisPointer = pointerContainer.querySelector(
              `.pointer-${totalPointerCounter}`
            );

            if (thisPointer.classList.contains("animation-four"))
              props.setUserScore((currentScore) => currentScore + 1);

            pointerContainer.removeChild(thisPointer);

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
    //! updateStack(); //! uncomment at your own risk
    const intervalId = setInterval(updateStack, 2250);

    return () => clearInterval(intervalId);
  }, [pointers, totalPointerCounter, ref, props]);

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
