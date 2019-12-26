import { PipClient } from '../net/PipClient';
import { EventBus } from '../event/EventBus';
// 管道连接
export class PipConnection {

    private _client: PipClient | null = null;

    private _eventBus: EventBus | null = null;

    public get eventBus(): EventBus {
        return this._eventBus;
    }

    constructor(pip: string) {
        this._eventBus = new EventBus();
        this._client = new PipClient(pip);
        this._client.onClose = this.onClose.bind(this);
        this._client.onError = this.onError.bind(this);
        this._client.onClose = this.onClose.bind(this);
        this._client.onMessage = this.onMessage.bind(this);
    }

    public Send(data: { [key: string]: any }): boolean {
        if (!this._client) return false;
        console.log('send', data);
        this._client.onSend(data);
    }

    protected onClose(res: any) {
        console.log('onclose ', res);
    }

    protected onMessage(str: string) {
        try {
            let info = JSON.parse(str);
            if (info.Service)
                this._eventBus.Dispatch(info.Service, info);
            else
                console.log('def onmessage', info);
        } catch (error) {
            console.error('onmessage error', str);
        }
    }

    protected onError(err: any) {
        console.log('onerror', err);
    }
}