import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const AuthRoute = ({ auth, component: Component, layout: Layout, ...rest }) => (
    <Route {...rest} render={props => {
        return !auth.logged ? <Component {...props}/> : <Redirect to='/' />;
    }} />
)