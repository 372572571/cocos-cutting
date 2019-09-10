/// <reference types="electron" />
import * as React from 'react';
import './ProjectContent.css';
import { Descriptions, Badge, Switch, Input, Button } from 'antd';
import path_js from 'path';
import { FileTool } from '../../tool/FileTool'
import { ProjectTool } from '../../tool/ProjectTool'
import { ProcessTool } from '../../tool/ProcessTool';
import { Unpacking } from '../../tool/Unpacking';
import { Dialog } from '../../tool/Dialog'
// python 脚本路径
const PY_SCRIPT_PATH = 'build/jsb-link/frameworks/runtime-src/proj.android-studio/cocosBuild.py';
const electron = (window as any).electron;
var path = path_js;
if (!path) { // 这里的操作是要把 electron 导出的功能覆盖到path上,这样使用 代码会提示
    path = (electron.remote.require('path'));
}
export interface Props {
    readonly location?: any
}
interface state {
    project_name: string,
    project_version: string,
    project_path: string,
    project_module: any[]
    project_versions: any[]
}

const _NOT: string = "N/A";


// 添加项目 拖拽
export class ProjectContent extends React.Component<Props, Object>{
    private suffix: string = ".cocos_project";

    public state: state = {
        project_name: _NOT,
        project_version: _NOT,
        project_path: _NOT,
        project_module: [],
        project_versions: [],
    }

    private _lock: boolean = false

    // 项目文件信息
    private _file_info: ProjectFile = { name: _NOT, path: _NOT };

    // 在渲染前调用
    public componentWillMount() {
        // 获取路由信息
        // console.log('this.props.location', this.props);
        // console.log('this.props.location.state', this.props.location.state);
        this.getProjectInfo(this.props.location.state);
    }

    render() {
        return <div className="ProjectContent_Body">
            <Descriptions title="游戏信息" bordered>
                <Descriptions.Item label="Game Name" span={2}>{this._file_info.name ? this._file_info.name : _NOT}</Descriptions.Item>
                <Descriptions.Item label="Version">{this._file_info.version ? this._file_info.version : _NOT}</Descriptions.Item>
                <Descriptions.Item label="PATH" span={3}>
                    <Badge status="processing" text={this._file_info.path ? this._file_info.path : _NOT} />
                </Descriptions.Item>
            </Descriptions>
            <br />
            <Descriptions title="模块开关" bordered>
                {this.state.project_module}
            </Descriptions>
            <br />
            <Descriptions title="模块版本" bordered>
                {this.state.project_versions}
            </Descriptions>
            <br />
            <Descriptions title="热更新相关" bordered>
                <Descriptions.Item label="热更新url" span={3}>
                    <Input defaultValue={this._file_info.hotUpdateUrl ? this._file_info.hotUpdateUrl : _NOT} onChange={this.updateHotUpdateUrl.bind(this)} />
                </Descriptions.Item>
                <Descriptions.Item label="热更新主版本" span={3}>
                    <Input defaultValue={this._file_info.version ? this._file_info.version : _NOT} onChange={this.updateRootVersion.bind(this)} />
                </Descriptions.Item>
            </Descriptions>

            <br />
            <Button type="primary" onClick={this.save.bind(this)}>保存</Button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Button type="primary" onClick={this.runScript.bind(this)}>分包开始</Button>
        </div >
    }

    /**
     * 获取项目信息
     *
     * @param {{ name: string, path: string }} data
     * @returns
     * @memberof ProjectContent
     */
    private getProjectInfo(data: { name: string, path: string }) {
        if (!data) return;
        let res = FileTool.getFileContentByJson(data.path);
        this._file_info = res;
        if (!res) return;
        this.setModules(ProjectTool.getModuleInfo(res.path))

    }

    /**
     * 设置模块信息
     *
     * @private
     * @param {string[]} modules
     * @memberof ProjectContent
     */
    private setModules(modules: string[]): void {
        if (!this._file_info.modules) this._file_info.modules = {}
        for (let i = 0; i < modules.length; i++) {
            let item: any = modules[i];
            if (!this._file_info.modules[item.name]) {
                this._file_info.modules[item.name] = { name: item.name, isShield: true }
            }
        }
        this.showModuleInfo();
    }

    /**
     * 展示模块信息
     *
     * @param {{ [key: string]: ModuleItemInfo }} modules
     * @returns
     * @memberof ProjectContent
     */
    private showModuleInfo(): void {
        let temp_modules = Object.values(this._file_info.modules);
        console.log(temp_modules)
        let res: any[] = [];
        let version: any[] = [];
        for (let i = 0; i < temp_modules.length; i++) {
            let val = temp_modules[i]
            res.push(<Descriptions.Item span={3} key={i} label={val.name}>
                <Switch checkedChildren="打开"
                    unCheckedChildren="屏蔽"
                    key={val.name}
                    defaultChecked={val.isShield}
                    onChange={this.updateModuleInfo.bind(this, temp_modules[i].isShield, (val.name as any))}
                />
            </Descriptions.Item>)
            // 非屏蔽组件才有版本号

            version.push(<Descriptions.Item span={3} key={val.name} label={val.name}>
                <Input id={val.name} disabled={!val.isShield} defaultValue={val.version ? val.version : '0.0.1'} onChange={this.updateVersionInfo.bind(this)} />
            </Descriptions.Item>)

        }

        this.setState({
            project_module: res,
            project_versions: version
        })
    }

    // 更新模块开关信息
    private updateModuleInfo(checked: boolean, data: string) {
        this._file_info.modules[data].isShield = !checked
        this.showModuleInfo()
    }

    /**
     * 更新模块版本号
     *
     * @memberof ProjectContent
     */
    private updateVersionInfo(e: any) {
        // console.log('(e as any).target.key', e.target.id)
        if (!this._file_info.modules[e.target.id].version) this._file_info.modules[e.target.id].version = '0.0.1';
        this._file_info.modules[e.target.id].version = e.target.value;
        console.log('this._file_info.modules[e.target.id]', this._file_info.modules[e.target.id]);
        e.target.defaultValue = e.target.value;
        this.showModuleInfo();
    }

    // 更新热更url
    private updateHotUpdateUrl(e: any) {
        this._file_info.hotUpdateUrl = e.target.value;
    }

    // 更新热更新版本
    private updateRootVersion(e: any) {
        this._file_info.version = e.target.value;
        this.setState({ project_version: this._file_info.version })
    }

    // 保存配置
    private save() {
        ProjectTool.saveProject(this._file_info.name, this._file_info)
        Dialog.ShowInfo({ title: '提示', content: '保存结束' })
    }

    // 注意手动构建项目一次
    public runScript() {
        if (this._lock) return;
        this._lock = true;
        let info = this._file_info;
        let url = this._file_info.hotUpdateUrl; // 热更地址
        let version = this._file_info.version; // 主板号
        // 缺少版本文件生成
        let process = new ProcessTool('python3', [`${info.path}/${PY_SCRIPT_PATH}`, path.basename(info.path), url, version, info.path]);
        process.exit_call_back = (code) => {
            console.log('任务结束', code);
            if (code === 0) {
                Dialog.ShowInfo({ title: '执行完毕', content: '热更文件生成完毕' })
                let unpack = new Unpacking(this._file_info);

                // 设置失败回调
                unpack.error = (error) => {
                    Dialog.ShowError({ title: '执行完毕', content: '文件切割失败！' })
                    this._lock = false;
                }
                // 设置成功回调
                unpack.success = (res) => {
                    Dialog.ShowInfo({
                        title: '提示', content: `${res}`
                    })
                    this._lock = false;
                }

                unpack.build() // 开始切割
            } else {
                Dialog.ShowError({ title: '执行异常', content: '请检查日志！' })
                this._lock = false;
            }
        }
        process.run(); // 运行生成热更新

    }

}

export interface ModuleItemInfo {
    name: string, // 模块名称
    isShield?: boolean, // 是否屏蔽
    version?: string // 版本 0.0.0
}

export interface ProjectFile {
    name: string,
    path: string,
    version?: string,
    hotUpdateUrl?: string, // 热更新url
    modules?: { [key: string]: ModuleItemInfo }
}