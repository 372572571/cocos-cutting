
interface Window {
    pip_service: PipConnection;
}

interface PipConnection {
    Send: (data: any) => boolean;
    eventBus: EventBus
}

interface ConfigJson {
    python3?: string; // python3 路径
    adb?: string; // android adb 路径
    node?: string;
    apikey?: string;
}

interface EventBus {

    /**
     * 添加一个监听
     *
     * @param {string} event
     * @param {() => void} call
     * @param {*} target
     * @memberof EventBus
     */
    public AddListener(event: string, call: _callback, target: any = null): void;

    /**
     * 移除所有事件下target的监听
     *
     * @param {*} target
     * @returns {void}
     * @memberof EventBus
     */
    public RemoveListenerByTarget(target: any): void;

    /**
     * 移除单个事件监听
     *
     * @param {string} event
     * @param {() => void} callback
     * @param {*} [target]
     * @memberof EventBus
     */
    public RemoveListener(event: string, callback: _callback, target?: any): void;

    /**
     * 触发事件
     *
     * @param {string} event
     * @param {*} args
     * @returns {boolean}
     * @memberof EventBus
     */
    public Dispatch(event: string, args: any): boolean;

}