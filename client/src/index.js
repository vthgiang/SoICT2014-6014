import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import store from './redux/store';
import translations from './lang';
import { IntlProvider } from 'react-redux-multilingual';
import AuthAlert from './modules/alert/components/authAlert';

import { ToastContainer, toast } from 'react-toastify';
import { Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import App from './app';

ReactDOM.render(
    <Provider store={store}>
        <IntlProvider translations={translations}>
            <AuthAlert />
            <ToastContainer 
                enableMultiContainer={true}
                closeOnClick={false}
                draggable={false}
                transition={Zoom}
                containerId={'toast-notification'}
                position={toast.POSITION.TOP_RIGHT}
            />
            <App />          
        </IntlProvider>
    </Provider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
