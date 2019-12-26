/// <reference types="electron" />

import * as React from 'react';
import './TinyPng.css';
import { Icon, Row, List, Avatar } from 'antd';
import { GlobalConfig } from '../../tool/GlobalConfig';
export interface Props {
}

// 添加项目 拖拽
export class TinyPng extends React.Component<Props, object> {
    public state: { [key: string]: any } = {
        list_data: [],
    };
    private apiKey: string | number = 'zXcGGgJ4spfcnrcWtnFnw0KMXJNYhfkP';

    private email: string | number = '372572571@qq.com';

    // 初始化
    public render() {
        return <div className="TinyPng_Body">
            <div className="TinyPng_Add" onDragOver={this.DragOver} onDrop={this.onDrop.bind(this)}>
                <Row type="flex" justify="center" align="top">
                    <Icon className="TinyPng_Icon" style={{ fontSize: '108px', color: '#fff' }} type="folder-add" />
                </Row>
            </div>
            <div style={{ overflow: "scroll", height: "70vh" }}>
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.list_data}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                title={<a href="https://ant.design">{item}</a>}
                                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                            />
                        </List.Item>
                    )}
                />,
            </div>
        </div>;
    }

    public DragOver(event: any): void {
        // event.persist();
        event.preventDefault(); // 防止默认 防止 onDrop 不会触发
    }
    public onDrop(event: any): void {
        // console.log(event.dataTransfer.files[0].path);
        window.pip_service.Send(
            {
                service: 'tinypngHandle',
                data: {
                    email: this.email,
                    apiKey: this.apiKey,
                    imgpath: event.dataTransfer.files[0].path,
                },
            },
        );

    }

    public componentWillMount() { // onload
        // 获取api调用凭证初始化
        this.apiKey = GlobalConfig.fileConfigJson['apikey'] ? GlobalConfig.fileConfigJson['apikey'] : this.apiKey;
        this.email = GlobalConfig.fileConfigJson['email'] ? GlobalConfig.fileConfigJson['email'] : this.email;
        // 初始化事件监听
        this.initEvent();
    }

    private initEvent() {
        window.pip_service.eventBus.AddListener('tinypngHandle', (data: any) => {
            console.log('接收监听:', data);
        }, this);
        // key tinypngHandle
    }
}
