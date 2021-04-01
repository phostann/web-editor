import {makeAutoObservable} from "mobx"
import {ItemTypes} from "../types/ItemTypes";
import {v4 as uuidv4} from 'uuid';
import {RGBColor} from "react-color";

export enum BorderStyle {
    SOLID = "solid",
    DOUBLE = "double",
    DOTTED = "dotted",
    DASHED = "dashed",
}

export interface DragItem {
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
    type: ItemTypes;
    src: string;
    text: string;
    fontSize: number;
    name: string;
    zIndex: number;
    blur: number; // 模糊度
    brightness: number; // 亮度
    opacity: number; // 透明度
    contrast: number; // 对比度
    grayscale: number; // 灰度
    hueRotate: number; // 色相旋转
    saturate: number; // 饱和度
    invert: number; // 反色
    sepia: number; // 褐色滤镜
    filterChanged: boolean; // 滤镜有没有被修改过
    locked: boolean;
    borderColor: RGBColor;
    borderWidth: number;
    borderStyle: BorderStyle;
    borderRadius: number;
    rotate: number;
}

type ModifyParam = Partial<DragItem> & { id: string };

export interface SnapShot {
    columns: { id: string, left: number; }[];
    rows: { id: string, top: number; }[];
}

export class Store {

    itemList: DragItem[] = [];

    canvasWidth = 1920;

    canvasHeight = 1080;

    currentId = "";

    snapShot: SnapShot = {rows: [], columns: []};

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    findItemById(id: string) {
        return this.itemList.find(item => item.id === id);
    }

    private generateSnapShot() {
        const snapShop: SnapShot = {rows: [], columns: []};
        this.itemList.forEach(({id, left, width, top, height, borderWidth}) => {
            snapShop.columns.push({id, left});
            snapShop.columns.push({id, left: left + width + borderWidth * 2});
            snapShop.columns.push({id, left: left + (width + borderWidth * 2) / 2});
            snapShop.rows.push({id, top});
            snapShop.rows.push({id, top: top + height + borderWidth * 2});
            snapShop.rows.push({id, top: top + (height + borderWidth * 2) / 2});
        });
        this.snapShot = snapShop;
    }

    changeWidth(width: number) {
        this.canvasWidth = width;
    }

    changeHeight(height: number) {
        this.canvasHeight = height;
    }

    modifyItem(param: ModifyParam) {
        const find = this.findItemById(param.id) || null;
        if (find) {
            Object.assign(find, param);
        }
        return find;
    }

    layoutItem(id: string, width: number, height: number) {
        this.modifyItem({id, width, height});
        this.generateSnapShot();
    }

    resizeItem(param: ModifyParam) {
        const res = this.modifyItem(param);
        res && this.generateSnapShot();
        return res;
    }

    moveItem(param: ModifyParam) {
        const res = this.modifyItem(param);
        res && this.generateSnapShot();
        return res;
    }

    changeCurrentId(param: string) {
        this.currentId = param;
    }

    moveItemToFront(id: string) {
        const find = this.findItemById(id);
        if (find && find.zIndex !== this.itemList.length - 1) {
            this.itemList.forEach(item => {
                if (item.zIndex > find.zIndex) {
                    item.zIndex--;
                }
            });
            find.zIndex = this.itemList.length - 1;
        }
        return find;
    }

    moveItemToBack(id: string) {
        const find = this.findItemById(id);
        if (find && find.zIndex !== 0) {
            this.itemList.forEach(item => {
                if (item.zIndex < find.zIndex) {
                    item.zIndex++;
                }
            });
            find.zIndex = 0;
        }
        return find;
    }

    moveItemToLeft(id: string) {
        const find = this.findItemById(id);
        let res: DragItem | null = null;
        if (find && find.left !== 0) {
            res = this.modifyItem({id, left: 0});
        }
        res && this.generateSnapShot();
        return res;
    }

    moveItemToRight(id: string) {
        const find = this.findItemById(id);
        let res: DragItem | null = null;
        if (find) {
            const left = Math.round(this.canvasWidth - (find.width + find.borderWidth * 2));
            if (find.left !== left) {
                res = this.modifyItem({id, left});
            }
        }
        res && this.generateSnapShot();
        return res;
    }

    moveItemToCenter(id: string) {
        const find = this.findItemById(id);
        let res: DragItem | null = null;
        if (find) {
            const left = Math.round(this.canvasWidth / 2 - (find.width + find.borderWidth * 2) / 2);
            if (find.left !== left) {
                res = this.modifyItem({id, left});
            }
        }
        res && this.generateSnapShot();
        return res;
    }

    moveItemToTop(id: string) {
        const find = this.findItemById(id);
        let res: DragItem | null = null;
        if (find && find.top !== 0) {
            res = this.modifyItem({id, top: 0});
        }
        res && this.generateSnapShot();
        return res;
    }

    moveItemToBottom(id: string) {
        const find = this.findItemById(id);
        let res: DragItem | null = null;
        if (find) {
            const top = Math.round(this.canvasHeight - (find.height + find.borderWidth * 2));
            if (find.top !== top) {
                res = this.modifyItem({id, top});
            }
        }
        res && this.generateSnapShot();
        return res;
    }

    moveItemToMiddle(id: string) {
        const find = this.findItemById(id);
        let res: DragItem | null = null;
        if (find) {
            const top = Math.round(this.canvasHeight / 2 - (find.height + find.borderWidth * 2) / 2);
            res = this.modifyItem({id, top});
        }
        res && this.generateSnapShot();
        return res;
    }

    lockItem(id: string, locked: boolean) {
        return this.modifyItem({id, locked});
    }

    stepToLeft(id: string) {
        const find = this.itemList.find(item => item.id === id);
        let res: DragItem | null = null;
        if (find) {
            res = this.modifyItem({id, left: find.left - 1});
        }
        res && this.generateSnapShot();
        return res;
    }

    stepToUp(id: string) {
        const find = this.itemList.find(item => item.id === id);
        let res: DragItem | null = null;
        if (find) {
            res = this.modifyItem({id, top: find.top - 1});
        }
        res && this.generateSnapShot();
        return res;
    }

    stepToRight(id: string) {
        const find = this.itemList.find(item => item.id === id);
        let res: DragItem | null = null;
        if (find) {
            res = this.modifyItem({id, left: find.left + 1});
        }
        res && this.generateSnapShot();
        return res;
    }

    stepToDown(id: string) {
        const find = this.itemList.find(item => item.id === id);
        let res: DragItem | null = null;
        if (find) {
            res = this.modifyItem({id, top: find.top + 1});
        }
        res && this.generateSnapShot();
        return res;
    }

    removeItem(id: string) {
        const findIndex = this.itemList.findIndex(item => item.id === id);
        if (findIndex !== -1) {
            const find = this.itemList[findIndex];
            this.itemList.forEach(item => {
                if (item.zIndex > find.zIndex) {
                    item.zIndex--;
                }
            });
            this.itemList.splice(findIndex, 1);
        }
        this.generateSnapShot();
        return null;
    }

    addImgItem(src: string) {
        const zIndex = this.itemList.length;
        this.itemList.push({
            id: uuidv4(),
            left: 0,
            top: 0,
            width: 0,
            height: 0,
            type: ItemTypes.IMAGE,
            text: "",
            fontSize: 13,
            name: "",
            locked: false,
            blur: 0, // 模糊度 px
            brightness: 1, // 亮度
            opacity: 1, // 透明度
            contrast: 1, // 对比度
            grayscale: 0, // 灰度
            hueRotate: 0, // 色相旋转 deg
            saturate: 1, // 饱和度
            invert: 0, // 反色
            sepia: 0, // 褐色滤镜,
            filterChanged: false,
            borderColor: {r: 0, g: 0, b: 0, a: 1},
            borderWidth: 0,
            borderStyle: BorderStyle.SOLID,
            borderRadius: 0,
            rotate: 0,
            src,
            zIndex
        });
    }
}