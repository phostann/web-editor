import React, {FC} from "react";
import {Divider} from "antd";
import styles from "./index.module.less";

interface TxtPopoverProps {
    onClose: () => void
}


const TxtPopover: FC<TxtPopoverProps> = ({onClose}) => {
    function onClick() {
        onClose();
    }

    return <>
        <h5 onClick={onClick} className={styles.h}>小号字体</h5>
        <Divider className={styles.divider}/>
        <h3 onClick={onClick} className={styles.h}>中号字体</h3>
        <Divider className={styles.divider}/>
        <h1 onClick={onClick} className={styles.h}>大号字体</h1>
    </>
};

export default TxtPopover;