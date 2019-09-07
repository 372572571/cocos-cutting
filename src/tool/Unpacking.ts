// import * as jsfs from "fs";
// import * as jspath from "path"
import { ArrayMd5 } from "./FileTool"
// 拆包工具
const electron: any = (window as any).electron;
const fs = electron.remote.require('fs');
const shell = electron.remote.require('shelljs')
const jsPath = electron.remote.require('path')

// 屏蔽模块
const _FILTER_MODULE_: Array<string> = [
    'internal', // 系统资源
    'resources',// 动态资源
    'hall', // 大厅资源
    'start',// 启动页资源
];
const _MANIFEST_NAME_: string = "project.manifest";
const _VERSION_NAME_: string = "version.manifest";

//资源分布文件 
const _RESOURCE_MAP_PATH_: string = jsPath.join('temp', 'assets-map.json');

const _BUILD_JSB_LINK_: string = jsPath.join('build', 'jsb-link');

// 总清单文件
const _TOTAL_MANIFEST_PATH_: string = jsPath.join(_BUILD_JSB_LINK_, _MANIFEST_NAME_);
// 分包资源输出目录
const _BUILD_PATH_: string = "unpack";

export class Unpacking {
    // 解包项目名称
    public projectName: string = "";
    // 项目路径
    public projectPath: string = "";
    // 资源地图数据
    private _resourceMapData: any = [];
    // 分包资源
    private _sub: { [key: string]: [string] } = {};
    // 总清单文件
    private _totalManifestData: any = {};

    public error: (event: any) => void = () => { };
    public success: (event: any) => void = () => { };

    /**
     *Creates an instance of Unpacking.
     * @memberof Unpacking
     */
    constructor(name: string, path: string) {
        this.projectName = name;
        this.projectPath = path;
    }

    // 资源分布文件
    private getResourceMap(): void {
        // fs
        let path = jsPath.join(this.projectPath, _RESOURCE_MAP_PATH_);
        console.log('读取资源分布文件--', path);

        let file_info = fs.statSync(path);
        if (file_info.isFile()) {
            this._resourceMapData = JSON.parse(fs.readFileSync(path, 'utf8'));
            console.log(path, '读取文件成功');
            for (let val in this._resourceMapData) {
                if (_FILTER_MODULE_.indexOf(val) === -1) { // 如果文件没有被屏蔽
                    // 获取主包中子包的资源
                    this._sub[val] = JSON.parse(JSON.stringify(this._resourceMapData[val]));
                }
            }
            console.log('子包资源信息', this._sub);
            return;
        }
        throw new Error('读取文件失败')
    }

    // 资源总清单
    private getTotalManifest(): void {
        let path = jsPath.join(this.projectPath, _TOTAL_MANIFEST_PATH_);
        let file_info = fs.statSync(path);
        if (file_info.isFile()) {
            this._totalManifestData = JSON.parse(fs.readFileSync(path, 'utf8'));
            console.log(JSON.stringify(this._totalManifestData));
            console.log('读取总清单文件成功');
            return;
        }
        throw new Error('读取文件失败')
    }

    // 创建分包目录结构
    private initBuildPath(): void {
        // 存放导出文件目录
        let path = jsPath.join(this.projectPath, _BUILD_PATH_);
        console.log(path);
        shell.rm('-R', path)
        shell.mkdir('-p', path)

        console.log('创建主路径成功')
        for (let index in this._sub) {
            shell.mkdir('-p', jsPath.join(path, index));
            console.log("创建目录", jsPath.join(path, index));
            this.copySubAssets(this._sub[index], index);
        }
    }

    // 拷贝分包资源 并删除源资源
    private copySubAssets(paths: [string], m: string): void {
        let manifest = this.crateManifest<any>(m) // 分包 m 模块名称
        let path = jsPath.join(this.projectPath, _BUILD_PATH_);
        for (let index in paths) {
            let val = paths[index]
            console.log('jsw val', val)
            let temp = jsPath.dirname(val)
            shell.mkdir('-p', `${jsPath.join(path, m, temp)}`);
            // 剪切文件
            shell.mv(jsPath.join(this.projectPath, _BUILD_JSB_LINK_, val), jsPath.join(path, m, val));
            if (this._totalManifestData.assets[val] === undefined) {
                console.log('分包资源丢失', val);
                throw new Error('分包资源丢失');
            }
            //
            // 添加判断如果是 impotr 资源 则不清理 主包清单
            // let reg = new RegExp('^(res/import)')
            //reg.test(a,reg)
            // if (reg.test(this._totalManifestData.assets[val])) {
            //     manifest.assets[val] = this._totalManifestData.assets[val]
            //     console.log('不清理')
            // } else {
            manifest.assets[val] = this._totalManifestData.assets[val]
            delete (this._totalManifestData.assets[val]) // 清理主包资源
            // }

        }
        // 输出分包清单
        fs.writeFile(jsPath.join(path, m, _MANIFEST_NAME_), JSON.stringify(manifest), 'utf8', () => {
            console.log(m, "分包清单输出完毕");
        })
        // 创建版本文件 空文件
        let version = this.crateVersion(m)
        // 输出版本文件
        fs.writeFile(jsPath.join(path, m, _VERSION_NAME_), JSON.stringify(version), 'utf8', () => {
            console.log(m, "分包版本输出完毕");
        })
    }

    // 生成清单文件
    private crateManifest<T>(m: string): T {
        let url = this._totalManifestData.packageUrl + m + "/";
        let manifest: any = {
            packageUrl: url,
            remoteManifestUrl: `${url}${m}${_MANIFEST_NAME_}`,
            remoteVersionUrl: `${url}${m}${_VERSION_NAME_}`,
            version: this._totalManifestData.version,
            assets: {},
            searchPaths: [`${m}`],
        }
        return manifest as any;
    }

    // 生成版本文件
    private crateVersion<T>(m: string): T {
        let url = this._totalManifestData.packageUrl + m + "/";
        let version = {
            packageUrl: url,
            remoteManifestUrl: `${url}${m}${_MANIFEST_NAME_}`,
            remoteVersionUrl: `${url}${m}${_VERSION_NAME_}`,
            version: this._totalManifestData.version,
        }

        return version as any;
    }

    // 开始切割
    public build(): void {
        try {
            this.getResourceMap();
            this.getTotalManifest();
            this.initBuildPath();
        } catch (error) {
            this.error(error)
            return;
        }

        // 替换主包文件
        shell.rm(jsPath.join(this.projectPath, _BUILD_JSB_LINK_, _MANIFEST_NAME_));
        fs.writeFileSync(jsPath.join(this.projectPath, _BUILD_JSB_LINK_, _MANIFEST_NAME_),
            JSON.stringify(this._totalManifestData), 'utf8',
        )
        let _t = fs.readFileSync(jsPath.join(this.projectPath, _BUILD_JSB_LINK_, _MANIFEST_NAME_))
        let _md = ArrayMd5(_t);
        // console.log('md5', _md)
        fs.writeFileSync(jsPath.join(this.projectPath, _BUILD_PATH_, _md), JSON.stringify(this._totalManifestData)); // 清单文件
        // localStorage.setItem('PackMd5','')
        fs.readFile(jsPath.join(this.projectPath, _BUILD_JSB_LINK_, "main.js"), 'utf8', (err: any, data: string) => {
            if (err) {
                console.warn(err)
                this.error(err)
                return
            }
            data = data.replace('// localStorage.setItem PackMd5', `localStorage.setItem('PackMd5','${_md}')`)
            shell.rm(jsPath.join(this.projectPath, _BUILD_JSB_LINK_, "main.js"))
            fs.writeFile(jsPath.join(this.projectPath, _BUILD_JSB_LINK_, "main.js"), data, 'utf8', () => {
                console.log('main.js 覆盖完毕')
                this.success('main.js 覆盖完毕')
            })
        })

        // 替换资源目录下清单
        shell.rm(jsPath.join(this.projectPath, _BUILD_JSB_LINK_, 'res', 'raw-assets', _MANIFEST_NAME_));
        fs.writeFile(jsPath.join(this.projectPath, _BUILD_JSB_LINK_, 'res', 'raw-assets', _MANIFEST_NAME_),
            JSON.stringify(this._totalManifestData), 'utf8', () => {
                console.log("主包资源清单覆盖完毕");
                this.success('主包资源清单覆盖完毕')
            })
    }
} 