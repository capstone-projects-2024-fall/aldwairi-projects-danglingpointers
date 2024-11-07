import axios from "axios";
import ItemEntry from "../entries/ItemEntry";
import { useLayoutEffect, useState } from "react";
import { HOST_PATH } from "../../scripts/constants";

export default function Store() {
  const [itemsList, setItemsList] = useState();
  const userMoney = 10;
  
  useLayoutEffect(() => {
    const fetchItems = async () => {
      try {
        const itemsResponse = await axios.get(`${HOST_PATH}/items/`);
        setItemsList(itemsResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="store-container default-scrollbar mb-def">
      <div className="store-details">
        <h1 className="store-title">Store</h1>
        <h1 className="user-money">${userMoney}</h1>
      </div>
      <article className="store">
        {itemsList
          ? Object.entries(itemsList).map(([key, item]) => (
              <ItemEntry
                key={key}
                itemName={item.name}
                itemDescription={item.description}
                itemIcon={item.icon}
                itemCost={item.cost}
                userMoney={userMoney}
              />
            ))
          : null}
      </article>
    </div>
  );
}
