import {DragItem, SnapShot} from "../store/Store";
import {XYCoord} from "react-dnd";
import _ from "lodash";

export interface Adsorption {
    left?: number;
    top?: number;
    showHorizontal?: number;
    showVertical?: number;
}

type Adsorb = (snapShot: SnapShot, item: DragItem, currentOffset: XYCoord, threshold?: number) => Adsorption | null

export const adsorb: Adsorb = (snapShot, item, currentOffset, threshold = 3) => {
    const copy = {...currentOffset};
    const size = snapShot.rows.length;
    const left = copy.x;
    const top = copy.y;
    const width = item.width;
    const height = item.height;
    const right = left + width;
    const bottom = top + height;
    const center = left + width / 2;
    const middle = top + height / 2;
    let dx = Number.MAX_VALUE;
    let dy = Number.MAX_VALUE;
    let adsorbed = false;
    const adsorption: Adsorption = {};
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

export const adsorb_n = _.throttle<Adsorb>(adsorb, 16);