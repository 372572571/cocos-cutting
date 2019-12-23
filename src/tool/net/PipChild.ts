import { ChildProcess, ChildProcessWithoutNullStreams, spawn } from "child_process";
let process = spawn;

const electron = (window as any).electron;
if (electron) {
    process = electron.remote.require("child_process").spawn;
}

// 交互管道客户端
type PipChildSendInfo = { [key: string]: any };

export class PipChild {
    private _conn: ChildProcessWithoutNullStreams | ChildProcess | null = null;

    public onMessage: (data: string) => void | null = null;

    public onError: (data: any) => void | null = null;

    public onClose: (data: any) => void | null = null;

    constructor(pip: string) {
        this._conn = process(pip, []); // 拉起管道
        this._conn.stdout.on("data", this._onMessage.bind(this)); // 收到消息
        this._conn.stderr.on("data", this._onError.bind(this)); // 收到错误
        this._conn.on("close", this._onClose.bind(this)); // 关闭
        this._conn.stdin.setDefaultEncoding("utf8"); // 默认编码
    }

    /**
     * 发送消息
     *
     * @param {PipChildSendInfo} data
     * @memberof PipChild
     */
    public onSend(data: PipChildSendInfo) {
        // json化后需要添加系统换行符,不然会导致消息虽然写入成功,但是没有没服务接收,或没发送
        let b = JSON.stringify(data) + (window as any)._os.EOL;
        this._conn.stdin.write(b);
    }

    private _onMessage(message: Buffer) {
        if (this.onMessage) {
            this.onMessage(message.toString());
        }
    }

    private _onError(err: Error) {
        if (this.onError) {
            this.onError(err);
        }
    }

    private _onClose(code: number, signal: string) {
        if (this.onClose) {
            this.onClose(code);
        }
    }

    public close() {
        this._conn.stdin.end();
    }
}
