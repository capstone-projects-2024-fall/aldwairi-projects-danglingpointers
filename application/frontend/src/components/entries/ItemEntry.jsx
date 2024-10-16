import viteLogo from '/vite.svg'
export default function ItemEntry({ itemName, itemDescription, itemCost }) {
    return (
        <section className={`${itemName} base-entry item-entry`}>
            <div className="item-img-container">
                <img src={viteLogo} className="item-img" alt="Vite logo" />
                <h1 className="item-name">{itemName}</h1>
            </div>
            <div className="item-description-container">
                <p className="item-description">{itemDescription}</p>
                <p className="item-cost">{itemCost}</p>
            </div>
        </section>
    )
};
