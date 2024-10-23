import GarbageCollector from "./game-components/GarbageCollector";
import RecyclingBin from "./game-components/RecyclingBin";
import Stack from "./game-components/Stack";
import { useEffect, useState } from "react";

export default function Game() {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prevSeconds) => prevSeconds + 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  function convertSecondsToMinutes(timer) {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    return `${minutes}:${seconds}`;
  }

  return (
    <main>
      <div className="timer">{convertSecondsToMinutes(timer)}</div>
      <article className="game">
        <Stack />
        <GarbageCollector />
        <RecyclingBin />
      </article>
    </main>
  );
}
