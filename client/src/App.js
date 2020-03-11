import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { createBrowserHistory } from 'history';
import Routes from './react-routes/Routes';
import { ToastContainer, toast } from 'react-toastify';

const history = createBrowserHistory();

function App() {
    return (
        <React.Fragment>
            <ToastContainer enableMultiContainer containerId={'toast-notification'} position={toast.POSITION.TOP_RIGHT} />
            <Router history={history}>
                <Routes/>
            </Router>
        </React.Fragment>
    );
}

export default App;