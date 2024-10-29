import { forwardRef, useEffect, useState } from "react";

const GarbageCollector = forwardRef((_, ref) => {
  const [styleLeft, setStyleLeft] = useState("1px");

  useEffect(() => {
    const handleKeyDown = (event) => {
      console.log(event);
      if (event.key === "ArrowLeft") {
        setStyleLeft((prevLeft) => {
          if (parseInt(prevLeft) >= -340) return parseInt(prevLeft) - 10 + "px";
          else return prevLeft;
        });
      } else if (event.key === "ArrowRight") {
        setStyleLeft((prevLeft) => {
          if (parseInt(prevLeft) <= 350) return parseInt(prevLeft) + 10 + "px";
          else return prevLeft;
        });
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
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
