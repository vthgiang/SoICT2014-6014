import React from 'react';
import { Route, Redirect} from 'react-router-dom';

const checkURL = (urlName, linkArr) => {
    var result = false;
    if(linkArr !== undefined){
        linkArr.forEach(link => {
            if(link.url === urlName){
                result = true;
            }
        });
    }

    return result;
}

export const PrivateRoute = ({ auth, isLoading, pageName, link, component: Component, layout: Layout, ...rest }) => (
    <Route {...rest} render={props => {
        if(auth.logged){
            if(link !== '/' && checkURL(link, auth.links) !== true){
                return <Layout pageName={ pageName }></Layout>
            } 
            return <Layout pageName={ pageName } isLoading={ isLoading }><Component {...props}/></Layout>
        }else{
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }
    }} />
)