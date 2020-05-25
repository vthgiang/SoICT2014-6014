import React, { Component } from 'react';
import { Router } from "react-router-dom";
import { createBrowserHistory } from 'history';
import Routes from './react-routes/routes';
import { IntlActions } from 'react-redux-multilingual';
import store from './redux/store';
import { PinnedPanel } from '../src/common-components'

import './app.css'

const history = createBrowserHistory();

class App extends Component {
    constructor(props) {
        super(props);
        this.state = { }
    }
    componentDidMount() {
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
            <React.Fragment>
                <Router history={history}>
                    <Routes/>
                </Router>
                <PinnedPanel />
            </React.Fragment>
        );
    }
}

export default App;