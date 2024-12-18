import axios from "axios";
import { useEffect, useState } from "react";
import { HOST_PATH } from "../../scripts/constants";
import ItemEntry from "../entries/ItemEntry";

export default function Store({ isInboxOpen }) {
  const [itemsList, setItemsList] = useState();
  const [userMoney, setUserMoney] = useState(null);
  const [userItems, setUserItems] = useState({});

  useEffect(() => {
    const store = JSON.parse(sessionStorage.getItem("user-metadata-state"));
    setUserMoney(store.state.points);
    setUserItems(store.state.items || {});

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

  // Function to update user items after purchase
  const updateUserItems = (itemId, newQuantity) => {
    setUserItems((prevItems) => ({
      ...prevItems,
      [itemId]: newQuantity,
    }));

    // Update sessionStorage to persist the change
    const store = JSON.parse(sessionStorage.getItem("user-metadata-state"));
    store.state.items[itemId] = newQuantity;
    sessionStorage.setItem("user-metadata-state", JSON.stringify(store));
  };

  return (
    <div className="store-container default-scrollbar mb-def" style={isInboxOpen ? {display: "none"}: null}>
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
                itemQuantity={userItems[item.id] || 0} // Pass the quantity
                updateUserItems={updateUserItems} // Pass the updater function
              />
            ))
          : null}
      </article>
    </div>
  );
}
