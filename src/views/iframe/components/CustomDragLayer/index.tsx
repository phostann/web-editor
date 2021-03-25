import React, {CSSProperties} from "react";
import {useDragLayer, XYCoord} from "react-dnd";
import styles from "./index.module.less";
import BoxDragPreview from "../BoxDragPreview";
import {useStore} from "../../App";
import {DragItem} from "../../store/Store";
import {adsorb_n, Adsorption} from "../../utils/adsorb";

const getStyle = (currentOffset: XYCoord | null): CSSProperties => {

    if (!currentOffset) {
        return {
            display: "none"
        }
    }

    const {x, y} = currentOffset;

    const transform = `translate(${x}px, ${y}px)`;

    return {
        transform,
        WebkitTransform: transform,
    };
}

const CustomDragLayer = () => {

    const {snapShot} = useStore();

    const {isDragging, item, currentOffset, adsorption} = useDragLayer(monitor => {
        const currentOffset = monitor.getSourceClientOffset();
        const item = monitor.getItem() as DragItem;
        let adsorption = null;
        if (currentOffset && item) {

            adsorption = adsorb_n(snapShot, item, currentOffset) as Adsorption | null;
            if (adsorption) {
                adsorption.left && (currentOffset.x = adsorption.left);
                adsorption.top && (currentOffset.y = adsorption.top);
            }
        }
        return {
            item,
            currentOffset,
            isDragging: monitor.isDragging(),
            adsorption: adsorption
        };
    }) as { item: DragItem, currentOffset: XYCoord | null, isDragging: boolean, adsorption: Adsorption | null };

    if (!isDragging) {
        return null;
    }

    return <div className={styles.container}>
        <div className={styles.boxContainer} style={getStyle(currentOffset)}>
            <BoxDragPreview {...item}/>
        </div>
        <div className={styles.horizontal}
             style={{top: adsorption?.showHorizontal || 0, display: adsorption?.showHorizontal ? "block" : "none"}}/>
        <div className={styles.vertical}
             style={{left: adsorption?.showVertical || 0, display: adsorption?.showVertical ? "block" : "none"}}/>
    </div>;
}
export default CustomDragLayer;