import ItemEntry from "../entries/ItemEntry"

export default function Store() {
    return (
        <main>
            <article className="store">
                <ItemEntry itemName={"Item 1"} description={"This is a generic description of item 1"}/>
                <ItemEntry itemName={"Item 2"} description={"This is a generic description of item 2"}/>
                <ItemEntry itemName={"Item 3"} description={"This is a generic description of item 3"}/>
                <ItemEntry itemName={"Item 4"} description={"This is a generic description of item 4"}/>
                <ItemEntry itemName={"Item 5"} description={"This is a generic description of item 5"}/>
            </article>
        </main>
    )
};
