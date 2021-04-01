import React from 'react';
import {Layout} from "antd";
import styles from "./app.module.less";
import AppHeader from "./components/AppHeader";
import AppContent from "./components/AppContent";

function App() {

    return <Layout className={styles.container}>
        <AppHeader/>
        <AppContent/>
    </Layout>;
}

export default App;
