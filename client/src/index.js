import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import store from './redux/store';
import translations from './translations'
import { IntlProvider, IntlActions } from 'react-redux-multilingual';

const lang = localStorage.getItem('lang');
if(lang){
    store.dispatch(IntlActions.setLocale(lang));
}else{
    localStorage.setItem('lang', 'vn');
    store.dispatch(IntlActions.setLocale(localStorage.getItem('lang')));
}

ReactDOM.render(
    <Provider store={store}>
        <IntlProvider translations={translations}>
            <App />
        </IntlProvider>
    </Provider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
