import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { PrivateRoute } from './privateRoute';
import { AuthRoute } from './authRoute';

import Layout from '../layout/layout';

import { NotFound } from '../modules/not-found/components';

import Login from '../modules/auth/components/login';
import ResetPassword from '../modules/auth/components/resetPassword';

import ManageDocument from '../modules/document/components/administration';
import Document from '../modules/document/components/user';

import { Home } from '../modules/home/components';

import { Notifications } from "../modules/combine-modules";

import { SystemSetting } from '../modules/system-admin/system-setting/components';
import { Company } from '../modules/system-admin/company/components';
import { ManageLinkSystem } from '../modules/system-admin/system-link/components';
import ManageRoleDefault from '../modules/system-admin/root-role/components';
import ComponentsDefaultManagement from '../modules/system-admin/system-component/components';

import ManageSystem from '../modules/super-admin/system/components';
import ManageUser from '../modules/super-admin/user/components';
import ManageRole from '../modules/super-admin/role/components';
import ManageLink from '../modules/super-admin/link/components';
import ManageDepartment from '../modules/super-admin/organizational-unit/components';
import ManageComponent from '../modules/super-admin/component/components';


import AnnualLeaveManager from '../modules/human-resource/annual-leave/components';
import { ManagerPraiseDiscipline } from '../modules/human-resource/commendation-discipline/components';
import EmployeeDashBoard from '../modules/human-resource/employee-dashboard/components';
import { DepartmentManage } from '../modules/human-resource/employee-in-organizational-unit/components/employeeInOrganizationalUnit';
import { ManageHoliday } from '../modules/human-resource/holiday/components/holidayManagement';
import { EmployeeDetail, UpdateEmployee } from '../modules/human-resource/profile/employee-info/components/combinedContent';
import EmpoyeeManager from '../modules/human-resource/profile/employee-management/components';
import EmployeeCreate from '../modules/human-resource/profile/employee-create/components';
import SalaryManager from '../modules/human-resource/salary/components';
import TimesheetsManager from '../modules/human-resource/timesheets/components';
import { AnnualLeave } from '../modules/human-resource/annual-leave/components/combinedContent';
import { ManageLeaveApplication } from '../modules/human-resource/annual-leave/components/combinedContent';

import { ListEducation } from '../modules/training/education-program/components/educationProgramList';
import { TrainingPlan } from '../modules/training/course/components/course';

import { OrganizationalUnitKpiCreate } from "../modules/kpi/organizational-unit/creation/component/organizationalUnitKpiCreate";
import { OrganizationalUnitKpiDashboard } from "../modules/kpi/organizational-unit/dashboard/component/organizationalUnitKpiDashboard";
import { KPIUnitManager } from "../modules/kpi/organizational-unit/management/component/organizationalUnitKpiOverview";
import { KPIUnitEvaluate } from "../modules/kpi/organizational-unit/evaluation/component/organizationalUnitKpiEvaluation";
import { StatisticsOfOrganizationalUnitKpi } from "../modules/kpi/statistic/component/statisticsOfOrganizationalUnitKpi";

import { CreateEmployeeKpiSet } from "../modules/kpi/employee/creation/component/employeeKpiCreate";
import { KPIPersonalManager } from "../modules/kpi/employee/management/component/employeeKpiManagement";
import { DashBoardEmployeeKpiSet } from "../modules/kpi/employee/dashboard/component/employeeKpiDashboard";
import { KPIPersonalEvaluate } from "../modules/kpi/employee/management/component/employeeKpiData";

import { EmployeeKpiManagement } from "../modules/kpi/evaluation/employee-evaluation/component/employeeKpiManagement";
import { EmployeeKpiEvaluationDashboard } from "../modules/kpi/evaluation/dashboard/component/employeeKpiEvaluationDashboard";


import { TaskManagement } from "../modules/task/task-management/component/taskManagement";
import { TaskComponent } from '../modules/task/task-perform/component/taskComponent';
import { TaskDashboard } from "../modules/task/task-dashboard/task-personal-dashboard/taskDashboard";
import { TaskTemplate } from '../modules/task/task-template/component/taskTemplate';
import { TaskProcessManagement } from '../modules/task/task-process/component/task-process-management/taskProcessManagement';
import { ProcessTemplate } from '../modules/task/task-process/component/process-template/processTemplate';
import { TaskOrganizationUnitDashboard } from '../modules/task/task-dashboard/task-organization-dashboard/taskOrganizationUnitDashboard';

//asset
import RecommendProcure from "../modules/asset/user/purchase-request/components";
import RecommendDistribute from "../modules/asset/user/use-request/components";
import ManagerRecommendProcure from "../modules/asset/admin/purchase-request/components";
import ManagerRecommendDistribute from "../modules/asset/admin/use-request/components";
import ManagerAssetType from "../modules/asset/admin/asset-type/components";
import MaintainanceManager from "../modules/asset/admin/maintainance/components";
// import UsageManager from "../modules/asset/admin/usage/components";
import IncidentManager from "../modules/asset/admin/incident/components";
import ManagerDepreciation from "../modules/asset/admin/depreciation/components";
import AssetManager from "../modules/asset/admin/asset-information/components";
import { ManagerAssetAssignedCrash } from '../modules/asset/user/asset-assigned/components';
import { DashBoardAssets } from '../modules/asset/admin/asset-dashboard/components/assetDashBoard';
import { BuildingAsset } from '../modules/asset/admin/building/components';
import EmployeeAssetManagement from '../modules/asset/user/asser-managed/components';


//report
import TaskReportManager from '../modules/report/task-report/components/taskReportManager';

//warehouse
import CategoryManagement from '../modules/warehouse/category-management/component';
import GoodManagement from '../modules/warehouse/good-management/component';
import StockManagement from '../modules/warehouse/stock-management/component';
import BinLocationManagement from '../modules/warehouse/bin-location-management/components';
import BillManagement from '../modules/warehouse/bill-management/components';
import InventoryManagement from '../modules/warehouse/inventory-management/components';
import PartnerManagement from '../modules/warehouse/partner-management/component';
import ProposalManagement from '../modules/warehouse/proposal-management/component';

// Customer Management
import CrmCustomer from '../modules/crm/customer/components';
import CrmGroup from '../modules/crm/group/components';

//orders
import OrderManagement from "../modules/order/components";

// plans
import PlanManagement from "../modules/plan/components";

// Example
import ExampleManagement1 from "../modules/example/example1/components";
import ExampleManagement2 from "../modules/example/example2/components";

class Routes extends Component {

    render() {
        const { auth, company, user, role, link, component, department, employeesManager } = this.props;
        return (
            <React.Fragment>
                <Switch>
                    <AuthRoute exact auth={auth} path="/login" component={Login} />
                    <AuthRoute exact auth={auth} path="/reset-password" component={ResetPassword} />
                    <PrivateRoute
                        isLoading={false}
                        key={'manage_system'}
                        arrPage={[
                            { link: '#', name: 'system_administration', icon: 'fa fa-key' },
                            { link: '/system/settings', name: 'manage_system', icon: 'fa fa-gears' }
                        ]}
                        // type='system-admin'
                        auth={auth}
                        exact={true}
                        link={'/system/settings'}
                        path={'/system/settings'}
                        pageName={'manage_system'}
                        layout={Layout}
                        component={SystemSetting}
                    />
                    <PrivateRoute
                        isLoading={this.props.rootRoles.isLoading}
                        key={'manage_roles_default'}
                        arrPage={[
                            { link: '#', name: 'system_administration', icon: 'fa fa-key' },
                            { link: '/system/roles-default-management', name: 'manage_role', icon: 'fa fa-lock' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/system/roles-default-management'}
                        path={'/system/roles-default-management'}
                        pageName={'manage_role'}
                        layout={Layout}
                        component={ManageRoleDefault}
                    />
                    <PrivateRoute
                        isLoading={this.props.systemLinks.isLoading}
                        key={'manage_links_default'}
                        arrPage={[
                            { link: '#', name: 'system_administration', icon: 'fa fa-key' },
                            { link: '/system/links-default-management', name: 'manage_link', icon: 'fa fa-link' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/system/links-default-management'}
                        path={'/system/links-default-management'}
                        pageName={'manage_link'}
                        layout={Layout}
                        component={ManageLinkSystem}
                    />
                    <PrivateRoute
                        isLoading={this.props.systemComponents.isLoading}
                        key={'manage_components_default'}
                        arrPage={[
                            { link: '#', name: 'system_administration', icon: 'fa fa-key' },
                            { link: '/system/components-default-management', name: 'manage_component', icon: 'fa fa-object-group' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/system/components-default-management'}
                        path={'/system/components-default-management'}
                        pageName={'manage_component'}
                        layout={Layout}
                        component={ComponentsDefaultManagement}
                    />
                    <PrivateRoute
                        isLoading={auth.isLoading}
                        key={'home'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/'}
                        path={'/'}
                        pageName={'home'}
                        layout={Layout}
                        component={Home}
                    />
                    <PrivateRoute
                        isLoading={this.props.company.isLoading}
                        key={'companies-management'}
                        arrPage={[
                            { link: '/system/companies-management', name: 'manage_company', icon: 'fa fa-building' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/system/companies-management'}
                        path={'/system/companies-management'}
                        pageName={'manage_company'}
                        layout={Layout}
                        component={Company}
                    />
                    <PrivateRoute
                        isLoading={this.props.system.isLoading}
                        key={'system-management'}
                        arrPage={[
                            { link: '#', name: 'system_administration', icon: 'fa fa-key' },
                            { link: '/system-management', name: 'manage_system', icon: 'fa fa-database' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/system-management'}
                        path={'/system-management'}
                        pageName={'manage_system'}
                        layout={Layout}
                        component={ManageSystem}
                    />
                    <PrivateRoute
                        isLoading={this.props.user.isLoading}
                        key={'users-management'}
                        arrPage={[
                            { link: '#', name: 'system_administration', icon: 'fa fa-key' },
                            { link: '/users-management', name: 'manage_user', icon: 'fa fa-users' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/users-management'}
                        path={'/users-management'}
                        pageName={'manage_user'}
                        layout={Layout}
                        component={ManageUser}
                    />
                    <PrivateRoute
                        isLoading={this.props.role.isLoading}
                        arrPage={[
                            { link: '#', name: 'system_administration', icon: 'fa fa-key' },
                            { link: '/roles-management', name: 'manage_role', icon: 'fa fa-lock' }
                        ]}
                        key={'roles-management'}
                        auth={auth}
                        exact={true}
                        link={'/roles-management'}
                        path={'/roles-management'}
                        pageName={'manage_role'}
                        layout={Layout}
                        component={ManageRole}
                    />
                    <PrivateRoute
                        isLoading={this.props.link.isLoading}
                        key={'links-management'}
                        arrPage={[
                            { link: '#', name: 'system_administration', icon: 'fa fa-key' },
                            { link: '/links-management', name: 'manage_link', icon: 'fa fa-link' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/links-management'}
                        path={'/links-management'}
                        pageName={'manage_link'}
                        layout={Layout}
                        component={ManageLink}
                    />
                    <PrivateRoute
                        isLoading={this.props.department.isLoading}
                        key={'departments-management'}
                        arrPage={[
                            { link: '#', name: 'system_administration', icon: 'fa fa-key' },
                            { link: '/departments-management', name: 'manage_department', icon: 'fa fa-sitemap' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/departments-management'}
                        path={'/departments-management'}
                        pageName={'manage_department'}
                        layout={Layout}
                        component={ManageDepartment}
                    />
                    <PrivateRoute
                        isLoading={this.props.component.isLoading}
                        key={'components-management'}
                        arrPage={[
                            { link: '#', name: 'system_administration', icon: 'fa fa-key' },
                            { link: '/components-management', name: 'manage_component', icon: 'fa fa-object-group' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/components-management'}
                        path={'/components-management'}
                        pageName={'manage_component'}
                        layout={Layout}
                        component={ManageComponent}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={'manage-document'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/documents-management', name: 'manage_document', icon: 'fa fa-folder-open' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/documents-management'}
                        path={'/documents-management'}
                        pageName={'manage_document'}
                        layout={Layout}
                        component={ManageDocument}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={'documents'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/documents', name: 'documents', icon: 'fa fa-file-text' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/documents'}
                        path={'/documents'}
                        pageName={'documents'}
                        layout={Layout}
                        component={Document}
                    />
                    {/* Quan ly nhan su */}
                    <PrivateRoute
                        isLoading={this.props.annualLeave.isLoading}
                        key={'leave_application'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/hr-manage-leave-application', name: 'leave_application', icon: 'fa fa-envelope' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/hr-manage-leave-application'}
                        path={'/hr-manage-leave-application'}
                        pageName={'leave_application'}
                        layout={Layout}
                        component={ManageLeaveApplication}
                    />
                    <PrivateRoute
                        isLoading={this.props.employeesManager.isLoading}
                        key={'add_employee'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/hr-add-employee', name: 'add_employee', icon: 'fa fa-user-plus' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/hr-add-employee'}
                        path={'/hr-add-employee'}
                        pageName={'add_employee'}
                        layout={Layout}
                        component={EmployeeCreate}
                    />
                    <PrivateRoute
                        isLoading={this.props.employeesInfo.isLoading}
                        key={'detail_employee'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/hr-detail-employee', name: 'detail_employee', icon: 'fa fa-user-o' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/hr-detail-employee'}
                        path={'/hr-detail-employee'}
                        pageName={'detail_employee'}
                        layout={Layout}
                        component={EmployeeDetail}
                    />
                    <PrivateRoute
                        isLoading={this.props.employeesInfo.isLoading}
                        key={'update_employee'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/hr-update-employee', name: 'update_employee', icon: 'fa fa-pencil-square-o' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/hr-update-employee'}
                        path={'/hr-update-employee'}
                        pageName={'update_employee'}
                        layout={Layout}
                        component={UpdateEmployee}
                    />
                    <PrivateRoute
                        isLoading={this.props.employeesManager.isLoading}
                        key={'list_employee'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/hr-list-employee', name: 'list_employee', icon: 'fa fa-address-card' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/hr-list-employee'}
                        path={'/hr-list-employee'}
                        pageName={'list_employee'}
                        layout={Layout}
                        component={EmpoyeeManager}
                    />

                    <PrivateRoute
                        isLoading={this.props.department.isLoading}
                        key={'manage_unit'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/hr-manage-department', name: 'manage_unit', icon: 'fa fa-sitemap' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/hr-manage-department'}
                        path={'/hr-manage-department'}
                        pageName={'manage_unit'}
                        layout={Layout}
                        component={DepartmentManage}
                    />

                    <PrivateRoute
                        isLoading={this.props.employeesManager.isLoading}
                        key={'dashBoard_employee'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/hr-dashboard-employee', name: 'dashboard_employee', icon: 'fa fa-dashboard' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/hr-dashboard-employee'}
                        path={'/hr-dashboard-employee'}
                        pageName={'dashboard_employee'}
                        layout={Layout}
                        component={EmployeeDashBoard}
                    />
                    <PrivateRoute
                        isLoading={this.props.discipline.isLoading}
                        key={'discipline'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/hr-discipline', name: 'discipline', icon: 'fa fa-balance-scale' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/hr-discipline'}
                        path={'/hr-discipline'}
                        pageName={'discipline'}
                        layout={Layout}
                        component={ManagerPraiseDiscipline}
                    />
                    <PrivateRoute
                        isLoading={this.props.annualLeave.isLoading}
                        key={'annual_leave'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/hr-annual-leave', name: 'annual_leave', icon: 'fa fa-calendar-times-o' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/hr-annual-leave'}
                        path={'/hr-annual-leave'}
                        pageName={'annual_leave'}
                        layout={Layout}
                        component={AnnualLeaveManager}
                    />
                    <PrivateRoute
                        isLoading={this.props.holiday.isLoading}
                        key={'manage_holiday'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/hr-manage-holiday', name: 'manage_holiday', icon: 'fa fa-calendar' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/hr-manage-holiday'}
                        path={'/hr-manage-holiday'}
                        pageName={'manage_holiday'}
                        layout={Layout}
                        component={ManageHoliday}
                    />
                    <PrivateRoute
                        isLoading={this.props.holiday.isLoading}
                        key={'annual_leave_personal'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/hr-annual-leave-personal', name: 'annual_leave_personal', icon: 'fa fa-calendar' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/hr-annual-leave-personal'}
                        path={'/hr-annual-leave-personal'}
                        pageName={'annual_leave_personal'}
                        layout={Layout}
                        component={AnnualLeave}
                    />
                    <PrivateRoute
                        isLoading={this.props.salary.isLoading}
                        key={'salary_employee'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/hr-salary-employee', name: 'salary_employee', icon: 'fa fa-line-chart' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/hr-salary-employee'}
                        path={'/hr-salary-employee'}
                        pageName={'salary_employee'}
                        layout={Layout}
                        component={SalaryManager}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={'time_keeping'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/hr-time-keeping', name: 'time_keeping', icon: 'fa fa-calculator' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/hr-time-keeping'}
                        path={'/hr-time-keeping'}
                        pageName={'time_keeping'}
                        layout={Layout}
                        component={TimesheetsManager}
                    />
                    <PrivateRoute
                        isLoading={this.props.education.isLoading}
                        key={'list_education'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/hr-list-education', name: 'list_education', icon: 'fa fa-university' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/hr-list-education'}
                        path={'/hr-list-education'}
                        pageName={'list_education'}
                        layout={Layout}
                        component={ListEducation}
                    />
                    <PrivateRoute
                        isLoading={this.props.course.isLoading}
                        key={'training_plan'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/hr-training-plan', name: 'training_plan', icon: 'fa fa-list-alt' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/hr-training-plan'}
                        path={'/hr-training-plan'}
                        pageName={'training_plan'}
                        layout={Layout}
                        component={TrainingPlan}
                    />

                    {/* kpi - routes */}
                    <PrivateRoute
                        isLoading={this.props.createKpiUnit.isLoading}
                        key={'kpi-unit-create'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/kpi-units/create', name: 'kpi_unit_create', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/kpi-units/create'}
                        path={'/kpi-units/create'}
                        pageName={'kpi_unit_create'}
                        layout={Layout}
                        component={OrganizationalUnitKpiCreate}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={'kpi-unit-evaluate'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/kpi-units/evaluate', name: 'kpi_unit_evaluate', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/kpi-units/evaluate'}
                        path={'/kpi-units/evaluate'}
                        pageName={'kpi_unit_evaluate'}
                        layout={Layout}
                        component={KPIUnitEvaluate}
                    />
                    <PrivateRoute
                        isLoading={this.props.dashboardOrganizationalUnitKpi.isLoading}
                        key={'kpi-unit-dashboard'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/kpi-units/dashboard', name: 'kpi_unit_dashboard', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/kpi-units/dashboard'}
                        path={'/kpi-units/dashboard'}
                        pageName={'kpi_unit_dashboard'}
                        layout={Layout}
                        component={OrganizationalUnitKpiDashboard}
                    />
                    <PrivateRoute
                        isLoading={this.props.statisticsOfOrganizationalUnitKpi.isLoading}
                        key={'kpi-unit-statistic'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/kpi-units/statistic', name: 'kpi_unit_statistic', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/kpi-units/statistic'}
                        path={'/kpi-units/statistic'}
                        pageName={'kpi_unit_statistic'}
                        layout={Layout}
                        component={StatisticsOfOrganizationalUnitKpi}
                    />
                    <PrivateRoute
                        isLoading={this.props.managerKpiUnit.isLoading}
                        key={'kpi-unit-manager'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/kpi-units/manager', name: 'kpi_unit_manager', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/kpi-units/manager'}
                        path={'/kpi-units/manager'}
                        pageName={'kpi_unit_manager'}
                        layout={Layout}
                        component={KPIUnitManager}
                    />
                    <PrivateRoute
                        isLoading={this.props.createEmployeeKpiSet.isLoading}
                        key={'kpi-personal-create'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/kpi-personals/create', name: 'kpi_personal_create', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/kpi-personals/create'}
                        path={'/kpi-personals/create'}
                        pageName={'kpi_personal_create'}
                        layout={Layout}
                        component={CreateEmployeeKpiSet}
                    />
                    <PrivateRoute
                        isLoading={this.props.KPIPersonalManager.isLoading}
                        key={'kpi-personal-manager'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/kpi-personals/manager', name: 'kpi_personal_manager', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/kpi-personals/manager'}
                        path={'/kpi-personals/manager'}
                        pageName={'kpi_personal_manager'}
                        layout={Layout}
                        component={KPIPersonalManager}
                    />
                    <PrivateRoute
                        isLoading={this.props.dashboardEmployeeKpiSet.isLoading}
                        key={'kpi-personal-dashboard'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/kpi-personals/dashboard', name: 'kpi_personal_dasdboad', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/kpi-personals/dashboard'}
                        path={'/kpi-personals/dashboard'}
                        pageName={'kpi_personal_dashboard'}
                        layout={Layout}
                        component={DashBoardEmployeeKpiSet}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={'kpi-personal-evaluate'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/kpi-personals/evaluate', name: 'kpi_personal_evaluate', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/kpi-personals/evaluate'}
                        path={'/kpi-personals/evaluate'}
                        pageName={'kpi_personal_evaluate'}
                        layout={Layout}
                        component={KPIPersonalEvaluate}
                    />
                    <PrivateRoute
                        isLoading={this.props.tasktemplates.isLoading}
                        key={'task-template-management'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/task-template', name: 'task_template', icon: 'fa fa-flash' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/task-template'}
                        path={'/task-template'}
                        pageName={'task_template'}
                        layout={Layout}
                        component={TaskTemplate}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={'notifications'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/notifications', name: 'notifications', icon: 'fa fa-bell' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/notifications'}
                        path={'/notifications'}
                        pageName={'notifications'}
                        layout={Layout}
                        component={Notifications}
                    />
                    <PrivateRoute
                        isLoading={this.props.kpimembers.isLoading}
                        key={'kpi_member_manager'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/kpi-member/manager', name: 'kpi_member_manager', icon: 'fa fa-number' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/kpi-member/manager'}
                        path={'/kpi-member/manager'}
                        pageName="kpi_member_manager"
                        layout={Layout}
                        component={EmployeeKpiManagement}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={'kpi_member_dashboard'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/kpi-member/dashboard', name: 'kpi_member_dashboard', icon: 'fa fa-number' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/kpi-member/dashboard'}
                        path={'/kpi-member/dashboard'}
                        pageName="kpi_member_dashboard"
                        layout={Layout}
                        component={EmployeeKpiEvaluationDashboard}
                    />
                    {/* Task Management */}
                    <PrivateRoute
                        isLoading={this.props.tasks.isLoading}
                        key={'task-management'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/task-management', name: 'task_management', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/task-management'}
                        path={'/task-management'}
                        pageName={'task_management'}
                        layout={Layout}
                        component={TaskManagement}
                    />
                    <PrivateRoute // Trang chi tiết công việc (không có trên menu)
                        isLoading={this.props.tasks.isLoading}
                        key={'task'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/task', name: 'task', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/task'}
                        path={'/task'}
                        pageName={'task'}
                        layout={Layout}
                        component={TaskComponent}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={'task-management-dashboard'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/task-management-dashboard', name: 'task_management_dashboard', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/task-management-dashboard'}
                        path={'/task-management-dashboard'}
                        pageName={'task_management_dashboard'}
                        layout={Layout}
                        component={TaskDashboard}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={'task-organization-management-dashboard'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/task-organization-management-dashboard', name: 'task_organization_management_dashboard', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/task-organization-management-dashboard'}
                        path={'/task-organization-management-dashboard'}
                        pageName={'task_organization_management_dashboard'}
                        layout={Layout}
                        component={TaskOrganizationUnitDashboard}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={'task-process-management'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/task-process-management', name: 'task_management_process', icon: 'fa fa-folder-open' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/task-process-management'}
                        path={'/task-process-management'}
                        pageName={'task_management_process'}
                        layout={Layout}
                        component={TaskProcessManagement}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={'task-process-template'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/task-process-template', name: 'task_process_template', icon: 'fa fa-folder-open' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/task-process-template'}
                        path={'/task-process-template'}
                        pageName={'task_process_template'}
                        layout={Layout}
                        component={ProcessTemplate}
                    />
                    {/** Quản lý tài sản */}
                    {/** Nhân viên */}
                    <PrivateRoute
                        isLoading={this.props.recommendProcure.isLoading}
                        key={'asset-purchase-request'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/asset-purchase-request', name: 'recommend_equipment_procurement', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/asset-purchase-request'}
                        path={'/asset-purchase-request'}
                        pageName={'recommend_equipment_procurement'}
                        layout={Layout}
                        component={RecommendProcure}
                    />

                    <PrivateRoute
                        isLoading={this.props.recommendDistribute.isLoading}
                        key={'asset-use-request'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/asset-use-request', name: 'recommend_distribute_asset', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/asset-use-request'}
                        path={'/asset-use-request'}
                        pageName={'recommend_distribute_asset'}
                        layout={Layout}
                        component={RecommendDistribute}
                    />

                    <PrivateRoute
                        isLoading={this.props.assetsManager.isLoading}
                        key={'manage-assigned-asset'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/manage-assigned-asset', name: 'manage_assigned_asset', icon: 'fa fa-balance-scale' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/manage-assigned-asset'}
                        path={'/manage-assigned-asset'}
                        pageName={'manage_assigned_asset'}
                        layout={Layout}
                        component={ManagerAssetAssignedCrash}
                    />

                    <PrivateRoute
                        isLoading={this.props.assetsManager.isLoading}
                        key={'employee-manage-info-asset'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/employee-manage-info-asset', name: 'manage_info_asset', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/employee-manage-info-asset'}
                        path={'/employee-manage-info-asset'}
                        pageName={'employee_manage_asset_info'}
                        layout={Layout}
                        component={EmployeeAssetManagement}
                    />

                    {/** Quản lý */}
                    <PrivateRoute
                        isLoading={false}
                        key={'dashBoard_asset'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/dashboard-asset', name: 'dashboard_asset', icon: 'fa fa-dashboard' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/dashboard-asset'}
                        path={'/dashboard-asset'}
                        pageName={'dashboard_asset'}
                        layout={Layout}
                        component={DashBoardAssets}
                    />

                    <PrivateRoute
                        isLoading={this.props.assetType.isLoading}
                        key={'manage-type-asset'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/manage-type-asset', name: 'manage_type_asset', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/manage-type-asset'}
                        path={'/manage-type-asset'}
                        pageName={'manage_type_asset'}
                        layout={Layout}
                        component={ManagerAssetType}
                    />

                    <PrivateRoute
                        isLoading={this.props.assetsManager.isLoading}
                        key={'manage-info-asset'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/manage-info-asset', name: 'manage_info_asset', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/manage-info-asset'}
                        path={'/manage-info-asset'}
                        pageName={'manage_info_asset'}
                        layout={Layout}
                        component={AssetManager}
                    />


                    <PrivateRoute
                        isLoading={false}
                        key={'manage-maintainance-asset'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/manage-maintainance-asset', name: 'manage_maintainance_asset', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/manage-maintainance-asset'}
                        path={'/manage-maintainance-asset'}
                        pageName={'manage_maintainance_asset'}
                        layout={Layout}
                        component={MaintainanceManager}
                    />

                    {/* <PrivateRoute
                        isLoading={false}
                        key={'manage-usage-asset'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/manage-usage-asset', name: 'manage_usage_asset', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/manage-usage-asset'}
                        path={'/manage-usage-asset'}
                        pageName={'manage_usage_asset'}
                        layout={Layout}
                        component={UsageManager}
                    /> */}

                    <PrivateRoute
                        isLoading={false}
                        key={'manage-depreciation-asset'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/manage-depreciation-asset', name: 'manage_depreciation_asset', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/manage-depreciation-asset'}
                        path={'/manage-depreciation-asset'}
                        pageName={'manage_depreciation_asset'}
                        layout={Layout}
                        component={ManagerDepreciation}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={'manage-incident-asset'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/manage-incident-asset', name: 'manage_incident_asset', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/manage-incident-asset'}
                        path={'/manage-incident-asset'}
                        pageName={'manage_incident_asset'}
                        layout={Layout}
                        component={IncidentManager}
                    />

                    <PrivateRoute
                        isLoading={this.props.recommendProcure.isLoading}
                        key={'manage-asset-purchase-request'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/manage-asset-purchase-request', name: 'manage_recommend_procure', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/manage-asset-purchase-request'}
                        path={'/manage-asset-purchase-request'}
                        pageName={'manage_recommend_procure'}
                        layout={Layout}
                        component={ManagerRecommendProcure}
                    />

                    <PrivateRoute
                        isLoading={this.props.recommendDistribute.isLoading}
                        key={'manage-asset-use-request'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/manage-asset-use-request', name: 'manage_recommend_distribute_asset', icon: '' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/manage-asset-use-request'}
                        path={'/manage-asset-use-request'}
                        pageName={'manage_recommend_distribute_asset'}
                        layout={Layout}
                        component={ManagerRecommendDistribute}
                    />

                    <PrivateRoute
                        isLoading={this.props.reports.isLoading}
                        key={'task-report-management'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/task-report', name: 'task_report', icon: 'fa fa-flash' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/task-report'}
                        path={'/task-report'}
                        pageName={'task_report'}
                        layout={Layout}
                        component={TaskReportManager}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={'category-management'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/category-management', name: 'category_management', icon: 'fa fa-cubes' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/category-management'}
                        path={'/category-management'}
                        pageName={'category_management'}
                        layout={Layout}
                        component={CategoryManagement}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={'good-management'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/good-management', name: 'good_management', icon: 'fa fa-gift' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/good-management'}
                        path={'/good-management'}
                        pageName={'good_management'}
                        layout={Layout}
                        component={GoodManagement}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={'stock-management'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/stock-management', name: 'stock_management', icon: 'fa fa-bank' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/stock-management'}
                        path={'/stock-management'}
                        pageName={'stock_management'}
                        layout={Layout}
                        component={StockManagement}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={'bin-location-management'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/bin-location-management', name: 'bin_location_management', icon: 'fa fa-sitemap' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/bin-location-management'}
                        path={'/bin-location-management'}
                        pageName={'bin_location_management'}
                        layout={Layout}
                        component={BinLocationManagement}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={'partner-management'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/partner-management', name: 'partner_management', icon: 'fa fa-users' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/partner-management'}
                        path={'/partner-management'}
                        pageName={'partner_management'}
                        layout={Layout}
                        component={PartnerManagement}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={'proposal-management'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/proposal-management', name: 'proposal_management', icon: 'fa fa-envelope-o' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/proposal-management'}
                        path={'/proposal-management'}
                        pageName={'proposal_management'}
                        layout={Layout}
                        component={ProposalManagement}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={'inventory-management'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/inventory-management', name: 'inventory_management', icon: 'fa fa-times-circle-o' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/inventory-management'}
                        path={'/inventory-management'}
                        pageName={'inventory_management'}
                        layout={Layout}
                        component={InventoryManagement}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={'bill-management'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/bill-management', name: 'bill_management', icon: 'fa fa-reorder' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/bill-management'}
                        path={'/bill-management'}
                        pageName={'bill_management'}
                        layout={Layout}
                        component={BillManagement}
                    />

                    <PrivateRoute
                        isLoading={this.props.assetsManager.isLoading}
                        key={'view-building-list'}
                        arrPage={[
                            { link: '/', name: 'home', icon: 'fa fa-home' },
                            { link: '/view-building-list', name: 'view_building_list', icon: 'fa fa-building' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/view-building-list'}
                        path={'/view-building-list'}
                        pageName={'view_building_list'}
                        layout={Layout}
                        // xem danh sach
                        component={BuildingAsset}
                    />

                    {/* Customer Management */}
                    <PrivateRoute
                        isLoading={false}
                        key={'crm_customer'}
                        arrPage={[
                            { link: '/crm/customer', name: 'crm_list.customer', icon: 'fa fa-users' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/crm/customer'}
                        path={'/crm/customer'}
                        pageName={'crm_list.customer'}
                        layout={Layout}
                        component={CrmCustomer}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={'customer-group'}
                        arrPage={[
                            { link: '/crm/group', name: 'crm_list.group', icon: 'fa fa-group' }
                        ]}
                        auth={auth}
                        exact={true}
                        link={'/crm/group'}
                        path={'/crm/group'}
                        pageName={'crm_list.group'}
                        layout={Layout}
                        component={CrmGroup}
                    />

                    {/* Orders Management */}

                    <PrivateRoute
                        isLoading={this.props.order.isLoading}
                        key={"manage-orders"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-orders",
                                name: "manage_orders",
                                icon: "fa fa-address-card",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-orders"}
                        path={"/manage-orders"}
                        pageName={"manage-orders"}
                        layout={Layout}
                        component={OrderManagement}
                    />

                    {/* Plans Management */}

                    <PrivateRoute
                        isLoading={this.props.plan.isLoading}
                        key={"manage-plans"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-plans",
                                name: "manage_plans",
                                icon: "fa fa-calendar",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-plans"}
                        path={"/manage-plans"}
                        pageName={"manage_plans"}
                        layout={Layout}
                        component={PlanManagement}
                    />

                    {/* Example Management */}
                    <PrivateRoute
                        isLoading={false}
                        key={"manage-examples-1"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-examples-1",
                                name: "manage_examples_1",
                                icon: "fa fa-circle",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-examples-1"}
                        path={"/manage-examples-1"}
                        pageName={"manage_examples_1"}
                        layout={Layout}
                        component={ExampleManagement1}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={"manage-examples-2"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-examples-1",
                                name: "manage_examples_2",
                                icon: "fa fa-adjust",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-examples-2"}
                        path={"/manage-examples-2"}
                        pageName={"manage_examples_2"}
                        layout={Layout}
                        component={ExampleManagement2}
                    />

                    {/* NOT FOUND */}
                    <Route component={NotFound}></Route>
                </Switch>

            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return state;
}

export default connect(mapStateToProps, null)(Routes);