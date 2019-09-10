/// <reference types="electron" />
// 弹窗功能
const electron = (window as any).electron;

export enum DIALOG_TYPE {
    INFO = "info",
}

export class Dialog {
    public static log: Electron.Dialog = electron.remote.dialog;

    // 信息框
    public static ShowInfo(data: DialogMessage) {
        Dialog.log.showMessageBox({
            title: data.title,
            type: "info",
            message: data.content,
        });
    }

    // 错误提示框
    public static ShowError(data: DialogMessage) {
        Dialog.log.showErrorBox(data.title, data.content);
    }
}

export interface DialogMessage {
    title: string;
    type?: DIALOG_TYPE;
    content: string;
}
