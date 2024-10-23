import { useEffect, useState } from "react";
export default function GarbageCollector() {
  const [styleLeft, setStyleLeft] = useState("1px");
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        setStyleLeft((prevLeft) => parseInt(prevLeft) - 10 + "px");
      } else if (event.key === "ArrowRight") {
        setStyleLeft((prevLeft) => parseInt(prevLeft) + 10 + "px");
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
        style={{ left: styleLeft }}
      ></section>
    </>
  );
}
