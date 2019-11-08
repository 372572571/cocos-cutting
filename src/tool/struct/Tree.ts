export class Tree {
    private _root: TreeNode | null = null;
    public get root(): TreeNode | null {
        return this._root;
    }
    public insert<T>(data: T) {
        if (!this._root) {
            this._root = new TreeNode(data, null, null, null);
            return
        }
        let current: TreeNode | null = this._root
        while (current) {
            if (current.left === null) { // 可以插入left
                current.left = new TreeNode(data, null, null, current);
                current = null;
                return;
            }
            if (current.right === null) { // 可以插入right
                current.right = new TreeNode(data, null, null, current);
                current = null;
                return;
            }
            if (current.left) { // 优先左边 left
                current = current.left;
            } else {
                current = current.right;
            }
        }

    }
}

class TreeNode {
    constructor(data: any, left: TreeNode | null, right: TreeNode | null, parent: TreeNode | null) {
        this.data = data;
        this.left = left;
        this.right = right;
        this.parent = parent;
    }
    public data: any = null;         // 节点数据
    public left: TreeNode | null;    // 左节点
    public right: TreeNode | null;   // 右节点
    public parent: TreeNode | null;  // 父节点
}