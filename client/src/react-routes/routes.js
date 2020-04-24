import React, { Component } from 'react';
import { Route,Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { PrivateRoute } from './privateRoute';
import { AuthRoute } from './authRoute';

import Layout from '../layout/layout';

import {NotFound} from '../modules/not-found/components';

import Login from '../modules/auth/components/login';
import ResetPassword from '../modules/auth/components/resetPassword';

import ManageFormDocument from '../modules/document/components';

import Home from '../modules/home/components';

import { Notifications } from "../modules/combine-modules";

import System from '../modules/system-admin/log/components';
import Company from '../modules/system-admin/company/components';
import LinksDefaultManagement from '../modules/system-admin/system-link/components';
import RolesDefaultManagement from '../modules/system-admin/root-role/components';
import ComponentsDefaultManagement from '../modules/system-admin/system-component/components';

import ManageUser from '../modules/super-admin/user/components';
import ManageRole from '../modules/super-admin/role/components';
import ManageLink from '../modules/super-admin/link/components';
import ManageDepartment from '../modules/super-admin/organizational-unit/components';
import ManageComponent from '../modules/super-admin/component/components';


import ManagerSabbatical from '../modules/human-resource/annual-leave/components';
import { ManagerPraiseDiscipline} from '../modules/human-resource/commendation-discipline/components';
import { DashBoardEmployees} from '../modules/human-resource/employee-dashboard/components/employeeDashBoard';
import { DepartmentManage} from '../modules/human-resource/employee-in-organizational-unit/components/employeeInOrganizationalUnit';
import { ManageHoliday } from '../modules/human-resource/holiday/components/holidayManagement';
import { EmployeeDetail, UpdateEmployee} from '../modules/human-resource/profile/employee-info/components/combinedContent';
import { ListEmployee, AddEmployee} from '../modules/human-resource/profile/employee-management/components/combinedContent';
import {EmployeeCreatePage} from '../modules/human-resource/profile/employee-create/components/employeeCreatePage';
import ManagerSalary from '../modules/human-resource/salary/components';
import { Timekeeping} from '../modules/human-resource/timesheet/components/timesheet';

import { ListEducation} from '../modules/training/education-program/components/educationProgramList';
import { TrainingPlan} from '../modules/training/course/components/course';

import {OrganizationalUnitKpiCreate} from "../modules/kpi/organizational-unit/creation/component/organizationalUnitKpiCreate";
import {OrganizationalUnitKpiDashboard} from "../modules/kpi/organizational-unit/dashboard/component/organizationalUnitKpiDashboard";
import {KPIUnitManager} from "../modules/kpi/organizational-unit/management/component/organizationalUnitKpiOverview";
import {KPIUnitEvaluate} from "../modules/kpi/organizational-unit/evaluation/component/organizationalUnitKpiEvaluation";

import {CreateEmployeeKpiSet} from "../modules/kpi/employee/creation/component/employeeKpiCreate";
import {KPIPersonalManager} from "../modules/kpi/employee/management/component/employeeKpiManagement";
import {DashBoardKPIPersonal} from "../modules/kpi/employee/dashboard/component/employeeKpiDashboard";
import {KPIPersonalEvaluate} from "../modules/kpi/employee/management/component/employeeKpiData";

import {KPIMember} from "../modules/kpi/evaluation/employee-evaluation/component/employeeKpiManagement";
import {DashBoardKPIMember} from "../modules/kpi/evaluation/dashboard/component/employeeKpiEvaluationDashboard";


import { TaskManagement } from "../modules/task/task-management/component/taskManagement";
import { TaskDashboard } from "../modules/task/task-management/component/taskDashboard";
import {TaskTemplate} from '../modules/task/task-template/component/taskTemplate';

//asset
import RecommendProcure from "../modules/assets-manager/recommend-procure/components";
import ManagerAssetType from "../modules/assets-manager/asset-type/components";
import ManagerRepairUpgrade from "../modules/assets-manager/repair-upgrade/components";
import ManagerDistributeTransfer from "../modules/assets-manager/distribute-transfer/components";
import ManagerDepreciation from "../modules/assets-manager/depreciation/components";
import ManagerAsset from "../modules/assets-manager/asset-manager/components";
import {AssetCreatePage} from '../modules/assets-manager/asset-create/components/AssetCreatePage';

class Routes extends Component {

    render() {
        const { auth, company, user, role, link, component, department,employeesManager } = this.props;
        return (
            <React.Fragment>
                <Switch>
                    <AuthRoute exact auth={ auth } path="/login" component={ Login } />
                    <AuthRoute exact auth={ auth } path="/reset-password" component={ ResetPassword } />
                    <PrivateRoute 
                        isLoading={ false }
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
                        component={ System }
                    />
                    <PrivateRoute 
                        isLoading={ this.props.rolesDefault.isLoading }
                        key={ 'manage_roles_default' }
                        arrPage={[
                            { link: '/system/roles-default-management', name:'manage_role', icon: 'fa fa-lock'}
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/system/roles-default-management' }
                        path={ '/system/roles-default-management' }
                        pageName={ 'manage_role' }
                        layout={ Layout }
                        component={ RolesDefaultManagement }
                    />
                    <PrivateRoute 
                        isLoading={ this.props.linksDefault.isLoading }
                        key={ 'manage_links_default' }
                        arrPage={[
                            { link: '/system/links-default-management', name:'manage_link', icon: 'fa fa-link'}
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/system/links-default-management' }
                        path={ '/system/links-default-management' }
                        pageName={ 'manage_link' }
                        layout={ Layout }
                        component={ LinksDefaultManagement }
                    />
                    <PrivateRoute 
                        isLoading={ this.props.componentsDefault.isLoading }
                        key={ 'manage_components_default' }
                        arrPage={[
                            { link: '/system/components-default-management', name:'manage_component', icon: 'fa fa-object-group'}
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/system/components-default-management' }
                        path={ '/system/components-default-management' }
                        pageName={ 'manage_component' }
                        layout={ Layout }
                        component={ ComponentsDefaultManagement }
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
                        isLoading={ this.props.company.isLoading }
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
                        component={ Company }
                    />
                    <PrivateRoute 
                        isLoading={ this.props.user.isLoading }
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
                        isLoading={ this.props.role.isLoading }
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
                        isLoading={ this.props.link.isLoading }
                        key={ 'links-management' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/links-management', name: 'manage_link', icon:'fa fa-link' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/links-management' }
                        path={ '/links-management' }
                        pageName={ 'manage_link' }
                        layout={ Layout }
                        component={ ManageLink }
                    />
                    <PrivateRoute 
                        isLoading={ this.props.department.isLoading }
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
                        isLoading={ this.props.component.isLoading }
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
                        isLoading={ false }
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
                        isLoading={ this.props.employeesManager.isLoading }
                        key={ 'add_employee' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/hr-add-employee', name: 'add_employee', icon:'fa fa-user-plus' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/hr-add-employee' }
                        path={ '/hr-add-employee' }
                        pageName={'add_employee' }
                        layout={ Layout }
                        component={ EmployeeCreatePage }
                    />
                    <PrivateRoute 
                        isLoading={ this.props.employeesInfo.isLoading }
                        key={ 'detail_employee' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/hr-detail-employee', name: 'detail_employee', icon:'fa fa-user-o' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/hr-detail-employee' }
                        path={ '/hr-detail-employee' }
                        pageName={'detail_employee' }
                        layout={ Layout }
                        component={ EmployeeDetail }
                    />
                    <PrivateRoute 
                        isLoading={ this.props.employeesInfo.isLoading }
                        key={ 'update_employee' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/hr-update-employee', name: 'update_employee', icon:'fa fa-pencil-square-o' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/hr-update-employee' }
                        path={ '/hr-update-employee' }
                        pageName={'update_employee' }
                        layout={ Layout }
                        component={ UpdateEmployee }
                    />
                    <PrivateRoute 
                        isLoading={ this.props.employeesManager.isLoading }
                        key={ 'list_employee' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/hr-list-employee', name: 'list_employee', icon:'fa fa-address-card' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/hr-list-employee' }
                        path={ '/hr-list-employee' }
                        pageName={'list_employee' }
                        layout={ Layout }
                        component={ ListEmployee }
                    />

                    <PrivateRoute 
                        isLoading={ this.props.department.isLoading }
                        key={ 'manage_unit' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/hr-manage-department', name: 'manage_unit', icon:'fa fa-sitemap' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/hr-manage-department' }
                        path={ '/hr-manage-department' }
                        pageName={'manage_unit' }
                        layout={ Layout }
                        component={ DepartmentManage }
                    />

                    <PrivateRoute 
                        isLoading={ false }
                        key={ 'dashBoard_employee' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/hr-dashboard-employee', name: 'dashboard_employee', icon:'fa fa-dashboard' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/hr-dashboard-employee' }
                        path={ '/hr-dashboard-employee' }
                        pageName={'dashboard_employee' }
                        layout={ Layout }
                        component={ DashBoardEmployees }
                    />
                    <PrivateRoute 
                        isLoading={ this.props.discipline.isLoading }
                        key={ 'discipline' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/hr-discipline', name: 'discipline', icon:'fa fa-balance-scale' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/hr-discipline' }
                        path={ '/hr-discipline' }
                        pageName={'discipline' }
                        layout={ Layout }
                        component={ ManagerPraiseDiscipline }
                    />
                    <PrivateRoute 
                        isLoading={ this.props.annualLeave.isLoading }
                        key={ 'sabbatical' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/hr-sabbatical', name: 'sabbatical', icon:'fa fa-calendar-times-o' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/hr-sabbatical' }
                        path={ '/hr-sabbatical' }
                        pageName={'sabbatical' }
                        layout={ Layout }
                        component={ ManagerSabbatical }
                    />
                    <PrivateRoute 
                        isLoading={ this.props.holiday.isLoading }
                        key={ 'manage_holiday' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/hr-manage-holiday', name: 'manage_holiday', icon:'fa fa-calendar' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/hr-manage-holiday' }
                        path={ '/hr-manage-holiday' }
                        pageName={'manage_holiday' }
                        layout={ Layout }
                        component={ ManageHoliday }
                    />
                    <PrivateRoute 
                        isLoading={ this.props.salary.isLoading }
                        key={ 'salary_employee' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/hr-salary-employee', name: 'salary_employee', icon:'fa fa-line-chart' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/hr-salary-employee' }
                        path={ '/hr-salary-employee' }
                        pageName={'salary_employee' }
                        layout={ Layout }
                        component={ ManagerSalary }
                    />
                    <PrivateRoute 
                        isLoading={ false }
                        key={ 'time_keeping' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/hr-time-keeping', name: 'time_keeping', icon:'fa fa-calculator' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/hr-time-keeping' }
                        path={ '/hr-time-keeping' }
                        pageName={'time_keeping' }
                        layout={ Layout }
                        component={ Timekeeping }
                    />
                    <PrivateRoute 
                        isLoading={ this.props.education.isLoading }
                        key={ 'list_education' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/hr-list-education', name: 'list_education', icon:'fa fa-university' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/hr-list-education' }
                        path={ '/hr-list-education' }
                        pageName={'list_education' }
                        layout={ Layout }
                        component={ ListEducation }
                    />
                    <PrivateRoute 
                        isLoading={ this.props.course.isLoading }
                        key={ 'training_plan' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/hr-training-plan', name: 'training_plan', icon:'fa fa-list-alt' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/hr-training-plan' }
                        path={ '/hr-training-plan' }
                        pageName={'training_plan' }
                        layout={ Layout }
                        component={ TrainingPlan }
                    />

                    {/* kpi - routes */}
                    <PrivateRoute 
                        isLoading={ this.props.createKpiUnit.isLoading }
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
                        component={ OrganizationalUnitKpiCreate }
                    />
                    <PrivateRoute 
                        isLoading={ false }
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
                        isLoading={ this.props.dashboardKpiUnit.isLoading }
                        key={ 'kpi-unit-dashboard' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/kpi-units/dashboard', name: 'kpi_unit_dashboard', icon:'' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/kpi-units/dashboard' }
                        path={ '/kpi-units/dashboard' }
                        pageName={ 'kpi_unit_dashboard' }
                        layout={ Layout }
                        component={ OrganizationalUnitKpiDashboard }
                    />
                    <PrivateRoute 
                        isLoading={ this.props.managerKpiUnit.isLoading }
                        key={ 'kpi-unit-manager' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/kpi-units/manager', name: 'kpi_unit_manager', icon:'' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/kpi-units/manager' }
                        path={ '/kpi-units/manager' }
                        pageName={ 'kpi_unit_manager' }
                        layout={ Layout }
                        component={ KPIUnitManager }
                    />
                    <PrivateRoute 
                        isLoading={ this.props.createEmployeeKpiSet.isLoading }
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
                        component={ CreateEmployeeKpiSet }
                    />
                    <PrivateRoute 
                        isLoading={ this.props.KPIPersonalManager.isLoading }
                        key={ 'kpi-personal-manager' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/kpi-personals/manager', name: 'kpi_personal_manager', icon:'' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/kpi-personals/manager' }
                        path={ '/kpi-personals/manager' }
                        pageName={ 'kpi_personal_manager' }
                        layout={ Layout }
                        component={ KPIPersonalManager }
                    />
                    <PrivateRoute 
                        isLoading={ this.props.dashboardKPIPersonal.isLoading }
                        key={ 'kpi-personal-dashboard' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/kpi-personals/dashboard', name: 'kpi_personal_dasdboad', icon:'' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/kpi-personals/dashboard' }
                        path={ '/kpi-personals/dashboard' }
                        pageName={ 'kpi_personal_dashboard' }
                        layout={ Layout }
                        component={DashBoardKPIPersonal }
                    />
                    <PrivateRoute 
                        isLoading={ false }
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
                        isLoading={ this.props.tasktemplates.isLoading }
                        key={ 'task-template-management' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/task-template', name: 'task_template', icon:'fa fa-flash' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/task-template' }
                        path={ '/task-template' }
                        pageName={ 'task_template' }
                        layout={ Layout }
                        component={ TaskTemplate }
                    />

                    <PrivateRoute 
                        isLoading={ false }
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
                    <PrivateRoute 
                        isLoading={ this.props.kpimembers.isLoading }
                        key={ 'kpi_member_manager' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link:'/kpi-member/manager', name: 'kpi_member_manager', icon:'fa fa-number' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={'/kpi-member/manager'}
                        path={ '/kpi-member/manager' }
                        pageName= "kpi_member_manager"
                        layout={ Layout }
                        component={ KPIMember }
                    />
                    <PrivateRoute 
                        isLoading={ false }
                        key={ 'kpi_member_dashboard' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link:'/kpi-member/dashboard', name: 'kpi_member_dashboard', icon:'fa fa-number' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={'/kpi-member/dashboard'}
                        path={ '/kpi-member/dashboard' }
                        pageName= "kpi_member_dashboard"
                        layout={ Layout }
                        component={ DashBoardKPIMember }
                    />
                     {/* Task Management */}
                     <PrivateRoute 
                        isLoading={ this.props.tasks.isLoading }
                        key={ 'task-management' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/task-management', name: 'task_management', icon:'' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/task-management' }
                        path={ '/task-management' }
                        pageName={ 'task_management' }
                        layout={ Layout }
                        component={ TaskManagement }
                    />
                    <PrivateRoute 
                        isLoading={ false }
                        key={ 'task-management-dashboard' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/task-management-dashboard', name: 'task_management_dashboard', icon:'' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/task-management-dashboard' }
                        path={ '/task-management-dashboard' }
                        pageName={ 'task_management_dashboard' }
                        layout={ Layout }
                        component={ TaskDashboard }
                    />

                    {/** Quản lý tài sản */}
                    {/** Nhân viên */}
                    <PrivateRoute 
                        isLoading={ this.props.recommendProcure.isLoading }
                        key={ 'recommend-equipment-procurement' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/recommend-equipment-procurement', name: 'recommend_equipment_procurement', icon:'' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/recommend-equipment-procurement' }
                        path={ '/recommend-equipment-procurement' }
                        pageName={ 'recommend_equipment_procurement' }
                        layout={ Layout }
                        component={ RecommendProcure }
                    />

                    {/** Quản lý */}
                    <PrivateRoute 
                        isLoading={ this.props.assetType.isLoading }
                        key={ 'manage-type-asset' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/manage-type-asset', name: 'manage_type_asset', icon:'' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/manage-type-asset' }
                        path={ '/manage-type-asset' }
                        pageName={ 'manage_type_asset' }
                        layout={ Layout }
                        component={ ManagerAssetType }
                    /> 

                    <PrivateRoute 
                        isLoading={ this.props.asset.isLoading }
                        key={ 'add-asset' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/add-asset', name: 'add_asset', icon:'' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/add-asset' }
                        path={ '/add-asset' }
                        pageName={ 'add_asset' }
                        layout={ Layout }
                        component={ AssetCreatePage }
                    /> 

                    <PrivateRoute 
                        isLoading={ this.props.asset.isLoading }
                        key={ 'manage-info-asset' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/manage-info-asset', name: 'manage_info_asset', icon:'' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/manage-info-asset' }
                        path={ '/manage-info-asset' }
                        pageName={ 'manage_info_asset' }
                        layout={ Layout }
                        component={ ManagerAsset }
                    />

                    <PrivateRoute 
                        isLoading={ this.props.repairUpgrade.isLoading }
                        key={ 'manage-repair-asset' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/manage-repair-asset', name: 'manage_repair_asset', icon:'' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/manage-repair-asset' }
                        path={ '/manage-repair-asset' }
                        pageName={ 'manage_repair_asset' } //manage_distribute_asset
                        layout={ Layout }
                        component={ ManagerRepairUpgrade }
                    /> 

                    <PrivateRoute 
                        isLoading={ this.props.repairUpgrade.isLoading }
                        key={ 'manage-distribute-asset' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/manage-distribute-asset', name: 'manage_distribute_asset', icon:'' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/manage-distribute-asset' } 
                        path={ '/manage-distribute-asset' }
                        pageName={ 'manage_distribute_asset' }
                        layout={ Layout }
                        component={ ManagerDistributeTransfer }
                    />

                    <PrivateRoute 
                        isLoading={ false }
                        key={ 'manage-depreciation-asset' }
                        arrPage={[
                            { link: '/', name:'home', icon: 'fa fa-home'},
                            { link: '/manage-depreciation-asset', name: 'manage_depreciation_asset', icon:'' }
                        ]}
                        auth={ auth }
                        exact={ true }
                        link={ '/manage-depreciation-asset' } //manage_depreciation_asset
                        path={ '/manage-depreciation-asset' }
                        pageName={ 'manage_depreciation_asset' }
                        layout={ Layout }
                        component={ ManagerDepreciation }
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