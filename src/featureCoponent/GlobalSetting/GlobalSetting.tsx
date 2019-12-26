/// <reference types="electron" />

import * as React from 'react';
import './GlobalSetting.css';
import { Descriptions, Input, Button } from 'antd';
import path_js from 'path';
import { FileTool } from '../../tool/FileTool';
import { Dialog } from '../../tool/Dialog';

const electron = (window as any).electron;
let path = path_js;
if (true) { // 这里的操作是要把 electron 导出的功能覆盖到path上,这样使用 代码会提示
    path = (electron.remote.require('path'));
}
export interface Props {
    name?: string;
}

// 添加项目 拖拽
export class GlobalSetting extends React.Component<Props, object> {

    private _config_data: ConfigJson = {};

    /**
     *  生命周期渲染前调用
     */
    public componentWillMount() {
        // 获取配置文件信息
        let res: ConfigJson = FileTool.getFileContentByJson(path.join((window as any).dir_name, `config.json`));
        if (!res) {
            console.error('debug 没有配置文件');
        } else {
            this._config_data = res;
        }
        console.log(res);
    }

    public render() {
        return <div className='Project_Body' >
            <Descriptions title="全局设置" bordered>
                <Descriptions.Item label="Python3-安装路径" span={1}>
                    <Input id='python3' defaultValue={this._config_data.python3} onChange={this.upDateConfig.bind(this)} />
                </Descriptions.Item>
                <Descriptions.Item label="Node-安装路径" span={1}>
                    <Input id='node' defaultValue={this._config_data.node} onChange={this.upDateConfig.bind(this)} />
                </Descriptions.Item>
            </Descriptions>
            <br />
            <Descriptions title="tinypng api 凭证" bordered>
                <Descriptions.Item label="注册邮箱" span={1}>
                    <Input id='email' defaultValue={this._config_data.python3} onChange={this.upDateConfig.bind(this)} />
                </Descriptions.Item>
                <Descriptions.Item label="apiKey" span={1}>
                    <Input id='apikey' defaultValue={this._config_data.node} onChange={this.upDateConfig.bind(this)} />
                </Descriptions.Item>
            </Descriptions>
            <br />
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={this.save.bind(this)}>保存</Button>
        </div>;
    }

    // 更新配置数据
    public upDateConfig(e: any) {
        if ((this._config_data as any)[e.target.id]) {
            (this._config_data as any)[e.target.id] = e.target.value;
        }
    }

    public save() {
        // 保存配置
        FileTool.saveFile(path.join((window as any).dir_name, `config.json`), this._config_data);
        Dialog.ShowInfo({ title: '提示', content: '保存结束' + path.join((window as any).dir_name) });
    }
}
