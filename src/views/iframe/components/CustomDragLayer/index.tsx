import React, {CSSProperties, useState} from "react";
import {useDragLayer, XYCoord} from "react-dnd";
import styles from "./index.module.less";
import BoxDragPreview from "../BoxDragPreview";
import {useStore} from "../../App";
import {Adsorption, DragItem} from "../../store/Store";
import {adsorb} from "../../utils/adsorb";

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

    const {itemList} = useStore();
    const [adsorption, setAdsorption] = useState<Adsorption | null>(null);

    const {isDragging, item, currentOffset} = useDragLayer(monitor => {
        const currentOffset = monitor.getSourceClientOffset();
        const item = monitor.getItem() as DragItem;
        if (currentOffset && item && itemList.length) {
            const _adsorption = adsorb(itemList, item, currentOffset);
            if (_adsorption === null && adsorption !== null) {
                setAdsorption(null);
            } else if (_adsorption !== null && adsorption === null) {
                setAdsorption(_adsorption);
            } else if (_adsorption !== null && adsorption !== null) {
                if (_adsorption.left !== adsorption.left ||
                    _adsorption.top !== adsorption.top ||
                    _adsorption.showHorizontal !== adsorption.showHorizontal ||
                    _adsorption.showVertical !== adsorption.showVertical) {
                    setAdsorption(_adsorption);
                }
            }
            if (_adsorption !== null) {
                _adsorption.left && (currentOffset.x = _adsorption.left);
                _adsorption.top && (currentOffset.y = _adsorption.top);
            }
        }
        return {
            item,
            currentOffset,
            isDragging: monitor.isDragging()
        };
    });

    if (!isDragging) {
        return null;
    }

    return <div className={styles.container}>
        <div className={styles.boxContainer} style={getStyle(currentOffset)}>
            <BoxDragPreview {...item}/>
        </div>
        {
            adsorption && adsorption.showHorizontal ?
                <div className={styles.horizontal} style={{top: adsorption.showHorizontal}}/> : null
        }
        {
            adsorption && adsorption.showVertical ?
                <div className={styles.vertical} style={{left: adsorption.showVertical}}/> : null
        }
    </div>;
}
export default CustomDragLayer;