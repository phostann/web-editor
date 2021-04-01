import React, {CSSProperties, FC, memo, useEffect} from "react";
import {DragItem} from "../../store/Store";
import {DragSourceMonitor, useDrag} from "react-dnd";
import {getEmptyImage} from "react-dnd-html5-backend";
import Box from "../Box";
import styles from "./index.module.less";
import {useStore} from "../../App";
import {iframeSendItemInfoChangeMessage, iframeSendMessage} from "../../utils/utils";
import {AntMessageType, MessagePayload} from "../../../../interface";
import {MessageType} from "../../../../types/MessageType";
import {ITEM_LOCKED_MESSAGE} from "../../constant/constant";

const getStyle = (isCurrent: boolean, isDragging: boolean, left: number, top: number, zIndex: number): CSSProperties => {

    const transform = `translate(${left}px, ${top}px)`;

    return {
        transform,
        WebkitTransform: transform,
        zIndex,
        opacity: isDragging ? 0 : 1,
        height: isDragging ? 0 : "",
    };
};

export interface DraggableBoxProps {
    item: DragItem;
    currentId: string;
}

const DraggableBox: FC<DraggableBoxProps> = memo(({item, currentId}) => {

    const {changeCurrentId} = useStore();

    const [{isDragging}, drag, preview] = useDrag(() => {
        return {
            type: item.type,
            item: item,
            canDrag: () => {
                if (item.locked) {
                    iframeSendMessage<MessagePayload>({
                        type: MessageType.SHOW_MESSAGE, data: {
                            type: AntMessageType.WARNING,
                            message: ITEM_LOCKED_MESSAGE
                        }
                    });
                }
                return !item.locked;
            },
            collect: (monitor: DragSourceMonitor) => {
                return {
                    isDragging: monitor.isDragging()
                }
            }
        };
    }, [item]);

    useEffect(() => {
        preview(getEmptyImage(), {captureDraggingState: true});
    }, [preview]);

    const onMouseDown = () => {
        changeCurrentId(item.id);
        iframeSendItemInfoChangeMessage(item);
    }

    return <div ref={drag}
                className={styles.container}
                id={item.id}
                onMouseDown={onMouseDown}
                style={getStyle(item.id === currentId, isDragging, item.left, item.top, item.zIndex)}>
        <Box item={{...item}} currentId={currentId}/>
    </div>;
});

export default DraggableBox;