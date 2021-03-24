import React, {CSSProperties, FC, memo, useEffect} from "react";
import {DragItem} from "../../store/Store";
import {DragSourceMonitor, useDrag} from "react-dnd";
import {getEmptyImage} from "react-dnd-html5-backend";
import Box from "../Box";
import styles from "./index.module.less";
import {useStore} from "../../App";

const getStyle = (isCurrent: boolean, isDragging: boolean, left: number, top: number, zIndex: number): CSSProperties => {

    const transform = `translate(${left}px, ${top}px)`;

    return {
        transform,
        WebkitTransform: transform,
        outlineColor: isCurrent ? "#61dafb" : "transparent",
        zIndex,
        opacity: isDragging ? 0 : 1,
        height: isDragging ? 0 : "",
    };
};

export enum MouseDirection {
    TOP_LEFT = "top_left",
    TOP_CENTER = "top_center",
    TOP_RIGHT = "top_right",
    MIDDLE_RIGHT = "middle_right",
    BOTTOM_RIGHT = "bottom_right",
    BOTTOM_CENTER = "bottom_center",
    BOTTOM_LEFT = "bottom_left",
    MIDDLE_LEFT = "middle_left"
}

const DraggableBox: FC<DragItem & { currentId: string }> = memo((props) => {

    const {changeCurrentId} = useStore();

    const [{isDragging}, drag, preview] = useDrag(() => {
        return {
            type: props.type,
            item: {...props},
            collect: (monitor: DragSourceMonitor) => ({
                isDragging: monitor.isDragging()
            })
        }
    }, [props]);

    useEffect(() => {
        preview(getEmptyImage(), {captureDraggingState: true});
    }, [preview]);

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        changeCurrentId(props.id);
    }

    return <div ref={drag}
                className={styles.container}
                id={props.id}
                onMouseDown={onMouseDown}
                style={getStyle(props.id === props.currentId, isDragging, props.left, props.top, props.zIndex)}>
        {
            props.id === props.currentId ? <>
                <div className={styles.dot} data-direction={MouseDirection.TOP_LEFT}/>
                <div className={styles.dot} data-direction={MouseDirection.TOP_CENTER}/>
                <div className={styles.dot} data-direction={MouseDirection.TOP_RIGHT}/>
                <div className={styles.dot} data-direction={MouseDirection.MIDDLE_RIGHT}/>
                <div className={styles.dot} data-direction={MouseDirection.BOTTOM_RIGHT}/>
                <div className={styles.dot} data-direction={MouseDirection.BOTTOM_CENTER}/>
                <div className={styles.dot} data-direction={MouseDirection.BOTTOM_LEFT}/>
                <div className={styles.dot} data-direction={MouseDirection.MIDDLE_LEFT}/>
            </> : null
        }
        <Box {...props}/>
    </div>;
});

export default DraggableBox;