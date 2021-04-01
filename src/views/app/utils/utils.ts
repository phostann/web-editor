import {ItemInfoInterface, MessageInterface} from "../../../interface";
import {RGBColor} from "react-color";
import {DragItem} from "../../iframe/store/Store";
import {MessageType} from "../../../types/MessageType";

export function parentSendMessage<T>(message: MessageInterface<T>) {
    const iframe = document.getElementById("iframe-editor") as HTMLIFrameElement | null;
    if (iframe) {
        iframe.contentWindow?.postMessage(JSON.stringify(message), "*");
    }
}

export function parentSendItemInfoChangeMessage(item: DragItem | null) {
    parentSendMessage<ItemInfoInterface>({type: MessageType.CHANGE_ITEM, data: item});
}

export function rgb2Str(color: RGBColor) {
    return `rgba(${color.r},${color.g},${color.b}, ${color.a})`;
}