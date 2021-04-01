import React, {useRef} from "react";
import {Avatar, Button, Popover, Tag, Tooltip} from "antd";
import styles from "./index.module.less";
import TxtPopover from "../TxtPopover";
import {CaretDownOutlined, FontColorsOutlined, InboxOutlined, PictureOutlined, StarOutlined} from "@ant-design/icons";
import ImgPopover, {ImgPopoverHandle} from "../ImgPopover";
import ShapePopover from "../ShapePopover";
import {parentSendMessage} from "../../utils/utils";
import {MessageType} from "../../../../types/MessageType";
import {Header} from "antd/es/layout/layout";

const AppHeader = () => {

    const imgPopover = useRef<ImgPopoverHandle>(null);

    function onTxtVisibleChange(visible: boolean) {

    }

    function onTxtSelect() {
    }

    function onImgVisibleChange(visible: boolean) {
        if (!visible) {
            imgPopover.current?.exitManageMode();
        }
    }

    function onShapeVisibleChange(visible: boolean) {
    }

    function onComponentVisibleChange(visible: boolean) {
    }

    function onImgSelected(src: string) {
        imgPopover.current?.exitManageMode();
        parentSendMessage({type: MessageType.ADD_IMG_ITEM, data: {src}});
    }

    return <Header className={styles.header}>
        <Avatar
            src="https://hexo-blog-1259448770.cos.ap-guangzhou.myqcloud.com/uPic/4.jpeg"/>
        <nav className={styles.nav}>
            <Popover placement={"bottom"}
                     onVisibleChange={onTxtVisibleChange}
                     content={<TxtPopover onClose={onTxtSelect}/>}>
                <Button size={"small"}
                        type={"primary"}
                        className={styles.navBtn}
                        icon={<FontColorsOutlined/>}>
                    文字<CaretDownOutlined/>
                </Button>
                <Tooltip placement={"bottom"} title={"文字"}>
                    <Tag className={styles.navTag} color={"#438cf6"}><FontColorsOutlined/></Tag>
                </Tooltip>
            </Popover>

            <Popover placement={"bottom"}
                     onVisibleChange={onImgVisibleChange}
                     content={<ImgPopover ref={imgPopover} onSelected={onImgSelected}/>}>
                <Button size={"small"}
                        type={"primary"}
                        className={styles.navBtn}
                        icon={<PictureOutlined/>}>
                    图片<CaretDownOutlined/>
                </Button>
                <Tooltip placement={"bottom"} title={"图片"}>
                    <Tag className={styles.navTag} color={"#438cf6"}><PictureOutlined/></Tag>
                </Tooltip>
            </Popover>

            <Popover placement={"bottom"}
                     onVisibleChange={onShapeVisibleChange}
                     content={<ShapePopover/>}>
                <Button size={"small"}
                        type={"primary"}
                        className={styles.navBtn}
                        icon={<StarOutlined/>}>
                    形状<CaretDownOutlined/>
                </Button>
                <Tooltip placement={"bottom"} title={"形状"}>
                    <Tag className={styles.navTag} color={"#438cf6"}><StarOutlined/></Tag>
                </Tooltip>
            </Popover>
            <Popover placement={"bottom"}
                     onVisibleChange={onComponentVisibleChange}
                     content={<span>组件</span>}>
                <Button size={"small"}
                        type={"primary"}
                        className={styles.navBtn}
                        icon={<InboxOutlined/>}>
                    组件<CaretDownOutlined/>
                </Button>
                <Tooltip placement={"bottom"} title={"组件"}>
                    <Tag className={styles.navTag} color={"#438cf6"}><InboxOutlined/></Tag>
                </Tooltip>
            </Popover>

        </nav>

        <Button size={"small"} type={"primary"} className={styles.header_save_btn}>保存</Button>
        <Button size={"small"} type={"primary"}>预览</Button>
    </Header>
};

export default AppHeader;