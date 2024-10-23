import GarbageCollector from "./game-components/GarbageCollector";
import RecyclingBin from "./game-components/RecyclingBin";
import Stack from "./game-components/Stack";
import convertSecondsToMinutes from "../scripts/convert-seconds-to-minutes";
import { useEffect, useRef, useState } from "react";

export default function Game() {
  const [timer, setTimer] = useState(0);
  // const [playingGame, setPlayingGame] = useState(true);
  const intervalRef = useRef(null);
  const collisionRef = useRef(null);
  const stackRef = useRef(null);
  const garbageCollectorRef = useRef(null);
  const recyclingBinRef = useRef(null);

  useEffect(() => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setTimer((prevSeconds) => prevSeconds + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (!collisionRef.current) {
      collisionRef.current = setInterval(() => {
        checkCollision();
      }, 100);
    } else if (intervalRef.current) {
      clearInterval(collisionRef.current);
      collisionRef.current = null;
    }
  }, []);

  const checkCollision = () => {
    const stackBounds = stackRef.current.getBoundingClientRect();
    const garbageCollectorBounds = garbageCollectorRef.current.getBoundingClientRect();
    const recyclingBinBounds = recyclingBinRef.current.getBoundingClientRect();

    if (
      garbageCollectorBounds.right >= stackBounds.left &&
      garbageCollectorBounds.left <= stackBounds.right &&
      garbageCollectorBounds.bottom >= stackBounds.top &&
      garbageCollectorBounds.top <= stackBounds.bottom
    ) {
      console.log("GarbageCollector intersects Stack");
    }

    if (
      garbageCollectorBounds.right >= recyclingBinBounds.left &&
      garbageCollectorBounds.left <= recyclingBinBounds.right &&
      garbageCollectorBounds.bottom >= recyclingBinBounds.top &&
      garbageCollectorBounds.top <= recyclingBinBounds.bottom
    ) {
      console.log("GarbageCollector intersects RecyclingBin");
    }
  }

  return (
    <main className="main-game">
      <div className="timer">{convertSecondsToMinutes(timer)}</div>
      <article className="game">
        <Stack ref={stackRef} />
        <GarbageCollector ref={garbageCollectorRef} />
        <RecyclingBin ref={recyclingBinRef} />
      </article>
    </main>
  );
}
