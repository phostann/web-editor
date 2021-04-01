import React, {CSSProperties, useEffect, useState} from "react";
import {useStore} from "../../App";
import {useDrop} from "react-dnd";
import {ItemTypes} from "../../types/ItemTypes";
import {DragItem} from "../../store/Store";
import DraggableBox from "../DraggableBox";
import {observer} from "mobx-react";
import {Item, Menu, Separator, useContextMenu} from "react-contexify";
import styles from "./index.module.less";
import "react-contexify/dist/ReactContexify.css";
import {adsorb, iframeSendItemInfoChangeMessage, iframeSendMessage} from "../../utils/utils";
import _ from "lodash";
import {
    AntMessageType,
    ImgItemPayload,
    MessageInterface,
    MessagePayload,
    ScalePayload,
    SizePayload
} from "../../../../interface";
import {MessageType} from "../../../../types/MessageType";
import {ITEM_LOCKED_MESSAGE} from "../../constant/constant";
import {MouseDirection} from "../Box";

const MENU_ID = "menu_id";

const getMenuStyle = (scale: number): CSSProperties => {
    const transform = `scale(${parseFloat((100 / scale).toFixed(6))})`;
    return {
        transformOrigin: "left top",
        transform,
        WebkitTransform: transform
    };
}

const Container = observer(() => {

    const {
        itemList,
        currentId,
        modifyItem,
        removeItem,
        changeCurrentId,
        moveItemToFront,
        moveItemToBack,
        moveItemToBottom,
        moveItemToCenter,
        moveItemToLeft,
        moveItemToMiddle,
        moveItemToRight,
        moveItemToTop,
        stepToLeft,
        stepToUp,
        stepToRight,
        stepToDown,
        resizeItem,
        moveItem,
        snapShot,
        changeWidth,
        changeHeight,
        canvasWidth,
        canvasHeight,
        addImgItem,
        findItemById,
        lockItem
    } = useStore();

    const [, drop] = useDrop(() => ({
        accept: [ItemTypes.TEXT, ItemTypes.IMAGE, ItemTypes.SHAPE, ItemTypes.SHAPE],
        drop(item: DragItem, monitor) {
            const currentOffset = monitor.getSourceClientOffset();
            if (currentOffset) {
                const adsorption = adsorb(snapShot, item, currentOffset, canvasWidth, canvasHeight);
                if (adsorption) {
                    (adsorption.left !== void 0) && (currentOffset.x = Math.round(adsorption.left));
                    (adsorption.top !== void 0) && (currentOffset.y = Math.round(adsorption.top));
                }
                const res = moveItem({id: item.id, left: currentOffset.x, top: currentOffset.y});
                iframeSendItemInfoChangeMessage(res);
            }
        }
    }), [snapShot, moveItem]);

    const {show} = useContextMenu({
        id: MENU_ID
    });

    const [mouseDirection, setMouseDirection] = useState<MouseDirection | null>(null);
    const [itemLocked, setItemLocked] = useState(false);
    const [scale, setScale] = useState(100);

    useEffect(() => {
        const onMouseUp = () => {
            setMouseDirection(null);
        };

        window.addEventListener("mouseup", onMouseUp, false);

        return () => window.removeEventListener("mouseup", onMouseUp, false);
    }, [currentId, itemList]);


    // 缩放
    useEffect(() => {
        const onMouseMove = _.throttle((e: MouseEvent) => {
            if (!mouseDirection) return;
            const item = findItemById(currentId);
            if (!item) return;
            if (item.locked) {
                iframeSendMessage<MessagePayload>({
                    type: MessageType.SHOW_MESSAGE,
                    data: {type: AntMessageType.WARNING, message: ITEM_LOCKED_MESSAGE}
                });
                return;
            }


            const {clientX, clientY} = e;
            const x = Math.round(clientX);
            const y = Math.round(clientY);
            const doubleBorder = item.borderWidth * 2;
            let width = item.width + doubleBorder;
            let height = item.height + doubleBorder;
            const halfWidth = width / 2;
            const halfHeight = height / 2;
            let left = item.left;
            let top = item.top;
            let right = left + width;
            let bottom = top + height;
            let center = (left + right) / 2;
            let middle = item.top + height / 2;
            let diff = 0;


            let res: DragItem | null = null;

            switch (mouseDirection) {
                case MouseDirection.TOP_LEFT:
                    // if (x <= right - 1 - diff) {
                    //     left = x;
                    //     width = right - left - diff;
                    //     res = resizeItem({id: currentId, left, width});
                    // }
                    // if (y <= bottom - 1 - diff) {
                    //     top = y;
                    //     height = bottom - top - diff;
                    //     res = resizeItem({id: currentId, top, height});
                    // }
                    break;
                case MouseDirection.TOP_CENTER:
                    if (y <= bottom - 1) {
                        top = y;
                        height = bottom - y;
                        resizeItem({id: currentId, top, height});
                    }
                    break;
                case MouseDirection.TOP_RIGHT:
                    const _bottom = item.top + item.height;
                    if (y <= _bottom - 1) {
                        resizeItem({id: currentId, top: y, height: _bottom - y});
                    }
                    // if (x >= left + 1 + diff) {
                    //     width = x - left - diff;
                    //     res = resizeItem({id: currentId, width});
                    // }
                    // if (y <= bottom - 1 - diff) {
                    //     top = y;
                    //     height = bottom - top - diff;
                    //     res = resizeItem({id: currentId, top, height});
                    // }
                    break;
                case MouseDirection.MIDDLE_RIGHT: {
                    // diff = halfWidth - halfWidth * Math.cos(item.rotate * Math.PI / 180);
                    // if (x + diff >= left + 1 + doubleBorder) {
                    //     width = Math.round(x + diff - left - doubleBorder);
                    //     res = resizeItem({id: currentId, width});
                    // }
                    break;
                }
                case MouseDirection.BOTTOM_RIGHT:
                    // if (x >= left + 1 + diff) {
                    //     width = x - left - diff;
                    //     res = resizeItem({id: currentId, width});
                    // }
                    // if (y >= top + 1 + diff) {
                    //     height = y - top - diff;
                    //     res = resizeItem({id: currentId, height});
                    // }
                    break;
                case MouseDirection.BOTTOM_CENTER:
                    // if (y >= top + 1 + diff) {
                    //     height = y - top - diff;
                    //     res = resizeItem({id: currentId, height});
                    // }
                    break;
                case MouseDirection.BOTTOM_LEFT:
                    // if (x <= right - 1 - diff) {
                    //     left = x;
                    //     width = right - left - diff;
                    //     res = resizeItem({id: currentId, left, width});
                    // }
                    // if (y >= top + 1 + diff) {
                    //     height = y - top - diff;
                    //     res = resizeItem({id: currentId, height});
                    // }
                    break;
                case MouseDirection.MIDDLE_LEFT:
                    // if (x <= right - 1 - diff) {
                    //     left = x;
                    //     width = right - left - diff;
                    //     res = resizeItem({id: currentId, left, width});
                    // }
                    break;
            }
            // iframeSendItemInfoChangeMessage(res);
        }, 16);

        window.addEventListener("mousemove", onMouseMove, false);
        return () => window.removeEventListener("mousemove", onMouseMove, false);
    }, [currentId, findItemById, mouseDirection, resizeItem]);

    // 键盘移动
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (!currentId.length) return;
            const item = findItemById(currentId);
            if (item && item.locked) {
                iframeSendMessage<MessagePayload>({
                    type: MessageType.SHOW_MESSAGE,
                    data: {type: AntMessageType.WARNING, message: ITEM_LOCKED_MESSAGE}
                });
                return;
            }

            e.preventDefault();

            let res: DragItem | null = null;
            switch (e.key) {
                case "ArrowUp":
                    res = stepToUp(currentId);
                    break;
                case "ArrowRight":
                    res = stepToRight(currentId);
                    break;
                case "ArrowDown":
                    res = stepToDown(currentId);
                    break;
                case "ArrowLeft":
                    res = stepToLeft(currentId);
                    break;
                case "Delete":
                    res = removeItem(currentId);
                    break;
                default:
                    return;
            }

            iframeSendItemInfoChangeMessage(res)
        };

        window.addEventListener("keydown", onKeyDown, false);
        return () => window.removeEventListener("keydown", onKeyDown, false);
    }, [currentId, findItemById, itemList, modifyItem, removeItem, stepToDown, stepToLeft, stepToRight, stepToUp]);

    // 右键菜单
    const onContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const current = document.getElementById(currentId);
        if (!current) return;
        const item = findItemById(currentId);
        if (!item) return;
        setItemLocked(item.locked);
        const target = e.target as HTMLDivElement;
        if (current.contains(target)) {
            show(e);
        }
    };

    const onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;
        if (target.dataset.direction) {
            e.preventDefault();
            setMouseDirection(target.dataset.direction as string as MouseDirection);
        } else if (target.dataset.container === "true") {
            changeCurrentId("");
            iframeSendItemInfoChangeMessage(null);
        }
    }

    const moveToFront = () => {
        moveItemToFront(currentId);
    }

    const moveToBack = () => {
        moveItemToBack(currentId);
    }

    const moveToLeft = () => {
        const res = moveItemToLeft(currentId);
        iframeSendItemInfoChangeMessage(res);
    }

    const moveToRight = () => {
        const res = moveItemToRight(currentId);
        iframeSendItemInfoChangeMessage(res);
    }

    const moveToCenter = () => {
        const res = moveItemToCenter(currentId);
        iframeSendItemInfoChangeMessage(res);
    }

    const moveToTop = () => {
        const res = moveItemToTop(currentId);
        iframeSendItemInfoChangeMessage(res);
    }

    const moveToMiddle = () => {
        const res = moveItemToMiddle(currentId);
        iframeSendItemInfoChangeMessage(res);
    }

    const moveToBottom = () => {
        const res = moveItemToBottom(currentId);
        iframeSendItemInfoChangeMessage(res);
    }

    function lockOrUnlockItem() {
        const res = lockItem(currentId, !itemLocked);
        setItemLocked(!itemLocked);
        iframeSendItemInfoChangeMessage(res);
    }

    const deleteItem = () => {
        const res = removeItem(currentId);
        iframeSendItemInfoChangeMessage(res);
    }

    // post message
    useEffect(() => {
        const onMessage = (e: MessageEvent) => {
            if (e.data) {
                const msg = JSON.parse(e.data) as MessageInterface<any>;
                switch (msg.type) {
                    case MessageType.SHOW_MESSAGE:
                        break;
                    case MessageType.CHANGE_SIZE: {
                        const data = msg.data as SizePayload;
                        changeWidth(data.width);
                        changeHeight(data.height);
                        break;
                    }

                    case MessageType.ADD_IMG_ITEM: {
                        const data = msg.data as ImgItemPayload;
                        addImgItem(data.src);
                        break;
                    }
                    case MessageType.CHANGE_SCALE: {
                        const data = msg.data as ScalePayload;
                        setScale(data.scale);
                        break;
                    }
                    case MessageType.CHANGE_ITEM: {
                        const data = msg.data as DragItem;
                        const res = modifyItem(data);
                        iframeSendItemInfoChangeMessage(res);
                        break;
                    }
                    default:
                        return;
                }
            }
        };

        window.addEventListener("message", onMessage, false);
        return () => window.removeEventListener("message", onMessage, false);
    }, [addImgItem, changeHeight, changeWidth, modifyItem]);


    return <>
        <div ref={drop}
             className={styles.container}
             onMouseDown={onMouseDown}
             onContextMenu={onContextMenu}
             data-container={true}
             style={{width: canvasWidth, height: canvasHeight}}>
            {
                itemList.map((item) => <DraggableBox item={{...item}} key={item.id} currentId={currentId}/>)
            }
        </div>
        <Menu id={MENU_ID}>
            <Item onClick={moveToFront} disabled={itemLocked}>置于最前</Item>
            <Item onClick={moveToBack} disabled={itemLocked}>置于最后</Item>
            <Separator/>
            <Item onClick={moveToLeft} disabled={itemLocked}>左对齐</Item>
            <Item onClick={moveToCenter} disabled={itemLocked}>水平居中</Item>
            <Item onClick={moveToRight} disabled={itemLocked}>右对齐</Item>
            <Separator/>
            <Item onClick={moveToTop} disabled={itemLocked}>顶部</Item>
            <Item onClick={moveToMiddle} disabled={itemLocked}>垂直居中</Item>
            <Item onClick={moveToBottom} disabled={itemLocked}>底部</Item>
            <Separator/>
            <Item onClick={lockOrUnlockItem}>{itemLocked ? "解锁" : "锁定"}</Item>
            <Separator/>
            <Item onClick={deleteItem} disabled={itemLocked}>删除</Item>
        </Menu>
    </>;
});

export default Container;