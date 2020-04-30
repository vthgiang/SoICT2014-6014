import React from 'react';
import { Route, Redirect} from 'react-router-dom';
import { getStorage } from  '../config';
import {NotFound} from '../modules/not-found/components';

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

export const PrivateRoute = ({ auth, isLoading, arrPage, pageName, link, component: Component, layout: Layout, ...rest }) => {
    return <Route {...rest} render={props => {
        var logged = getStorage();
        if(logged !== null){
            if(auth.calledAPI) //chưa thực hiện load trang để check link
                return <Layout></Layout>
            if(link !== '/' && checkURL(link, auth.links) !== true){
                return <Redirect to='/'/>
            } 
            return <Layout arrPage={ arrPage } pageName={ pageName } isLoading={ isLoading }><Component {...props}/></Layout>
        }else{
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }
    }} />
}
