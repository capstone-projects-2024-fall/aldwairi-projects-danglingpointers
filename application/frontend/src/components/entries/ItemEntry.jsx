import { useState, useEffect } from "react";
export default function ItemEntry({
  itemId,
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

  const handlePurchase = async () => {
    const store = JSON.parse(sessionStorage.getItem("user-metadata-state"));

    let points = store.state.points
    points -= itemCost;
    store.state.points = points;

    const items = store.state.items;
    items[itemId] += 1;
    store.state.items = items;

    setUserMoney((prevMoney) => prevMoney - itemCost);

    sessionStorage.setItem("user-metadata-state", JSON.stringify(store));
  };

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
          onClick={handlePurchase}
          className={`btn-item-cost ${btnColor}`}
        >
          ${itemCost}
        </button>
      </div>
    </section>
  );
}
