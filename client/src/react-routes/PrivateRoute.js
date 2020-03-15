import React from 'react';
import { Route, Redirect} from 'react-router-dom';
import { getStorage } from  '../config';

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

export const PrivateRoute = ({ auth, isLoading, arrPage, pageName, link, component: Component, layout: Layout, ...rest }) => (
    <Route {...rest} render={props => {
        var logged = getStorage();
        if(logged !== null){
            if(link !== '/' && checkURL(link, auth.links) !== true){
                return <Layout pageName={ pageName }></Layout>
            } 
            return <Layout arrPage={ arrPage } pageName={ pageName } isLoading={ isLoading }><Component {...props}/></Layout>
        }else{
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }
    }} />
)