import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from "react-router-dom";
import { PrivateRoute, AuthRoute } from './route-export';

import Layout from '../layouts/Layout';
import Login from '../modules/auth/components/Login';
import Home from '../modules/home/components';
import ManageCompany from '../modules/manage-company/components';
import ManageUser from '../modules/manage-user/components';
import ManageRole from '../modules/manage-role/components';
import ManageLink from '../modules/manage-link/components';
// import NotFoundPage from '../modules/notfound/components';

import {reactLocalStorage} from 'reactjs-localstorage';
let companyURL = reactLocalStorage.getObject('company');

const pages = [
    { path: '/', exact: true, component: () => <Home/> },
    { path: `/manage-company`, exact: true, component: () => <ManageCompany/> },
    { path: `/${companyURL.short_name}/`, exact: true, component: () => <Home/> },
    { path: `/${companyURL.short_name}/manage-user`, exact: true, component: () => <ManageUser/> },
    { path: `/${companyURL.short_name}/manage-role`, exact: true, component: () => <ManageRole/> },
    { path: `/${companyURL.short_name}/manage-link`, exact: true, component: () => <ManageLink/> },
];

class Routes extends Component {
    render() {
        const { auth } = this.props;

        return (
            <React.Fragment>
                {/* <Route exact path=" " component={ NotFoundPage }></Route> */}
                <AuthRoute 
                    exact
                    auth={ auth }
                    path="/login"
                    component={ Login }
                />
                {
                    pages.map( page => 
                        <PrivateRoute 
                            key={ page.path}
                            auth={ auth }
                            exact={ page.exact }
                            path={ page.path }
                            layout={ Layout }
                            component={ page.component }
                        />
                    )
                }
                <Route exact path="/login" component={ Login }/>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return state;
}

export default connect(mapStateToProps, null)(Routes);