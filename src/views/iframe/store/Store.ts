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

export interface Adsorption {
    left?: number;
    top?: number;
    showHorizontal?: number;
    showVertical?: number;
}

type ModifyParam = Partial<DragItem> & { id: string };

export class Store {

    itemList: DragItem[] = Array.from(new Array(10), (_, v) => ({
        id: uuidv4(),
        left: v * 4,
        top: v * 8,
        width: 0,
        height: 0,
        type: ItemTypes.IMAGE,
        src: "https://hexo-blog-1259448770.cos.ap-guangzhou.myqcloud.com/uPic/4.jpeg",
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

    adsorption: Adsorption | null = null;

    constructor() {
        makeAutoObservable(this);
        this.modifyItem = this.modifyItem.bind(this);
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
        this.changeAdsorption = this.changeAdsorption.bind(this);
    }

    private findItemById(id: string) {
        return this.itemList.find(item => item.id === id);
    }

    modifyItem(param: ModifyParam) {
        const find = this.findItemById(param.id);
        if (find) {
            Object.assign(find, param);
        }
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
    }

    moveItemToRight(id: string) {
        const find = this.findItemById(id);
        if (find && find.left !== 1920 - find.width) {
            this.modifyItem({id, left: 1920 - find.width});
        }
    }

    moveItemToCenter(id: string) {
        const find = this.findItemById(id);
        if (find && find.left !== 1920 / 2 - find.width / 2) {
            this.modifyItem({id, left: 1920 / 2 - find.width / 2});
        }
    }

    moveItemToTop(id: string) {
        const find = this.findItemById(id);
        if (find && find.top !== 0) {
            this.modifyItem({id, top: 0});
        }
    }

    moveItemToBottom(id: string) {
        const find = this.findItemById(id);
        if (find && find.top !== 1080 - find.height) {
            this.modifyItem({id, top: 1080 - find.height});
        }
    }

    moveItemToMiddle(id: string) {
        const find = this.findItemById(id);
        if (find && find.top !== 1080 / 2 - find.height / 2) {
            this.modifyItem({id, top: 1080 / 2 - find.height / 2});
        }
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
    }

    changeAdsorption(adsorption: Adsorption | null) {
        if (adsorption === null && this.adsorption === null) {
            return;
        }
        if (this.adsorption?.left !== adsorption?.left ||
            this.adsorption?.top !== adsorption?.top ||
            this.adsorption?.showHorizontal !== adsorption?.showHorizontal ||
            this.adsorption?.showVertical !== adsorption?.showVertical) {
            this.adsorption = adsorption;
        }
    }
}