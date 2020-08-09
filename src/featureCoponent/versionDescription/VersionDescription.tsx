
import * as React from 'react';
import './VersionDescription.css';
import 'braft-editor/dist/index.css'
import { Modal, Button } from 'antd';
import BraftEditor from 'braft-editor'
export interface Props {
    // fun: (text: string) => void;
    isShow: boolean;
    onOk: (e: any) => void;
    onCancel: () => void;
    tagObj: any;
}
export interface state {
    // isShow: boolean;
}
/**
 *  版本描述组件
 */
export class VersionDescription extends React.Component<Props, state> {
    public state = {
        visible: false,
        editorState: BraftEditor.createEditorState(''), // 设置编辑器初始内容
        outputHTML: '',
    }
    public componentWillMount() {
        // 获取路由信息
        // console.log('this.props.location', this.props);
        // console.log('this.props.location.state', this.props.location.state);
        // this.getProjectInfo(this.props.location.state);
    }

    public render() {
        return <div>
            <Modal
                title="编辑版本描述"
                visible={this.props.isShow}
                onOk={this.props.onOk.bind(this.props.tagObj, (this) as any)}
                onCancel={this.props.onCancel}
                okText="保存"
                cancelText="关闭"
            >
                <div>
                    <div className="editor-wrapper">
                        <BraftEditor
                            value={this.state.editorState}
                            onChange={this.handleChange.bind(this)}
                        />
                    </div>
                    {/* <h5>输出内容</h5>
                    <div className="output-content">{this.state.outputHTML}</div> */}
                </div>
            </Modal>
        </div>;
    }

    public handleChange(editorState: any) {
        this.setState({
            editorState: editorState,
            outputHTML: editorState.toHTML(),
        })
    }

    public setEditorContentAsync() {
        this.setState({
            editorState: BraftEditor.createEditorState('<p>请开始你的表演<p>')
        })
    }
}