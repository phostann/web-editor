import React, {FC} from "react";
import paletteStyles from "../../styles/palette.module.less";
import {DragItem} from "../../../iframe/store/Store";
import {InputNumber} from "antd";
import {parentSendItemInfoChangeMessage} from "../../utils/utils";

const ImageAppearance: FC<DragItem> = (props) => {


    function onLeftChange(value: number) {
        parentSendItemInfoChangeMessage({...props, left: value});
    }

    function onTopChange(value: number) {
        parentSendItemInfoChangeMessage({...props, top: value});
    }

    function onWidthChange(value: number) {
        parentSendItemInfoChangeMessage({...props, width: value});
    }

    function onHeightChange(value: number) {
        parentSendItemInfoChangeMessage({...props, height: value});
    }

    function onRotateChange(value: number) {
        parentSendItemInfoChangeMessage({...props, rotate: value});
    }

    return <>
        <div className={paletteStyles.subTitle}>
            <span>位置和尺寸</span>
        </div>
        <div className={paletteStyles.row}>
            <div className={paletteStyles.rowLabel}>X 坐标</div>
            <div className={paletteStyles.rowContent}>
                <InputNumber size={"small"}
                             value={props.left}
                             onChange={onLeftChange}
                             style={{width: "100%"}}
                             disabled={props.locked}/>
            </div>
        </div>
        <div className={paletteStyles.row}>
            <div className={paletteStyles.rowLabel}>Y 坐标</div>
            <div className={paletteStyles.rowContent}>
                <InputNumber size={"small"}
                             value={props.top}
                             onChange={onTopChange}
                             style={{width: "100%"}}
                             disabled={props.locked}/>
            </div>
        </div>
        <div className={paletteStyles.row}>
            <div className={paletteStyles.rowLabel}>宽度</div>
            <div className={paletteStyles.rowContent}>
                <InputNumber size={"small"}
                             value={props.width}
                             onChange={onWidthChange}
                             style={{width: "100%"}}
                             disabled={props.locked}/>
            </div>
        </div>
        <div className={paletteStyles.row}>
            <div className={paletteStyles.rowLabel}>高度</div>
            <div className={paletteStyles.rowContent}>
                <InputNumber size={"small"}
                             value={props.height}
                             onChange={onHeightChange}
                             style={{width: "100%"}}
                             disabled={props.locked}/>
            </div>
        </div>
        <div className={paletteStyles.subTitle}>
            <span>旋转</span>
        </div>
        <div className={paletteStyles.row}>
            <div className={paletteStyles.rowLabel}>角度</div>
            <div className={paletteStyles.rowContent}>
                <InputNumber size={"small"}
                             min={-360}
                             max={360}
                             value={props.rotate}
                             onChange={onRotateChange}
                             style={{width: "100%"}}
                             disabled={props.locked}/>
            </div>
        </div>
        <div className={paletteStyles.subTitle}>
            <span>背景</span>
        </div>
    </>;
};

export default ImageAppearance;