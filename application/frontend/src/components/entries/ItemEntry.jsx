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
  updateUserItems, // Receive the updater function
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

    // Update sessionStorage and state
    const store = JSON.parse(sessionStorage.getItem("user-metadata-state"));

    let points = store.state.points;
    points -= itemCost;
    store.state.points = points;

    const items = store.state.items;
    const newQuantity = (items[itemId] || 0) + 1;
    items[itemId] = newQuantity;
    store.state.items = items;

    setUserMoney((prevMoney) => prevMoney - itemCost);
    sessionStorage.setItem("user-metadata-state", JSON.stringify(store));

    // Update userItems state in the parent
    updateUserItems(itemId, newQuantity);

    alert(`You successfully purchased ${itemName}!`);
  };

  return (
    <section className={`${itemName} base-entry item-entry`}>
      <div className="item-quantity-badge">Current Amount: x{itemQuantity}</div>
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
