import React, {CSSProperties} from "react";
import {useDragLayer, XYCoord} from "react-dnd";
import styles from "./index.module.less";
import BoxDragPreview from "../BoxDragPreview";
import {useStore} from "../../App";
import {DragItem} from "../../store/Store";
import {adsorb_n, Adsorption} from "../../utils/utils";

const getStyle = (currentOffset: XYCoord | null): CSSProperties => {

    if (!currentOffset) {
        return {
            display: "none"
        }
    }

    const {x, y} = currentOffset;

    const transform = `translate(${x}px, ${y}px)`;

    return {
        transformOrigin: "center",
        transform,
        WebkitTransform: transform,
    };
}

const getHStyle = (adsorption: Adsorption | null): CSSProperties => {
    if (!adsorption) {
        return {
            display: "none"
        };
    } else {
        return {
            top: adsorption.showHorizontal !== void 0 ? adsorption.showHorizontal : 0,
            display: adsorption.showHorizontal !== void 0 ? "block" : "none"
        };
    }

}

const getVStyle = (adsorption: Adsorption | null): CSSProperties => {
    if (!adsorption) {
        return {
            display: "none"
        }
    } else {
        return {
            left: adsorption.showVertical !== void 0 ? adsorption.showVertical : 0,
            display: adsorption.showVertical !== void 0 ? "block" : "none"
        };
    }
};

const CustomDragLayer = () => {

    const {snapShot, canvasWidth, canvasHeight} = useStore();

    const {isDragging, item, currentOffset, adsorption} = useDragLayer(monitor => {
        const currentOffset = monitor.getSourceClientOffset();
        const item = monitor.getItem() as DragItem;
        let adsorption = null;
        if (currentOffset && item) {
            adsorption = adsorb_n(snapShot, item, currentOffset, canvasWidth, canvasHeight) as Adsorption | null;
            if (adsorption) {
                (adsorption.left !== void 0) && (currentOffset.x = adsorption.left);
                (adsorption.top !== void 0) && (currentOffset.y = adsorption.top);
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
             style={getHStyle(adsorption)}/>
        <div className={styles.vertical}
             style={getVStyle(adsorption)}/>
    </div>;
}
export default CustomDragLayer;