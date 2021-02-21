import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getStorage } from '../config';

export const AuthRoute = ({ auth, component: Component, layout: Layout, ...rest }) => (
    <Route {...rest} render={props => {
        var logged = getStorage(); // Lấy ra json web token
        return logged === null ? <Component {...props} /> : <Redirect to='/home' />;
    }} />
)