import React, {CSSProperties, useEffect, useState} from "react";
import {parentSendMessage} from "../../utils/utils";
import {MessageType} from "../../../../types/MessageType";
import styles from "./index.module.less";
import {InputNumber, message, Tabs} from "antd";
import {ItemInfoInterface, MessageInterface, MessagePayload, ScalePayload, SizePayload} from "../../../../interface";
import {Content} from "antd/es/layout/layout";
import {DragItem} from "../../../iframe/store/Store";
import {NotificationOutlined} from "@ant-design/icons";
import ImageAttrs from "../ImageAttrs";
import ImageAppearance from "../ImageAppearance";

const {TabPane} = Tabs;

type CanvasProps = {
    width: number;
    height: number;
};

const getIframeContainerStyle = (canvasProps: CanvasProps, scale: number): CSSProperties => {
    return {
        width: Math.round(canvasProps.width * (parseFloat((scale / 100).toFixed(2)))),
        height: Math.round(canvasProps.height * (parseFloat((scale / 100).toFixed(2)))),
        overflow: "hidden"
    };
}

const getIframeStyle = (canvasProps: CanvasProps, scale: number): CSSProperties => {
    const transform = `scale(${parseFloat((scale / 100).toFixed(2))}) translateZ(0)`;
    return {
        width: canvasProps.width,
        height: canvasProps.height,
        transformOrigin: "left top",
        transform,
        WebkitTransform: transform,
        overflow: "hidden"
    }
};

const AppContent = () => {

    const [scale, setScale] = useState(100);
    const [canvasProps, setCanvasProps] = useState<CanvasProps>({width: 1920, height: 1080});
    const [item, setItem] = useState<DragItem | null>(null);

    function onCanvasWidthChange(value: number) {
        parentSendMessage<SizePayload>({
            type: MessageType.CHANGE_SIZE,
            data: {width: value, height: canvasProps.height}
        });
        setCanvasProps(prevState => {
            return {
                ...prevState,
                width: value
            }
        });
    }

    function onCanvasHeightChange(value: number) {
        parentSendMessage<SizePayload>({
            type: MessageType.CHANGE_SIZE,
            data: {width: canvasProps.width, height: value}
        });
        setCanvasProps(prevState => {
            return {
                ...prevState,
                height: value
            }
        });
    }

    function onScaleChange(value: number) {
        setScale(value);
        parentSendMessage<ScalePayload>({type: MessageType.CHANGE_SCALE, data: {scale: value}});
    }


    useEffect(() => {

        const resize = () => {
            const editor = document.querySelector(`.${styles.editorWrapper}`) as HTMLDivElement | null;
            if (editor) {
                const {offsetWidth} = editor;
                if (canvasProps.width <= offsetWidth) {
                    setScale(100);
                    parentSendMessage<ScalePayload>({type: MessageType.CHANGE_SCALE, data: {scale: 100}});
                } else {
                    const _scale = offsetWidth / canvasProps.width * 100 | 0
                    setScale(_scale);
                    parentSendMessage<ScalePayload>({type: MessageType.CHANGE_SCALE, data: {scale: _scale}});
                }
            }
        }

        resize();

        window.addEventListener("resize", resize, false);
        return () => window.removeEventListener("resize", resize, false);
    }, [canvasProps]);


    useEffect(() => {
        const editor = document.querySelector(`.${styles.editorWrapper}`) as HTMLDivElement | null;
        if (editor) {
            let {offsetWidth} = editor;
            if (canvasProps.width <= offsetWidth) {
                setScale(100);
            } else {
                setScale(offsetWidth / canvasProps.width * 100 | 0);
            }
        }
        // global message config
        message.config({maxCount: 1, duration: 1});
    }, []);

    useEffect(() => {
        const iframe = document.getElementById("iframe-editor");
        if (iframe) {
            iframe.onload = () => {
                parentSendMessage<ScalePayload>({type: MessageType.CHANGE_SCALE, data: {scale}});
            }
        }
    }, [scale]);

    useEffect(() => {
        const onMessage = (e: MessageEvent) => {
            if (typeof e.data === "string") {
                const msg = JSON.parse(e.data) as MessageInterface<any>;
                switch (msg.type) {
                    case MessageType.SHOW_MESSAGE: {
                        const data = msg.data as MessagePayload;
                        message[data.type](data.message);
                        break;
                    }
                    case MessageType.CHANGE_ITEM: {
                        const data = msg.data as ItemInfoInterface;
                        setItem(data);
                        break;
                    }
                    default:
                        return;
                }
            }
        }

        window.addEventListener("message", onMessage, false);
        return () => window.removeEventListener("message", onMessage, false);
    }, []);

    return <Content className={styles.content}>
        <div className={styles.editorContainer}>
            <div className={styles.editorWrapper}>
                <div className={styles.editorBox}>
                    <div style={getIframeContainerStyle(canvasProps, scale)}>
                        <iframe id="iframe-editor" title="iframe-editor"
                                src={"/iframe.html"}
                                style={getIframeStyle(canvasProps, scale)}
                                frameBorder={0}/>
                    </div>

                </div>
            </div>
            <div className={styles.canvasController}>
                <span>画布大小：</span>
                <InputNumber size={"small"}
                             min={0}
                             style={{width: 80}}
                             value={canvasProps.width}
                             onChange={onCanvasWidthChange}/>
                <span>*</span>
                <InputNumber size={"small"}
                             min={0}
                             style={{width: 80}}
                             value={canvasProps.height}
                             onChange={onCanvasHeightChange}/>
                <span>缩放：</span>
                <InputNumber size={"small"}
                             min={0 as number}
                             style={{width: 80}}
                             max={100 as number}
                             value={scale}
                             formatter={value => `${value}%`}
                             parser={value => value ? parseInt(value.replace("%", "")) : 0}
                             onChange={onScaleChange}
                />
            </div>
        </div>
        <div className={styles.palette}>
            <Tabs defaultActiveKey="1" className={styles.tabsContainer}>
                <TabPane tab="编辑" key="1" className={styles.tabsPanel}>
                    {
                        item ? <ImageAttrs {...item}/> : <>
                            <NotificationOutlined className={styles.noItemTipIcon}/>
                            <span className={styles.noItemTipTxt}>选择组件进行编辑</span>
                        </>
                    }
                </TabPane>
                <TabPane tab="外观" key="2" className={styles.tabsPanel}>
                    {
                        item ? <ImageAppearance{...item}/> :
                            <>
                                <NotificationOutlined className={styles.noItemTipIcon}/>
                                <span className={styles.noItemTipTxt}>选择组件进行编辑</span>
                            </>
                    }
                </TabPane>
            </Tabs>
        </div>
    </Content>
};

export default AppContent;