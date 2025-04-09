'use client'
import { useRef } from "react";
export default function () {
    const rref = useRef<HTMLInputElement>(null);
    function handleOnclick() {
        alert(rref.current?.value);
        rref.current?.requestFullscreen()
    }
    return (
        <div>
            <input type="text" ref={rref} />
            <button onClick={handleOnclick}>asda</button>
        </div>
    )
}