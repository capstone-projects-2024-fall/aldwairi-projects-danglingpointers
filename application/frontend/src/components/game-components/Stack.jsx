import { forwardRef } from "react"

const Stack = forwardRef((_, ref) => {
    return (
        <section className='stack' id="stack" ref={ref}>
            <div className='memory1' id="memory">1</div>
            <div className='memory2' id="memory">2</div>
            <div className='memory3' id="memory">3</div>
            <div className='memory4' id="memory">4</div>
            <div className='memory5' id="memory">5</div>
            <div className='memory6' id="memory">6</div>
        </section>
    )
});

Stack.displayName = "Stack";

export default Stack;
