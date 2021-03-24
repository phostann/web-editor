import {Adsorption, DragItem} from "../store/Store";
import {XYCoord} from "react-dnd";

export const adsorb = (itemList: DragItem[], item: DragItem, currentOffset: XYCoord, threshold: number = 5) => {
    const copy = {...currentOffset};
    let adsorbed = false;
    let adsorption: Adsorption = {}
    for (let i = 0; i < itemList.length; i++) {
        const _item = itemList[i];
        if (_item.id !== item.id) {
            // 左 -》 右
            if (Math.abs(copy.x - (_item.left + _item.width)) <= threshold) {
                copy.x = _item.left + _item.width;
                adsorption.left = copy.x;
                adsorption.showVertical = copy.x;
                adsorbed = true;
            }
            // 左 -》左
            else if (Math.abs(copy.x - _item.left) <= threshold) {
                copy.x = _item.left;
                adsorption.left = copy.x;
                adsorption.showVertical = copy.x;
                adsorbed = true;
            }
            // 右 -》右
            else if (Math.abs(copy.x + item.width - (_item.left + _item.width)) <= threshold) {
                copy.x = _item.left + _item.width - item.width;
                adsorption.left = copy.x;
                adsorption.showVertical = _item.left + _item.width;
                adsorbed = true;
            }
            // 右 -》 左
            else if (Math.abs(copy.x + item.width - _item.left) <= threshold) {
                copy.x = _item.left - item.width;
                adsorption.left = copy.x;
                adsorption.showVertical = _item.left;
                adsorbed = true;
            }
            // 水平中线对齐
            else if (Math.abs((copy.x + item.width / 2) - (_item.left + _item.width / 2)) <= threshold) {
                copy.x = _item.left + (_item.width - item.width) / 2;
                adsorption.left = copy.x;
                adsorption.showVertical = _item.left + _item.width / 2;
                adsorbed = true;
            }

            // 上 -》 上
            if (Math.abs(copy.y - _item.top) <= threshold) {
                copy.y = _item.top;
                adsorption.top = copy.y;
                adsorption.showHorizontal = copy.y;
                adsorbed = true;
            }
            // 上 -》 下
            else if (Math.abs(copy.y - (_item.top + _item.height)) <= threshold) {
                copy.y = _item.top + _item.height;
                adsorption.top = copy.y;
                adsorption.showHorizontal = copy.y;
                adsorbed = true;
            }
            // 下 -》 上
            else if (Math.abs(copy.y + item.height - _item.top) <= threshold) {
                copy.y = _item.top - item.height;
                adsorption.top = copy.y;
                adsorption.showHorizontal = _item.top;
                adsorbed = true;
            }
            // 下 -》 下
            else if (Math.abs(copy.y + item.height - (_item.top + _item.height)) <= threshold) {
                copy.y = _item.top + _item.height - item.height;
                adsorption.top = copy.y;
                adsorption.showHorizontal = _item.top + _item.height;
                adsorbed = true;
            }
            // 垂直中线对齐
            else if (Math.abs(copy.y + item.height / 2 - (_item.top + _item.height / 2)) <= threshold) {
                copy.y = _item.top + (_item.height - item.height) / 2;
                adsorption.top = copy.y;
                adsorption.showHorizontal = _item.top + _item.height / 2;
                adsorbed = true;
            }

            if (adsorbed) {
                break;
            }
        }
    }
    return adsorbed ? adsorption : null;
}