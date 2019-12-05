/// <reference types="electron" />
import './SubGameVersionCheck.css';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Descriptions, Input, Badge, List, Avatar, Button } from 'antd';
import path_js from 'path';
import { FileTool } from '../../tool/FileTool';
import { VersionComparison, ModuleVersionInfo } from '../../tool/VersionComparison';
import { Dialog } from '../../tool/Dialog';

const electron = (window as any).electron;
let path = path_js;

if (true) {
    path = (electron.remote.require('path'));
}

export interface Props {
    readonly location?: any;
    readonly history?: any;
}

// 与远程子包比较版本
export class SubGameVersionCheck extends React.Component<Props, object> {
    private _mods: ModuleVersionInfo[] = [];
    private _lock: boolean = false;
    public state: { [key: string]: any } = {};
    private _path: string = '';


    // 在渲染前调
    public componentWillMount() {
        this.checkVersion(this.props.location.state);
    }
    // -----------渲染-----------------
    public render() {
        return <div className="SubGameVersionCheck_Body">

            <Descriptions title="清单文件检测" bordered>
                {this.state.module}
            </Descriptions>
            <br />
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={this.save.bind(this)}>保存</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={this.packMod.bind(this)}>压缩模块</Button>
        </div>;
    }
    private async checkVersion(data: { mod: string[]; url: string; project_path: string; path: string }) {
        if (!data) return;
        console.log(data.mod.length);
        // data.mod.path
        this._path = data.path;
        console.log('this._path', this._path);
        let ver_cls = new VersionComparison();
        let res: ModuleVersionInfo[] = [];
        for (let i = 0; i < data.mod.length; i++) {
            console.log('data.mod[i],', data.mod[i]);
            let t = await ver_cls.versionCompared(data.mod[i], data.url, data.project_path);
            switch (t) {
                case 2:
                    console.error('获取资源失败!');
                    continue;
                case 0:
                    console.log('模块无变化', data.mod[i]);
                    continue;
                default:
                    res.push((t as ModuleVersionInfo));
                    break;
            }
        }
        this._mods = res;
        Dialog.ShowInfo({ title: "提示", content: "远端游戏对比完成！" });
        // console.log('jsw check', res);
        this.showModuleInfo(res);
    }

    private showModuleInfo(data: ModuleVersionInfo[]) {
        let temp = [];
        for (let i = 0; i < data.length; i++) {
            temp.push(<Descriptions.Item span={3} key={data[i].name} label={`模块:${data[i].name}  - 远程版本:${data[i].remoteVerSion} - 本地版本:${data[i].nativeVerSion}`}>
                <Input id={`${i}`} defaultValue={data[i].nativeVerSion} onChange={this.updateVersionInfo.bind(this)} />
            </Descriptions.Item>);
        }
        this.setState({ module: temp });
    }

    public updateVersionInfo(e: any): void {
        this._mods[e.target.id].nativeVerSion = e.target.value;
        console.log('版本', this._mods[e.target.id].nativeVerSion);
        e.target.defaultValue = e.target.value;
    }

    public save(): void {
        if (this._lock) { return; }
        this._lock = true;
        let file = FileTool.getFileContentByJson(this._path);

        for (let i = 0; i < this._mods.length; i++) {
            let t = FileTool.getFileContentByJson(this._mods[i].manifestPath);
            t.version = this._mods[i].nativeVerSion;
            FileTool.saveFile(this._mods[i].manifestPath, t);
            let v = FileTool.getFileContentByJson(this._mods[i].versionPath);
            v.version = this._mods[i].nativeVerSion;
            FileTool.saveFile(this._mods[i].versionPath, v);
            file.modules[this._mods[i].name].version = this._mods[i].nativeVerSion;
        }
        FileTool.saveFile(this._path, file); // 本地配置修改
        Dialog.ShowInfo({ title: "提示", content: "修改完成！" });
        this._lock = false;
    }

    public packMod() {
        let file = FileTool.getFileContentByJson(this._path);
        // file
        for (let key in file.modules) {
            if (file.modules[key] && file.modules[key].isShield) {
                // FileTool.zipDir(path.join(file.path, 'unpack', key), path.join(file.path, 'unpack', key), path.join(file.path, 'unpack'));
                FileTool.zipDir(key, key, path.join(file.path, 'unpack'));
            }
        }
        FileTool.initPath();
        Dialog.ShowInfo({ title: "提示", content: "压缩完毕!" });
    }
}