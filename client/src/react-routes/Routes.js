import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from "react-router-dom";
import { PrivateRoute, AuthRoute } from './route-export';

import Layout from '../layouts/Layout';
import Login from '../modules/auth/components/Login';
import Home from '../modules/home/components';
import ManageCompany from '../modules/system-admin-management/manage-company/components';
import ManageUser from '../modules/super-admin-management/manage-user/components';
import ManageRole from '../modules/super-admin-management/manage-role/components';
import ManageLink from '../modules/system-admin-management/manage-link/components';
import ManageDepartment from '../modules/super-admin-management/manage-department/components';
import ManageComponent from '../modules/system-admin-management/manage-component/components';
import ManageFormDocument from '../modules/super-admin-management/manage-form-document/components';
import { AddEmployee, DetailEmployee, UpdateEmployee,} from '../modules/employees-manager/employee-info/components/CombineContent';
import { ListEmployee} from '../modules/employees-manager/employee-manager/components/ListEmployee';
import { DashBoardEmployees} from '../modules/employees-manager/dashBoard-employeesManagement/components/DashBoardEmployees';
import { Discipline} from '../modules/employees-manager/discipline/components/Discipline';
import { Sabbatical} from '../modules/employees-manager/sabbatical/components/Sabbatical';
import { SalaryEmployee} from '../modules/employees-manager/salary-employee/components/SalaryEmployee';
import { Timekeeping} from '../modules/employees-manager/timekeeping/components/Timekeeping';
import { ListCourse} from '../modules/training-course/list-course/components/ListCourse';
import { TrainingPlan} from '../modules/training-course/training-plan/components/TrainingPlan';

class Routes extends Component {

    render() {
        const { auth, company, user, role, link, component, department } = this.props;
        return (
            <React.Fragment>
                <AuthRoute exact auth={ auth } path="/login" component={ Login } />
                <PrivateRoute 
                    isLoading={ auth.isLoading }
                    key={ 'home' }
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
                <PrivateRoute 
                    key={ 'addemployee' }
                    auth={ auth }
                    exact={ true }
                    link={ '/add-employee' }
                    path={ '/add-employee' }
                    pageName={'addemployee' }
                    layout={ Layout }
                    component={ AddEmployee }
                />
                <PrivateRoute 
                    key={ 'detailemployee' }
                    auth={ auth }
                    exact={ true }
                    link={ '/detail-employee' }
                    path={ '/detail-employee' }
                    pageName={'detailemployee' }
                    layout={ Layout }
                    component={ DetailEmployee }
                />
                <PrivateRoute 
                    key={ 'updateemployee' }
                    auth={ auth }
                    exact={ true }
                    link={ '/update-employee' }
                    path={ '/update-employee' }
                    pageName={'updateemployee' }
                    layout={ Layout }
                    component={ UpdateEmployee }
                />
                <PrivateRoute 
                    key={ 'listemployee' }
                    auth={ auth }
                    exact={ true }
                    link={ '/list-employee' }
                    path={ '/list-employee' }
                    pageName={'listemployee' }
                    layout={ Layout }
                    component={ ListEmployee }
                />
                <PrivateRoute 
                    key={ 'dashBoardEmployee' }
                    auth={ auth }
                    exact={ true }
                    link={ '/dashboard-employee' }
                    path={ '/dashboard-employee' }
                    pageName={'dashboardemployee' }
                    layout={ Layout }
                    component={ DashBoardEmployees }
                />
                <PrivateRoute 
                    key={ 'discipline' }
                    auth={ auth }
                    exact={ true }
                    link={ '/discipline' }
                    path={ '/discipline' }
                    pageName={'discipline' }
                    layout={ Layout }
                    component={ Discipline }
                />
                <PrivateRoute 
                    key={ 'sabbatical' }
                    auth={ auth }
                    exact={ true }
                    link={ '/sabbatical' }
                    path={ '/sabbatical' }
                    pageName={'sabbatical' }
                    layout={ Layout }
                    component={ Sabbatical }
                />
                <PrivateRoute 
                    key={ 'salaryemployee' }
                    auth={ auth }
                    exact={ true }
                    link={ '/salary-employee' }
                    path={ '/salary-employee' }
                    pageName={'salaryemployee' }
                    layout={ Layout }
                    component={ SalaryEmployee }
                />
                <PrivateRoute 
                    key={ 'timekeeping' }
                    auth={ auth }
                    exact={ true }
                    link={ '/time-keeping' }
                    path={ '/time-keeping' }
                    pageName={'timekeeping' }
                    layout={ Layout }
                    component={ Timekeeping }
                />
                <PrivateRoute 
                    key={ 'listCourse' }
                    auth={ auth }
                    exact={ true }
                    link={ '/list-course' }
                    path={ '/list-course' }
                    pageName={'listCourse' }
                    layout={ Layout }
                    component={ ListCourse }
                />
                <PrivateRoute 
                    key={ 'trainingplan' }
                    auth={ auth }
                    exact={ true }
                    link={ '/training-plan' }
                    path={ '/training-plan' }
                    pageName={'trainingplan' }
                    layout={ Layout }
                    component={ TrainingPlan }
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return state;
}

export default connect(mapStateToProps, null)(Routes);