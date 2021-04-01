import React, {FC, useState} from "react";
import {InputNumber, message, Popover, Select} from "antd";
import {ChromePicker, ColorResult, RGBColor} from "react-color";
import {parentSendItemInfoChangeMessage, rgb2Str} from "../../utils/utils";
import {BorderStyle, DragItem} from "../../../iframe/store/Store";
import {ITEM_LOCKED_MESSAGE} from "../../../iframe/constant/constant";
import paletteStyles from "../../styles/palette.module.less";
import styles from "./index.module.less";

const {Option} = Select;


const ImageAttrs: FC<DragItem> = (props) => {


    const [borderColorPickerVisible, setBorderColorPickerVisible] = useState(false);

    function onBorderColorChange(color: ColorResult) {
        parentSendItemInfoChangeMessage({...props, borderColor: color.rgb});
    }

    function onBorderColorPickerVisibleChange(visible: boolean) {
        if (props.locked) {
            setBorderColorPickerVisible(false);
        } else {
            setBorderColorPickerVisible(visible);
        }
    }

    const onBlurChange = (value: number) => {
        parentSendItemInfoChangeMessage({...props, blur: value, filterChanged: true});
    };

    function onBrightnessChange(value: number) {
        parentSendItemInfoChangeMessage({...props, brightness: value, filterChanged: true});
    }

    function onOpacityChange(value: number) {
        parentSendItemInfoChangeMessage({...props, opacity: value, filterChanged: true});
    }

    function onContrastChange(value: number) {
        parentSendItemInfoChangeMessage({...props, contrast: value, filterChanged: true});
    }

    function onGrayscaleChange(value: number) {
        parentSendItemInfoChangeMessage({...props, grayscale: value, filterChanged: true});
    }

    function onHueRotateChange(value: number) {
        parentSendItemInfoChangeMessage({...props, hueRotate: value, filterChanged: true});
    }

    function onSaturateChange(value: number) {
        parentSendItemInfoChangeMessage({...props, saturate: value, filterChanged: true});
    }

    function onInvertChange(value: number) {
        parentSendItemInfoChangeMessage({...props, invert: value, filterChanged: true});
    }

    function onSepiaChange(value: number) {
        parentSendItemInfoChangeMessage({...props, sepia: value, filterChanged: true});
    }

    function onRestFilter() {
        if (props.locked) {
            message.warning(ITEM_LOCKED_MESSAGE);
        } else {
            parentSendItemInfoChangeMessage({
                ...props,
                blur: 0,
                brightness: 1,
                opacity: 1,
                contrast: 1,
                grayscale: 0,
                hueRotate: 0,
                saturate: 1,
                invert: 0,
                sepia: 0,
                filterChanged: false
            });
        }
    }

    function onBorderStyleChange(value: BorderStyle) {
        parentSendItemInfoChangeMessage({...props, borderStyle: value});
    }

    function onBorderWidthChange(value: number) {
        parentSendItemInfoChangeMessage({...props, borderWidth: value});
    }

    function onBorderRadiusChange(value: number) {
        parentSendItemInfoChangeMessage({...props, borderRadius: value});
    }

    return <>
        <div className={paletteStyles.subTitle}>
            <span>滤镜</span>
            {
                props.filterChanged ?
                    <span className={styles.resetFilterBtn} onClick={onRestFilter}>重置滤镜</span> : null
            }
        </div>
        <div className={paletteStyles.row}>
            <div className={paletteStyles.rowLabel}>模糊度</div>
            <div className={paletteStyles.rowContent}>
                <InputNumber size={"small"}
                             value={props.blur}
                             min={0}
                             max={10}
                             step={0.1}
                             onChange={onBlurChange}
                             style={{width: "100%"}}
                             disabled={props.locked}/>
            </div>
        </div>
        <div className={paletteStyles.row}>
            <div className={paletteStyles.rowLabel}>亮度</div>
            <div className={paletteStyles.rowContent}>
                <InputNumber size={"small"}
                             value={props.brightness}
                             min={0}
                             max={10}
                             step={0.1}
                             onChange={onBrightnessChange}
                             style={{width: "100%"}}
                             disabled={props.locked}/>
            </div>
        </div>
        <div className={paletteStyles.row}>
            <div className={paletteStyles.rowLabel}>透明度</div>
            <div className={paletteStyles.rowContent}>
                <InputNumber size={"small"}
                             value={props.opacity}
                             min={0}
                             max={1}
                             step={0.01}
                             onChange={onOpacityChange}
                             style={{width: "100%"}}
                             disabled={props.locked}/>
            </div>
        </div>
        <div className={paletteStyles.row}>
            <div className={paletteStyles.rowLabel}>对比度</div>
            <div className={paletteStyles.rowContent}>
                <InputNumber size={"small"}
                             value={props.contrast}
                             min={0}
                             max={2}
                             step={0.01}
                             onChange={onContrastChange}
                             style={{width: "100%"}}
                             disabled={props.locked}/>
            </div>
        </div>
        <div className={paletteStyles.row}>
            <div className={paletteStyles.rowLabel}>灰度</div>
            <div className={paletteStyles.rowContent}>
                <InputNumber size={"small"}
                             value={props.grayscale}
                             min={0}
                             max={1}
                             step={0.01}
                             onChange={onGrayscaleChange}
                             style={{width: "100%"}}
                             disabled={props.locked}/>
            </div>
        </div>
        <div className={paletteStyles.row}>
            <div className={paletteStyles.rowLabel}>色相</div>
            <div className={paletteStyles.rowContent}>
                <InputNumber size={"small"}
                             value={props.hueRotate}
                             min={0}
                             max={360}
                             onChange={onHueRotateChange}
                             style={{width: "100%"}}
                             disabled={props.locked}/>
            </div>
        </div>
        <div className={paletteStyles.row}>
            <div className={paletteStyles.rowLabel}>饱和度</div>
            <div className={paletteStyles.rowContent}>
                <InputNumber size={"small"}
                             value={props.saturate}
                             min={0}
                             max={2}
                             step={0.01}
                             onChange={onSaturateChange}
                             style={{width: "100%"}}
                             disabled={props.locked}/>
            </div>
        </div>
        <div className={paletteStyles.row}>
            <div className={paletteStyles.rowLabel}>反色</div>
            <div className={paletteStyles.rowContent}>
                <InputNumber size={"small"}
                             value={props.invert}
                             min={0}
                             max={2}
                             step={0.01}
                             onChange={onInvertChange}
                             style={{width: "100%"}}
                             disabled={props.locked}/>
            </div>
        </div>
        <div className={paletteStyles.row}>
            <div className={paletteStyles.rowLabel}>褐色滤镜</div>
            <div className={paletteStyles.rowContent}>
                <InputNumber size={"small"}
                             value={props.sepia}
                             min={0}
                             max={2}
                             step={0.01}
                             onChange={onSepiaChange}
                             style={{width: "100%"}}
                             disabled={props.locked}/>
            </div>
        </div>
        <div className={paletteStyles.subTitle}>外观</div>
        <div className={paletteStyles.row}>
            <div className={paletteStyles.rowLabel}>边框颜色</div>
            <div className={`${paletteStyles.rowContent} ${paletteStyles.minimum}`}>
                <Popover
                    visible={borderColorPickerVisible}
                    onVisibleChange={onBorderColorPickerVisibleChange}
                    content={<ChromePicker color={props.borderColor}
                                           onChange={onBorderColorChange}/>}>
                    <div className={styles.borderColorShowBox}
                         style={{backgroundColor: rgb2Str(props.borderColor)}}/>
                </Popover>
            </div>
        </div>
        <div className={paletteStyles.row}>
            <div className={paletteStyles.rowLabel}>边线宽度</div>
            <div className={paletteStyles.rowContent}>
                <InputNumber size={"small"}
                             min={0 as number}
                             value={props.borderWidth}
                             style={{width: "100%"}}
                             onChange={onBorderWidthChange}
                             formatter={value => `${value}px`}
                             disabled={props.locked}
                             parser={value => value ? parseInt(value.replace("%", "")) : 0}/>
            </div>
        </div>
        <div className={paletteStyles.row}>
            <div className={paletteStyles.rowLabel}>边线类型</div>
            <div className={paletteStyles.rowContent}>
                <Select size={"small"}
                        value={props.borderStyle}
                        onChange={onBorderStyleChange}
                        style={{width: "100%"}}
                        disabled={props.locked}>
                    <Option value={BorderStyle.SOLID}>实线</Option>
                    <Option value={BorderStyle.DOUBLE}>双线</Option>
                    <Option value={BorderStyle.DOTTED}>点线</Option>
                    <Option value={BorderStyle.DASHED}>虚线</Option>
                </Select>
            </div>
        </div>
        <div className={paletteStyles.row}>
            <div className={paletteStyles.rowLabel}>圆角半径</div>
            <div className={paletteStyles.rowContent}>
                <InputNumber size={"small"}
                             min={0 as number}
                             width={100}
                             value={props.borderRadius}
                             onChange={onBorderRadiusChange}
                             style={{width: "100%"}}
                             formatter={value => `${value}px`}
                             disabled={props.locked}
                             parser={value => value ? parseInt(value.replace("%", "")) : 0}/>
            </div>
        </div>
    </>;
}

export default ImageAttrs;