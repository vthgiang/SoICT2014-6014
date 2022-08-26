import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslate } from 'react-redux-multilingual';
import { Route, Redirect, useLocation} from 'react-router-dom';
import { getStorage } from  '../config';
import { AuthActions } from '../modules/auth/redux/actions';
import { NotificationActions } from '../modules/notification/redux/actions';

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

const getLinkId = (path, links) => {
    var linkId;
    for (let index = 0; index < links.length; index++) {
        const element = links[index];
        if (element.url === path) {
            linkId = element._id;
        }
    }
    return linkId;
}

const PrivateRoute = (props) => {
    const { auth, isLoading, arrPage, pageName, link, component: Component, layout: Layout, ...rest } = props
    let location = useLocation();
    const [callApi, setCallApi] = useState(true)

    useEffect(() => {
        props.refresh()
        props.getAllManualNotifications();
        props.getAllNotifications();
        const currentRole = getStorage('currentRole')
        props.getLinksOfRole(currentRole).then(res => {
            setCallApi(false)
            const links = res.data.content;
            const path = window.location.pathname;
            const linkId = getLinkId(path, links);
            props.getComponentsOfUserInLink(currentRole, linkId);
        })
    }, [])

    return <Route {...rest} render={props => {
        var logged = getStorage();
        if (logged !== null) {
            if(callApi)
                return <Layout></Layout>

            if(link !== '/' && checkURL(link, auth.links) !== true){
                return <Redirect to='/home'/>
            }
            return <Layout arrPage={ arrPage } pageName={ pageName } isLoading={ isLoading }><Component {...props}/></Layout>
        }else{
            return <Redirect to={{ pathname: `/login${location.pathname}${location.search}`, state: { from: props.location } }} />
        }
    }} />
}


const mapDispatchToProps = {
    refresh: AuthActions.refresh,
    getLinksOfRole: AuthActions.getLinksOfRole,
    getComponentsOfUserInLink: AuthActions.getComponentOfUserInLink,
    getAllManualNotifications: NotificationActions.getAllManualNotifications,
    getAllNotifications: NotificationActions.getAllNotifications,
}


export default connect(null, mapDispatchToProps)(withTranslate(PrivateRoute)) ;