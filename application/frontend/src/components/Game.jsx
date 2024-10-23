import GarbageCollector from "./game-components/GarbageCollector";
import RecyclingBin from "./game-components/RecyclingBin";
import Stack from "./game-components/Stack";
import convertSecondsToMinutes from "../scripts/convert-seconds-to-minutes";
import { useEffect, useState } from "react";

export default function Game() {
  const [timer, setTimer] = useState(0);
  const [playingGame, setPlayingGame] = useState(true);

  useEffect(() => {
    let intervalId;
    
    if (playingGame) {
      intervalId = setInterval(() => {
        setTimer((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [playingGame]);

  useEffect(() => {
    if (timer > 30) {
      setPlayingGame(false);
      setTimer(-1)
    }
  }, [timer])

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
