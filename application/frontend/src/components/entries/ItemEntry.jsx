import viteLogo from '/vite.svg'
export default function ItemEntry({ itemName, description }) {
    return (
        <section className={`${itemName} base-entry item-entry`}>
            <div className="item-img-container">
                <img src={viteLogo} className="item-img" alt="Vite logo" />
                <h1 className="item-name">{itemName}</h1>
            </div>
            <p className="item-description">{description}</p>
        </section>
    )
};
