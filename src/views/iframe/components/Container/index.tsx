import React, {useEffect, useState} from "react";
import {useStore} from "../../App";
import {useDrop} from "react-dnd";
import {ItemTypes} from "../../types/ItemTypes";
import {DragItem} from "../../store/Store";
import DraggableBox, {MouseDirection} from "../DraggableBox";
import {observer} from "mobx-react";
import {Item, Menu, Separator, useContextMenu} from "react-contexify";
import styles from "./index.module.less";
import "react-contexify/dist/ReactContexify.css";
import {adsorb} from "../../utils/adsorb";

type ClientXY = {
    x: number;
    y: number;
}

const MENU_ID = "menu_id";

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
    } = useStore();

    const [, drop] = useDrop(() => ({
        accept: [ItemTypes.TEXT, ItemTypes.IMAGE, ItemTypes.SHAPE, ItemTypes.SHAPE],
        drop(item: DragItem, monitor) {
            const currentOffset = monitor.getSourceClientOffset();
            if (currentOffset) {
                const _adsorption = adsorb(itemList, item, currentOffset);
                if (_adsorption) {
                    _adsorption.left && (currentOffset.x = _adsorption.left);
                    _adsorption.top && (currentOffset.y = _adsorption.top);
                }
                modifyItem({id: item.id, left: currentOffset.x, top: currentOffset.y});
            }
        }
    }), [modifyItem]);

    const {show} = useContextMenu({
        id: MENU_ID
    });

    const [cachedItem, setCachedItem] = useState<DragItem | null>(null);
    const [clientXY, setClientXY] = useState<ClientXY>({x: 0, y: 0});
    const [mouseDirection, setMouseDirection] = useState<MouseDirection | null>(null);

    useEffect(() => {
        const onMouseUp = () => {
            setMouseDirection(null);
            const find = itemList.find(item => item.id === currentId) || null;
            setCachedItem(JSON.parse(JSON.stringify(find)));
        };

        window.addEventListener("mouseup", onMouseUp, false);

        return () => window.removeEventListener("mouseup", onMouseUp, false);
    }, [currentId, itemList]);


    // 缩放
    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            if (!cachedItem || !mouseDirection) {
                return;
            }
            const diff = {x: Math.round(e.clientX - clientXY.x), y: Math.round(e.clientY - clientXY.y)};
            let width;
            let height;
            let left;
            let top;
            switch (mouseDirection) {
                case MouseDirection.TOP_LEFT:
                    width = cachedItem.width - diff.x;
                    left = cachedItem.left + diff.x
                    height = cachedItem.height - diff.y;
                    top = cachedItem.top + diff.y;
                    if (width <= 0 || height <= 0) {
                        break;
                    }
                    modifyItem({id: currentId, width, left, height, top});
                    break;
                case MouseDirection.TOP_CENTER:
                    height = cachedItem.height - diff.y;
                    top = cachedItem.top + diff.y;
                    if (height <= 0) {
                        break;
                    }
                    modifyItem({id: currentId, height, top});
                    break;
                case MouseDirection.TOP_RIGHT:
                    width = cachedItem.width + diff.x;
                    height = cachedItem.height - diff.y;
                    top = cachedItem.top + diff.y;
                    if (width <= 0 || height <= 0) {
                        break;
                    }
                    modifyItem({id: currentId, width, height, top});
                    break;
                case MouseDirection.MIDDLE_RIGHT:
                    width = cachedItem.width + diff.x;
                    if (width <= 0) {
                        break;
                    }
                    modifyItem({id: currentId, width});
                    break;
                case MouseDirection.BOTTOM_RIGHT:
                    width = cachedItem.width + diff.x;
                    height = cachedItem.height + diff.y;
                    if (width <= 0 || height <= 0) {
                        break;
                    }
                    modifyItem({id: currentId, width, height});
                    break;
                case MouseDirection.BOTTOM_CENTER:
                    height = cachedItem.height + diff.y;
                    if (height <= 0) {
                        break;
                    }
                    modifyItem({id: currentId, height});
                    break;
                case MouseDirection.BOTTOM_LEFT:
                    width = cachedItem.width - diff.x;
                    left = cachedItem.left + diff.x
                    height = cachedItem.height + diff.y;
                    if (width <= 0 || height <= 0) {
                        break;
                    }
                    modifyItem({id: currentId, width, left, height});
                    break;
                case MouseDirection.MIDDLE_LEFT:
                    width = cachedItem.width - diff.x;
                    left = cachedItem.left + diff.x
                    if (width <= 0) {
                        break;
                    }
                    modifyItem({id: currentId, width, left});
                    break;
            }
        }


        window.addEventListener("mousemove", onMouseMove, false);
        return () => window.removeEventListener("mousemove", onMouseMove, false);
    }, [cachedItem, clientXY, currentId, modifyItem, mouseDirection]);

    // 键盘移动
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (!currentId.length) return;

            const find = itemList.find(item => item.id === currentId);
            if (!find) return;

            switch (e.key) {
                case "ArrowUp":
                    modifyItem({id: currentId, top: find.top - 1});
                    break;
                case "ArrowRight":
                    modifyItem({id: currentId, left: find.left + 1});
                    break;
                case "ArrowDown":
                    modifyItem({id: currentId, top: find.top + 1});
                    break;
                case "ArrowLeft":
                    modifyItem({id: currentId, left: find.left - 1});
                    break;
                case "Delete":
                    removeItem(currentId);
                    break;
                default:
                    return;
            }
        }

        window.addEventListener("keydown", onKeyDown, false);
        return () => window.removeEventListener("keydown", onKeyDown, false);
    }, [currentId, itemList, modifyItem, removeItem]);

    // 右键菜单
    const onContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const current = document.getElementById(currentId);
        if (!current) return;
        const target = e.target as HTMLDivElement;
        if (current.contains(target)) {
            show(e);
        }
    };

    const onMouseDown = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;
        if (target.dataset.direction) {
            e.preventDefault();
            setClientXY({
                x: e.clientX,
                y: e.clientY
            });
            setMouseDirection(target.dataset.direction as string as MouseDirection);
            const current = itemList.find(item => item.id === currentId) || null;
            setCachedItem(JSON.parse(JSON.stringify(current)));
        } else if (target.dataset.container === "true") {
            changeCurrentId("");
        }
    }

    const moveToFront = () => {
        moveItemToFront(currentId);
    }

    const moveToBack = () => {
        moveItemToBack(currentId);
    }

    const moveToLeft = () => {
        moveItemToLeft(currentId);
    }

    const moveToRight = () => {
        moveItemToRight(currentId);
    }

    const moveToCenter = () => {
        moveItemToCenter(currentId);
    }

    const moveToTop = () => {
        moveItemToTop(currentId);
    }

    const moveToMiddle = () => {
        moveItemToMiddle(currentId);
    }

    const moveToBottom = () => {
        moveItemToBottom(currentId);
    }

    const deleteItem = () => {
        removeItem(currentId);
    }

    return <>
        <div className={styles.container} ref={drop} onMouseDown={onMouseDown} onContextMenu={onContextMenu}
             data-container={true}>
            {
                itemList.map((item) => <DraggableBox {...item} key={item.id} currentId={currentId}/>)
            }
        </div>
        <Menu id={MENU_ID}>
            <Item onClick={moveToFront}>置于最前</Item>
            <Item onClick={moveToBack}>置于最后</Item>
            <Separator/>
            <Item onClick={moveToLeft}>左对齐</Item>
            <Item onClick={moveToCenter}>居中</Item>
            <Item onClick={moveToRight}>右对齐</Item>
            <Separator/>
            <Item onClick={moveToTop}>顶部</Item>
            <Item onClick={moveToMiddle}>中间</Item>
            <Item onClick={moveToBottom}>底部</Item>
            <Separator/>
            <Item onClick={deleteItem}>删除</Item>
        </Menu>
    </>;
});

export default Container;