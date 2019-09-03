import { ChildProcess, spawn, ChildProcessWithoutNullStreams } from "child_process";
let process = spawn

const electron = (window as any).electron;
if (!process) {
    process = electron.remote.require('child_process').spawn
}

const EVENT_NAME_DATA = "data"
const EVENT_NAME_CLOSE = "close"

export class ProcessTool {

    private _command: ChildProcessWithoutNullStreams | ChildProcess | null = null;

    public error_call_back: (error: any) => void = this.defaultCallBack; // 失败回调

    public exit_call_back: (code: number) => void = this.defaultCallBack; // 退出回调

    public out_call_back: (data: any) => void = this.defaultCallBack; // 输出回调

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
        var dataString = "";
        for (var i = 0; i < data.length; i++) {
            dataString += String.fromCharCode(data[i]);

        }
        console.log('默认回调', dataString);
    }
}