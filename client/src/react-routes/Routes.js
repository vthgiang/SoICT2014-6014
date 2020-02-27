import React, { Component } from 'react';
import { connect } from 'react-redux';
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
import { DetailEmployee, UpdateEmployee,} from '../modules/employees-manager/employee-info/components/CombineContent';
import { ListEmployee,AddEmployee} from '../modules/employees-manager/employee-manager/components/CombineContent';
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
                    isLoading={ company.isLoading }
                    key={ 'manage_system' }
                    arrPage={[
                        { link: '/system', name:'manage_system', icon: 'fa fa-gears'}
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/system' }
                    path={ '/system' }
                    pageName={ 'manage_system' }
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
                        { link: '/manage-company', name: 'manage_company', icon:'fa fa-building' }
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/manage-company' }
                    path={ '/manage-company' }
                    pageName={ 'manage_company' }
                    layout={ Layout }
                    component={ ManageCompany }
                />
                <PrivateRoute 
                    isLoading={ user.isLoading }
                    key={ 'manage-user' }
                    arrPage={[
                        { link: '/', name:'home', icon: 'fa fa-home'},
                        { link: '/manage-user', name: 'manage_user', icon:'fa fa-users' }
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/manage-user' }
                    path={ '/manage-user' }
                    pageName={ 'manage_user' }
                    layout={ Layout }
                    component={ ManageUser }
                />
                <PrivateRoute 
                    isLoading={ role.isLoading }
                    arrPage={[
                        { link: '/', name:'home', icon:'fa fa-home' },
                        { link: '/manage-role', name: 'manage_role', icon:'fa fa-lock'}
                    ]}
                    key={ 'manage-role' }
                    auth={ auth }
                    exact={ true }
                    link={ '/manage-role' }
                    path={ '/manage-role' }
                    pageName={ 'manage_role' }
                    layout={ Layout }
                    component={ ManageRole }
                />
                <PrivateRoute 
                    isLoading={ link.isLoading }
                    key={ 'manage-link' }
                    arrPage={[
                        { link: '/', name:'home', icon: 'fa fa-home'},
                        { link: '/manage-link', name: 'manage_page', icon:'fa fa-link' }
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/manage-link' }
                    path={ '/manage-link' }
                    pageName={ 'manage_page' }
                    layout={ Layout }
                    component={ ManageLink }
                />
                <PrivateRoute 
                    isLoading={ department.isLoading }
                    key={ 'manage-department' }
                    arrPage={[
                        { link: '/', name:'home', icon: 'fa fa-home'},
                        { link: '/manage-department', name: 'manage_department', icon:'fa fa-sitemap' }
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/manage-department' }
                    path={ '/manage-department' }
                    pageName={ 'manage_department' }
                    layout={ Layout }
                    component={ ManageDepartment }
                />
                <PrivateRoute 
                    isLoading={ component.isLoading }
                    key={ 'manage-component' }
                    arrPage={[
                        { link: '/', name:'home', icon: 'fa fa-home'},
                        { link: '/manage-component', name: 'manage_component', icon:'fa fa-object-group' }
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/manage-component' }
                    path={ '/manage-component' }
                    pageName={ 'manage_component' }
                    layout={ Layout }
                    component={ ManageComponent }
                />
                <PrivateRoute 
                    key={ 'manage-form-document' }
                    auth={ auth }
                    exact={ true }
                    link={ '/manage-document' }
                    path={ '/manage-document' }
                    pageName={ 'manage_document' }
                    layout={ Layout }
                    component={ ManageFormDocument }
                />
                {/* Quan ly nhan su */}
                <PrivateRoute 
                    isLoading={ component.isLoading }
                    key={ 'add_employee' }
                    arrPage={[
                        { link: '/', name:'home', icon: 'fa fa-home'},
                        { link: '/add-employee', name: 'add_employee', icon:'fa fa-user-plus' }
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/add-employee' }
                    path={ '/add-employee' }
                    pageName={'add_employee' }
                    layout={ Layout }
                    component={ AddEmployee }
                />
                <PrivateRoute 
                    isLoading={ component.isLoading }
                    key={ 'detail_employee' }
                    arrPage={[
                        { link: '/', name:'home', icon: 'fa fa-home'},
                        { link: '/detail-employee', name: 'detail_employee', icon:'fa fa-user-o' }
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/detail-employee' }
                    path={ '/detail-employee' }
                    pageName={'detail_employee' }
                    layout={ Layout }
                    component={ DetailEmployee }
                />
                <PrivateRoute 
                    isLoading={ component.isLoading }
                    key={ 'update_employee' }
                    arrPage={[
                        { link: '/', name:'home', icon: 'fa fa-home'},
                        { link: '/update-employee', name: 'update_employee', icon:'fa fa-pencil-square-o' }
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/update-employee' }
                    path={ '/update-employee' }
                    pageName={'update_employee' }
                    layout={ Layout }
                    component={ UpdateEmployee }
                />
                <PrivateRoute 
                    isLoading={ component.isLoading }
                    key={ 'list_employee' }
                    arrPage={[
                        { link: '/', name:'home', icon: 'fa fa-home'},
                        { link: '/list-employee', name: 'list_employee', icon:'fa fa-address-card' }
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/list-employee' }
                    path={ '/list-employee' }
                    pageName={'list_employee' }
                    layout={ Layout }
                    component={ ListEmployee }
                />
                <PrivateRoute 
                    isLoading={ component.isLoading }
                    key={ 'dashBoard_employee' }
                    arrPage={[
                        { link: '/', name:'home', icon: 'fa fa-home'},
                        { link: '/dashboard-employee', name: 'dashboard_employee', icon:'fa fa-dashboard' }
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/dashboard-employee' }
                    path={ '/dashboard-employee' }
                    pageName={'dashboard_employee' }
                    layout={ Layout }
                    component={ DashBoardEmployees }
                />
                <PrivateRoute 
                    isLoading={ component.isLoading }
                    key={ 'discipline' }
                    arrPage={[
                        { link: '/', name:'home', icon: 'fa fa-home'},
                        { link: '/discipline', name: 'discipline', icon:'fa fa-balance-scale' }
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/discipline' }
                    path={ '/discipline' }
                    pageName={'discipline' }
                    layout={ Layout }
                    component={ Discipline }
                />
                <PrivateRoute 
                    isLoading={ component.isLoading }
                    key={ 'sabbatical' }
                    arrPage={[
                        { link: '/', name:'home', icon: 'fa fa-home'},
                        { link: '/sabbatical', name: 'sabbatical', icon:'fa fa-calendar-times-o' }
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/sabbatical' }
                    path={ '/sabbatical' }
                    pageName={'sabbatical' }
                    layout={ Layout }
                    component={ Sabbatical }
                />
                <PrivateRoute 
                    isLoading={ component.isLoading }
                    key={ 'salary_employee' }
                    arrPage={[
                        { link: '/', name:'home', icon: 'fa fa-home'},
                        { link: '/salary-employee', name: 'salary_employee', icon:'fa fa-line-chart' }
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/salary-employee' }
                    path={ '/salary-employee' }
                    pageName={'salary_employee' }
                    layout={ Layout }
                    component={ SalaryEmployee }
                />
                <PrivateRoute 
                    isLoading={ component.isLoading }
                    key={ 'time_keeping' }
                    arrPage={[
                        { link: '/', name:'home', icon: 'fa fa-home'},
                        { link: '/time-keeping', name: 'time_keeping', icon:'fa fa-calculator' }
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/time-keeping' }
                    path={ '/time-keeping' }
                    pageName={'time_keeping' }
                    layout={ Layout }
                    component={ Timekeeping }
                />
                <PrivateRoute 
                    isLoading={ component.isLoading }
                    key={ 'list_course' }
                    arrPage={[
                        { link: '/', name:'home', icon: 'fa fa-home'},
                        { link: '/list-course', name: 'list_course', icon:'fa fa-university' }
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/list-course' }
                    path={ '/list-course' }
                    pageName={'list_course' }
                    layout={ Layout }
                    component={ ListCourse }
                />
                <PrivateRoute 
                    isLoading={ component.isLoading }
                    key={ 'training_plan' }
                    arrPage={[
                        { link: '/', name:'home', icon: 'fa fa-home'},
                        { link: '/training-plan', name: 'training_plan', icon:'fa fa-list-alt' }
                    ]}
                    auth={ auth }
                    exact={ true }
                    link={ '/training-plan' }
                    path={ '/training-plan' }
                    pageName={'training_plan' }
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