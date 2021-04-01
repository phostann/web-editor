import {MessageType} from "../types/MessageType";
import {DragItem} from "../views/iframe/store/Store";

export interface HttpResult<T> {
    code: number;
    message: number;
    data: T;
}

export interface PageData<T> {
    page: number;
    size: number;
    total: number;
    totalPage: number;
    content: Array<T>
}

export enum AntMessageType {
    SUCCESS = "success",
    ERROR = "error",
    INFO = "info",
    WARNING = "warning",
    WARN = "warn",
    LOADING = "loading"
}

export interface SizePayload {
    width: number;
    height: number;
}

export interface ScalePayload {
    scale: number;
}

export interface ImgItemPayload {
    src: string;
}

export interface MessagePayload {
    message: string;
    type: AntMessageType;
}

export type ItemInfoInterface = DragItem | null;

export interface MessageInterface<T> {
    type: MessageType,
    data: T,
}