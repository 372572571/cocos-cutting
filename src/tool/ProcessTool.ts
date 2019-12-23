import { ChildProcess, ChildProcessWithoutNullStreams, spawn } from "child_process";
let process = spawn;

const electron = (window as any).electron;
if (!process) {
    process = electron.remote.require("child_process").spawn;
}

const EVENT_NAME_DATA = "data";
const EVENT_NAME_CLOSE = "close";

export class ProcessTool {

    public error_call_back: (error: any) => void = this.defaultCallBack; // 失败回调

    public exit_call_back: (code: number) => void = this.defaultCallBack; // 退出回调

    public out_call_back: (data: any) => void = this.defaultCallBack; // 输出回调

    protected _command: ChildProcessWithoutNullStreams | ChildProcess | null = null;

    constructor(command: any, ops: any[]) {
        // 异步地衍生子进程
        // console.log('jsw ', process)
        this._command = process(command, ops);
    }

    // 执行
    public run() {
        if (this._command === null) { return; }
        this._command.stdout.on(EVENT_NAME_DATA, this.out_call_back);
        this._command.stderr.on(EVENT_NAME_DATA, this.error_call_back);
        this._command.on(EVENT_NAME_CLOSE, this.exit_call_back);
    }
    // 默认回调
    private defaultCallBack(data: any): void {
        let dataString = "";
        for (let i = 0; i < data.length; i++) {
            dataString += String.fromCharCode(data[i]);

        }
        console.log("默认回调", dataString);
    }
}

/**
 * Promise 执行命令
 *
 * @export
 * @class ProcessPromise
 * @extends {ProcessTool}
 */
export class ProcessPromise extends ProcessTool {
    constructor(command: any, ops: any[]) {
        super(command, ops);
    }
    // 执行
    public end() {
        return new Promise((resolve, reject) => {
            let res: { [key: string]: any } | null = null;
            let def: string = '{}';
            if (this._command === null) {
                reject('error: _command not null');
                return;
            }
            this._command.stdout.on(EVENT_NAME_DATA, (data: Buffer) => {
                def = data.toString();
            });
            this._command.stderr.on(EVENT_NAME_DATA, () => { reject(res); });
            this._command.on(EVENT_NAME_CLOSE, () => {
                res = JSON.parse(def);
                resolve(res);
            });
        });
    }
}
