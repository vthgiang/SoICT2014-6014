import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PrivateRoute, AuthRoute } from './route-export';

import Layout from '../layouts/Layout';
import Login from '../modules/auth/components/Login';
import Home from '../modules/home/components';
import ManageCompany from '../modules/manage-company/components';
import ManageUser from '../modules/manage-user/components';
import ManageRole from '../modules/manage-role/components';
import ManageLink from '../modules/manage-link/components';
import ManageDepartment from '../modules/manage-department/components';
import ManageFormDocument from '../modules/manage-form-document/components';
// import NotFoundPage from '../modules/notfound/components';

const pages = [
    { path: '/', exact: true, component: () => <Home/> },
    { path: '/manage-company', exact: true, component: () => <ManageCompany/> },
    { path: '/manage-user', exact: true, component: () => <ManageUser/> },
    { path: '/manage-role', exact: true, component: () => <ManageRole/> },
    { path: '/manage-link', exact: true, component: () => <ManageLink/> },
    { path: '/manage-department', exact: true, component: () => <ManageDepartment/> },
    { path: '/manage-form-document', exact: true, component: () => <ManageFormDocument/> },
];  

class Routes extends Component {
    render() {
        const { auth } = this.props;
        return (
            <React.Fragment>
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
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return state;
}

export default connect(mapStateToProps, null)(Routes);