import React, {useEffect} from 'react';
import {Spin} from "antd";
import styles from "./app.module.less"

function App() {
    useEffect(() => {
        window.location.replace("/app.html");
    }, []);
    return <div className={styles.container}>
        <Spin tip={"正在初始化..."}/>
    </div>;
}

export default App;
