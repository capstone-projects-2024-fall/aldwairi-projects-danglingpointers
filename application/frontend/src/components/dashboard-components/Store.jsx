import axios from "axios";
import ItemEntry from "../entries/ItemEntry";
import { useEffect, useState } from "react";
import { HOST_PATH } from "../../scripts/constants";

export default function Store() {
  const [itemsList, setItemsList] = useState();
  const [userMoney, setUserMoney] = useState(null);

  useEffect(() => {
    const store = JSON.parse(sessionStorage.getItem("user-metadata-state"));
    setUserMoney(store.state.points);

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
        <h1 className="user-money">{userMoney ? `$${userMoney}` : "$0"}</h1>
      </div>
      <article className="store">
        {itemsList
          ? Object.entries(itemsList).map(([key, item]) => (
              <ItemEntry
                key={key}
                itemId={item.id}
                itemName={item.name}
                itemDescription={item.description}
                itemIcon={item.icon}
                itemCost={item.cost}
                userMoney={userMoney}
                setUserMoney={setUserMoney}
              />
            ))
          : null}
      </article>
    </div>
  );
}
