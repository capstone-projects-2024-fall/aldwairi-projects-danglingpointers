import {
  forwardRef,
  useContext,
  useEffect,
  // useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  checkLeftBoundary,
  checkRightBoundary,
} from "../../scripts/check-boundaries";
// import useUserAuthStore from "../../stores/userAuthStore";
import AuthContext from "../../auth/AuthContext";
import GameContext from "../../context/GameContext";

const GarbageCollector = forwardRef((_, ref) => {
  // const { userId } = useUserAuthStore();
  const [styleLeft, setStyleLeft] = useState("1px");
  const { isSpeedUp, setIsSpeedUp, isSuperCollector, setIsSuperCollector } =
    useContext(GameContext);
  const { garbageCollectorColor } = useContext(AuthContext);
  const intervalRef = useRef(null);

  // useLayoutEffect(() => {
  //   if (userId) {
  //     const store = JSON.parse(sessionStorage.getItem("user-metadata-state"));
  //     const color = store.state.settings.garbageCollectorColor;
  //     if (color) setGarbageCollectorColor(color);
  //     else setGarbageCollectorColor("green");
  //   } else setGarbageCollectorColor("red");
  // }, [userId]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
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
          isSpeedUp ? 5 : 10
        );
      } else if (event.key === "ArrowRight") {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(
          () => {
            setStyleLeft((prevLeft) => {
              if (
                checkRightBoundary(
                  document
                    .querySelector(".garbage-collector")
                    .getBoundingClientRect(),
                  document
                    .querySelector(".recycling-bin")
                    .getBoundingClientRect()
                )
              )
                return parseInt(prevLeft) + 10 + "px";
              else {
                clearInterval(intervalRef.current);
                return prevLeft;
              }
            });
          },
          isSpeedUp ? 5 : 10
        );
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

  useEffect(() => {
    if (isSpeedUp) {
      const timeoutId = setTimeout(() => {
        setIsSpeedUp(false);
      }, 10000);

      return () => clearTimeout(timeoutId);
    }
    if (isSuperCollector) {
      const timeoutId = setTimeout(() => {
        setIsSuperCollector(false);
      }, 10000);

      return () => clearTimeout(timeoutId);
    }
  }, [isSpeedUp, setIsSpeedUp, isSuperCollector, setIsSuperCollector]);

  return (
    <>
      <section
        className="garbage-collector"
        ref={ref}
        style={{
          left: styleLeft,
          background: garbageCollectorColor,
          width: isSuperCollector ? "125px" : "75px",
        }}
      ></section>
    </>
  );
});

GarbageCollector.displayName = "GarbageCollector";
export default GarbageCollector;
