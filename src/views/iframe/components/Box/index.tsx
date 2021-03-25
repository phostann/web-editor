import React, {CSSProperties, FC, memo, SyntheticEvent, useCallback} from "react";
import {DragItem} from "../../store/Store";
import {ItemTypes} from "../../types/ItemTypes";
import styles from "./index.module.less";
import {useStore} from "../../App";

const getStyle = (width: number, height: number): CSSProperties => {
    return {
        width: width ? width : "",
        height: height ? height : ""
    }
}

const Box: FC<DragItem> = memo((props) => {

    const {layoutItem} = useStore();

    const onImgOnload = useCallback((e: SyntheticEvent<HTMLImageElement, Event>) => {
        const img = e.target as HTMLImageElement | null;
        if (img) {
            const width = img.offsetWidth;
            const height = img.offsetHeight;
            layoutItem(props.id, width, height);
        }
    }, [layoutItem, props.id]);

    const renderItem = useCallback((item: DragItem) => {
        switch (item.type) {
            case ItemTypes.TEXT:
                return null;
            case ItemTypes.IMAGE:
                return <img src={item.src} alt="#" className={styles.img} onLoad={onImgOnload}/>;
            case ItemTypes.SHAPE:
                return null;
            case ItemTypes.COMPONENT:
                return null;
        }
    }, [onImgOnload]);

    return <div style={getStyle(props.width, props.height)}>
        {
            renderItem(props)
        }
    </div>;
});

export default Box;