import { forwardRef, useEffect, useState } from "react";

const Stack = forwardRef((_, ref) => {
  const [pointerCounter, setPointerCounter] = useState(0);

  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  useEffect(() => {
    const updateStack = () => {
      if (pointerCounter < 5) {
        const newDiv = document.createElement("div");
        newDiv.className = `pointer pointer-${pointerCounter}`;
        newDiv.style.backgroundColor = getRandomColor();
        newDiv.style.left = "270px";

        const pointerContainer =
          ref.current.querySelector(".pointer-container");

        newDiv.addEventListener("animationiteration", () => {
          pointerContainer.removeChild(newDiv);
          setPointerCounter((prevCounter) => prevCounter - 1);
        });

        pointerContainer.appendChild(newDiv);
        setPointerCounter((prevCounter) => prevCounter + 1);

        const container = ref.current.querySelector(".stack");
        const firstChild = container.firstChild;

        container.removeChild(firstChild);
        container.appendChild(firstChild);
      }
    };

    const intervalId = setInterval(updateStack, 3000);

    return () => clearInterval(intervalId);
  }, [pointerCounter, ref]);

  return (
    <div ref={ref}>
      <section className="pointer-container" />
      <section className="stack" id="stack">
        <div className="memory1" id="memory">
          1
        </div>
        <div className="memory2" id="memory">
          2
        </div>
        <div className="memory3" id="memory">
          3
        </div>
        <div className="memory4" id="memory">
          4
        </div>
        <div className="memory5" id="memory">
          5
        </div>
        <div className="memory6" id="memory">
          6
        </div>
      </section>
    </div>
  );
});

Stack.displayName = "Stack";

export default Stack;
