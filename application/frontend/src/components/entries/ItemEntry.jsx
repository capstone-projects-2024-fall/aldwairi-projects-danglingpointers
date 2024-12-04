import { useEffect, useState } from "react";

export default function ItemEntry({
  itemId,
  itemName,
  itemDescription,
  itemCost,
  itemIcon,
  userMoney,
  setUserMoney,
  itemQuantity,
}) {
  const [btnColor, setBtnColor] = useState("blue");

  useEffect(() => {
    userMoney >= itemCost ? setBtnColor("green") : setBtnColor("red");
  }, [itemCost, userMoney]);

  const handlePurchase = async () => {
    if (userMoney < itemCost) {
      alert("You do not have enough money to purchase this item.");
      return;
    }

    const store = JSON.parse(sessionStorage.getItem("user-metadata-state"));

    let points = store.state.points;
    points -= itemCost;
    store.state.points = points;

    const items = store.state.items;
    items[itemId] = (items[itemId] || 0) + 1;
    store.state.items = items;

    setUserMoney((prevMoney) => prevMoney - itemCost);
    sessionStorage.setItem("user-metadata-state", JSON.stringify(store));

    alert(`You successfully purchased ${itemName}!`);
  };

  return (
    <section className={`${itemName} base-entry item-entry`}>
      <div className="item-img-container">
        <span className="item-img">{itemIcon}</span>
        <h1 className="item-name">{itemName}</h1>
        <h1 className="item-quantity">  Amount: {itemQuantity}</h1>

      </div>
      <div className="item-description-container">
        <p className="item-description">{itemDescription}</p>
        <div className="item-info">
          <button
            id="btnItemCost"
            onClick={handlePurchase}
            className={`btn-item-cost ${btnColor}`}
          >
            ${itemCost}
          </button>
        </div>
      </div>
    </section>
  );
}
