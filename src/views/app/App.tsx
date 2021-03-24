import React, {useEffect, useRef, useState} from 'react';
import {MessageInterface} from "../../interfaces/MessageInterface";
import {MessageType} from "../../types/MessageType";
import styles from "./App.module.less";

function App() {

    const ref = useRef<HTMLIFrameElement | null>(null)

    const [scale, setScale] = useState((1500 / 1920 * 100 | 0) / 100);

    const postMessage = (msg: MessageInterface) => {
        if (ref.current) {
            ref.current?.contentWindow?.postMessage(JSON.stringify(msg), "*");
        }
    }

    useEffect(() => {
        if (ref.current !== null) {
            ref.current.onload = () => {
                postMessage({data: "加载成功", type: MessageType.SCALE_CHANGE});
            }
        }
    }, []);
    return <div className={styles.container}>
        <div style={{width: 1920 * scale, height: 1080 * scale, overflow: "hidden"}}>
            <iframe ref={ref} src={`/iframe.html?scale=${scale}`} frameBorder={0}
                    style={{transform: `scale(${scale})`}}
                    title={"iframe"} className={styles.iframe}/>
        </div>

    </div>
}

export default App;
