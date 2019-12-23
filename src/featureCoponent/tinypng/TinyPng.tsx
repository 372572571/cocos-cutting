/// <reference types="electron" />

import * as React from 'react';
import './TinyPng.css';
import { Icon, Row, List, Avatar } from 'antd';
import path_js from 'path';
// import { Tinify } from '../../tool/tinify-nodejs/src/index';
import fsjs from "fs";
import { FileTool } from '../../tool/FileTool';
import { ProcessPromise } from '../../tool/ProcessTool';

const electron = (window as any).electron;
let path = path_js;
let fs = fsjs;
if (true) { // 这里的操作是要把 electron 导出的功能覆盖到path上,这样使用 代码会提示
    fs = (electron.remote.require('fs'));
    path = (electron.remote.require('path'));
}
export interface Props {
}

// 添加项目 拖拽
export class TinyPng extends React.Component<Props, object> {
    public state: { [key: string]: any } = {
        list_data: ["not"],
    };
    // 初始化
    public componentWillMount() {
    }

    public render() {
        return <div className="TinyPng_Body">
            <div className="TinyPng_Add" onDragOver={this.DragOver} onDrop={this.onDrop.bind(this)}>
                <Row type="flex" justify="center" align="top">
                    <Icon className="TinyPng_Icon" style={{ fontSize: '108px', color: '#fff' }} type="folder-add" />
                </Row>
            </div>
            <div style={{ overflow: "scroll", height: "70vh" }}>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.list_data}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                title={<a href="https://ant.design">{item}</a>}
                                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                            />
                        </List.Item>
                    )}
                />,
            </div>
        </div>;
    }

    public DragOver(event: any): void {
        // event.persist();
        event.preventDefault(); // 防止默认 防止 onDrop 不会触发
    }
    public onDrop(event: any): void {
        // console.log(event.dataTransfer.files[0].path);
        // let cmd = new ProcessPromise(path.join((window as any).dir_name, 'tinypng'), [event.dataTransfer.files[0].path]);
        // cmd.end().then(res => {
        //     console.log('成功', res);
        // }).catch(err => {
        //     console.log('失败', err);
        // });
    }

}
