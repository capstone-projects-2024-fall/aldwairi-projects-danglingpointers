import { forwardRef } from "react";

const RecyclingBin = forwardRef((_, ref) => {
  return (
    <>
      <section className="recycling-bin" ref={ref}></section>
    </>
  );
});

RecyclingBin.displayName = "RecyclingBin";
export default RecyclingBin;
