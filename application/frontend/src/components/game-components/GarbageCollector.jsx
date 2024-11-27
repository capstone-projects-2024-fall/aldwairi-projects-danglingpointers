import { forwardRef, useContext, useEffect, useRef, useState } from "react";
import {
  checkLeftBoundary,
  checkRightBoundary,
} from "../../scripts/check-boundaries";
import { DEFAULT_SETTINGS, ITEMS } from "../../scripts/constants";
import AuthContext from "../../auth/AuthContext";
import GameContext from "../../context/GameContext";

const GarbageCollector = forwardRef((_, ref) => {
  const { userId } = useContext(AuthContext);
  const {
    isSpeedUp,
    isSuperCollector,
  } = useContext(GameContext);

  const [styleLeft, setStyleLeft] = useState("1px");
  const intervalRef = useRef(null);
  const garbageCollectorColor = useRef(null);
  const arrowLeft = useRef(null);
  const arrowRight = useRef(null);

  useEffect(() => {
    const store = JSON.parse(sessionStorage.getItem("user-metadata-state"));
    if (store) {
      const settings = store.state.settings;
      garbageCollectorColor.current = settings.garbageCollectorColor;
      arrowLeft.current = settings.moveLeft;
      arrowRight.current = settings.moveRight;
    } else {
      garbageCollectorColor.current = DEFAULT_SETTINGS.garbageCollectorColor;
      arrowLeft.current = DEFAULT_SETTINGS.moveLeft;
      arrowRight.current = DEFAULT_SETTINGS.moveRight;
    }
  }, [userId]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === arrowLeft.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(
          () => {
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
          },
          isSpeedUp
            ? ITEMS.speedUpGarbageCollector
            : ITEMS.defaultSpeedGarbageCollector
        );
      } else if (event.key === arrowRight.current) {
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
  }, [isSpeedUp]);

  return (
    <>
      <section
        className="garbage-collector"
        ref={ref}
        style={{
          left: styleLeft,
          background: garbageCollectorColor.current,
          width: isSuperCollector
            ? ITEMS.superWidthGarbageCollector
            : ITEMS.defaultWidthGarbageCollector,
        }}
      ></section>
    </>
  );
});

GarbageCollector.displayName = "GarbageCollector";
export default GarbageCollector;
