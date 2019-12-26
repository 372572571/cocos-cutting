import React from 'react';
import ReactDOM from 'react-dom';
// -----------------------------引入 antd-----------------------------
// import { LocaleProvider, DatePicker, message } from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
// import zhCN from 'antd/es/locale-provider/zh_CN';
//  moment 一个时间日期库库
import moment from 'moment';
//  时间库语言
import 'moment/locale/zh-cn';
//  引入antd css
import 'antd/dist/antd.css';
// -------------------------------------------------------------------
import './index.css';
// import App from './App';
import { Index } from './home/Index';
import * as serviceWorker from './serviceWorker';
import { PipConnection } from "./tool/common/PipConnection";
moment.locale('zh-cn'); // 设置文本中文
ReactDOM.render(<Index />, document.getElementById('root'));
(window as any).pip_service = new PipConnection((window as any).pip_service_path);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
