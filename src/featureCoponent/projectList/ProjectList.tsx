/// <reference types="electron" />
import './ProjectList.css';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { List, Avatar, Button } from 'antd';
import path_js from 'path';
import { FileTool } from '../../tool/FileTool';
import { ProcessTool } from '../../tool/ProcessTool';
import { Unpacking } from '../../tool/Unpacking';
import { Dialog } from '../../tool/Dialog';

const electron = (window as any).electron;
var path = path_js;

if (true) {
    path = (electron.remote.require('path'));
}
// python 脚本路径
const PY_SCRIPT_PATH = 'build/jsb-link/frameworks/runtime-src/proj.android-studio/cocosBuild.py';

export interface Props {
    readonly location?: any
    readonly history?: any
}

// 显示所有项目
export class ProjectList extends React.Component<Props, Object>{
    private suffix: string = ".cocos_project"
    // 遍历文件获取所有项目数据
    public data: Array<{ name: string, path: string }> = []
    // 在渲染前调用
    public componentWillMount() {
        let res = FileTool.getFileList(path.join((window as any).dir_name, `./project/*${this.suffix}`))
        if (res.length <= 0) return
        for (let i = 0; i < res.length; i++) {
            let t = path.basename(res[i].toString());
            if (t) {
                this.data.push({ name: t, path: res[i] })
            }
        }
    }
    // -----------渲染-----------------
    render() {
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
    //---------------------------------

    // // 注意手动构建项目一次
    // public runScript(item: { name: string, path: string }, index: number) {
    //     let info = (FileTool.getFileContentByJson(item.path) as any);
    //     let url = 'http://192.168.3.125:8099/static/'; // 热更地址
    //     let version = 0.06;
    //     // 缺少版本文件生成
    //     let process = new ProcessTool('python3', [`${info.path}/${PY_SCRIPT_PATH}`, path.basename(info.path), url, version, info.path]);
    //     process.exit_call_back = (code) => {
    //         console.log('任务结束', code);
    //         if (code === 0) {
    //             Dialog.ShowInfo({ title: '执行完毕', content: '热更文件生成完毕' })
    //             let unpack = new Unpacking(info.name, info.path);
    //             // 设置失败回调
    //             unpack.error = (error) => { Dialog.ShowError({ title: '执行完毕', content: '文件切割失败！' }) }
    //             // 设置成功回调
    //             unpack.success = (res) => { Dialog.ShowInfo({ title: '提示', content: `${res}` }) }

    //             unpack.build() // 开始切割
    //         } else {
    //             Dialog.ShowError({ title: '执行异常', content: '请检查日志！' })
    //         }
    //     }
    //     process.run(); // 运行生成热更新

    // }

    public enter(item: { [key: string]: any }): any {

        let res = { pathname: '/ProjectContent', state: item }

        return res;
    }
}