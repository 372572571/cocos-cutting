// 热更新版本比较
import { BrickHttp } from './net/BrickHttp';
import { FileTool } from './FileTool';
export class VersionComparison {
    public versionCompared(m_name: string, url: string, base_path: string) {
        return new Promise((resolve, reject) => {
            let m_path = `${base_path}/unpack/${m_name}/project.manifest`;
            console.log(m_path);
            let native_manifest = FileTool.getFileContentByJson(m_path);
            let native_assets = native_manifest.assets;
            let http = new BrickHttp(url);
            http.get(`${m_name}/project.manifest`).then((res: any) => {
                console.log(FileTool.md5.update(JSON.stringify(native_assets)).digest('hex'));
                if (!res.assets || !native_assets) {
                    resolve(2);
                    return;
                }
                if (FileTool.md5.update(JSON.stringify(res.assets)).digest('hex') === FileTool.md5.update(JSON.stringify(native_assets)).digest('hex')) {
                    resolve(0);
                    return 0;
                } else {
                    let info: ModuleVersionInfo = {
                        nativeVerSion: native_manifest.version,
                        remoteVerSion: res.version,
                        manifestPath: m_path,
                        name: m_name,
                    };
                    resolve(info);
                    return;
                }
            });
        });
    }
}

export interface ModuleVersionInfo {
    nativeVerSion: string; // 本地版本
    remoteVerSion: string; // 远程版本
    manifestPath: string; // manifest文件路径
    name: string;
}
