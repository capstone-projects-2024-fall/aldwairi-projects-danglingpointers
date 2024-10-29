import { useRef } from "react"

export default function Pointer() {
    const collisionCount = useRef(0);
    return (
        <>
            <div className="pointer">{collisionCount.current}</div>
        </>
    )
};
