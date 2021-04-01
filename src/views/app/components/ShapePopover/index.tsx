import React from "react";
import styles from "./index.module.less";
import {Divider} from "antd";

const ShapePopover = () => {
    return <div className={styles.container}>
        <div>形状</div>
        <Divider className={styles.divider}/>
        <div className={styles.shapeContainer}>
            <div className={`${styles.shape} ${styles.square}`}/>
            <div className={`${styles.shape} ${styles.squareWithRadius}`}/>
            <div className={`${styles.shape} ${styles.squareWithNoBackground}`}/>
        </div>
        <div className={styles.shapeContainer}>
            <div className={`${styles.shape} ${styles.circleWithBorder}`}/>
            <div className={`${styles.shape} ${styles.circleWithNoBorder}`}/>
            <div className={`${styles.shape} ${styles.circleWithNoBackground}`}/>
        </div>
    </div>
};

export default ShapePopover;