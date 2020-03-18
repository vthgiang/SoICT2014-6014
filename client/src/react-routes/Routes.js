import React, { Component } from 'react';
import { Route,Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { PrivateRoute, AuthRoute } from './route-export';
import Layout from '../layouts/Layout';
import {NotFound} from '../modules/not-found/components';
import Login from '../modules/auth/components/Login';
import LogManagement from '../modules/system-admin-management/logs-management/components';
import Home from '../modules/home/components';
import ManageCompany from '../modules/system-admin-management/companies-management/components';
import ManageUser from '../modules/super-admin-management/users-management/components';
import ManageRole from '../modules/super-admin-management/roles-management/components';
import ManageLink from '../modules/super-admin-management/links-management/components';
import ManageDepartment from '../modules/super-admin-management/departments-management/components';
import ManageComponent from '../modules/system-admin-management/components-management/components';
import ManageFormDocument from '../modules/super-admin-management/documents-management/components';
import { DetailEmployee, UpdateEmployee,} from '../modules/employees-manager/employee-info/components/CombineContent';
import { ListEmployee,AddEmployee} from '../modules/employees-manager/employee-manager/components/CombineContent';
import { DashBoardEmployees} from '../modules/employees-manager/dashboard-employee-manage/components/DashBoardEmployees';
import { Discipline} from '../modules/employees-manager/discipline/components/Discipline';
import { Sabbatical} from '../modules/employees-manager/sabbatical/components/Sabbatical';
import { SalaryEmployee} from '../modules/employees-manager/salary-employee/components/SalaryEmployee';
import { Timekeeping} from '../modules/employees-manager/timekeeping/components/Timekeeping';
import { ListCourse} from '../modules/training-course/list-course/components/ListCourse';
import { TrainingPlan} from '../modules/training-course/training-plan/components/TrainingPlan';
import { DepartmentManage} from '../modules/employees-manager/department-manager/components/DepartmentManage';


import {KPIUnitCreate} from "../modules/kpi-unit/kpi-unit-create/component/KPIUnitCreate";
import {KPIUnitOverview} from "../modules/kpi-unit/kpi-unit-overview/component/KPIUnitOverview";
import {KPIUnitEvaluate} from "../modules/kpi-unit/kpi-unit-evaluate/component/KPIUnitEvaluate";
import {KPIPersonalOverview} from "../modules/kpi-personal/kpi-personal-overview/component/KPIPersonalOverview";
import {KPIPersonalCreate} from "../modules/kpi-personal/kpi-personal-create/component/KPIPersonalCreate";
import {KPIPersonalEvaluate} from "../modules/kpi-personal/kpi-personal-data/component/KPIPersonalData";

import { Notifications } from "../modules/combine-modules";

class Routes extends Component {

    render() {
        const { auth, company, user, role, link, component, department } = this.props;
        return (
            <React.Fragment>
                <Switch>
                    <AuthRoute exact auth={ auth } path="/login" component={ Login } />
                    <PrivateRoute 
                        isLoading={ company.isLoading }
                        key={ 'manage_system' }
                        arrPage={[
                            { link: '/system/settings', name:'manage_system', icon: 'fa fa-gears'}
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/system/settings' }
                        path={ '/system/settings' }
                        pageName={ 'manage_system' }
                        layout={ Layout }
                        component={ LogManagement }
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
                        key={ 'companies-management' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/system/companies-management', name: 'manage_company', icon:'fa fa-building' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/system/companies-management' }
                        path={ '/system/companies-management' }
                        pageName={ 'manage_company' }
                        layout={ Layout }
                        component={ ManageCompany }
                    />
                    <PrivateRoute 
                        isLoading={ user.isLoading }
                        key={ 'users-management' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/users-management', name: 'manage_user', icon:'fa fa-users' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/users-management' }
                        path={ '/users-management' }
                        pageName={ 'manage_user' }
                        layout={ Layout }
                        component={ ManageUser }
                    />
                    <PrivateRoute 
                        isLoading={ role.isLoading }
                        arrPage={[
                            { link: '/', name:'home', icon:'fa fa-home' },
                            { link: '/roles-management', name: 'manage_role', icon:'fa fa-lock'}
                        ]}
                        key={ 'roles-management' }
                        auth={ auth }
                        exact={ true }
                        link={ '/roles-management' }
                        path={ '/roles-management' }
                        pageName={ 'manage_role' }
                        layout={ Layout }
                        component={ ManageRole }
                    />
                    <PrivateRoute 
                        isLoading={ link.isLoading }
                        key={ 'links-management' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/pages-management', name: 'manage_page', icon:'fa fa-link' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/pages-management' }
                        path={ '/pages-management' }
                        pageName={ 'manage_page' }
                        layout={ Layout }
                        component={ ManageLink }
                    />
                    <PrivateRoute 
                        isLoading={ department.isLoading }
                        key={ 'departments-management' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/departments-management', name: 'manage_department', icon:'fa fa-sitemap' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/departments-management' }
                        path={ '/departments-management' }
                        pageName={ 'manage_department' }
                        layout={ Layout }
                        component={ ManageDepartment }
                    />
                    <PrivateRoute 
                        isLoading={ component.isLoading }
                        key={ 'components-management' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/components-management', name: 'manage_component', icon:'fa fa-object-group' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/components-management' }
                        path={ '/components-management' }
                        pageName={ 'manage_component' }
                        layout={ Layout }
                        component={ ManageComponent }
                    />
                    <PrivateRoute 
                        key={ 'manage-document' }
                        auth={ auth }
                        exact={ true }
                        link={ '/documents-managements' }
                        path={ '/documents-managements' }
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
                        key={ 'manage_unit' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/manage_unit', name: 'manage_unit', icon:'fa fa-sitemap' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/manage-unit' }
                        path={ '/manage-unit' }
                        pageName={'manage_unit' }
                        layout={ Layout }
                        component={ DepartmentManage }
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

                    {/* kpi - routes */}
                    <PrivateRoute 
                        isLoading={ component.isLoading }
                        key={ 'kpi-unit-create' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/kpi-units/create', name: 'kpi_unit_create', icon:'' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/kpi-units/create' }
                        path={ '/kpi-units/create' }
                        pageName={ 'kpi_unit_create' }
                        layout={ Layout }
                        component={ KPIUnitCreate }
                    />
                    <PrivateRoute 
                        isLoading={ component.isLoading }
                        key={ 'kpi-unit-evaluate' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/kpi-units/evaluate', name: 'kpi_unit_evaluate', icon:'' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/kpi-units/evaluate' }
                        path={ '/kpi-units/evaluate' }
                        pageName={ 'kpi_unit_evaluate' }
                        layout={ Layout }
                        component={ KPIUnitEvaluate }
                    />
                    <PrivateRoute 
                        isLoading={ component.isLoading }
                        key={ 'kpi-unit-overview' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/kpi-units/overview', name: 'kpi_unit_overview', icon:'' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/kpi-units/overview' }
                        path={ '/kpi-units/overview' }
                        pageName={ 'kpi_unit_overview' }
                        layout={ Layout }
                        component={ KPIUnitOverview }
                    />
                    <PrivateRoute 
                        isLoading={ component.isLoading }
                        key={ 'kpi-personal-create' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/kpi-personals/create', name: 'kpi_personal_create', icon:'' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/kpi-personals/create' }
                        path={ '/kpi-personals/create' }
                        pageName={ 'kpi_personal_create' }
                        layout={ Layout }
                        component={ KPIPersonalCreate }
                    />
                    <PrivateRoute 
                        isLoading={ component.isLoading }
                        key={ 'kpi-personal-overview' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/kpi-personals/overview', name: 'kpi_personal_overview', icon:'' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/kpi-personals/overview' }
                        path={ '/kpi-personals/overview' }
                        pageName={ 'kpi_personal_overview' }
                        layout={ Layout }
                        component={ KPIPersonalOverview }
                    />
                    <PrivateRoute 
                        isLoading={ component.isLoading }
                        key={ 'kpi-personal-evaluate' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/kpi-personals/evaluate', name: 'kpi_personal_evaluate', icon:'' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/kpi-personals/evaluate' }
                        path={ '/kpi-personals/evaluate' }
                        pageName={ 'kpi_personal_evaluate' }
                        layout={ Layout }
                        component={ KPIPersonalEvaluate }
                    />

                    <PrivateRoute 
                        isLoading={ company.isLoading }
                        key={ 'notifications' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/notifications', name: 'notifications', icon:'fa fa-bell' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/notifications' }
                        path={ '/notifications' }
                        pageName={ 'notifications' }
                        layout={ Layout }
                        component={ Notifications }
                    />

                    {/* NOT FOUND */}
                    <Route component={ NotFound }></Route>
                </Switch>
       
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return state;
}

export default connect(mapStateToProps, null)(Routes);