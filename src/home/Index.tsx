import * as React from 'react';
import { Route, Link, HashRouter } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import { AddProject } from '../featureCoponent/addProject/AddProject';
import { ProjectList } from '../featureCoponent/projectList/ProjectList';
import { ProjectContent } from '../featureCoponent/ProjectContent/ProjectContent';
import { GlobalSetting } from '../featureCoponent/GlobalSetting/GlobalSetting';
import { SubGameVersionCheck } from '../featureCoponent/SubGameVersionCheck/SubGameVersionCheck';
import { TinyPng } from '../featureCoponent/tinypng/TinyPng';
import { PipConnection } from '../tool/common/PipConnection';
// import '../App.css'
import './Index.css'
// const supportsHistory = 'pushState' in window.history
const { Footer, Sider, Content } = Layout;
export interface Props {
    // 属性
}
export class Index extends React.Component<Props, object> {

    render() {
        // 渲染
        return (
            <HashRouter >
                <Layout>
                    {/* 选项区域 */}
                    <Sider className="Index_Sider" >
                        {/* 菜单 */}
                        <Menu className="Index_Left_Menu">
                            <Menu.Item>
                                <Link to="/">
                                    <Icon type="folder-add" />
                                    <span>添加项目</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item onClick={this.goProjectList.bind(this)}>
                                <Link to="/projectList">
                                    <Icon type="ordered-list" />
                                    <span>项目列表</span>
                                </Link>
                            </Menu.Item>
                            {/* <Menu.Item onClick={this.goProjectList.bind(this)}>
                                <Link to="/TinyPng">
                                    <Icon type="setting" />
                                    <span>TinyPng</span>
                                </Link>
                            </Menu.Item> */}
                            <Menu.Item onClick={this.goProjectList.bind(this)}>
                                <Link to="/globalSetting">
                                    <Icon type="setting" />
                                    <span>全局设置</span>
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>

                    <Layout>
                        {/* <Header style={{ backgroundColor: '#fff' }}> </Header> */}
                        {/* 内容区域 */}
                        {/* <Content style={{ backgroundColor: '#fff' }}> */}
                        <Content>
                            {/* <Switch> */}
                            <Route exact path="/" component={AddProject} />
                            <Route exact path="/projectList" component={ProjectList} />
                            <Route exact path="/ProjectContent" component={ProjectContent} />
                            <Route exact path="/globalSetting" component={GlobalSetting} />
                            <Route exact path="/SubGameVersionCheck" component={SubGameVersionCheck} />
                            <Route exact path="/TinyPng" component={TinyPng} />
                            {/* </Switch> */}
                        </Content>

                        {/* 底部 */}
                        <Footer style={{ position: 'relative', bottom: '0', backgroundColor: 'silver', height: '8vh', marginLeft: '5px', marginRight: '5px' }}>

                        </Footer>
                    </Layout>

                </Layout>
            </HashRouter>
        );
    }

    /**
     *  渲染钱生命周期
     */
    public componentWillMount() {
    }
    public goProjectList() { }
}