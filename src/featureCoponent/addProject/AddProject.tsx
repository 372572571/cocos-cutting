/// <reference types="electron" />

import * as React from 'react';
import './AddProject.css';
import { Icon, Row } from 'antd';
import path_js from 'path';
import { FileTool } from '../../tool/FileTool';

const electron = (window as any).electron;
let path = path_js;
if (true) { // 这里的操作是要把 electron 导出的功能覆盖到path上,这样使用 代码会提示
    path = (electron.remote.require('path'));
}
export interface Props {
}

// 添加项目 拖拽
export class AddProject extends React.Component<Props, object> {
    private suffix: string = ".cocos_project";

    public render() {
        return <div className="AddProject_Body" onDragOver={this.DragOver} onDrop={this.onDrop.bind(this)}>
            <Row type="flex" justify="center" align="top">
                <Icon style={{ fontSize: '108px', marginTop: '200px', color: '#fff' }} type="folder-add" />
            </Row>
        </div>;
    }

    public DragOver(event: any): void {
        // event.persist();
        event.preventDefault(); // 防止默认 防止 onDrop 不会触发
    }
    public onDrop(event: any): void {
        console.log(event.dataTransfer.files);
        let fileName = event.dataTransfer.files[0].name;
        let filePath = event.dataTransfer.files[0].path;
        console.log(fileName, filePath);
        // 生成配置文件
        let data = {
            name: fileName,
            path: filePath,
        };

        //  判断文件是否存在
        FileTool.setNotEmptyFIle(path.join(((window as any).dir_name), 'project', `${data.name + this.suffix}`), data).then((res) => {
            electron.remote.dialog.showMessageBox({
                title: res
                , type: 'info'
                , message: '项目添加成功。',
            });
        }).catch((error) => {
            electron.remote.dialog.showMessageBox({
                title: 'error'
                , type: 'info'
                , message: JSON.stringify(error),
            });
        });
    }

}
