import ItemEntry from "../entries/ItemEntry";
import { useState } from "react";

export default function Store() {
  const [userMoney, setUserMoney] = useState(10);

  function handleClick(increment) {
    let money = userMoney;
    increment ? (money += 1) : (money -= 1);
    money > 0 ? setUserMoney(money) : setUserMoney(0);
  }

  return (
    <div className="store-container">
      <div>
        <h1 className="store-title">Store</h1>
        <p className="store-description">Buy an item from the list above!</p>
        <p className="user-money">You have ${userMoney}</p>
        <button onClick={() => handleClick(true)}>+</button>
        <button onClick={() => handleClick(false)}>-</button>
      </div>
      <article className="store">
        <ItemEntry
          itemName={"Item 1"}
          itemDescription={"This is a generic description of item 1"}
          itemCost={10}
          userMoney={userMoney}
        />
        <ItemEntry
          itemName={"Item 2"}
          itemDescription={"This is a generic description of item 2"}
          itemCost={12}
          userMoney={userMoney}
        />
        <ItemEntry
          itemName={"Item 3"}
          itemDescription={"This is a generic description of item 3"}
          itemCost={8}
          userMoney={userMoney}
        />
        <ItemEntry
          itemName={"Item 4"}
          itemDescription={"This is a generic description of item 4"}
          itemCost={20}
          userMoney={userMoney}
        />
        <ItemEntry
          itemName={"Item 5"}
          itemDescription={"This is a generic description of item 5"}
          itemCost={15}
          userMoney={userMoney}
        />
      </article>
    </div>
  );
}
