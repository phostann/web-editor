import React, {FC} from "react";
import styles from "./index.module.less";
import {Button, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";

export interface ImgPopoverProps {
    onClose: () => void
}

const ImgPopover: FC<ImgPopoverProps> = ({onClose}) => {


    function onClick() {
        onClose();
    }

    return <div className={styles.container}>
        <Upload>
            <Button icon={<UploadOutlined/>} type={"primary"} size={"small"}>上传图片</Button>
        </Upload>最大多少
    </div>
};

export default ImgPopover;