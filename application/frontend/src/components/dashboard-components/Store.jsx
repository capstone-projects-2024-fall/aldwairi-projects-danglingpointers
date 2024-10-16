import ItemEntry from "../entries/ItemEntry"

export default function Store() {
    return (
        <main>
            <article className="store">
                <ItemEntry itemName={"Item 1"} itemDescription={"This is a generic description of item 1"} itemCost={"$10"}/>
                <ItemEntry itemName={"Item 2"} itemDescription={"This is a generic description of item 2"} itemCost={"$12"}/>
                <ItemEntry itemName={"Item 3"} itemDescription={"This is a generic description of item 3"} itemCost={"$8"}/>
                <ItemEntry itemName={"Item 4"} itemDescription={"This is a generic description of item 4"} itemCost={"$20"}/>
                <ItemEntry itemName={"Item 5"} itemDescription={"This is a generic description of item 5"} itemCost={"$15"}/>
            </article>
        </main>
    )
};
