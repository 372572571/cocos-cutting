// 快速获取全局配置信息
import path_js from 'path';
import { FileTool } from './FileTool';
const electron = (window as any).electron;
let path = path_js;
if (true) { // 这里的操作是要把 electron 导出的功能覆盖到path上,这样使用 代码会提示
    path = (electron.remote.require('path'));
}
export class GlobalConfig {
    private static _globalConfigFilePth: string = path.join((window as any).dir_name, `config.json`);

    /**
     * 获取python3全路径
     *
     * @static
     * @returns {string}
     * @memberof GlobalConfig
     */
    public static getPython3(): string {
        let res = 'python3';
        let temp = FileTool.getFileContentByJson(GlobalConfig._globalConfigFilePth);
        if (temp[res]) {
            res = temp[res];
        }
        return res;
    }
}