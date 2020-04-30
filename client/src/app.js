import React from 'react';
import { Router } from "react-router-dom";
import { createBrowserHistory } from 'history';
import Routes from './react-routes/routes';
import { IntlActions } from 'react-redux-multilingual';
import store from './redux/store';

const history = createBrowserHistory();

function App() {
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
    return (
        <React.Fragment>
            <Router history={history}>
                <Routes/>
            </Router>
        </React.Fragment>
    );
}

export default App;