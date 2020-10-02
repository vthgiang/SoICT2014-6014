import React, { Component } from 'react';
import { Router } from "react-router-dom";
import { createBrowserHistory } from 'history';
import Routes from './react-routes/routes';
import { IntlActions, IntlProvider } from 'react-redux-multilingual';
import store from './redux/store';
import { PinnedPanel } from '../src/common-components';
import TaskTimesheetLog from '../src/modules/task/task-perform/component/taskTimesheetLog';
import { Provider } from 'react-redux';
import translations from './lang';
import AuthAlert from './modules/alert/components/authAlert';
import { ToastContainer, toast } from 'react-toastify';
import { SocketConstants } from './modules/socket/redux/constants';

import 'react-toastify/dist/ReactToastify.css';
import './app.css'

const history = createBrowserHistory();

class App extends Component {
    constructor() {
        super();
        this.state = { }
    }
    componentDidMount() {
        console.log("didmount app.js");
        store.dispatch({
            type: SocketConstants.CONNECT_SOCKET_IO
        });
        const lang = localStorage.getItem('lang');
        if(lang !== null){
            switch(lang){
                case 'en':
                case 'vn':
                    store.dispatch(IntlActions.setLocale(lang));
                    break;
                default:
                    localStorage.setItem('lang', 'vn');
                    store.dispatch(IntlActions.setLocale('vn'));
                    break;
            }
        }else{
            localStorage.setItem('lang', 'vn');
            store.dispatch(IntlActions.setLocale('vn'));
        }
    }
    render() {
        return (
            <Provider store={store}>
                <IntlProvider translations={translations}>
                    <AuthAlert />
                    <ToastContainer 
                        enableMultiContainer={true}
                        closeOnClick={true}
                        draggable={false}
                        containerId={'toast-notification'}
                        position={toast.POSITION.TOP_RIGHT}
                    />
                    <Router history={history}>
                        <Routes/>
                    </Router>
                    <PinnedPanel>
                        <TaskTimesheetLog />
                    </PinnedPanel>        
                </IntlProvider>
            </Provider>
        );
    }
}

export default App;