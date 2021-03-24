import React, {FC} from "react";
import {DragItem} from "../../store/Store";
import Box from "../Box";
import styles from "./index.module.less";

const BoxDragPreview: FC<DragItem> = (props) => {
    return <div className={styles.container}>
        <div className={styles.dot}/>
        <div className={styles.dot}/>
        <div className={styles.dot}/>
        <div className={styles.dot}/>
        <div className={styles.dot}/>
        <div className={styles.dot}/>
        <div className={styles.dot}/>
        <div className={styles.dot}/>
        <Box {...props}/>
    </div>
};

export default BoxDragPreview;