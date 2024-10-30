import { forwardRef, useEffect, useRef, useState } from "react";
import {
  checkLeftBoundary,
  checkRightBoundary,
} from "../../scripts/check-boundaries";

const GarbageCollector = forwardRef((_, ref) => {
  const [styleLeft, setStyleLeft] = useState("1px");
  const intervalRef = useRef(null);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
          setStyleLeft((prevLeft) => {
            if (
              checkLeftBoundary(
                document
                  .querySelector(".garbage-collector")
                  .getBoundingClientRect(),
                document.querySelector(".stack").getBoundingClientRect()
              )
            )
              return parseInt(prevLeft) - 10 + "px";
            else {
              clearInterval(intervalRef.current);
              return prevLeft;
            }
          });
        }, 10);
      } else if (event.key === "ArrowRight") {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
          setStyleLeft((prevLeft) => {
            if (
              checkRightBoundary(
                document
                  .querySelector(".garbage-collector")
                  .getBoundingClientRect(),
                document.querySelector(".recycling-bin").getBoundingClientRect()
              )
            )
              return parseInt(prevLeft) + 10 + "px";
            else {
              clearInterval(intervalRef.current);
              return prevLeft;
            }
          });
        }, 10);
      }
    };

    const handleKeyUp = () => {
      clearInterval(intervalRef.current);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <>
      <section
        className="garbage-collector"
        ref={ref}
        style={{ left: styleLeft }}
      ></section>
    </>
  );
});

GarbageCollector.displayName = "GarbageCollector";
export default GarbageCollector;
