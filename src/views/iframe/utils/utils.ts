import {DragItem, SnapShot} from "../store/Store";
import {XYCoord} from "react-dnd";
import _ from "lodash";
import {ItemInfoInterface, MessageInterface} from "../../../interface";
import {MessageType} from "../../../types/MessageType";

export interface Adsorption {
    left?: number;
    top?: number;
    showHorizontal?: number;
    showVertical?: number;
}

type Utils = (snapShot: SnapShot, item: DragItem, currentOffset: XYCoord, canvasWidth: number, canvasHeight: number, threshold?: number) => Adsorption | null

export const adsorb: Utils = (snapShot, item, currentOffset, canvasWidth, canvasHeight, threshold = 3) => {
    const copy = {...currentOffset};
    const size = snapShot.rows.length;
    const diff = item.borderWidth * 2;
    const left = copy.x;
    const top = copy.y;
    const width = item.width + diff;
    const height = item.height + diff;
    const right = left + width;
    const bottom = top + height;
    const center = left + width / 2;
    const middle = top + height / 2;
    let dx = Number.MAX_VALUE;
    let dy = Number.MAX_VALUE;
    let adsorbed = false;
    const adsorption: Adsorption = {};

    // boundary
    // left
    if (Math.abs(left) <= threshold) {
        if (dx > Math.abs(left)) {
            dx = Math.abs(left);
            copy.x = 0;
            adsorption.left = copy.x;
            adsorption.showVertical = 0;
            adsorbed = true;
        }
    }

    // center
    if (Math.abs(center - canvasWidth / 2) <= threshold) {
        if (dx > Math.abs(center - canvasWidth / 2)) {
            dx = Math.abs(center - canvasWidth / 2);
            copy.x = canvasWidth / 2 - width / 2;
            adsorption.left = copy.x;
            adsorption.showVertical = canvasWidth / 2;
            adsorbed = true;
        }
    }

    // right
    if (Math.abs(right - canvasWidth) <= threshold) {
        if (dx > Math.abs(right - canvasWidth)) {
            dx = Math.abs(right - canvasWidth);
            copy.x = canvasWidth - width;
            adsorption.left = copy.x;
            adsorption.showVertical = canvasWidth - 1;
            adsorbed = true;
        }
    }
    // top
    if (Math.abs(top) <= threshold) {
        if (dy > Math.abs(top)) {
            dy = Math.abs(top);
            copy.y = 0;
            adsorption.top = copy.y;
            adsorption.showHorizontal = 0;
            adsorbed = true;
        }
    }

    // middle
    if (Math.abs(middle - canvasHeight / 2) <= threshold) {
        if (dy > Math.abs(middle - canvasHeight / 2)) {
            dy = Math.abs(middle - canvasHeight / 2);
            copy.y = canvasHeight / 2 - height / 2;
            adsorption.top = copy.y;
            adsorption.showHorizontal = canvasHeight / 2;
            adsorbed = true;
        }
    }

    // bottom
    if (Math.abs(bottom - canvasHeight) <= threshold) {
        if (dy > Math.abs(bottom - canvasHeight)) {
            dy = Math.abs(bottom - canvasHeight);
            copy.y = canvasHeight - height;
            adsorption.top = copy.y;
            adsorption.showHorizontal = canvasHeight - 1;
            adsorbed = true;
        }
    }

    // item adsorb each other
    for (let i = 0; i < size; i++) {
        const row = snapShot.rows[i];
        const column = snapShot.columns[i];
        if (column.id !== item.id) {
            // left
            if (Math.abs(left - column.left) <= threshold) {
                if (dx > Math.abs(left - column.left)) {
                    copy.x = column.left;
                    dx = Math.abs(left - column.left);
                    adsorption.left = copy.x;
                    adsorption.showVertical = column.left
                    adsorbed = true;
                }
            }
            // right
            if (Math.abs(right - column.left) <= threshold) {
                if (dx > Math.abs(right - column.left)) {
                    copy.x = column.left - width;
                    dx = Math.abs(right - column.left);
                    adsorption.left = copy.x;
                    adsorption.showVertical = column.left;
                    adsorbed = true;
                }
            }
            // center
            if (Math.abs(center - column.left) <= threshold) {
                if (dx > Math.abs(center - column.left)) {
                    copy.x = column.left - width / 2;
                    dx = Math.abs(center - column.left);
                    adsorption.left = copy.x;
                    adsorption.showVertical = column.left;
                    adsorbed = true;
                }
            }
        }

        if (row.id !== item.id) {
            // top
            if (Math.abs(top - row.top) <= threshold) {
                if (dy > Math.abs(top - row.top)) {
                    copy.y = row.top;
                    dy = Math.abs(top - row.top);
                    adsorption.top = copy.y;
                    adsorption.showHorizontal = row.top;
                    adsorbed = true;
                }
            }
            // bottom
            if (Math.abs(bottom - row.top) <= threshold) {
                if (dy > Math.abs(bottom - row.top)) {
                    copy.y = row.top - height;
                    dy = Math.abs(bottom - row.top);
                    adsorption.top = copy.y;
                    adsorption.showHorizontal = row.top;
                    adsorbed = true;
                }
            }
            // middle
            if (Math.abs(middle - row.top) <= threshold) {
                if (dy > Math.abs(middle - row.top)) {
                    copy.y = row.top - height / 2;
                    dy = Math.abs(middle - row.top);
                    adsorption.top = copy.y;
                    adsorption.showHorizontal = row.top;
                    adsorbed = true;
                }
            }
        }
    }

    return adsorbed ? adsorption : null;
};

export const adsorb_n = _.throttle<Utils>(adsorb, 16);

export function iframeSendMessage<T>(message: MessageInterface<T>) {
    window.parent.postMessage(JSON.stringify(message), "*");
}

export function iframeSendItemInfoChangeMessage(item: DragItem | null) {
    iframeSendMessage<ItemInfoInterface>({type: MessageType.CHANGE_ITEM, data: item});
}