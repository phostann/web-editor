import React, {FC} from "react";
import {DragItem} from "../../store/Store";
import Box from "../Box";
import styles from "./index.module.less";

const BoxDragPreview: FC<DragItem> = (props) => {
    return <div className={styles.container}>
        <Box item={{...props}} currentId={props.id}/>
    </div>
};

export default BoxDragPreview;