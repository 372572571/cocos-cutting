/// <reference types="electron" />
import './ProjectList.css';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { List, Avatar, Button } from 'antd';
import path_js from 'path';
import { FileTool } from '../../tool/FileTool';

const electron = (window as any).electron;
let path = path_js;

if (true) {
    path = (electron.remote.require('path'));
}

export interface Props {
    readonly location?: any;
    readonly history?: any;
}

// 显示所有项目
export class ProjectList extends React.Component<Props, object> {
    private suffix: string = ".cocos_project";
    // 遍历文件获取所有项目数据
    public data: Array<{ name: string; path: string }> = [];
    // 在渲染前调用
    public componentWillMount() {
        let res = FileTool.getFileList(path.join((window as any).dir_name, `./project/*${this.suffix}`));
        if (res.length <= 0) return;
        for (let i = 0; i < res.length; i++) {
            let t = path.basename(res[i].toString());
            if (t) {
                this.data.push({ name: t, path: res[i] });
            }
        }
    }
    // -----------渲染-----------------
    public render() {
        return <div className="Project_Body" >
            <List
                itemLayout="horizontal"
                dataSource={this.data}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar size="large" src="https://www.cocos.com/wp-content/themes/cocos/image/logo.png" />}
                            title={<a href="http://acghobby.cn/">{item.name}</a>}
                            description={item.path}
                        />
                        <Link to={this.enter(item)}>
                            <Button >进入</Button>
                        </Link>
                        {/* <Button onClick={this.runScript.bind(this, item, index)} >开始分包</Button> */}
                    </List.Item>
                )}
            />,
        </div>
    }

    public enter(item: { [key: string]: any }): any {

        let res = { pathname: '/ProjectContent', state: item };

        return res;
    }
}