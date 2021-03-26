import React, {useState} from 'react';
import {Avatar, Button, Layout, Popover} from "antd";
import {CaretDownOutlined, FontColorsOutlined, PictureOutlined, StarOutlined} from "@ant-design/icons";
import styles from "./app.module.less";
import TxtPopover from "./components/TxtPopover";
import ImgPopover from "./components/ImgPopover";

const {Header} = Layout;

function App() {

    const [txtVisible, setTxtVisible] = useState(false);
    const [imgVisible, setImgVisible] = useState(false);

    function onTxtVisibleChange(visible: boolean) {
        setTxtVisible(visible);
    }

    function onTxtSelect() {
        setTxtVisible(false);
    }

    function onImgVisibleChange(visible: boolean) {
        setImgVisible(visible);
    }

    function onImgSelect() {
        setImgVisible(false);
    }

    return <Layout className={styles.container}>
        <Header className={styles.header}>
            <Avatar
                src="https://hexo-blog-1259448770.cos.ap-guangzhou.myqcloud.com/uPic/4.jpeg"/>
            <nav className={styles.nav}>
                <Popover placement={"bottom"}
                         trigger={"click"}
                         visible={txtVisible}
                         onVisibleChange={onTxtVisibleChange}
                         content={<TxtPopover onClose={onTxtSelect}/>}>
                    <Button size={"small"}
                            type={"primary"}
                            className={styles.nav_text_btn}
                            icon={<FontColorsOutlined/>}>
                        文字<CaretDownOutlined/>
                    </Button>
                </Popover>

                <Popover placement={"bottom"}
                         trigger={"click"}
                         visible={imgVisible}
                         onVisibleChange={onImgVisibleChange}
                         content={<ImgPopover onClose={onImgSelect}/>}>
                    <Button size={"small"}
                            type={"primary"}
                            className={styles.nav_img_btn}
                            icon={<PictureOutlined/>}>
                        图片<CaretDownOutlined/></Button>
                </Popover>

                <Button size={"small"}
                        type={"primary"}
                        icon={<StarOutlined/>}>
                    形状<CaretDownOutlined/>
                </Button>
            </nav>
            <Button size={"small"} type={"primary"} className={styles.header_save_btn}>保存</Button>
            <Button size={"small"} type={"primary"}>预览</Button>
        </Header>
    </Layout>;
}

export default App;
