import React, { useState, useEffect } from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { getStorage } from '../config';

export const AuthRoute = ({ auth, component: Component, layout: Layout, ...rest }) => {
    const location = useLocation();
    const [loggedIn, setLoggedIn] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const logged = getStorage();
        setLoggedIn(logged);
        setLoading(false);
    }, []);

    let redirectPagePath = location.pathname + location.search;
    redirectPagePath = redirectPagePath.replace('/login', '');

    if (redirectPagePath === '' || redirectPagePath === '/') redirectPagePath = '/home';

    if (loading) return null;

    return (
        <Route
            {...rest}
            render={(props) => {
                return loggedIn === null ? <Component {...props} /> : <Redirect to={redirectPagePath} />;
            }}
        />
    );
};
