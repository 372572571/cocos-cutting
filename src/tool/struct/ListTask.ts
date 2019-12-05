/**
 * 任务接口
 */
interface ItemTask {
    Run: () => Promise<any>;
}

/**
 * 列表任务
 *
 * @export
 * @class ListTask
 * @template ItemTask
 */
export class ListTask {
    /**
     * 当前队列
     *
     * @private
     * @type {(ItemTask | null)}
     * @memberof ListTask
     */
    private _current_task: ItemTask | null = null;

    /**
     * 任务列表
     *
     * @private
     * @type {ItemTask[]}
     * @memberof ListTask
     */
    private _list: ItemTask[] = [];

    /**
     * push 任务 并启动任务
     *
     * @param {ItemTask} item
     * @memberof ListTask
     */
    public push(item: ItemTask): void {
        this._list.push(item);
        this.next();
    }

    // _call
    private next() {
        this._call();
    }

    /**
     * 运行任务完成后下一条
     *
     * @private
     * @memberof ListTask
     */
    private _call() {
        if (this._current_task === null) {
            this._current_task = (this._list.shift() as ItemTask);
            this._current_task.Run().finally(() => {
                this._current_task = null;
                this.next();
            });
        }
    }
}