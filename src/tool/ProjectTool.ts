// 工具
import fs_js from "fs";
import path_js from "path";
import shelljs from "shelljs";

const electron: any = (window as any).electron;
let shell = shelljs;
let pathjs = path_js;
let fs = fs_js;
if (true) {
    shell = electron.remote.require("shelljs");
    pathjs = (electron.remote.require("path"));
    fs = electron.remote.require("fs");
}

export class ProjectTool {
    public static suffix: string = ".cocos_project";
    // 获取项目模块目录信息
    public static getModuleInfo(path: string): any[] {
        const res: any[] = [];
        const data = shell.ls("-l", `${pathjs.join(path, "assets")}`);
        for (let i = 0; i < data.length; i++) {
            const item = (data[i] as any);
            if (item.isDirectory()) {
                res.push({ name: item.name });
            }
        }
        return res;
    }

    // 保存项目
    public static saveProject(file_name: string, data: { [key: string]: any }): void {
        const file = pathjs.join((window as any).dir_name, `./project/${file_name + ProjectTool.suffix}`);
        shell.rm(file); // 删除
        fs.writeFileSync(file, JSON.stringify(data), "utf8"); // 清单文件
    }
}
