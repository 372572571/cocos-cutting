import * as React from 'react';
import {  Route, Link, HashRouter } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import { AddProject } from '../featureCoponent/addProject/AddProject';
import { ProjectList } from '../featureCoponent/projectList/ProjectList';
// import '../App.css'
import './Index.css'
// const supportsHistory = 'pushState' in window.history
const { Header, Footer, Sider, Content } = Layout;
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
                        <Menu>
                            <Menu.Item>
                                <Link to="/">
                                    <Icon type="folder-add" />
                                    <span>添加项目</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item onClick={this.goProjectList.bind(this)}>
                                <Link to="/projectList">
                                    <Icon type="folder-add" />
                                    <span>项目列表</span>
                                </Link>
                            </Menu.Item>
                        </Menu>

                    </Sider>

                    <Layout>
                        <Header style={{ backgroundColor: '#fff' }}> </Header>
                        {/* 内容区域 */}
                        <Content style={{ backgroundColor: '#fff' }}>
                            {/* <Switch> */}
                            <Route exact path="/" component={AddProject} />
                            <Route exact path="/projectList" component={ProjectList} />
                            {/* </Switch> */}
                        </Content>

                        {/* 底部 */}
                        <Footer style={{ backgroundColor: '#fff' }}>

                        </Footer>
                    </Layout>

                </Layout>
            </HashRouter>
        );
    }

    public goProjectList(): void {
        // this.context.router.history.push("/projectList");
        // H.createBrowserHistory().push("/projectList");
        // console.log('1111')
    }
}