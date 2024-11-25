import { useRef } from "react";
import Stack from "../game-components/Stack";
import RecyclingBin from "../game-components/RecyclingBin";

export default function GameReplay() {
  const stackRef = useRef();
  const recyclingBinRef = useRef();

  // TODO: Get from UserMetaData

  return (
    <main className="main-game">
      <article className="details-container">
        <div className="game-details">
          <div className="timer">Timer: </div>
          <div className="score">Score: </div>
          <div className="lives-remaining">Lives: </div>
        </div>
      </article>
      <article className="game">
        <Stack ref={stackRef} />
        <RecyclingBin ref={recyclingBinRef} />
      </article>
    </main>
  );
}
