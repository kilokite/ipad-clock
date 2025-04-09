'use client'
import styles from "./time.module.scss"
import { useState, useRef, useEffect } from "react"
import { FullScreen, useFullScreenHandle } from "react-full-screen";
function Time() {
    const handle = useFullScreenHandle();
    let [time, setTime] = useState("00:00")
    setInterval(() => {
        let date = new Date()
        let a = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
        setTime(a)
    }, 1000)
    return (
        <FullScreen  handle={handle}>
            <div className={styles.time}>
                <button onClick={handle.enter}>
                    Enter fullscreen
                </button>
                <p className={styles.aa}>{time}</p>
            </div>
        </FullScreen>
    );
}

export default Time;