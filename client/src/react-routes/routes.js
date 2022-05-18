import React, { Component, Suspense, lazy } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import { PrivateRoute } from "./privateRoute";
import { AuthRoute } from "./authRoute";

import Layout from "../layout/layout";
import Login from "../modules/auth/components/login"
import Introduction from "../modules/intro/components"
import ResetPassword from "../modules/auth/components/resetPasswordNew"
import { ModalViewTaskProcessById } from "../modules/task/task-process/component/process-template/modalViewTaskProcessById";
import { ModalViewProcessById } from "../modules/task/task-process/component/task-process-management/modalViewProcessById";

const Home = lazy(() => import("../modules/home/components"))
const NotFound = lazy(() => import("../modules/not-found/components"))
const ManageDocument = lazy(() => import("../modules/document/components/administration"))
const Document = lazy(() => import("../modules/document/components/user"))


const ManageUser = lazy(() => import("../modules/super-admin/user/components"))
const ManageRole = lazy(() => import("../modules/super-admin/role/components"))
const ManageLink = lazy(() => import("../modules/super-admin/link/components"))
const ManageApi = lazy(() => import("../modules/super-admin/api/api-management/components/apiManagement"))
const ApiRegistration = lazy(() => import("../modules/super-admin/api/api-registration/components/apiRegistration"))
const ApiRegistrationEmployee = lazy(() => import("../modules/super-admin/api/api-registration/components/apiRegistrationEmployee"))
const ManageDepartment = lazy(() => import("../modules/super-admin/organizational-unit/components"))
const ManageComponent = lazy(() => import("../modules/super-admin/component/components"))
const ConfigurationManager = lazy(() => import("../modules/super-admin/module-configuration/components"))

const AnnualLeaveManager = lazy(() => import("../modules/human-resource/annual-leave/components/annualLeaveManagement"))
const ManagerPraiseDiscipline = lazy(() => import("../modules/human-resource/commendation-discipline/components"))
const EmployeeDashBoard = lazy(() => import("../modules/human-resource/employee-dashboard/components"))
const DepartmentManage = lazy(() => import("../modules/human-resource/employee-in-organizational-unit/components/employeeInOrganizationalUnit"))
const ManageWorkPlan = lazy(() => import("../modules/human-resource/work-plan/components/worksPlanManagement"))
const EmployeeDetail = lazy(() => import("../modules/human-resource/profile/employee-info/components/employeeDetailPage"))
const UpdateEmployee = lazy(() => import("../modules/human-resource/profile/employee-info/components/employeeUpdate"))
const EmpoyeeManager = lazy(() => import("../modules/human-resource/profile/employee-management/components"))
const EmployeeCreate = lazy(() => import("../modules/human-resource/profile/employee-create/components"))
const SalaryManager = lazy(() => import("../modules/human-resource/salary/components"))
const FieldManager = lazy(() => import("../modules/human-resource/field/components"))
const TimesheetsManager = lazy(() => import("../modules/human-resource/timesheets/components"))
const AnnualLeave = lazy(() => import("../modules/human-resource/annual-leave/components/annualLeave"))
const ManageLeaveApplication = lazy(() => import("../modules/human-resource/annual-leave/components/manageLeaveApplication"))
const EmployeesInfomation = lazy(() => import("../modules/human-resource/employee-infomation/components/"))
const DashboardPersonal = lazy(() => import("../modules/dashboard-personal/components"))
const DashboardUnit = lazy(() => import("../modules/dashboard-unit/components"))

const ListEducation = lazy(() => import("../modules/training/education-program/components/educationProgramList"))
const TrainingPlan = lazy(() => import("../modules/training/course/components/course"))
const CourseOfUser = lazy(() => import("../modules/training/course/user/components/course"))


const OrganizationalUnitKpiCreateForAdmin = lazy(() => import("../modules/kpi/organizational-unit/creation/component/organizationalUnitKpiCreateForAdmin"))
const OrganizationalUnitKpiCreate = lazy(() => import("../modules/kpi/organizational-unit/creation/component/organizationalUnitKpiCreate"))
const OrganizationalUnitKpiDashboard = lazy(() => import("../modules/kpi/organizational-unit/dashboard/component/organizationalUnitKpiDashboard"))
const KPIUnitManager = lazy(() => import("../modules/kpi/organizational-unit/management/component/organizationalUnitKpiOverview"))
const KPIUnitEvaluate = lazy(() => import("../modules/kpi/organizational-unit/evaluation/component/organizationalUnitKpiEvaluation"))
const StatisticsOfOrganizationalUnitKpi = lazy(() => import("../modules/kpi/statistic/component/statisticsOfOrganizationalUnitKpi"))

const SearchEmployeeForPackage = lazy(() => import("../modules/human-resource/profile/employee-management/components/searchEmployeeForPackage"))
const CareerPosition = lazy(() => import("../modules/human-resource/career/component"))
const SearchKeyEmployee = lazy(() => import("../modules/human-resource/profile/employee-management/components/searchKeyEmployees"))
const Certificate = lazy(() => import("../modules/human-resource/certificate/component"))
const Major = lazy(() => import("../modules/human-resource/major/component"))
const Contract = lazy(() => import("../modules/bidding/bidding-contract/component"))
const BiddingPackagesManagement = lazy(() => import("../modules/bidding/bidding-package/biddingPackageManagement/components"))

const CreateEmployeeKpiSet = lazy(() => import("../modules/kpi/employee/creation/component/employeeKpiCreate"))
const KPIPersonalManager = lazy(() => import("../modules/kpi/employee/management/component/employeeKpiManagement"))
const DashBoardEmployeeKpiSet = lazy(() => import("../modules/kpi/employee/dashboard/component/employeeKpiDashboard"))
const KPIPersonalEvaluate = lazy(() => import("../modules/kpi/employee/management/component/employeeKpiData"))

const EmployeeKpiManagement = lazy(() => import("../modules/kpi/evaluation/employee-evaluation/component/employeeKpiManagement"))
const EmployeeKpiEvaluationDashboard = lazy(() => import("../modules/kpi/evaluation/dashboard/component/employeeKpiEvaluationDashboard"))

const TaskManagement = lazy(() => import("../modules/task/task-management/component/taskManagement"))
const TaskManagementOfUnit = lazy(() => import("../modules/task/task-management/component/taskManagementOfUnit"))
const TaskComponent = lazy(() => import("../modules/task/task-perform/component/taskComponent"))
const TaskDashboard = lazy(() => import("../modules/task/task-dashboard/task-personal-dashboard/taskDashboard"))
const TaskTemplate = lazy(() => import("../modules/task/task-template/component/taskTemplate"))
const TaskProcessManagement = lazy(() => import("../modules/task/task-process/component/task-process-management/taskProcessManagement"))
const ProcessTemplate = lazy(() => import("../modules/task/task-process/component/process-template/processTemplate"))
const TaskOrganizationUnitDashboard = lazy(() => import("../modules/task/task-dashboard/task-organization-dashboard/taskOrganizationUnitDashboard"))

//asset
const RecommendProcure = lazy(() => import("../modules/asset/user/purchase-request/components"))
const RecommendDistribute = lazy(() => import("../modules/asset/user/use-request/components"))
const ManagerRecommendProcure = lazy(() => import("../modules/asset/admin/purchase-request/components"))
const ManagerRecommendDistribute = lazy(() => import("../modules/asset/admin/use-request/components"))
const ManagerAssetType = lazy(() => import("../modules/asset/admin/asset-type/components"))
const MaintainanceManager = lazy(() => import("../modules/asset/admin/maintainance/components"))

//asset lot
const AssetLotManager = lazy(() => import("../modules/asset/admin/asset-lot/components"))


//supplies
const ManageSupplies = lazy(() => import("../modules/supplies/admin/supplies/components"))
const ManageSupplieDashboard = lazy(() => import("../modules/supplies/admin/supplies-dashboard/components"))
const ManagePurchaseInvoice = lazy(() => import("../modules/supplies/admin/purchase-invoice/components"))
const ManageAllocationHistory = lazy(() => import("../modules/supplies/admin/allocation-history/components"))
const ManagePurchaseRequest = lazy(() => import("../modules/supplies/admin/purchase-request/components"))
const UserPurchaseRequest = lazy(() => import("../modules/supplies/user/purchase-request/components"))

// import UsageManager from "../modules/asset/admin/usage/components";
const IncidentManager = lazy(() => import("../modules/asset/admin/incident/components"))
const ManagerDepreciation = lazy(() => import("../modules/asset/admin/depreciation/components"))
const AssetManager = lazy(() => import("../modules/asset/admin/asset-information/components"))
const ManagerAssetAssignedCrash = lazy(() => import("../modules/asset/user/asset-assigned/components"))
const DashBoardAssets = lazy(() => import("../modules/asset/admin/asset-dashboard/components/assetDashBoard"))
const BuildingAsset = lazy(() => import("../modules/asset/admin/building/components"))
const EmployeeAssetManagement = lazy(() => import("../modules/asset/user/asset-managed/components"))

//report
const TaskReportManager = lazy(() => import("../modules/report/task-report/components/taskReportManager"))

//warehouse
const InventoryDashBoard = lazy(() => import("../modules/production/warehouse/dashboard-inventory/components"))
const BillDashBoard = lazy(() => import("../modules/production/warehouse/dashboard-bill/components"))
const CategoryManagement = lazy(() => import("../modules/production/common-production/category-management/components"))
const GoodManagement = lazy(() => import("../modules/production/common-production/good-management/components"))
const StockManagement = lazy(() => import("../modules/production/warehouse/stock-management/components"))
const BinLocationManagement = lazy(() => import("../modules/production/warehouse/bin-location-management/components"))
const BillManagement = lazy(() => import("../modules/production/warehouse/bill-management/components"))
const InventoryManagement = lazy(() => import("../modules/production/warehouse/inventory-management/components"))

// Customer Management
const CrmDashBoard = lazy(() => import("../modules/crm/dashboard/components"))
const CrmDashBoardUnit = lazy(() => import("../modules/crm/crmUnitDashboard/components"))
const CrmCustomer = lazy(() => import("../modules/crm/customer/components"))
const CrmGroup = lazy(() => import("../modules/crm/group/components"))
const CrmCare = lazy(() => import("../modules/crm/care/components"))
const CrmLoyalCustomer = lazy(() => import("../modules/crm/loyalCustomer/components"))
const CrmEvaluation = lazy(() => import("../modules/crm/evaluation/components"))
const GeneralConfiguration = lazy(() => import("../modules/crm/generalConfiguration/components"))
const CrmUnitConfiguration = lazy(() => import("../modules/crm/crmUnitConfiguration/components"))

//orders
const PurchaseOrder = lazy(() => import("../modules/production/order/purchase-order/components"))
const SalesOrder = lazy(() => import("../modules/production/order/sales-order/components"))
const Discount = lazy(() => import("../modules/production/order/discount/components"))
const Quote = lazy(() => import("../modules/production/order/quote/components"))
const SalesOrderDashboard = lazy(() => import("../modules/production/order/sales-order-dashboard/components"))
const Tax = lazy(() => import("../modules/production/order/tax/components"))
const ServiceLevelAgreement = lazy(() => import("../modules/production/order/service-level-agreement/components"))
const BusinessDepartment = lazy(() => import("../modules/production/order/business-department/components"))
const Payment = lazy(() => import("../modules/production/order/payment/components"))
const BankAccount = lazy(() => import("../modules/production/order/bank-account/components"))

// plans
const PlanManagement = lazy(() => import("../modules/plan/components"))

// Example
const ExampleManagement1 = lazy(() => import("../modules/example/example1/components"))
const ExampleManagement2 = lazy(() => import("../modules/example/example2/components"))
const ExampleManagement3 = lazy(() => import("../modules/example/example3/components"))

const ExampleManagementHooks1 = lazy(() => import("../modules/example/example1/components-hooks"))
const ExampleManagementHooks2 = lazy(() => import("../modules/example/example2/components-hooks"))
const ExampleManagementHooks3 = lazy(() => import("../modules/example/example3/components-hooks"))


// Manufacturing Managements

const ManufacturingPlan = lazy(() => import("../modules/production/manufacturing/manufacturing-plan/components"))
const ManufacturingCommand = lazy(() => import("../modules/production/manufacturing/manufacturing-command/components"))
const ManufacturingMill = lazy(() => import("../modules/production/manufacturing/manufacturing-mill/components"))
const ManufacturingPerformance = lazy(() => import("../modules/production/manufacturing/manufacturing-performance/components"))
const WorkSchedule = lazy(() => import("../modules/production/manufacturing/work-schedule/components"))
const ManufacturingWorks = lazy(() => import("../modules/production/manufacturing/manufacturing-works/components"))
const PurchasingRequest = lazy(() => import("../modules/production/manufacturing/purchasing-request/components"))
const ManufacturingDashboard = lazy(() => import("../modules/production/manufacturing/manufacturing-dashboard/components"))
const ManufacturingLot = lazy(() => import("../modules/production/manufacturing/manufacturing-lot/components"))

// Transport Managements
const TransportRequirement = lazy(() => import("../modules/production/transport/transport-requirements/components"))
const TransportPlan = lazy(() => import("../modules/production/transport/transport-plan/components"))
const TransportSchedule = lazy(() => import("../modules/production/transport/transport-schedule/components"))
const TransportVehicle = lazy(() => import("../modules/production/transport/transport-vehicle/components"))
const TransportRoute = lazy(() => import("../modules/production/transport/transport-route/components"))
const TransportDepartment = lazy(() => import("../modules/production/transport/transport-department/components"))
const CarrierTodayTransportMission = lazy(() => import("../modules/production/transport/carrier-today-transport-mission/components"))
const CarrierAllTimesTransportMission = lazy(() => import("../modules/production/transport/carrier-all-times-transport-mission/components"))

// import AnswerAuthQuestionPage from '../modules/auth/components/answerAuthQuestion';

const Project = lazy(() => import("../modules/project/projects/components/index"))
// const Phase = lazy(() => import("../modules/project/component/phases/index"))
// const PhaseDetail = lazy(() => import("../modules/project/component/phases/detailPhase"))
const ProjectDetailPage = lazy(() => import("../modules/project/projects/components/detailProjectPage"))
const ProjectReport = lazy(() => import("../modules/project/reports/components/index"))
const ProjectStatistic = lazy(() => import("../modules/project/statistic/components/index"))
const UserGuide = lazy(() => import("../modules/user-guide/components"))
const PersonalTimeSheetLog = lazy(() => import("../modules/task/task-dashboard/statistic/personalTimeSheetLog"))
const EmployeeTimeSheetLog = lazy(() => import("../modules/task/task-dashboard/statistic/employeeTimeSheetLog"))

const Notifications = lazy(() => import("../modules/notification/components/index"))
const SystemSetting = lazy(() => import("../modules/system-admin/system-setting/components"))
const Company = lazy(() => import("../modules/system-admin/company/components"))
const ManageLinkSystem = lazy(() => import("../modules/system-admin/system-link/components"))
const SystemApiManagement = lazy(() => import("../modules/system-admin/system-api/system-api-management/components/systemApiManagement"))
const PrivilegeApiManagement = lazy(() => import("../modules/system-admin/system-api/system-api-privilege/components/privilegeApiManagement"))

const ManageRoleDefault = lazy(() => import("../modules/system-admin/root-role/components"))
const ComponentsDefaultManagement = lazy(() => import("../modules/system-admin/system-component/components"))
const ManageSystem = lazy(() => import("../modules/super-admin/system/components"))
const DashboardUnitForAdmin = lazy(() => import("../modules/dashboard-unit/components/dashboardUnitForAdmin"))

class Routes extends Component {
    render() {
        const {
            auth,
            company,
            user,
            role,
            link,
            component,
            department,
            employeesManager,
        } = this.props;
        return (
            <Suspense fallback={<Layout />}>
                <Switch>
                    <AuthRoute
                        exact
                        auth={auth}
                        path="/"
                        component={Introduction}
                    />
                    <AuthRoute
                        exact={false}
                        auth={auth}
                        path="/login"
                        component={Login}
                    />
                    <AuthRoute
                        exact
                        auth={auth}
                        path="/reset-password"
                        component={ResetPassword}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"manage_system"}
                        arrPage={[
                            {
                                link: "#",
                                name: "system_administration",
                                icon: "fa fa-key",
                            },
                            {
                                link: "/system/settings",
                                name: "manage_system",
                                icon: "fa fa-gears",
                            },
                        ]}
                        // type='system-admin'
                        auth={auth}
                        exact={true}
                        link={"/system/settings"}
                        path={"/system/settings"}
                        pageName={"manage_system"}
                        layout={Layout}
                        component={SystemSetting}
                    />
                    <PrivateRoute
                        isLoading={this.props.rootRoles.isLoading}
                        key={"manage_roles_default"}
                        arrPage={[
                            {
                                link: "#",
                                name: "system_administration",
                                icon: "fa fa-key",
                            },
                            {
                                link: "/system/roles-default-management",
                                name: "manage_role",
                                icon: "fa fa-lock",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/system/roles-default-management"}
                        path={"/system/roles-default-management"}
                        pageName={"manage_role"}
                        layout={Layout}
                        component={ManageRoleDefault}
                    />
                    <PrivateRoute
                        isLoading={this.props.systemLinks.isLoading}
                        key={"manage_links_default"}
                        arrPage={[
                            {
                                link: "#",
                                name: "system_administration",
                                icon: "fa fa-key",
                            },
                            {
                                link: "/system/links-default-management",
                                name: "manage_link",
                                icon: "fa fa-link",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/system/links-default-management"}
                        path={"/system/links-default-management"}
                        pageName={"manage_link"}
                        layout={Layout}
                        component={ManageLinkSystem}
                    />
                    <PrivateRoute
                        isLoading={this.props.systemApis?.isLoading}
                        key={"manage_apis_default"}
                        arrPage={[
                            {
                                link: "#",
                                name: "system_administration",
                                icon: "fa fa-key",
                            },
                            {
                                link: "/system/apis-default-management",
                                name: "manage_api",
                                icon: "fa fa-link",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/system/apis-default-management"}
                        path={"/system/apis-default-management"}
                        pageName={"manage_api"}
                        layout={Layout}
                        component={SystemApiManagement}
                    />
                    <PrivateRoute
                        isLoading={this.props.systemApis?.isLoading}
                        key={"manage_privilege_api"}
                        arrPage={[
                            {
                                link: "#",
                                name: "system_administration",
                                icon: "fa fa-key",
                            },
                            {
                                link: "/system/privilege-api-management",
                                name: "privilege_api",
                                icon: "fa fa-link",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/system/privilege-api-management"}
                        path={"/system/privilege-api-management"}
                        pageName={"privilege_api"}
                        layout={Layout}
                        component={PrivilegeApiManagement}
                    />
                    <PrivateRoute
                        isLoading={this.props.systemComponents.isLoading}
                        key={"manage_components_default"}
                        arrPage={[
                            {
                                link: "#",
                                name: "system_administration",
                                icon: "fa fa-key",
                            },
                            {
                                link: "/system/components-default-management",
                                name: "manage_component",
                                icon: "fa fa-object-group",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/system/components-default-management"}
                        path={"/system/components-default-management"}
                        pageName={"manage_component"}
                        layout={Layout}
                        component={ComponentsDefaultManagement}
                    />
                    <PrivateRoute
                        isLoading={auth.isLoading}
                        key={"home"}
                        arrPage={[
                            { link: "/home", name: "home", icon: "fa fa-home" },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/home"}
                        path={"/home"}
                        pageName={"home"}
                        layout={Layout}
                        component={Home}
                    />
                    <PrivateRoute
                        isLoading={this.props.company.isLoading}
                        key={"companies-management"}
                        arrPage={[
                            {
                                link: "/system/companies-management",
                                name: "manage_company",
                                icon: "fa fa-building",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/system/companies-management"}
                        path={"/system/companies-management"}
                        pageName={"manage_company"}
                        layout={Layout}
                        component={Company}
                    />
                    <PrivateRoute
                        isLoading={this.props.system.isLoading}
                        key={"system-management"}
                        arrPage={[
                            {
                                link: "#",
                                name: "system_administration",
                                icon: "fa fa-key",
                            },
                            {
                                link: "/system-management",
                                name: "manage_system",
                                icon: "fa fa-database",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/system-management"}
                        path={"/system-management"}
                        pageName={"manage_system"}
                        layout={Layout}
                        component={ManageSystem}
                    />
                    <PrivateRoute
                        isLoading={this.props.user.isLoading}
                        key={"users-management"}
                        arrPage={[
                            {
                                link: "#",
                                name: "system_administration",
                                icon: "fa fa-key",
                            },
                            {
                                link: "/users-management",
                                name: "manage_user",
                                icon: "fa fa-users",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/users-management"}
                        path={"/users-management"}
                        pageName={"manage_user"}
                        layout={Layout}
                        component={ManageUser}
                    />
                    <PrivateRoute
                        isLoading={this.props.role.isLoading}
                        arrPage={[
                            {
                                link: "#",
                                name: "system_administration",
                                icon: "fa fa-key",
                            },
                            {
                                link: "/roles-management",
                                name: "manage_role",
                                icon: "fa fa-lock",
                            },
                        ]}
                        key={"roles-management"}
                        auth={auth}
                        exact={true}
                        link={"/roles-management"}
                        path={"/roles-management"}
                        pageName={"manage_role"}
                        layout={Layout}
                        component={ManageRole}
                    />
                    <PrivateRoute
                        isLoading={this.props.link.isLoading}
                        key={"links-management"}
                        arrPage={[
                            {
                                link: "#",
                                name: "system_administration",
                                icon: "fa fa-key",
                            },
                            {
                                link: "/links-management",
                                name: "manage_link",
                                icon: "fa fa-link",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/links-management"}
                        path={"/links-management"}
                        pageName={"manage_link"}
                        layout={Layout}
                        component={ManageLink}
                    />
                    <PrivateRoute
                        isLoading={this.props.api?.isLoading}
                        key={"apis-management"}
                        arrPage={[
                            {
                                link: "#",
                                name: "system_administration",
                                icon: "fa fa-key",
                            },
                            {
                                link: "/apis-management",
                                name: "manage_api",
                                icon: "fa fa-link",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/apis-management"}
                        path={"/apis-management"}
                        pageName={"manage_api"}
                        layout={Layout}
                        component={ManageApi}
                    />
                    <PrivateRoute
                        isLoading={this.props.api?.isLoading}
                        key={"apis-registration"}
                        arrPage={[
                            {
                                link: "#",
                                name: "system_administration",
                                icon: "fa fa-key",
                            },
                            {
                                link: "/apis-registration",
                                name: "registration_api",
                                icon: "fa fa-link",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/apis-registration"}
                        path={"/apis-registration"}
                        pageName={"registration_api"}
                        layout={Layout}
                        component={ApiRegistration}
                    />
                    <PrivateRoute
                        isLoading={this.props.api?.isLoading}
                        key={"apis-registration-employee"}
                        arrPage={[
                            {
                                link: "#",
                                name: "system_administration",
                                icon: "fa fa-key",
                            },
                            {
                                link: "/apis-registration-employee",
                                name: "registration_api_employee",
                                icon: "fa fa-link",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/apis-registration-employee"}
                        path={"/apis-registration-employee"}
                        pageName={"registration_api_employee"}
                        layout={Layout}
                        component={ApiRegistrationEmployee}
                    />
                    <PrivateRoute
                        isLoading={this.props.department.isLoading}
                        key={"departments-management"}
                        arrPage={[
                            {
                                link: "#",
                                name: "system_administration",
                                icon: "fa fa-key",
                            },
                            {
                                link: "/departments-management",
                                name: "manage_department",
                                icon: "fa fa-sitemap",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/departments-management"}
                        path={"/departments-management"}
                        pageName={"manage_department"}
                        layout={Layout}
                        component={ManageDepartment}
                    />
                    <PrivateRoute
                        isLoading={this.props.component.isLoading}
                        key={"components-management"}
                        arrPage={[
                            {
                                link: "#",
                                name: "system_administration",
                                icon: "fa fa-key",
                            },
                            {
                                link: "/components-management",
                                name: "manage_component",
                                icon: "fa fa-object-group",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/components-management"}
                        path={"/components-management"}
                        pageName={"manage_component"}
                        layout={Layout}
                        component={ManageComponent}
                    />

                    {/* Quản lý tài liệu của admin */}
                    <PrivateRoute
                        isLoading={false}
                        key={"manage-document"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/documents-management",
                                name: "manage_document",
                                icon: "fa fa-folder-open",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/documents-management"}
                        path={"/documents-management"}
                        pageName={"manage_document"}
                        layout={Layout}
                        component={ManageDocument}
                    />

                    {/* Quản lý tài liệu đơn vị */}
                    <PrivateRoute
                        isLoading={false}
                        key={"documents/organizational-unit"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/documents/organizational-unit",
                                name: "documents_og",
                                icon: "fa fa-folder-open",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/documents/organizational-unit"}
                        path={"/documents/organizational-unit"}
                        pageName={"documents_og"}
                        layout={Layout}
                        component={ManageDocument}
                    />

                    {/* Tài liệu văn bản của người dùng */}
                    <PrivateRoute
                        isLoading={false}
                        key={"documents"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/documents",
                                name: "documents",
                                icon: "fa fa-file-text",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/documents"}
                        path={"/documents"}
                        pageName={"documents"}
                        layout={Layout}
                        component={Document}
                    />
                    {/* Quan ly nhan su */}

                    <PrivateRoute
                        isLoading={this.props.annualLeave.isLoading}
                        key={"manage_configuration"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-configuration",
                                name: "manage_configuration",
                                icon: "fa fa-gear",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-configuration"}
                        path={"/manage-configuration"}
                        pageName={"manage_configuration"}
                        layout={Layout}
                        component={ConfigurationManager}
                    />
                    <PrivateRoute
                        isLoading={this.props.annualLeave.isLoading}
                        key={"dashboard_personal"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/dashboard-personal",
                                name: "dashboard_personal",
                                icon: "fa fa-newspaper-o",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/dashboard-personal"}
                        path={"/dashboard-personal"}
                        pageName={"dashboard_personal"}
                        layout={Layout}
                        component={DashboardPersonal}
                    />
                    <PrivateRoute
                        isLoading={this.props.annualLeave.isLoading}
                        key={"dashboard_unit"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/dashboard-unit",
                                name: "dashboard_unit",
                                icon: "fa fa-newspaper-o",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/dashboard-unit"}
                        path={"/dashboard-unit"}
                        pageName={"dashboard_unit"}
                        layout={Layout}
                        component={DashboardUnit}
                    />
                    <PrivateRoute
                        isLoading={this.props.annualLeave.isLoading}
                        key={"dashboard_all_unit"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/dashboard-all-unit",
                                name: "dashboard_all_unit",
                                icon: "fa fa-newspaper-o",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/dashboard-all-unit"}
                        path={"/dashboard-all-unit"}
                        pageName={"dashboard_all_unit"}
                        layout={Layout}
                        component={DashboardUnitForAdmin}
                    />
                    <PrivateRoute
                        isLoading={this.props.annualLeave.isLoading}
                        key={"leave_application"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-manage-leave-application",
                                name: "leave_application",
                                icon: "fa fa-envelope",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-manage-leave-application"}
                        path={"/hr-manage-leave-application"}
                        pageName={"leave_application"}
                        layout={Layout}
                        component={ManageLeaveApplication}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={"employee_infomation"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/employees-infomation",
                                name: "employee_infomation",
                                icon: "fa fa-envelope",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/employees-infomation"}
                        path={"/employees-infomation"}
                        pageName={"employee_infomation"}
                        layout={Layout}
                        component={EmployeesInfomation}
                    />

                    <PrivateRoute
                        isLoading={this.props.employeesManager.isLoading}
                        key={"add_employee"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-add-employee",
                                name: "add_employee",
                                icon: "fa fa-user-plus",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-add-employee"}
                        path={"/hr-add-employee"}
                        pageName={"add_employee"}
                        layout={Layout}
                        component={EmployeeCreate}
                    />
                    <PrivateRoute
                        isLoading={this.props.employeesInfo.isLoading}
                        key={"detail_employee"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-detail-employee",
                                name: "detail_employee",
                                icon: "fa fa-user-o",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-detail-employee"}
                        path={"/hr-detail-employee"}
                        pageName={"detail_employee"}
                        layout={Layout}
                        component={EmployeeDetail}
                    />
                    <PrivateRoute
                        isLoading={this.props.employeesInfo.isLoading}
                        key={"update_employee"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-update-employee",
                                name: "update_employee",
                                icon: "fa fa-pencil-square-o",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-update-employee"}
                        path={"/hr-update-employee"}
                        pageName={"update_employee"}
                        layout={Layout}
                        component={UpdateEmployee}
                    />
                    <PrivateRoute
                        isLoading={this.props.employeesManager.isLoading}
                        key={"list_employee"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-list-employee",
                                name: "list_employee",
                                icon: "fa fa-address-card",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-list-employee"}
                        path={"/hr-list-employee"}
                        pageName={"list_employee"}
                        layout={Layout}
                        component={EmpoyeeManager}
                    />

                    <PrivateRoute
                        isLoading={this.props.department.isLoading}
                        key={"manage_unit"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-manage-department",
                                name: "manage_unit",
                                icon: "fa fa-sitemap",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-manage-department"}
                        path={"/hr-manage-department"}
                        pageName={"manage_unit"}
                        layout={Layout}
                        component={DepartmentManage}
                    />

                    <PrivateRoute
                        isLoading={this.props.employeesManager.isLoading}
                        key={"dashBoard_employee"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-dashboard-employee",
                                name: "dashboard_employee",
                                icon: "fa fa-dashboard",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-dashboard-employee"}
                        path={"/hr-dashboard-employee"}
                        pageName={"dashboard_employee"}
                        layout={Layout}
                        component={EmployeeDashBoard}
                    />
                    <PrivateRoute
                        isLoading={this.props.discipline.isLoading}
                        key={"discipline"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-discipline",
                                name: "discipline",
                                icon: "fa fa-balance-scale",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-discipline"}
                        path={"/hr-discipline"}
                        pageName={"discipline"}
                        layout={Layout}
                        component={ManagerPraiseDiscipline}
                    />
                    <PrivateRoute
                        isLoading={this.props.annualLeave.isLoading}
                        key={"annual_leave"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-annual-leave",
                                name: "annual_leave",
                                icon: "fa fa-calendar-times-o",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-annual-leave"}
                        path={"/hr-annual-leave"}
                        pageName={"annual_leave"}
                        layout={Layout}
                        component={AnnualLeaveManager}
                    />
                    <PrivateRoute
                        isLoading={this.props.workPlan.isLoading}
                        key={"manage_work_plan"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-manage-work-plan",
                                name: "manage_work_plan",
                                icon: "fa fa-calendar",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-manage-work-plan"}
                        path={"/hr-manage-work-plan"}
                        pageName={"manage_work_plan"}
                        layout={Layout}
                        component={ManageWorkPlan}
                    />
                    <PrivateRoute
                        isLoading={this.props.workPlan.isLoading}
                        key={"annual_leave_personal"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-annual-leave-personal",
                                name: "annual_leave_personal",
                                icon: "fa fa-calendar",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-annual-leave-personal"}
                        path={"/hr-annual-leave-personal"}
                        pageName={"annual_leave_personal"}
                        layout={Layout}
                        component={AnnualLeave}
                    />
                    <PrivateRoute
                        isLoading={this.props.salary.isLoading}
                        key={"salary_employee"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-salary-employee",
                                name: "salary_employee",
                                icon: "fa fa-line-chart",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-salary-employee"}
                        path={"/hr-salary-employee"}
                        pageName={"salary_employee"}
                        layout={Layout}
                        component={SalaryManager}
                    />

                    <PrivateRoute
                        isLoading={this.props.field.isLoading}
                        key={"fields"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-manage-field",
                                name: "manage_field",
                                icon: "fa fa-line-chart",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-manage-field"}
                        path={"/hr-manage-field"}
                        pageName={"manage_field"}
                        layout={Layout}
                        component={FieldManager}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"time_keeping"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-time-keeping",
                                name: "time_keeping",
                                icon: "fa fa-calculator",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-time-keeping"}
                        path={"/hr-time-keeping"}
                        pageName={"time_keeping"}
                        layout={Layout}
                        component={TimesheetsManager}
                    />
                    <PrivateRoute
                        isLoading={this.props.education.isLoading}
                        key={"list_education"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-list-education",
                                name: "list_education",
                                icon: "fa fa-university",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-list-education"}
                        path={"/hr-list-education"}
                        pageName={"list_education"}
                        layout={Layout}
                        component={ListEducation}
                    />
                    <PrivateRoute
                        isLoading={this.props.course.isLoading}
                        key={"training_plan"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-training-plan",
                                name: "training_plan",
                                icon: "fa fa-list-alt",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-training-plan"}
                        path={"/hr-training-plan"}
                        pageName={"training_plan"}
                        layout={Layout}
                        component={TrainingPlan}
                    />

                    {/* Quản lý gói thầu */}
                    {/* <PrivateRoute
                        isLoading={this.props.course.isLoading}
                        key={"list_search_for_package"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-search-for-package",
                                name: "list_search_for_package",
                                icon: "fa fa-list-alt",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-search-for-package"}
                        path={"/hr-search-for-package"}
                        pageName={"list_search_for_package"}
                        layout={Layout}
                        component={SearchEmployeeForPackage}
                    /> */}

                    {/* Nhân sự gói thầu */}
                    <PrivateRoute
                        isLoading={this.props.course.isLoading}
                        key={"list_search_for_package"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-search-for-package",
                                name: "list_search_for_package",
                                icon: "fa-regular fa-file-magnifying-glass",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-search-for-package"}
                        path={"/hr-search-for-package"}
                        pageName={"list_search_for_package"}
                        layout={Layout}
                        component={SearchKeyEmployee}
                    />

                    {/* Nhân sự gói thầu */}
                    <PrivateRoute
                        isLoading={this.props.course.isLoading}
                        key={"list_major"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-list-major",
                                name: "list_major",
                                icon: "fa fa-list-alt",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-list-major"}
                        path={"/hr-list-major"}
                        pageName={"list_major"}
                        layout={Layout}
                        component={Major}
                    />

                    <PrivateRoute
                        isLoading={this.props.course.isLoading}
                        key={"list_career_position"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-list-career-position",
                                name: "list_career_position",
                                icon: "fa fa-list-alt",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-list-career-position"}
                        path={"/hr-list-career-position"}
                        pageName={"list_career_position"}
                        layout={Layout}
                        component={CareerPosition}
                    />

                    <PrivateRoute
                        isLoading={this.props.course.isLoading}
                        key={"list_bidding_package"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-list-bidding-package",
                                name: "list_bidding_package",
                                icon: "fa fa-list-alt",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-list-bidding-package"}
                        path={"/hr-list-bidding-package"}
                        pageName={"list_bidding_package"}
                        layout={Layout}
                        component={BiddingPackagesManagement}
                    />

                    <PrivateRoute
                        isLoading={this.props.course.isLoading}
                        key={"list_certificate"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-list-certificate",
                                name: "list_certificate",
                                icon: "fa fa-list-alt",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-list-certificate"}
                        path={"/hr-list-certificate"}
                        pageName={"list_certificate"}
                        layout={Layout}
                        component={Certificate}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={"training_plan_employee"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/hr-training-plan-employee",
                                name: "training_plan_employee",
                                icon: "fa fa-list-alt",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/hr-training-plan-employee"}
                        path={"/hr-training-plan-employee"}
                        pageName={"training_plan_employee"}
                        layout={Layout}
                        component={CourseOfUser}
                    />

                    {/* bidding - routes */}
                    <PrivateRoute
                        isLoading={this.props.course.isLoading}
                        key={"list_bidding_contract"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/bidding-list-contract",
                                name: "list_bidding_contract",
                                icon: "fa fa-list-alt",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/bidding-list-contract"}
                        path={"/bidding-list-contract"}
                        pageName={"list_bidding_contract"}
                        layout={Layout}
                        component={Contract}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"/bidding-project-template"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/project/projects-list",
                                name: "bidding_project_template_list",
                                icon: "fa fa-folder-open",
                            }
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/bidding-project-template"}
                        path={"/bidding-project-template"}
                        pageName={"bidding_project_template_list"}
                        layout={Layout}
                        component={Project}
                    />
                    <PrivateRoute
                        isLoading={this.props.course.isLoading}
                        key={"list_search_for_package"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/bidding-search-for-package",
                                name: "list_search_for_package",
                                icon: "fa-regular fa-file-magnifying-glass",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/bidding-search-for-package"}
                        path={"/bidding-search-for-package"}
                        pageName={"list_search_for_package"}
                        layout={Layout}
                        component={SearchKeyEmployee}
                    />
                    <PrivateRoute
                        isLoading={this.props.course.isLoading}
                        key={"list_bidding_package"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/bidding-list-package",
                                name: "list_bidding_package",
                                icon: "fa fa-list-alt",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/bidding-list-package"}
                        path={"/bidding-list-package"}
                        pageName={"list_bidding_package"}
                        layout={Layout}
                        component={BiddingPackagesManagement}
                    />

                    {/* kpi - routes */}
                    <PrivateRoute
                        isLoading={this.props.createKpiUnit.isLoading}
                        key={"kpi-unit-create"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/kpi-units/create-for-admin",
                                name: "kpi_unit_create_for_admin",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/kpi-units/create-for-admin"}
                        path={"/kpi-units/create-for-admin"}
                        pageName={"kpi_unit_create_for_admin"}
                        layout={Layout}
                        component={OrganizationalUnitKpiCreateForAdmin}
                    />
                    <PrivateRoute
                        isLoading={this.props.createKpiUnit.isLoading}
                        key={"kpi-unit-create"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/kpi-units/create",
                                name: "kpi_unit_create",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/kpi-units/create"}
                        path={"/kpi-units/create"}
                        pageName={"kpi_unit_create"}
                        layout={Layout}
                        component={OrganizationalUnitKpiCreate}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"kpi-unit-evaluate"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/kpi-units/evaluate",
                                name: "kpi_unit_evaluate",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/kpi-units/evaluate"}
                        path={"/kpi-units/evaluate"}
                        pageName={"kpi_unit_evaluate"}
                        layout={Layout}
                        component={KPIUnitEvaluate}
                    />
                    <PrivateRoute
                        isLoading={
                            this.props.dashboardOrganizationalUnitKpi.isLoading
                        }
                        key={"kpi-unit-dashboard"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/kpi-units/dashboard",
                                name: "kpi_unit_dashboard",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/kpi-units/dashboard"}
                        path={"/kpi-units/dashboard"}
                        pageName={"kpi_unit_dashboard"}
                        layout={Layout}
                        component={OrganizationalUnitKpiDashboard}
                    />
                    <PrivateRoute
                        isLoading={
                            this.props.statisticsOfOrganizationalUnitKpi
                                .isLoading
                        }
                        key={"kpi-unit-statistic"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/kpi-units/statistic",
                                name: "kpi_unit_statistic",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/kpi-units/statistic"}
                        path={"/kpi-units/statistic"}
                        pageName={"kpi_unit_statistic"}
                        layout={Layout}
                        component={StatisticsOfOrganizationalUnitKpi}
                    />
                    <PrivateRoute
                        isLoading={this.props.managerKpiUnit.isLoading}
                        key={"kpi-unit-manager"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/kpi-units/manager",
                                name: "kpi_unit_manager",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/kpi-units/manager"}
                        path={"/kpi-units/manager"}
                        pageName={"kpi_unit_manager"}
                        layout={Layout}
                        component={KPIUnitManager}
                    />
                    <PrivateRoute
                        isLoading={this.props.createEmployeeKpiSet.isLoading}
                        key={"kpi-personal-create"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/kpi-personals/create",
                                name: "kpi_personal_create",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/kpi-personals/create"}
                        path={"/kpi-personals/create"}
                        pageName={"kpi_personal_create"}
                        layout={Layout}
                        component={CreateEmployeeKpiSet}
                    />
                    <PrivateRoute
                        isLoading={this.props.KPIPersonalManager.isLoading}
                        key={"kpi-personal-manager"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/kpi-personals/manager",
                                name: "kpi_personal_manager",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/kpi-personals/manager"}
                        path={"/kpi-personals/manager"}
                        pageName={"kpi_personal_manager"}
                        layout={Layout}
                        component={KPIPersonalManager}
                    />
                    <PrivateRoute
                        isLoading={this.props.dashboardEmployeeKpiSet.isLoading}
                        key={"kpi-personal-dashboard"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/kpi-personals/dashboard",
                                name: "kpi_personal_dasdboad",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/kpi-personals/dashboard"}
                        path={"/kpi-personals/dashboard"}
                        pageName={"kpi_personal_dashboard"}
                        layout={Layout}
                        component={DashBoardEmployeeKpiSet}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"kpi-personal-evaluate"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/kpi-personals/evaluate",
                                name: "kpi_personal_evaluate",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/kpi-personals/evaluate"}
                        path={"/kpi-personals/evaluate"}
                        pageName={"kpi_personal_evaluate"}
                        layout={Layout}
                        component={KPIPersonalEvaluate}
                    />
                    <PrivateRoute
                        isLoading={this.props.tasktemplates.isLoading}
                        key={"task-template-management"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/task-template",
                                name: "task_template",
                                icon: "fa fa-flash",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/task-template"}
                        path={"/task-template"}
                        pageName={"task_template"}
                        layout={Layout}
                        component={TaskTemplate}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={"notifications"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/notifications",
                                name: "notifications",
                                icon: "fa fa-bell",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/notifications"}
                        path={"/notifications"}
                        pageName={"notifications"}
                        layout={Layout}
                        component={Notifications}
                    />
                    <PrivateRoute
                        isLoading={this.props.kpimembers.isLoading}
                        key={"kpi_member_manager"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/kpi-member/manager",
                                name: "kpi_member_manager",
                                icon: "fa fa-number",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/kpi-member/manager"}
                        path={"/kpi-member/manager"}
                        pageName="kpi_member_manager"
                        layout={Layout}
                        component={EmployeeKpiManagement}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"kpi_member_dashboard"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/kpi-member/dashboard",
                                name: "kpi_member_dashboard",
                                icon: "fa fa-number",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/kpi-member/dashboard"}
                        path={"/kpi-member/dashboard"}
                        pageName="kpi_member_dashboard"
                        layout={Layout}
                        component={EmployeeKpiEvaluationDashboard}
                    />
                    {/* Task Management */}
                    <PrivateRoute
                        isLoading={this.props.tasks.isLoading}
                        key={"task-management"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/task-management",
                                name: "task_management",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/task-management"}
                        path={"/task-management"}
                        pageName={"task_management"}
                        layout={Layout}
                        component={TaskManagement}
                    />

                    {/* Quản lý công việc đơn vị */}
                    <PrivateRoute
                        isLoading={this.props.tasks.isLoading}
                        key={"task-management-unit"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/task-management-unit",
                                name: "task_management_of_unit",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/task-management-unit"}
                        path={"/task-management-unit"}
                        pageName={"task_management_of_unit"}
                        layout={Layout}
                        component={TaskManagementOfUnit}
                    />
                    <PrivateRoute // Trang chi tiết công việc (không có trên menu)
                        isLoading={this.props.tasks.isLoading}
                        key={"task"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            { link: "/task", name: "task", icon: "" },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/task"}
                        path={"/task"}
                        pageName={"task"}
                        layout={Layout}
                        component={TaskComponent}
                    />
                    <PrivateRoute // Trang chi tiết mẫu quy trinh  (không có trên menu)
                        isLoading={this.props.tasks.isLoading}
                        key={"task"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            { link: "/process-template", name: "process-template", icon: "" },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/process-template"}
                        path={"/process-template"}
                        pageName={"process_template"}
                        layout={Layout}
                        component={ModalViewTaskProcessById}
                    />
                    <PrivateRoute // Trang chi tiết quy trinh  (không có trên menu)
                        isLoading={this.props.tasks.isLoading}
                        key={"task"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            { link: "/process-template", name: "process-template", icon: "" },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/process"}
                        path={"/process"}
                        pageName={"process"}
                        layout={Layout}
                        component={ModalViewProcessById}
                    />
                    <PrivateRoute
                        isLoading={this.props.tasks.isLoading}
                        key={"task-management-dashboard"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/task-management-dashboard",
                                name: "task_management_dashboard",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/task-management-dashboard"}
                        path={"/task-management-dashboard"}
                        pageName={"task_management_dashboard"}
                        layout={Layout}
                        component={TaskDashboard}
                    />
                    <PrivateRoute
                        isLoading={this.props.tasks.isLoading}
                        key={"task-organization-management-dashboard"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/task-organization-management-dashboard",
                                name: "task_organization_management_dashboard",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/task-organization-management-dashboard"}
                        path={"/task-organization-management-dashboard"}
                        pageName={"task_organization_management_dashboard"}
                        layout={Layout}
                        component={TaskOrganizationUnitDashboard}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"task-process-management"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/task-process-management",
                                name: "task_management_process",
                                icon: "fa fa-folder-open",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/task-process-management"}
                        path={"/task-process-management"}
                        pageName={"task_management_process"}
                        layout={Layout}
                        component={TaskProcessManagement}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"task-process-template"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/task-process-template",
                                name: "task_process_template",
                                icon: "fa fa-folder-open",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/task-process-template"}
                        path={"/task-process-template"}
                        pageName={"task_process_template"}
                        layout={Layout}
                        component={ProcessTemplate}
                    />
                    {/** Quản lý tài sản */}
                    {/** Nhân viên */}
                    <PrivateRoute
                        isLoading={this.props.recommendProcure.isLoading}
                        key={"asset-purchase-request"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/asset-purchase-request",
                                name: "recommend_equipment_procurement",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/asset-purchase-request"}
                        path={"/asset-purchase-request"}
                        pageName={"recommend_equipment_procurement"}
                        layout={Layout}
                        component={RecommendProcure}
                    />

                    <PrivateRoute
                        isLoading={this.props.recommendDistribute.isLoading}
                        key={"asset-use-request"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/asset-use-request",
                                name: "recommend_distribute_asset",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/asset-use-request"}
                        path={"/asset-use-request"}
                        pageName={"recommend_distribute_asset"}
                        layout={Layout}
                        component={RecommendDistribute}
                    />

                    <PrivateRoute
                        isLoading={this.props.assetsManager.isLoading}
                        key={"manage-assigned-asset"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-assigned-asset",
                                name: "manage_assigned_asset",
                                icon: "fa fa-balance-scale",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-assigned-asset"}
                        path={"/manage-assigned-asset"}
                        pageName={"manage_assigned_asset"}
                        layout={Layout}
                        component={ManagerAssetAssignedCrash}
                    />

                    <PrivateRoute
                        isLoading={this.props.assetsManager.isLoading}
                        key={"employee-manage-info-asset"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/employee-manage-info-asset",
                                name: "manage_info_asset",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/employee-manage-info-asset"}
                        path={"/employee-manage-info-asset"}
                        pageName={"employee_manage_asset_info"}
                        layout={Layout}
                        component={EmployeeAssetManagement}
                    />

                    {/** Quản lý */}
                    <PrivateRoute
                        isLoading={false}
                        key={"dashBoard_asset"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/dashboard-asset",
                                name: "dashboard_asset",
                                icon: "fa fa-dashboard",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/dashboard-asset"}
                        path={"/dashboard-asset"}
                        pageName={"dashboard_asset"}
                        layout={Layout}
                        component={DashBoardAssets}
                    />

                    <PrivateRoute
                        isLoading={this.props.assetType.isLoading}
                        key={"manage-type-asset"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-type-asset",
                                name: "manage_type_asset",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-type-asset"}
                        path={"/manage-type-asset"}
                        pageName={"manage_type_asset"}
                        layout={Layout}
                        component={ManagerAssetType}
                    />

                    <PrivateRoute
                        isLoading={this.props.assetsManager.isLoading}
                        key={"manage-info-asset"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-info-asset",
                                name: "manage_info_asset",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-info-asset"}
                        path={"/manage-info-asset"}
                        pageName={"manage_info_asset"}
                        layout={Layout}
                        component={AssetManager}
                    />

                    <PrivateRoute
                        isLoading={this.props.assetLotManager.isLoading}
                        key={"manage-info-asset-lot"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-info-asset-lot",
                                name: "manage_info_asset_lot",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-info-asset-lot"}
                        path={"/manage-info-asset-lot"}
                        pageName={"manage_info_asset_lot"}
                        layout={Layout}
                        component={AssetLotManager}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={"manage-maintainance-asset"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-maintainance-asset",
                                name: "manage_maintainance_asset",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-maintainance-asset"}
                        path={"/manage-maintainance-asset"}
                        pageName={"manage_maintainance_asset"}
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
                        key={"manage-depreciation-asset"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-depreciation-asset",
                                name: "manage_depreciation_asset",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-depreciation-asset"}
                        path={"/manage-depreciation-asset"}
                        pageName={"manage_depreciation_asset"}
                        layout={Layout}
                        component={ManagerDepreciation}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={"manage-incident-asset"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-incident-asset",
                                name: "manage_incident_asset",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-incident-asset"}
                        path={"/manage-incident-asset"}
                        pageName={"manage_incident_asset"}
                        layout={Layout}
                        component={IncidentManager}
                    />

                    <PrivateRoute
                        isLoading={this.props.recommendProcure.isLoading}
                        key={"manage-asset-purchase-request"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-asset-purchase-request",
                                name: "manage_recommend_procure",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-asset-purchase-request"}
                        path={"/manage-asset-purchase-request"}
                        pageName={"manage_recommend_procure"}
                        layout={Layout}
                        component={ManagerRecommendProcure}
                    />

                    <PrivateRoute
                        isLoading={this.props.recommendDistribute.isLoading}
                        key={"manage-asset-use-request"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-asset-use-request",
                                name: "manage_recommend_distribute_asset",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-asset-use-request"}
                        path={"/manage-asset-use-request"}
                        pageName={"manage_recommend_distribute_asset"}
                        layout={Layout}
                        component={ManagerRecommendDistribute}
                    />


                    {/* Supplies */}
                    <PrivateRoute
                        isLoading={this.props.suppliesDashboardReducer.isLoading}
                        key={"dashboard-supplies"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/dashboard-supplies",
                                name: "dashboard_supplies",
                                icon: "fa fa-dashboard",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/dashboard-supplies"}
                        path={"/dashboard-supplies"}
                        pageName={"dashboard_supplies"}
                        layout={Layout}
                        component={ManageSupplieDashboard}
                    />

                    <PrivateRoute
                        isLoading={this.props.suppliesReducer.isLoading}
                        key={"manage-supplies"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-supplies",
                                name: "manage_supplies",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-supplies"}
                        path={"/manage-supplies"}
                        pageName={"manage_supplies"}
                        layout={Layout}
                        component={ManageSupplies}
                    />
                    <PrivateRoute
                        isLoading={this.props.purchaseInvoiceReducer.isLoading}
                        key={"manage-purchase-invoice"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-supplies",
                                name: "manage_purchase_invoice",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-purchase-invoice"}
                        path={"/manage-purchase-invoice"}
                        pageName={"manage_purchase_invoice"}
                        layout={Layout}
                        component={ManagePurchaseInvoice}
                    />
                    <PrivateRoute
                        isLoading={this.props.allocationHistoryReducer.isLoading}
                        key={"manage-allocation-history"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-allocation-history",
                                name: "manage_allocation_history",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-allocation-history"}
                        path={"/manage-allocation-history"}
                        pageName={"manage_allocation_history"}
                        layout={Layout}
                        component={ManageAllocationHistory}
                    />

                    <PrivateRoute
                        isLoading={this.props.purchaseRequest.isLoading}
                        key={"manage-supplies-request"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-supplies-request",
                                name: "manage_supplies_purchase_request",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-supplies-request"}
                        path={"/manage-supplies-request"}
                        pageName={"manage_supplies_purchase_request"}
                        layout={Layout}
                        component={ManagePurchaseRequest}
                    />


                    <PrivateRoute
                        isLoading={this.props.purchaseRequest.isLoading}
                        key={"supplies-purchase-request"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/supplies-purchase-request",
                                name: "recommend_supplies_procurement",
                                icon: "",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/supplies-purchase-request"}
                        path={"/supplies-purchase-request"}
                        pageName={"recommend_supplies_procurement"}
                        layout={Layout}
                        component={UserPurchaseRequest}
                    />



                    <PrivateRoute
                        isLoading={this.props.reports.isLoading}
                        key={"task-report-management"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/task-report",
                                name: "task_report",
                                icon: "fa fa-flash",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/task-report"}
                        path={"/task-report"}
                        pageName={"task_report"}
                        layout={Layout}
                        component={TaskReportManager}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={"dashboard-inventory"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/dashboard-inventory",
                                name: "dashboard_inventory",
                                icon: "fa fa-dashboard",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/dashboard-inventory"}
                        path={"/dashboard-inventory"}
                        pageName={"dashboard_inventory"}
                        layout={Layout}
                        component={InventoryDashBoard}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={"dashboard-bill"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/dashboard-bill",
                                name: "dashboard_bill",
                                icon: "fa fa-dashboard",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/dashboard-bill"}
                        path={"/dashboard-bill"}
                        pageName={"dashboard_bill"}
                        layout={Layout}
                        component={BillDashBoard}
                    />

                    <PrivateRoute
                        isLoading={this.props.categories.isLoading}
                        key={"category-management"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/category-management",
                                name: "category_management",
                                icon: "fa fa-cubes",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/category-management"}
                        path={"/category-management"}
                        pageName={"category_management"}
                        layout={Layout}
                        component={CategoryManagement}
                    />

                    <PrivateRoute
                        isLoading={this.props.goods.isLoading}
                        key={"good-management"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/good-management",
                                name: "good_management",
                                icon: "fa fa-gift",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/good-management"}
                        path={"/good-management"}
                        pageName={"good_management"}
                        layout={Layout}
                        component={GoodManagement}
                    />
                    <PrivateRoute
                        isLoading={this.props.stocks.isLoading}
                        key={"stock-management"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/stock-management",
                                name: "stock_management",
                                icon: "fa fa-bank",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/stock-management"}
                        path={"/stock-management"}
                        pageName={"stock_management"}
                        layout={Layout}
                        component={StockManagement}
                    />
                    <PrivateRoute
                        isLoading={this.props.binLocations.isLoading}
                        key={"bin-location-management"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/bin-location-management",
                                name: "bin_location_management",
                                icon: "fa fa-sitemap",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/bin-location-management"}
                        path={"/bin-location-management"}
                        pageName={"bin_location_management"}
                        layout={Layout}
                        component={BinLocationManagement}
                    />
                    <PrivateRoute
                        isLoading={this.props.lots.isLoading}
                        key={"inventory-management"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/inventory-management",
                                name: "inventory_management",
                                icon: "fa fa-times-circle-o",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/inventory-management"}
                        path={"/inventory-management"}
                        pageName={"inventory_management"}
                        layout={Layout}
                        component={InventoryManagement}
                    />
                    <PrivateRoute
                        isLoading={this.props.bills.isLoading}
                        key={"bill-management"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/bill-management",
                                name: "bill_management",
                                icon: "fa fa-reorder",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/bill-management"}
                        path={"/bill-management"}
                        pageName={"bill_management"}
                        layout={Layout}
                        component={BillManagement}
                    />

                    <PrivateRoute
                        isLoading={this.props.assetsManager.isLoading}
                        key={"view-building-list"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/view-building-list",
                                name: "view_building_list",
                                icon: "fa fa-building",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/view-building-list"}
                        path={"/view-building-list"}
                        pageName={"view_building_list"}
                        layout={Layout}
                        // xem danh sach
                        component={BuildingAsset}
                    />

                    {/* Customer Management */}
                    <PrivateRoute
                        isLoading={false}
                        key={"crm_dashboard"}
                        arrPage={[
                            {
                                link: "/crm/dashboard",
                                name: "crm_list.dashboard",
                                icon: "fa fa-dashboard",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/crm/dashboard"}
                        path={"/crm/dashboard"}
                        pageName={"crm_list.dashboard"}
                        layout={Layout}
                        component={CrmDashBoard}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"crm_dashboardUnit"}
                        arrPage={[
                            {
                                link: "/crm/dashboardUnit",
                                name: "crm_list.dashboardUnit",
                                icon: "fa fa-dashboard",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/crm/dashboardUnit"}
                        path={"/crm/dashboardUnit"}
                        pageName={"crm_list.dashboardUnit"}
                        layout={Layout}
                        component={CrmDashBoardUnit}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={"crm_customer"}
                        arrPage={[
                            {
                                link: "/crm/customer",
                                name: "crm_list.customer",
                                icon: "fa fa-users",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/crm/customer"}
                        path={"/crm/customer"}
                        pageName={"crm_list.customer"}
                        layout={Layout}
                        component={CrmCustomer}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"crm_loyal_customer"}
                        arrPage={[
                            {
                                link: "/crm/loyal-customer",
                                name: "crm_list.lead",
                                icon: "fa fa-users",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/crm/loyal-customer"}
                        path={"/crm/loyal-customer"}
                        pageName={"crm_list.lead"}
                        layout={Layout}
                        component={CrmLoyalCustomer}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={"customer-group"}
                        arrPage={[
                            {
                                link: "/crm/group",
                                name: "crm_list.group",
                                icon: "fa fa-group",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/crm/group"}
                        path={"/crm/group"}
                        pageName={"crm_list.group"}
                        layout={Layout}
                        component={CrmGroup}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"crm_evaluation"}
                        arrPage={[
                            {
                                link: "/crm/evaluation",
                                name: "crm_list.evaluation",
                                icon: "fa fa-users",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/crm/evaluation"}
                        path={"/crm/evaluation"}
                        pageName={"crm_list.evaluation"}
                        layout={Layout}
                        component={CrmEvaluation}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"customer-care"}
                        arrPage={[
                            {
                                link: "/crm/care",
                                name: "crm_list.care",
                                icon: "fa fa-group",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/crm/care"}
                        path={"/crm/care"}
                        pageName={"crm_list.care"}
                        layout={Layout}
                        component={CrmCare}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={"generalConfiguration"}
                        arrPage={[
                            {
                                link: "/crm/generalConfiguration",
                                name: "crm_list.generalConfiguration",
                                icon: "fa fa-gear",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/crm/generalConfiguration"}
                        path={"/crm/generalConfiguration"}
                        pageName={"crm_list.generalConfiguration"}
                        layout={Layout}
                        component={GeneralConfiguration}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"crmUnitConfiguration"}
                        arrPage={[
                            {
                                link: "/crm/crmUnitConfiguration",
                                name: "crm_list.crmUnitConfiguration",
                                icon: "fa fa-gear",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/crm/crmUnitConfiguration"}
                        path={"/crm/crmUnitConfiguration"}
                        pageName={"crm_list.crmUnitConfiguration"}
                        layout={Layout}
                        component={CrmUnitConfiguration}
                    />

                    {/* Orders Management */}

                    <PrivateRoute
                        isLoading={this.props.salesOrders.isLoading}
                        key={"/manage-sales-order"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-sales-order",
                                name: "manage_sales_order",
                                icon: "fa fa-address-card",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-sales-order"}
                        path={"/manage-sales-order"}
                        pageName={"manage_sales_order"}
                        layout={Layout}
                        component={SalesOrder}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={"/manage-purchase-order"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-purchase-order",
                                name: "manage_purchase_order",
                                icon: "fa fa-address-card",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-purchase-order"}
                        path={"/manage-purchase-order"}
                        pageName={"manage_purchase_order"}
                        layout={Layout}
                        component={PurchaseOrder}
                    />

                    <PrivateRoute
                        isLoading={this.props.quotes.isLoading}
                        key={"/manage-quote"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-quote",
                                name: "manage_quote",
                                icon: "fa fa-address-card",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-quote"}
                        path={"/manage-quote"}
                        pageName={"manage_quote"}
                        layout={Layout}
                        component={Quote}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={"/manage-sales-order-dashboard"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-sales-order-dashboard",
                                name: "manage_sales_order_dashboard",
                                icon: "fa fa-address-card",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-sales-order-dashboard"}
                        path={"/manage-sales-order-dashboard"}
                        pageName={"manage_sales_order_dashboard"}
                        layout={Layout}
                        component={SalesOrderDashboard}
                    />

                    <PrivateRoute
                        isLoading={this.props.discounts.isLoading}
                        key={"/manage-discount"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-discount",
                                name: "manage_discount",
                                icon: "fa fa-address-card",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-discount"}
                        path={"/manage-discount"}
                        pageName={"manage_discount"}
                        layout={Layout}
                        component={Discount}
                    />

                    <PrivateRoute
                        isLoading={this.props.taxs.isLoading}
                        key={"/manage-tax"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-tax",
                                name: "manage_tax",
                                icon: "fa fa-address-card",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-tax"}
                        path={"/manage-tax"}
                        pageName={"manage_tax"}
                        layout={Layout}
                        component={Tax}
                    />

                    <PrivateRoute
                        isLoading={this.props.serviceLevelAgreements.isLoading}
                        key={"/manage-sla"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-sla",
                                name: "manage_sla",
                                icon: "fa fa-address-card",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-sla"}
                        path={"/manage-sla"}
                        pageName={"manage_sla"}
                        layout={Layout}
                        component={ServiceLevelAgreement}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={"/manage-business-department"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-business-department",
                                name: "manage_business_department",
                                icon: "fa fa-address-card",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-business-department"}
                        path={"/manage-business-department"}
                        pageName={"manage_business_department"}
                        layout={Layout}
                        component={BusinessDepartment}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={"/manage-bank-account"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-bank-account",
                                name: "manage_bank_account",
                                icon: "fa fa-address-card",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-bank-account"}
                        path={"/manage-bank-account"}
                        pageName={"manage_bank_account"}
                        layout={Layout}
                        component={BankAccount}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={"/manage-payment"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-payment",
                                name: "manage_payment",
                                icon: "fa fa-address-card",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-payment"}
                        path={"/manage-payment"}
                        pageName={"manage_payment"}
                        layout={Layout}
                        component={Payment}
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
                        isLoading={this.props.example1.isLoading}
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
                        isLoading={this.props.example2.isLoading}
                        key={"manage-examples-2"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-examples-2",
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

                    {/* Example Management Hooks*/}
                    <PrivateRoute
                        isLoading={this.props.example1.isLoading}
                        key={"manage-examples-1"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-examples-hooks-1",
                                name: "manage_examples_hooks_1",
                                icon: "fa fa-circle",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-examples-hooks-1"}
                        path={"/manage-examples-hooks-1"}
                        pageName={"manage_examples_hooks_1"}
                        layout={Layout}
                        component={ExampleManagementHooks1}
                    />

                    <PrivateRoute
                        isLoading={this.props.example2.isLoading}
                        key={"manage-examples-2"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-examples-hooks-2",
                                name: "manage_examples_hooks_2",
                                icon: "fa fa-circle",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-examples-hooks-2"}
                        path={"/manage-examples-hooks-2"}
                        pageName={"manage_examples_hooks_2"}
                        layout={Layout}
                        component={ExampleManagementHooks2}
                    />
                    {/* example 3 */}
                    <PrivateRoute
                        isLoading={this.props.example3.isLoading}
                        key={"manage-examples-3"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-examples-3",
                                name: "manage_examples_3",
                                icon: "fa fa-adjust",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-examples-3"}
                        path={"/manage-examples-3"}
                        pageName={"manage_examples_3"}
                        layout={Layout}
                        component={ExampleManagement3}
                    />

                    <PrivateRoute
                        isLoading={this.props.example3.isLoading}
                        key={"manage-examples-3"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-examples-hooks-3",
                                name: "manage_examples_hooks_3",
                                icon: "fa fa-circle",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-examples-hooks-3"}
                        path={"/manage-examples-hooks-3"}
                        pageName={"manage_examples_hooks_3"}
                        layout={Layout}
                        component={ExampleManagementHooks3}
                    />

                    {/* Manufacturing-management */}

                    <PrivateRoute
                        isLoading={this.props.manufacturingPlan.isLoading}
                        key={"manage-manufacturing-plan"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-manufacturing-plan",
                                name: "manage_manufacturing_plan",
                                icon: "fa fa-file-o",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-manufacturing-plan"}
                        path={"/manage-manufacturing-plan"}
                        pageName={"manage_manufacturing_plan"}
                        layout={Layout}
                        component={ManufacturingPlan}
                    />

                    <PrivateRoute
                        isLoading={this.props.manufacturingCommand.isLoading}
                        key={"manage-manufacturing-command"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-manufacturing-command",
                                name: "manage_manufacturing_command",
                                icon: "fa fa-gavel",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-manufacturing-command"}
                        path={"/manage-manufacturing-command"}
                        pageName={"manage_manufacturing_command"}
                        layout={Layout}
                        component={ManufacturingCommand}
                    />
                    <PrivateRoute
                        isLoading={this.props.workSchedule.isLoading}
                        key={"manage-work-schedule"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-work-schedule",
                                name: "manage_work_schedule",
                                icon: "fa fa-calendar",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-work-schedule"}
                        path={"/manage-work-schedule"}
                        pageName={"manage_work_schedule"}
                        layout={Layout}
                        component={WorkSchedule}
                    />

                    <PrivateRoute
                        isLoading={this.props.purchasingRequest.isLoading}
                        key={"manage-purchasing-request"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-purchasing-request",
                                name: "manage_purchasing_request",
                                icon: "fa fa-file-text-o",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-purchasing-request"}
                        path={"/manage-purchasing-request"}
                        pageName={"manage_purchasing_request"}
                        layout={Layout}
                        component={PurchasingRequest}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={"manufacturing-dashboard"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manufacturing-dashboard",
                                name: "manufacturing_dashboard",
                                icon: "fa fa-dashboard",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manufacturing-dashboard"}
                        path={"/manufacturing-dashboard"}
                        pageName={"manufacturing_dashboard"}
                        layout={Layout}
                        component={ManufacturingDashboard}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={"analysis-manufacturing-performance"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/analysis-manufacturing-performance",
                                name: "analysis_manufacturing_performance",
                                icon: "fa fa-bar-chart",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/analysis-manufacturing-performance"}
                        path={"/analysis-manufacturing-performance"}
                        pageName={"analysis_manufacturing_performance"}
                        layout={Layout}
                        component={ManufacturingPerformance}
                    />

                    <PrivateRoute
                        isLoading={this.props.manufacturingWorks.isLoading}
                        key={"manage-manufacturing-works"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-manufacturing-works",
                                name: "manage_manufacturing_works",
                                icon: "fa fa-university",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-manufacturing-works"}
                        path={"/manage-manufacturing-works"}
                        pageName={"manage_manufacturing_works"}
                        layout={Layout}
                        component={ManufacturingWorks}
                    />

                    <PrivateRoute
                        isLoading={this.props.manufacturingMill.isLoading}
                        key={"manage-manufacturing-mill"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-manufacturing-mill",
                                name: "manage_manufacturing_mill",
                                icon: "fa fa-home",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-manufacturing-mill"}
                        path={"/manage-manufacturing-mill"}
                        pageName={"manage_manufacturing_mill"}
                        layout={Layout}
                        component={ManufacturingMill}
                    />

                    <PrivateRoute
                        isLoading={this.props.lots.isLoading}
                        key={"manage-manufacturing-lot"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-manufacturing-lot",
                                name: "manage_manufacturing_lot",
                                icon: "fa fa-navicon",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-manufacturing-lot"}
                        path={"/manage-manufacturing-lot"}
                        pageName={"manage_manufacturing_lot"}
                        layout={Layout}
                        component={ManufacturingLot}
                    />

                    {/* Transport Management */}

                    <PrivateRoute
                        isLoading={false}
                        key={"manage-transport-requirement"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-transport-requirement", // url trang
                                name: "manage_transport_requirements", // tên trang
                                icon: " fa fa-calendar-o ",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-transport-requirement"}
                        path={"/manage-transport-requirement"}
                        pageName={"manage_transport_requirements"}
                        layout={Layout}
                        component={TransportRequirement} // component ứng với trang, tạo ở bước 1
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"manage-transport-plan"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-transport-plan", // url trang
                                name: "manage_transport_plan", // tên trang
                                icon: " fa fa-calendar-o ",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-transport-plan"}
                        path={"/manage-transport-plan"}
                        pageName={"manage_transport_plan"}
                        layout={Layout}
                        component={TransportPlan} // component ứng với trang, tạo ở bước 1
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"manage-transport-schedule"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-transport-schedule", // url trang
                                name: "manage_transport_schedule", // tên trang
                                icon: " fa fa-calendar-o ",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-transport-schedule"}
                        path={"/manage-transport-schedule"}
                        pageName={"manage_transport_schedule"}
                        layout={Layout}
                        component={TransportSchedule} // component ứng với trang, tạo ở bước 1
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"manage-transport-vehicle"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-transport-vehicle", // url trang
                                name: "manage_transport_vehicle", // tên trang
                                icon: " fa fa-calendar-o ",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-transport-vehicle"}
                        path={"/manage-transport-vehicle"}
                        pageName={"manage_transport_vehicle"}
                        layout={Layout}
                        component={TransportVehicle} // component ứng với trang, tạo ở bước 1
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"manage-transport-route"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-transport-route", // url trang
                                name: "manage_transport_route", // tên trang
                                icon: " fa fa-calendar-o ",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-transport-route"}
                        path={"/manage-transport-route"}
                        pageName={"manage_transport_route"}
                        layout={Layout}
                        component={TransportRoute} // component ứng với trang, tạo ở bước 1
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"manage-transport-department"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/manage-transport-department", // url trang
                                name: "manage_transport_department", // tên trang
                                icon: " fa fa-address-card ",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/manage-transport-department"}
                        path={"/manage-transport-department"}
                        pageName={"manage_transport_department"}
                        layout={Layout}
                        component={TransportDepartment} // component ứng với trang, tạo ở bước 1
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"carrier-today-transport-mission"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/carrier-today-transport-mission", // url trang
                                name: "manage_transport_route", // tên trang
                                icon: " fa fa-calendar-o ",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/carrier-today-transport-mission"}
                        path={"/carrier-today-transport-mission"}
                        pageName={"carrier_today_transport_mission"}
                        layout={Layout}
                        component={CarrierTodayTransportMission} // component ứng với trang, tạo ở bước 1
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"carrier-all-times-transport-mission"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/carrier-all-times-transport-mission", // url trang
                                name: "carrier_all_times_transport_mission", // tên trang
                                icon: " fa fa-calendar-o ",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/carrier-all-times-transport-mission"}
                        path={"/carrier-all-times-transport-mission"}
                        pageName={"carrier_all_times_transport_mission"}
                        layout={Layout}
                        component={CarrierAllTimesTransportMission} // component ứng với trang, tạo ở bước 1
                    />


                    {/* Quản lý dự án */}
                    <PrivateRoute
                        isLoading={false}
                        key={"/project/projects-list"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/project/projects-list",
                                name: "projects_list",
                                icon: "fa fa-folder-open",
                            }
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/project/projects-list"}
                        path={"/project/projects-list"}
                        pageName={"projects_list"}
                        layout={Layout}
                        component={Project}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"/project/project-details"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/project/projects-list",
                                name: "projects_list",
                                icon: "fa fa-folder-open",
                            },
                            {
                                link: "/project/project-details",
                                name: "project_details",
                                icon: "fa fa-folder-open",
                            }
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/project/project-details"}
                        path={"/project/project-details"}
                        pageName={"project_details"}
                        layout={Layout}
                        component={ProjectDetailPage}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"/project/tasks-list"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/project/tasks-list",
                                name: "tasks_list",
                                icon: "fa fa-folder-open",
                            }
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/project/tasks-list"}
                        path={"/project/tasks-list"}
                        pageName={"tasks_list"}
                        layout={Layout}
                        component={Project}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"/project/projects-template-list"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/project/projects-list",
                                name: "project_template_list",
                                icon: "fa fa-folder-open",
                            }
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/project/projects-template-list"}
                        path={"/project/projects-template-list"}
                        pageName={"project_template_list"}
                        layout={Layout}
                        component={Project}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"/project/project-template-details"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/project/projects-template-list",
                                name: "projects_template_list",
                                icon: "fa fa-folder-open",
                            },
                            {
                                link: "/project/project-template-details",
                                name: "project_details",
                                icon: "fa fa-folder-open",
                            }
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/project/project-template-details"}
                        path={"/project/project-template-details"}
                        pageName={"project_template_details"}
                        layout={Layout}
                        component={ProjectDetailPage}
                    />
                    {/* <PrivateRoute
                        isLoading={false}
                        key={"/project/phases-list"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/project/phases-list",
                                name: "phases_list",
                                icon: "fa fa-folder-open",
                            }
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/project/phases-list"}
                        path={"/project/phases-list"}
                        pageName={"phases_list"}
                        layout={Layout}
                        component={Phase}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"/project/phase-details"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/project/phases-list",
                                name: "phases_list",
                                icon: "fa fa-folder-open",
                            },
                            {
                                link: "/project/phase-details",
                                name: "phase_details",
                                icon: "fa fa-folder-open",
                            }
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/project/phase-details"}
                        path={"/project/phase-details"}
                        pageName={"phase"}
                        layout={Layout}
                        component={PhaseDetail}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"/project/issues-list"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/project/issues-list",
                                name: "issues_list",
                                icon: "fa fa-folder-open",
                            }
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/project/issues-list"}
                        path={"/project/issues-list"}
                        pageName={"issues_list"}
                        layout={Layout}
                        component={Project}
                    /> */}
                    <PrivateRoute
                        isLoading={false}
                        key={"/project/project-report"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/project/project-report",
                                name: "project_report",
                                icon: "fa fa-folder-open",
                            }
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/project/project-report"}
                        path={"/project/project-report"}
                        pageName={"project_report"}
                        layout={Layout}
                        component={ProjectReport}
                    />
                    <PrivateRoute
                        isLoading={false}
                        key={"/project/project-evaluation"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/project/project-evaluation",
                                name: "project_evaluation",
                                icon: "fa fa-folder-open",
                            }
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/project/project-evaluation"}
                        path={"/project/project-evaluation"}
                        pageName={"project_evaluation"}
                        layout={Layout}
                        component={ProjectStatistic}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={"user-guide"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/user-guide",
                                name: "user_guide",
                                icon: "fa fa-newspaper-o",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/user-guide"}
                        path={"/user-guide"}
                        pageName={"user_guide"}
                        layout={Layout}
                        component={UserGuide}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={"personal-time-sheet-log"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/personal-time-sheet-log",
                                name: "personal_time_sheet_log",
                                icon: "fa fa-newspaper-o",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/personal-time-sheet-log"}
                        path={"/personal-time-sheet-log"}
                        pageName={"personal_time_sheet_log"}
                        layout={Layout}
                        component={PersonalTimeSheetLog}
                    />

                    <PrivateRoute
                        isLoading={false}
                        key={"/time-sheet-log/all"}
                        arrPage={[
                            { link: "/", name: "home", icon: "fa fa-home" },
                            {
                                link: "/time-sheet-log/all",
                                name: "employee_time_sheet_log",
                                icon: "fa fa-newspaper-o",
                            },
                        ]}
                        auth={auth}
                        exact={true}
                        link={"/time-sheet-log/all"}
                        path={"/time-sheet-log/all"}
                        pageName={"employee_time_sheet_log"}
                        layout={Layout}
                        component={EmployeeTimeSheetLog}
                    />



                    {/* NOT FOUND */}
                    <Route component={NotFound}></Route>
                </Switch>
            </Suspense>
        );
    }
}

const mapStateToProps = (state) => {
    return state;
};

export default connect(mapStateToProps, null)(Routes);
