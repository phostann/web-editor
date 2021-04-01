import React, {CSSProperties, FC, memo, SyntheticEvent, useCallback} from "react";
import {DragItem} from "../../store/Store";
import {ItemTypes} from "../../types/ItemTypes";
import styles from "./index.module.less";
import {useStore} from "../../App";
import {rgb2Str} from "../../../app/utils/utils";

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

const getContainerStyle = (item: DragItem, isCurrent: boolean): CSSProperties => {
    const transform = item.rotate ? `rotate(${item.rotate}deg)` : "";
    return {
        transform,
        WebkitTransform: transform,
        outlineColor: isCurrent ? "#61dafb" : "transparent"
    };
};

const getItemStyle = (item: DragItem): CSSProperties => {

    const filter = `blur(${item.blur}px) 
                    brightness(${item.brightness}) 
                    opacity(${item.opacity}) 
                    contrast(${item.contrast}) 
                    grayscale(${item.grayscale}) 
                    hue-rotate(${item.hueRotate}deg) 
                    saturate(${item.saturate}) 
                    invert(${item.invert}) 
                    sepia(${item.sepia})`;

    return {
        width: item.width ? item.width : "",
        height: item.height ? item.height : "",
        borderWidth: item.borderWidth,
        borderColor: rgb2Str(item.borderColor),
        borderStyle: item.borderStyle,
        borderRadius: item.borderRadius,
        filter,
    }
}

export interface BoxProps {
    item: DragItem;
    currentId: string;
}

const Box: FC<BoxProps> = memo(({item, currentId}) => {

    const {layoutItem} = useStore();

    const onImgOnload = useCallback((e: SyntheticEvent<HTMLImageElement, Event>) => {
        const img = e.target as HTMLImageElement | null;
        if (img) {
            const width = img.offsetWidth;
            const height = img.offsetHeight;
            layoutItem(item.id, width, height);
        }
    }, [layoutItem, item.id]);

    const renderItem = useCallback((item: DragItem) => {
        switch (item.type) {
            case ItemTypes.TEXT:
                return null;
            case ItemTypes.IMAGE:
                return <div className={styles.imgContainer} style={getItemStyle({...item})}>
                    <img src={item.src} alt="#" className={styles.img} onLoad={onImgOnload}/>
                </div>;
            case ItemTypes.SHAPE:
                return null;
            case ItemTypes.COMPONENT:
                return null;
        }
    }, [onImgOnload]);

    const isCurrent = item.id === currentId;

    return <div className={styles.container} style={getContainerStyle(item, isCurrent)}>
        {
            isCurrent ? <>
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
        {
            renderItem(item)
        }
    </div>;
});

export default Box;