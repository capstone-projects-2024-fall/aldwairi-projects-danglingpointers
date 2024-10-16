import ItemEntry from "../entries/ItemEntry"

export default function Store() {
    return (
        <main>
            <section className="store">
                <ItemEntry itemName={"item 1"}/>
                <ItemEntry itemName={"item 2"}/>
                <ItemEntry itemName={"item 3"}/>
                <ItemEntry itemName={"item 4"}/>
                <ItemEntry itemName={"item 5"}/>
            </section>
        </main>
    )
};
