import { useState, useEffect } from "react";
import viteLogo from "/vite.svg";
export default function ItemEntry({
  itemName,
  itemDescription,
  itemCost,
  userMoney,
}) {
  const [btnColor, setBtnColor] = useState("blue");
  useEffect(() => {
    userMoney >= itemCost ? setBtnColor("blue") : setBtnColor("red");
  }, [itemCost, userMoney]);

  return (
    <section className={`${itemName} base-entry item-entry`}>
      <div className="item-img-container">
        <img src={viteLogo} className="item-img" alt="Vite logo" />
        <h1 className="item-name">{itemName}</h1>
      </div>
      <div className="item-description-container">
        <p className="item-description">{itemDescription}</p>
        <button id="btnItemCost" className={`btn-item-cost ${btnColor}`}>
          ${itemCost}
        </button>
      </div>
    </section>
  );
}
