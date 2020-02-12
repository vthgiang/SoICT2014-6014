import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Route } from "react-router-dom";
import { PrivateRoute, AuthRoute } from './route-export';

import Layout from '../layouts/Layout';
import Login from '../modules/auth/components/Login';
import System from '../modules/system/components';
import Home from '../modules/home/components';
import ManageCompany from '../modules/system-admin-management/manage-company/components';
import ManageUser from '../modules/super-admin-management/manage-user/components';
import ManageRole from '../modules/super-admin-management/manage-role/components';
import ManageLink from '../modules/system-admin-management/manage-link/components';
import ManageDepartment from '../modules/super-admin-management/manage-department/components';
import ManageComponent from '../modules/system-admin-management/manage-component/components';
import ManageFormDocument from '../modules/super-admin-management/manage-form-document/components';
// import { AddEmployee, DetailEmployee, UpdateEmployee,} from '../modules/employees-manager/employee-info/components/CombineContent';
// import { ListEmployee} from '../modules/employees-manager/employee-manager/components/ListEmployee';

class Routes extends Component {

    render() {
        const { auth, company, user, role, link, component, department } = this.props;
        return (
            <React.Fragment>
                <AuthRoute exact auth={ auth } path="/login" component={ Login } />
                <PrivateRoute 
                    isLoading={ company.isLoading }
                    key={ 'system' }
                    arrPage={[
                        { link: '/system', name:'system', icon: 'fa fa-gears'}
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/system' }
                    path={ '/system' }
                    pageName={ 'system' }
                    layout={ Layout }
                    component={ System }
                />
                <PrivateRoute 
                    isLoading={ auth.isLoading }
                    key={ 'home' }
                    arrPage={[
                        { link: '/', name:'home', icon: 'fa fa-home'}
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/' }
                    path={ '/' }
                    pageName={ 'home' }
                    layout={ Layout }
                    component={ Home }
                />
                <PrivateRoute 
                    isLoading={ company.isLoading }
                    key={ 'manage-company' }
                    arrPage={[
                        { link: '/', name:'home', icon: 'fa fa-home'},
                        { link: '/manage-company', name: 'manageCompany', icon:'fa fa-building' }
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/manage-company' }
                    path={ '/manage-company' }
                    pageName={ 'manageCompany' }
                    layout={ Layout }
                    component={ ManageCompany }
                />
                <PrivateRoute 
                    isLoading={ user.isLoading }
                    key={ 'manage-user' }
                    arrPage={[
                        { link: '/', name:'home', icon: 'fa fa-home'},
                        { link: '/manage-user', name: 'manageUser', icon:'fa fa-users' }
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/manage-user' }
                    path={ '/manage-user' }
                    pageName={ 'manageUser' }
                    layout={ Layout }
                    component={ ManageUser }
                />
                <PrivateRoute 
                    isLoading={ role.isLoading }
                    arrPage={[
                        { link: '/', name:'home', icon:'fa fa-home' },
                        { link: '/manage-role', name: 'manageRole', icon:'fa fa-lock'}
                    ]}
                    key={ 'manage-role' }
                    auth={ auth }
                    exact={ true }
                    link={ '/manage-role' }
                    path={ '/manage-role' }
                    pageName={ 'manageRole' }
                    layout={ Layout }
                    component={ ManageRole }
                />
                <PrivateRoute 
                    isLoading={ link.isLoading }
                    key={ 'manage-link' }
                    arrPage={[
                        { link: '/', name:'home', icon: 'fa fa-home'},
                        { link: '/manage-link', name: 'manageLink', icon:'fa fa-link' }
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/manage-link' }
                    path={ '/manage-link' }
                    pageName={ 'manageLink' }
                    layout={ Layout }
                    component={ ManageLink }
                />
                <PrivateRoute 
                    isLoading={ department.isLoading }
                    key={ 'manage-department' }
                    arrPage={[
                        { link: '/', name:'home', icon: 'fa fa-home'},
                        { link: '/manage-department', name: 'manageDepartment', icon:'fa fa-sitemap' }
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/manage-department' }
                    path={ '/manage-department' }
                    pageName={ 'manageDepartment' }
                    layout={ Layout }
                    component={ ManageDepartment }
                />
                <PrivateRoute 
                    isLoading={ component.isLoading }
                    key={ 'manage-component' }
                    arrPage={[
                        { link: '/', name:'home', icon: 'fa fa-home'},
                        { link: '/manage-component', name: 'manageComponent', icon:'fa fa-object-group' }
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/manage-component' }
                    path={ '/manage-component' }
                    pageName={ 'manageComponent' }
                    layout={ Layout }
                    component={ ManageComponent }
                />
                <PrivateRoute 
                    key={ 'manage-form-document' }
                    auth={ auth }
                    exact={ true }
                    link={ '/manage-form-document' }
                    path={ '/manage-form-document' }
                    pageName={ 'manageFormDocument' }
                    layout={ Layout }
                    component={ ManageFormDocument }
                />
                {/* Quan ly nhan su */}
                {/* <PrivateRoute 
                    key={ 'addemployee' }
                    auth={ auth }
                    exact={ true }
                    link={ '/addemployee' }
                    path={ '/addemployee' }
                    pageName={'addemployee' }
                    layout={ Layout }
                    component={ AddEmployee }
                />
                <PrivateRoute 
                    key={ 'detailemployee' }
                    auth={ auth }
                    exact={ true }
                    link={ '/detailemployee' }
                    path={ '/detailemployee' }
                    pageName={'detailemployee' }
                    layout={ Layout }
                    component={ DetailEmployee }
                /> */}
                {/* <PrivateRoute 
                    key={ 'updateemployee' }
                    auth={ auth }
                    exact={ true }
                    link={ '/manage-company' }
                    path={ '/updateemployee' }
                    pageName={'manage-company' }
                    layout={ Layout }
                    component={ UpdateEmployee }
                /> */}
                {/* <PrivateRoute 
                    key={ 'listemployee' }
                    auth={ auth }
                    exact={ true }
                    link={ '/listemployee' }
                    path={ '/listemployee' }
                    pageName={'listemployee' }
                    layout={ Layout }
                    component={ ListEmployee }
                /> */}
                {/* <Route exact path="/addemployee" layout={ Layout } component={AddEmployee} /> */}
                {/* <Route exact path="/detailemployee" layout={ Layout } component={DetailEmployee} /> */}
                {/* <Route exact path="/updateemployee" layout={ Layout } component={UpdateEmployee} /> */}
                {/* <Route exact path="/listemployee" layout={ Layout } component={ListEmployee} /> */}
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return state;
}

export default connect(mapStateToProps, null)(Routes);