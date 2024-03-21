import { IntlReducer as Intl } from 'react-redux-multilingual';
import { combineReducers } from 'redux';
import { clearStorage } from '../config';
import { auth } from '../modules/auth/redux/reducers';
import { socket } from '../modules/socket/redux/reducers';
import { company } from '../modules/system-admin/company/redux/reducers';

import { systemApis } from '../modules/system-admin/system-api/system-api-management/redux/reducers';
import { privilegeApis } from '../modules/system-admin/system-api/system-api-privilege/redux/reducers';
import { systemLinks } from '../modules/system-admin/system-link/redux/reducers';
import { systemAdminPage, systemPage } from '../modules/system-admin/system-page/redux/reducers';
import { systemSetting } from '../modules/system-admin/system-setting/redux/reducers';

import { apis } from '../modules/super-admin/api/api-management/redux/reducers';
import { apiRegistration } from '../modules/super-admin/api/api-registration/redux/reducers';
import { component } from '../modules/super-admin/component/redux/reducers';
import { link } from '../modules/super-admin/link/redux/reducers';
import { modelConfiguration } from '../modules/super-admin/module-configuration/redux/reducers';
import { department } from '../modules/super-admin/organizational-unit/redux/reducers';
import { role } from '../modules/super-admin/role/redux/reducers';
import { system } from '../modules/super-admin/system/redux/reducers';
import { user } from '../modules/super-admin/user/redux/reducers';
import { attribute } from '../modules/super-admin/attribute/redux/reducers';
import { policy } from '../modules/super-admin/policy/redux/reducers';
import { policyDelegation } from '../modules/super-admin/policy-delegation/redux/reducers';

import { annualLeave } from '../modules/human-resource/annual-leave/redux/reducers';
import { discipline } from '../modules/human-resource/commendation-discipline/redux/reducers';
import { employeeDashboardData } from '../modules/human-resource/employee-dashboard/redux/reducers';
import { field } from '../modules/human-resource/field/redux/reducers';
import { employeesInfo } from '../modules/human-resource/profile/employee-info/redux/reducers';
import { employeesManager } from '../modules/human-resource/profile/employee-management/redux/reducers';
import { salary } from '../modules/human-resource/salary/redux/reducers';
import { timesheets } from '../modules/human-resource/timesheets/redux/reducers';

import { biddingContract } from '../modules/bidding/bidding-contract/redux/reducers';
import { biddingPackagesManager } from '../modules/bidding/bidding-package/biddingPackageManagement/redux/reducers';
import { biddingPackageInfo } from '../modules/bidding/bidding-package/redux/reducers';
import { tag } from '../modules/bidding/tags/redux/reducers';
import { career } from '../modules/human-resource/career/redux/reducers';
import { certificate } from '../modules/human-resource/certificate/redux/reducers';
import { major } from '../modules/human-resource/major/redux/reducers';

import { workPlan } from '../modules/human-resource/work-plan/redux/reducers';
import { course } from '../modules/training/course/redux/reducers';
import { education } from '../modules/training/education-program/redux/reducers';

import { documents } from '../modules/document/redux/reducers';
import { notifications } from '../modules/notification/redux/reducers';

// dashboard-unit
import { dashboardUnit } from '../modules/dashboard-unit/redux/reducers';

import { createKpiUnit } from '../modules/kpi/organizational-unit/creation/redux/reducers';
import { dashboardOrganizationalUnitKpi } from '../modules/kpi/organizational-unit/dashboard/redux/reducers';
import { managerKpiUnit } from '../modules/kpi/organizational-unit/management/redux/reducers';
import { kpitemplates } from '../modules/kpi/organizational-unit/template/redux/reducers';
import { statisticsOfOrganizationalUnitKpi } from '../modules/kpi/statistic/redux/reducers';

import { createEmployeeKpiSet } from '../modules/kpi/employee/creation/redux/reducers';
import { dashboardEmployeeKpiSet } from '../modules/kpi/employee/dashboard/redux/reducers';
import { KPIPersonalManager } from '../modules/kpi/employee/management/redux/reducers';

import { kpimembers } from '../modules/kpi/evaluation/employee-evaluation/redux/reducers';
import { tasktemplates } from '../modules/task/task-template/redux/reducers';

import { dashboardEvaluationEmployeeKpiSet } from '../modules/kpi/evaluation/dashboard/redux/reducers';

import { rootRoles } from '../modules/system-admin/root-role/redux/reducers';
import { systemComponents } from '../modules/system-admin/system-component/redux/reducers';
import { tasks } from '../modules/task/task-management/redux/reducers';
import { performtasks } from '../modules/task/task-perform/redux/reducers';
import { taskProcess } from '../modules/task/task-process/redux/reducers';

//asset
import { assetsManager } from '../modules/asset/admin/asset-information/redux/reducers';
import { assetType } from '../modules/asset/admin/asset-type/redux/reducers';
import { incidentManager } from '../modules/asset/admin/incident/redux/reducers';
import { mintainanceManager } from '../modules/asset/admin/maintainance/redux/reducers';
import { recommendProcure } from '../modules/asset/user/purchase-request/redux/reducers';
import { recommendDistribute } from '../modules/asset/user/use-request/redux/reducers';
//asset lot
import { assetLotManager } from '../modules/asset/admin/asset-lot/redux/reducers';

//supplies
import { suppliesReducer } from '../modules/supplies/admin/supplies/redux/reducers';
import { suppliesDashboardReducer } from '../modules/supplies/admin/supplies-dashboard/redux/reducers';
import { purchaseInvoiceReducer } from '../modules/supplies/admin/purchase-invoice/redux/reducers';
import { allocationHistoryReducer } from '../modules/supplies/admin/allocation-history/redux/reducers';
import { purchaseRequest } from '../modules/supplies/admin/purchase-request/redux/reducers';

//report
import { reports } from '../modules/report/task-report/redux/reducers';

//warehouse
import { categories } from '../modules/production/common-production/category-management/redux/reducers';
import { goods } from '../modules/production/common-production/good-management/redux/reducers';
import { requestManagements } from '../modules/production/common-production/request-management/redux/reducers';
import { bills } from '../modules/production/warehouse/bill-management/redux/reducers';
import { binLocations } from '../modules/production/warehouse/bin-location-management/redux/reducers';
import { lots } from '../modules/production/warehouse/inventory-management/redux/reducers';
import { stocks } from '../modules/production/warehouse/stock-management/redux/reducers';

//crm
import { cares } from '../modules/crm/care/redux/reducers';
import { careTypes } from '../modules/crm/careType/redux/reducers';
import { crmUnits } from '../modules/crm/crmUnitConfiguration/redux/reducers';
import { crmUnitKPI } from '../modules/crm/crmUnitKPI/redux/reducers';
import { customers } from '../modules/crm/customer/redux/reducers';
import { customerRankPoints } from '../modules/crm/customerRankPoint/redux/reducers';
import { evaluations } from '../modules/crm/evaluation/redux/reducers';
import { groups } from '../modules/crm/group/redux/reducers';
import { loyalCustomers } from '../modules/crm/loyalCustomer/redux/reducers';
import { status } from '../modules/crm/status/redux/reducers';
//order
import { bankAccounts } from '../modules/production/order/bank-account/redux/reducers';
import { businessDepartments } from '../modules/production/order/business-department/redux/reducers';
import { discounts } from '../modules/production/order/discount/redux/reducers';
import { payments } from '../modules/production/order/payment/redux/reducers';
import { purchaseOrders } from '../modules/production/order/purchase-order/redux/reducers';
import { quotes } from '../modules/production/order/quote/redux/reducers';
import { salesOrders } from '../modules/production/order/sales-order/redux/reducers';
import { serviceLevelAgreements } from '../modules/production/order/service-level-agreement/redux/reducers';
import { taxs } from '../modules/production/order/tax/redux/reducers';

//plan
import { plan } from '../modules/plan/redux/reducers';

//example1
import { example1 } from '../modules/example/example1/redux/reducers';

//example2
import { example2 } from '../modules/example/example2/redux/reducers';

//example3
import { example3 } from '../modules/example/example3/redux/reducers';

// Manufacturing
import { manufacturingCommand } from '../modules/production/manufacturing/manufacturing-command/redux/reducers';
import { manufacturingMill } from '../modules/production/manufacturing/manufacturing-mill/redux/reducers';
import { manufacturingPlan } from '../modules/production/manufacturing/manufacturing-plan/redux/reducers';
import { manufacturingWorks } from '../modules/production/manufacturing/manufacturing-works/redux/reducers';
import { purchasingRequest } from '../modules/production/manufacturing/purchasing-request/redux/reducers';
import { workSchedule } from '../modules/production/manufacturing/work-schedule/redux/reducers';

// Transport
import { transportDepartment } from '../modules/production/transport/transport-department/redux/reducers';
import { transportPlan } from '../modules/production/transport/transport-plan/redux/reducers';
import { transportRequirements } from '../modules/production/transport/transport-requirements/redux/reducers';
import { transportSchedule } from '../modules/production/transport/transport-schedule/redux/reducers';
import { transportVehicle } from '../modules/production/transport/transport-vehicle/redux/reducers';

// Project
import { projectTemplate } from '../modules/bidding/project-template/redux/reducers';
import { changeRequest } from '../modules/project/change-requests/redux/reducers';
import { project } from '../modules/project/projects/redux/reducers';
import { schedulingProjects } from '../modules/project/scheduling-projects/redux/reducers';
import { projectPhase } from '../modules/project/project-phase/redux/reducers';
import { projectStatistic } from '../modules/project/statistic/redux/reducers';

// Delegation
import { delegation } from '../modules/delegation/delegation-list/redux/reducers';
import { delegationReceive } from '../modules/delegation/delegation-receive/redux/reducers';

import { newsFeeds } from '../modules/home/redux/reducers';

const appReducer = combineReducers({
    socket,
    //system
    systemSetting,
    company,
    systemLinks,
    systemPage,
    systemAdminPage,
    systemApis,
    rootRoles,
    systemComponents,
    privilegeApis,

    //admin
    system,
    user,
    role,
    link,
    attribute,
    policy,
    policyDelegation,
    apis,
    apiRegistration,
    component,
    department,
    modelConfiguration,

    //---------------------------
    documents,
    notifications,
    auth,

    // dashboard-unit
    dashboardUnit,

    // hr-employee
    employeesInfo,
    employeesManager,
    salary,
    discipline,
    annualLeave,
    workPlan,
    timesheets,
    field,
    employeeDashboardData,

    // gói thầu
    career,
    major,
    biddingContract,
    tag,
    certificate,
    biddingPackageInfo,
    biddingPackagesManager,

    // hr-tranning
    education,
    course,

    // kpi-unit
    createKpiUnit,
    dashboardOrganizationalUnitKpi,
    managerKpiUnit,
    statisticsOfOrganizationalUnitKpi,
    kpitemplates,

    //kpi-personal
    createEmployeeKpiSet,
    KPIPersonalManager,
    dashboardEmployeeKpiSet,

    //tasktemplates
    tasktemplates,

    //task-managemnet
    tasks,
    performtasks,
    taskProcess,

    // kpi members
    kpimembers,

    // asset
    recommendProcure,
    recommendDistribute,
    assetType,
    assetsManager,
    incidentManager,
    mintainanceManager,
    //asset lot
    assetLotManager,

    //supplies
    suppliesReducer,
    suppliesDashboardReducer,
    purchaseInvoiceReducer,
    allocationHistoryReducer,
    purchaseRequest,

    dashboardEvaluationEmployeeKpiSet,

    //report
    reports,

    //warehouse
    stocks,
    categories,
    goods,
    binLocations,
    lots,
    bills,
    requestManagements,

    // customer management
    crm: combineReducers({
        customers,
        groups,
        status,
        cares,
        careTypes,
        evaluations,
        loyalCustomers,
        customerRankPoints,
        crmUnits,
        crmUnitKPI,
    }),

    //order
    taxs,
    quotes,
    discounts,
    serviceLevelAgreements,
    businessDepartments,
    salesOrders,
    bankAccounts,
    payments,
    purchaseOrders,

    //plane
    plan,

    // delegation
    delegation,
    delegationReceive,

    //example1
    example1,

    //example2
    example2,

    //example3
    example3,

    // production - manufacturing works management

    manufacturingWorks,
    manufacturingMill,
    purchasingRequest,
    workSchedule,
    manufacturingPlan,
    manufacturingCommand,

    // production - transport

    transportRequirements,
    transportPlan,
    transportSchedule,
    transportVehicle,
    transportDepartment,

    // project
    projectTemplate,
    project,
    projectStatistic,
    changeRequest,
    schedulingProjects,
    projectPhase,

    Intl,

    newsFeeds,
});

const rootReducer = (state, action) => {
    if (action.type === 'RESET') {
        state = undefined;
        clearStorage();
    } else if (action.type === 'SWITCH_PAGE') {
        state = {
            auth: state.auth,
            socket: state.socket,
            Intl: { locale: localStorage.getItem('lang') },
        };
    }

    return appReducer(state, action);
};

export default rootReducer;
