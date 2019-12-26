
type _callback = (res: any) => void;
interface IListener {
    scope: any;
    callback: _callback;
    // args: any;
}

export class EventBus {

    /**
     * 存放监听容器
     *
     * @private
     * @type {{ [key: string]: IListener[] }}
     * @memberof EventBus
     */
    private _listeners: { [key: string]: IListener[] } = {};

    /**
     * 添加一个监听
     *
     * @param {string} event
     * @param {() => void} call
     * @param {*} target
     * @memberof EventBus
     */
    public AddListener(event: string, call: _callback, target: any = null): void {
        if (typeof this._listeners[event] === undefined || this._listeners[event] === null) {
            this._listeners[event] = [{ scope: target, callback: call }];
        } else {
            this._listeners[event].push({ scope: target, callback: call });
        }
    }

    /**
     * 移除所有事件下target的监听
     *
     * @param {*} target
     * @returns {void}
     * @memberof EventBus
     */
    public RemoveListenerByTarget(target: any): void {
        if (!target) return;
        for (let event in this._listeners) {
            this.removeListenerByEventTarget(event, target);
        }
    }

    /**
     * 移除一个事件下这个对象的所有监听
     * @param event 事件名称
     * @param target 监听人
     */
    private removeListenerByEventTarget(event: string, target: any): void {
        if (typeof this._listeners[event] === undefined || this._listeners[event] === null) {
            let len = this._listeners[event].length - 1;
            for (let i = len; i >= 0; i--) {
                if (this._listeners[event][i] && this._listeners[event][i].scope === target) {
                    this._listeners[event].splice(i, 1); // 删除元素
                }
            }
        }
    }

    /**
     * 移除单个事件监听
     *
     * @param {string} event
     * @param {() => void} callback
     * @param {*} [target]
     * @memberof EventBus
     */
    public RemoveListener(event: string, callback: _callback, target?: any) {
        if (typeof this._listeners[event] === undefined || this._listeners[event] === null) {
            let len = this._listeners[event].length - 1;
            for (let i = len; i >= 0; i--) {
                // 如果target undefined
                if (!target
                    && this._listeners[event][i]
                    && this._listeners[event][i].callback === callback) {
                    this._listeners[event].splice(i, 1); // 删除元素

                } else if (this._listeners[event][i] // target 如果存在
                    && this._listeners[event][i].callback === callback
                    && this._listeners[event][i].scope === target) {
                    this._listeners[event].splice(i, 1); // 删除元素
                }
            }
        }
    }

    /**
     * 触发事件
     *
     * @param {string} event
     * @param {*} args
     * @returns {boolean}
     * @memberof EventBus
     */
    public Dispatch(event: string, args: any): boolean {
        if (this._listeners[event] === undefined) return false;
        let len = this._listeners[event].length - 1;
        for (let i = len; i >= 0; i--) {
            let item_scope = this._listeners[event][i].scope; // 实例
            let call = this._listeners[event][i].callback;  // 回调
            if (!item_scope) {
                call && call(args);
            } else {
                call.apply(this._listeners[event][i].scope, args);
            }
        }
        return true;
    }
}