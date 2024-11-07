import { useState, useEffect } from "react";
export default function ItemEntry({
  itemName,
  itemDescription,
  itemCost,
  itemIcon,
  userMoney,
  setUserMoney,
}) {
  const [btnColor, setBtnColor] = useState("blue");
  useEffect(() => {
    userMoney >= itemCost ? setBtnColor("green") : setBtnColor("red");
  }, [itemCost, userMoney]);

  return (
    <section className={`${itemName} base-entry item-entry`}>
      <div className="item-img-container">
        <span className="item-img">{itemIcon}</span>
        <h1 className="item-name">{itemName}</h1>
      </div>
      <div className="item-description-container">
        <p className="item-description">{itemDescription}</p>
        <button
          id="btnItemCost"
          onClick={() => {
            setUserMoney((prevMoney) => prevMoney - itemCost);
          }}
          className={`btn-item-cost ${btnColor}`}
        >
          ${itemCost}
        </button>
      </div>
    </section>
  );
}
