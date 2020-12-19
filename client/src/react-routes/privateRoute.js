import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect} from 'react-router-dom';
import { getStorage } from  '../config';
import {CallApiStatus} from '../modules/auth/redux/reducers';

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

const PrivateRoute = ({ authenticate, auth, isLoading, arrPage, pageName, link, component: Component, layout: Layout, ...rest }) => {
    const {redirectToAuthQuestionPage} = authenticate;
    
    return <Route {...rest} render={props => {
        var logged = getStorage();
        if(redirectToAuthQuestionPage)
            return <Redirect to='/answer-auth-questions'/>
        else if(logged !== null){
            if(auth.calledAPI !== CallApiStatus.FINISHED)
                return <Layout></Layout>
            
            if(link !== '/' && checkURL(link, auth.links) !== true){
                return <Redirect to='/home'/>
            } 
            return <Layout arrPage={ arrPage } pageName={ pageName } isLoading={ isLoading }><Component {...props}/></Layout>
        }else{
            return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        }
    }} />
}

const mapStateToProps = state => {
    return {authenticate: state.auth}
}

const PrivateRouteConnected = connect(mapStateToProps)(PrivateRoute);
export {PrivateRouteConnected as PrivateRoute};
