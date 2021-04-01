import React, {
    ChangeEvent,
    forwardRef,
    ForwardRefRenderFunction,
    useCallback,
    useEffect,
    useImperativeHandle,
    useState
} from "react";
import {Button, Divider, Input, message, Modal, Pagination, Popconfirm, Upload} from "antd";
import {CheckCircleFilled, CloseCircleOutlined, DeleteOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons";
import {RcFile} from "antd/lib/upload";
import {request} from "../../../../utils/request";
import bgImg from "../../../../assets/images/transparenta-background.png";
import {HttpResult, PageData} from "../../../../interface";
import axios from "axios";
import styles from "./index.module.less";
import {BASE_URL} from "../../../../confit";

export interface ImgPopoverProps {
    onSelected: (srs: string) => void
}

type ImgFile = {
    id: number;
    fileName: string;
    path: string;
}

type Group = {
    id: number;
    name: string;
}

export type ImgPopoverHandle = {
    exitManageMode: () => void
}

const ImgPopover: ForwardRefRenderFunction<ImgPopoverHandle, ImgPopoverProps> = ({onSelected}, ref) => {

    const [uploading, setUploading] = useState(false);

    const [imgFileList, setImgFileList] = useState<ImgFile[]>([]);

    const [total, setTotal] = useState(0);

    const [current, setCurrent] = useState(1);

    const [groupList, setGroupList] = useState<Group[]>([]);

    const [groupId, setGroupId] = useState<number | undefined>(undefined)

    const [showModal, setShowModal] = useState(false);

    const [groupValue, setGroupValue] = useState<string>("");

    const [manage, setManage] = useState(false);

    const [selectedImgIds, setSelectedImgIds] = useState<Set<number>>(new Set());

    const [showMoveMenu, setShowMoveMenu] = useState(false);

    const queryImgList = useCallback((current: number, groupId: number | undefined = undefined) => {
        request.get<HttpResult<PageData<ImgFile>>>("/file/query-by-page-and-group-id",
            {params: {page: current - 1, size: 10, groupId}}).then(res => {
            setImgFileList(res.data.data.content);
            setTotal(res.data.data.total);
        });
    }, []);

    const queryGroupList = useCallback(() => {
        request.get<HttpResult<Group[]>>("/group/query-all")
            .then(res => {
                setGroupList(res.data.data)
            });
    }, []);

    async function beforeUpload(file: RcFile) {
        const formData = new FormData();
        formData.append("file", file);
        if (groupId) {
            formData.append("groupId", groupId + "")
        }
        setUploading(true);
        try {
            await request.post("/file/upload", formData);
            message.success("上传成功");
            queryImgList(current, groupId);
        } catch (e) {
            console.error(e.message)
        } finally {
            setUploading(false);
        }
        return false;
    }

    function onPageChange(page: number) {
        queryImgList(page, groupId);
        setCurrent(page);
    }

    function onGroupChange(groupId: number | undefined) {
        setCurrent(1);
        queryImgList(1, groupId);
        setGroupId(groupId);
    }

    function onGroupValueChange(e: ChangeEvent<HTMLInputElement>) {
        setGroupValue(e.target.value);
    }

    function onModalOk() {
        if (groupValue.length) {
            axios.post("/group/add", {name: groupValue})
                .then(() => {
                    queryGroupList();
                }).finally(() => {
                setGroupValue("");
                setShowModal(false);
            });
        }
    }

    function onModalCancel() {
        setGroupValue("");
        setShowModal(false);
    }

    function onManageClick() {
        if (manage) {
            setSelectedImgIds(new Set());
        }
        setManage(!manage);
    }

    async function onDeleteGroup(groupId: number) {
        try {
            await request.delete("/file/delete-by-group-id", {params: {groupId}});
            await request.delete("/group/delete-by-id", {params: {id: groupId}});
            setGroupId(undefined)
            setCurrent(1);
            queryGroupList();
            queryImgList(1, undefined);
        } catch (e) {
            console.error(e.message);
        }
    }

    function onCheckBoxClick(id: number) {
        setSelectedImgIds(prevState => {
            const set = new Set(prevState);
            if (set.has(id)) {
                set.delete(id)
            } else {
                set.add(id);
            }
            return set;
        })
    }

    function isChecked(id: number) {
        return selectedImgIds.has(id);
    }

    function onMoveMenuClick() {
        setShowMoveMenu(!showMoveMenu)
    }

    useEffect(() => {
        queryImgList(current);
        queryGroupList();
    }, []);

    useEffect(() => {
        const onClick = (e: MouseEvent) => {
            const dom = e.target as HTMLElement;
            const moveMenu = document.querySelector(`.${styles.moveMenu}`);
            if (!moveMenu?.contains(dom) && showMoveMenu) {
                setShowMoveMenu(false);
            }
        };

        window.addEventListener("click", onClick, false);
        return () => window.removeEventListener("click", onClick, false);
    }, [showMoveMenu]);


    useImperativeHandle(ref, () => ({
        exitManageMode: () => {
            setManage(false);
            setSelectedImgIds(new Set());
            setTimeout(() => {
                queryImgList(1, undefined);
                setGroupId(undefined);
                setCurrent(1);
            }, 200);
        }
    }));

    function onMoveToGroup(_groupId: number) {
        if (selectedImgIds.size) {
            axios.put("/file/move-to-group", {imgIds: Array.from(selectedImgIds), groupId: _groupId})
                .then(() => {
                    message.success("添加到分组成功");
                    queryImgList(current, groupId);
                    setSelectedImgIds(new Set());
                })
                .catch(e => {
                    console.log(e.message);
                });
        }

    }

    function onDeleteImages() {
        if (selectedImgIds.size) {
            axios.delete("/file/delete-by-ids", {params: {ids: Array.from(selectedImgIds).join(",")}})
                .then(() => {
                    message.success("图片删除成功");
                    queryImgList(1, groupId);
                    setCurrent(1);
                    setSelectedImgIds(new Set());
                })
        }
    }

    return <div className={styles.container}>
        <div className={styles.uploadContainer}>
            <Upload fileList={[]}
                    accept={"image/*"}
                    disabled={uploading}
                    beforeUpload={beforeUpload}>
                <Button icon={<UploadOutlined/>} type={"primary"} size={"small"}>上传图片</Button>
            </Upload>
            <span className={styles.tip}>最大2M（.jpg / .png / .gif）</span>
            <div className={styles.toolBox}>
                <span onClick={() => setShowModal(true)}><PlusOutlined style={{fontSize: 14}}/>添加分组</span>
                <span onClick={onManageClick}>{!manage ? "管理" : "取消"}</span>
            </div>
        </div>
        <Divider className={styles.divider}/>
        <div className={styles.groupContainer}>
            <a href="javascript:;"
               className={`${styles.group} ${groupId === undefined ? styles.groupActive : ""}`}
               onClick={() => onGroupChange(undefined)}>全部图片</a>
            {
                groupList.map(group => <React.Fragment key={group.id}>
                    <Divider className={styles.groupDivider} type={"vertical"}/>
                    <a href="javascript:;"
                       className={`${styles.group} ${groupId === group.id ? styles.groupActive : ""}`}
                       onClick={() => onGroupChange(group.id)}>{group.name}</a>
                    {manage ? <Popconfirm title={"删除后图片也会被同时删除"}
                                          okText={"确定"}
                                          cancelText={"取消"}
                                          onConfirm={() => onDeleteGroup(group.id)}>
                        <CloseCircleOutlined className={styles.groupCloseIcon}/>
                    </Popconfirm> : null}
                </React.Fragment>)
            }
        </div>
        {
            manage ? <div className={styles.actionBox}>
                <span onClick={onMoveMenuClick}>
                    添加到..
                    {
                        showMoveMenu ? <ul className={styles.moveMenu}>
                            {groupList.map(group => <li key={group.id} onClick={() => onMoveToGroup(group.id)}>
                                <a href="javascript:;">{group.name}</a>
                            </li>)}
                        </ul> : null
                    }
                </span>
                <span onClick={onDeleteImages}><DeleteOutlined style={{marginRight: 0}}/>删除</span>
            </div> : null
        }
        <div className={styles.imgList}>
            {
                imgFileList.map(img => <div className={styles.itemItemContainer} key={img.id}
                                            onClick={() => !manage && onSelected(`${BASE_URL}/${img.path}`)}>
                    <a href="javascript:;" className={styles.imgItem}>
                        <img className={styles.img} src={`${BASE_URL}/${img.path}`}
                             style={{backgroundImage: `url("${bgImg}")`}} alt={"#"}/>
                    </a>
                    {
                        manage ? <div className={styles.imgItemMask} onClick={() => onCheckBoxClick(img.id)}>
                            <CheckCircleFilled
                                className={`${styles.maskCheckBox} ${isChecked(img.id) ? styles.checked : ""}`}/>
                        </div> : null
                    }
                </div>)
            }
        </div>
        <div className={`${styles.paginationContainer} ${!total ? styles.hide : ""}`}>
            <Pagination total={total} size={"small"} pageSize={10} current={current} onChange={onPageChange}/>
        </div>
        <Modal title={"请输入分组名称"}
               okText={"确定"}
               cancelText={"取消"}
               visible={showModal}
               width={400}
               onCancel={onModalCancel}
               onOk={onModalOk}>
            <Input placeholder={"如：人物"} value={groupValue} style={{fontSize: 13}} onChange={onGroupValueChange}/>
        </Modal>
    </div>
};

export default forwardRef(ImgPopover);