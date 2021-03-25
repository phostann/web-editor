import {makeAutoObservable} from "mobx"
import {ItemTypes} from "../types/ItemTypes";
import {v4 as uuidv4} from 'uuid';

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
}


type ModifyParam = Partial<DragItem> & { id: string };

export interface SnapShot {
    columns: { id: string, left: number; }[];
    rows: { id: string, top: number; }[];
}

export class Store {

    itemList: DragItem[] = Array.from(new Array(100), (_, v) => ({
        id: uuidv4(),
        left: v * 4,
        top: 0,
        width: 0,
        height: 0,
        type: ItemTypes.IMAGE,
        src: "https://hexo-blog-1259448770.cos.ap-guangzhou.myqcloud.com/uPic/2.jpeg",
        text: "",
        fontSize: 12,
        name: "",
        zIndex: v
    }));


    // itemList: DragItem[] = [
    //     {
    //         id: uuidv4(),
    //         left: 0,
    //         top: 0,
    //         width: 0,
    //         height: 0,
    //         type: ItemTypes.IMAGE,
    //         src: "https://hexo-blog-1259448770.cos.ap-guangzhou.myqcloud.com/uPic/1.jpeg",
    //         text: "",
    //         fontSize: 12,
    //         name: "",
    //         zIndex: 0
    //     },
    //     {
    //         id: uuidv4(),
    //         left: 0,
    //         top: 0,
    //         width: 0,
    //         height: 0,
    //         type: ItemTypes.IMAGE,
    //         src: "https://hexo-blog-1259448770.cos.ap-guangzhou.myqcloud.com/uPic/2.jpeg",
    //         text: "",
    //         fontSize: 12,
    //         name: "",
    //         zIndex: 1
    //     },
    //     {
    //         id: uuidv4(),
    //         left: 0,
    //         top: 0,
    //         width: 0,
    //         height: 0,
    //         type: ItemTypes.IMAGE,
    //         src: "https://hexo-blog-1259448770.cos.ap-guangzhou.myqcloud.com/uPic/3.jpeg",
    //         text: "",
    //         fontSize: 12,
    //         name: "",
    //         zIndex: 2
    //     },
    //     {
    //         id: uuidv4(),
    //         left: 0,
    //         top: 0,
    //         width: 0,
    //         height: 0,
    //         type: ItemTypes.IMAGE,
    //         src: "https://hexo-blog-1259448770.cos.ap-guangzhou.myqcloud.com/uPic/4.jpeg",
    //         text: "",
    //         fontSize: 12,
    //         name: "",
    //         zIndex: 3
    //     }
    // ];

    scale = 1;

    currentId = "";

    snapShot: SnapShot = {rows: [], columns: []};

    constructor() {
        makeAutoObservable(this);
        this.modifyItem = this.modifyItem.bind(this);
        this.layoutItem = this.layoutItem.bind(this);
        this.resizeItem = this.resizeItem.bind(this);
        this.changeScale = this.changeScale.bind(this);
        this.changeCurrentId = this.changeCurrentId.bind(this);
        this.moveItemToFront = this.moveItemToFront.bind(this);
        this.moveItemToBack = this.moveItemToBack.bind(this);
        this.moveItemToLeft = this.moveItemToLeft.bind(this);
        this.moveItemToRight = this.moveItemToRight.bind(this);
        this.moveItemToCenter = this.moveItemToCenter.bind(this);
        this.moveItemToTop = this.moveItemToTop.bind(this);
        this.moveItemToBottom = this.moveItemToBottom.bind(this);
        this.moveItemToMiddle = this.moveItemToMiddle.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.stepToLeft = this.stepToLeft.bind(this);
        this.stepToUp = this.stepToUp.bind(this);
        this.stepToRight = this.stepToRight.bind(this);
        this.stepToDown = this.stepToDown.bind(this);
        this.moveItem = this.moveItem.bind(this);
    }

    private findItemById(id: string) {
        return this.itemList.find(item => item.id === id);
    }

    private generateSnapShot() {
        const snapShop: SnapShot = {rows: [], columns: []};
        this.itemList.forEach(({id, left, width, top, height}) => {
            snapShop.columns.push({id, left});
            snapShop.columns.push({id, left: left + width});
            snapShop.columns.push({id, left: left + width / 2});
            snapShop.rows.push({id, top});
            snapShop.rows.push({id, top: top + height});
            snapShop.rows.push({id, top: top + height / 2});
        });
        this.snapShot = snapShop;
    }

    modifyItem(param: ModifyParam) {
        const find = this.findItemById(param.id);
        if (find) {
            Object.assign(find, param);
        }
    }

    layoutItem(id: string, width: number, height: number) {
        this.modifyItem({id, width, height});
        this.generateSnapShot();
    }

    resizeItem(param: ModifyParam) {
        this.modifyItem(param);
        this.generateSnapShot();
    }

    moveItem(param: ModifyParam) {
        this.modifyItem(param);
        this.generateSnapShot();
    }

    changeScale(param: number) {
        this.scale = param;
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
    }

    moveItemToLeft(id: string) {
        const find = this.findItemById(id);
        if (find && find.left !== 0) {
            this.modifyItem({id, left: 0});
        }
        this.generateSnapShot();
    }

    moveItemToRight(id: string) {
        const find = this.findItemById(id);
        if (find && find.left !== 1920 - find.width) {
            this.modifyItem({id, left: 1920 - find.width});
        }
        this.generateSnapShot();
    }

    moveItemToCenter(id: string) {
        const find = this.findItemById(id);
        if (find && find.left !== 1920 / 2 - find.width / 2) {
            this.modifyItem({id, left: 1920 / 2 - find.width / 2});
        }
        this.generateSnapShot();
    }

    moveItemToTop(id: string) {
        const find = this.findItemById(id);
        if (find && find.top !== 0) {
            this.modifyItem({id, top: 0});
        }
        this.generateSnapShot();
    }

    moveItemToBottom(id: string) {
        const find = this.findItemById(id);
        if (find && find.top !== 1080 - find.height) {
            this.modifyItem({id, top: 1080 - find.height});
        }
        this.generateSnapShot();
    }

    moveItemToMiddle(id: string) {
        const find = this.findItemById(id);
        if (find && find.top !== 1080 / 2 - find.height / 2) {
            this.modifyItem({id, top: 1080 / 2 - find.height / 2});
        }
        this.generateSnapShot();
    }

    stepToLeft(id: string) {
        const find = this.itemList.find(item => item.id === id);
        if (find) {
            this.modifyItem({id, left: find.left - 1});
        }
        this.generateSnapShot();
    }

    stepToUp(id: string) {
        const find = this.itemList.find(item => item.id === id);
        if (find) {
            this.modifyItem({id, top: find.top - 1});
        }
        this.generateSnapShot();
    }

    stepToRight(id: string) {
        const find = this.itemList.find(item => item.id === id);
        if (find) {
            this.modifyItem({id, left: find.left + 1});
        }
        this.generateSnapShot();
    }

    stepToDown(id: string) {
        const find = this.itemList.find(item => item.id === id);
        if (find) {
            this.modifyItem({id, top: find.top + 1});
        }
        this.generateSnapShot();
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
    }
}