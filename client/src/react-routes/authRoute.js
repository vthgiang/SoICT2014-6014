import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { getStorage } from '../config';

export const AuthRoute = ({ auth, component: Component, layout: Layout, ...rest }) => {
    const location = useLocation();

    let redirectPagePath = location.pathname + location.search;
    redirectPagePath = redirectPagePath.replace('/login', '');

    if(redirectPagePath === '' || redirectPagePath === '/') redirectPagePath = '/home';

    return (
        <Route {...rest} render={props => {
            var logged = getStorage(); // Lấy ra json web token
            return logged === null ? <Component {...props} /> : <Redirect to={redirectPagePath} />;
        }} />
    )
}