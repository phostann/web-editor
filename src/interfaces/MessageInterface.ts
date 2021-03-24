import {MessageType} from "../types/MessageType";

export interface MessageInterface {
    type: MessageType,
    data: any,
}