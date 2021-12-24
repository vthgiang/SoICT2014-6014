import { IntlReducer as Intl } from 'react-redux-multilingual';
import { socket } from '../modules/socket/redux/reducers';
import { clearStorage } from '../config';
import { combineReducers } from 'redux';
import { systemSetting } from '../modules/system-admin/system-setting/redux/reducers';
import { auth } from '../modules/auth/redux/reducers';
import { company } from '../modules/system-admin/company/redux/reducers';
import { systemLinks } from '../modules/system-admin/system-link/redux/reducers';
import { systemApis } from '../modules/system-admin/system-api/system-api-management/redux/reducers';
import { privilegeApis } from '../modules/system-admin/system-api/system-api-privilege/redux/reducers'

import { system } from '../modules/super-admin/system/redux/reducers';
import { user } from '../modules/super-admin/user/redux/reducers';
import { role } from '../modules/super-admin/role/redux/reducers';
import { link } from '../modules/super-admin/link/redux/reducers';
import { apis } from '../modules/super-admin/api/api-management/redux/reducers';
import { apiRegistration } from '../modules/super-admin/api/api-registration/redux/reducers'
import { component } from '../modules/super-admin/component/redux/reducers';
import { department } from '../modules/super-admin/organizational-unit/redux/reducers';
import { modelConfiguration } from '../modules/super-admin/module-configuration/redux/reducers';

import { employeesInfo } from '../modules/human-resource/profile/employee-info/redux/reducers';
import { employeesManager } from '../modules/human-resource/profile/employee-management/redux/reducers';
import { education } from '../modules/training/education-program/redux/reducers';
import { course } from '../modules/training/course/redux/reducers';
import { salary } from '../modules/human-resource/salary/redux/reducers';
import { field } from '../modules/human-resource/field/redux/reducers';
import { discipline } from '../modules/human-resource/commendation-discipline/redux/reducers';
import { annualLeave } from '../modules/human-resource/annual-leave/redux/reducers';
import { workPlan } from '../modules/human-resource/work-plan/redux/reducers';
import { timesheets } from '../modules/human-resource/timesheets/redux/reducers';
import { employeeDashboardData } from '../modules/human-resource/employee-dashboard/redux/reducers'

import { notifications } from '../modules/notification/redux/reducers';
import { documents } from '../modules/document/redux/reducers';

import { createKpiUnit } from "../modules/kpi/organizational-unit/creation/redux/reducers";
import { dashboardOrganizationalUnitKpi } from "../modules/kpi/organizational-unit/dashboard/redux/reducers";
import { managerKpiUnit } from "../modules/kpi/organizational-unit/management/redux/reducers";
import { statisticsOfOrganizationalUnitKpi } from "../modules/kpi/statistic/redux/reducers";

import { createEmployeeKpiSet } from "../modules/kpi/employee/creation/redux/reducers"
import { KPIPersonalManager } from "../modules/kpi/employee/management/redux/reducers"
import { dashboardEmployeeKpiSet } from "../modules/kpi/employee/dashboard/redux/reducers"

import { tasktemplates } from '../modules/task/task-template/redux/reducers';
import { kpimembers } from '../modules/kpi/evaluation/employee-evaluation/redux/reducers';

import { dashboardEvaluationEmployeeKpiSet } from '../modules/kpi/evaluation/dashboard/redux/reducers';

import { performtasks } from "../modules/task/task-perform/redux/reducers";
import { tasks } from "../modules/task/task-management/redux/reducers";
import { rootRoles } from "../modules/system-admin/root-role/redux/reducers";
import { systemComponents } from "../modules/system-admin/system-component/redux/reducers";
import { taskProcess } from "../modules/task/task-process/redux/reducers"

//asset
import { recommendProcure } from "../modules/asset/user/purchase-request/redux/reducers";
import { recommendDistribute } from "../modules/asset/user/use-request/redux/reducers";
import { assetType } from "../modules/asset/admin/asset-type/redux/reducers";
import { assetsManager } from "../modules/asset/admin/asset-information/redux/reducers";
import { incidentManager } from "../modules/asset/admin/incident/redux/reducers";
import { mintainanceManager } from "../modules/asset/admin/maintainance/redux/reducers";
//asset lot
import { assetLotManager } from "../modules/asset/admin/asset-lot/redux/reducers";

//supplies 
import { suppliesReducer} from "../modules/supplies/admin/supplies/redux/reducers";
import { purchaseInvoiceReducer} from "../modules/supplies/admin/purchase-invoice/redux/reducers";
import { allocationHistoryReducer} from "../modules/supplies/admin/allocation-history/redux/reducers";
import { purchaseRequest} from "../modules/supplies/admin/purchase-request/redux/reducers";

//report 
import { reports } from "../modules/report/task-report/redux/reducers";

//warehouse
import { stocks } from "../modules/production/warehouse/stock-management/redux/reducers";
import { categories } from "../modules/production/common-production/category-management/redux/reducers";
import { goods } from "../modules/production/common-production/good-management/redux/reducers";
import { binLocations } from "../modules/production/warehouse/bin-location-management/redux/reducers";
import { lots } from "../modules/production/warehouse/inventory-management/redux/reducers";
import { bills } from "../modules/production/warehouse/bill-management/redux/reducers";

//crm
import { customers } from "../modules/crm/customer/redux/reducers";
import { groups } from "../modules/crm/group/redux/reducers";
import { status } from "../modules/crm/status/redux/reducers";
import { cares } from "../modules/crm/care/redux/reducers";
import { careTypes } from "../modules/crm/careType/redux/reducers";
import { evaluations } from "../modules/crm/evaluation/redux/reducers";
import {loyalCustomers} from "../modules/crm/loyalCustomer/redux/reducers"
import {customerRankPoints} from "../modules/crm/customerRankPoint/redux/reducers"
import {crmUnits} from "../modules/crm/crmUnitConfiguration/redux/reducers"
import {crmUnitKPI} from "../modules/crm/crmUnitKPI/redux/reducers"
//order
import { taxs } from "../modules/production/order/tax/redux/reducers";
import { quotes } from '../modules/production/order/quote/redux/reducers';
import { discounts } from "../modules/production/order/discount/redux/reducers";
import { serviceLevelAgreements } from "../modules/production/order/service-level-agreement/redux/reducers";
import { businessDepartments } from "../modules/production/order/business-department/redux/reducers";
import { salesOrders } from "../modules/production/order/sales-order/redux/reducers";
import { bankAccounts } from "../modules/production/order/bank-account/redux/reducers";
import { payments } from "../modules/production/order/payment/redux/reducers";
import { purchaseOrders } from "../modules/production/order/purchase-order/redux/reducers";

//plan
import { plan } from "../modules/plan/redux/reducers";


//example1
import { example1 } from "../modules/example/example1/redux/reducers";

//example2
import { example2 } from "../modules/example/example2/redux/reducers";

//example3
import { example3 } from "../modules/example/example3/redux/reducers";

// Manufacturing
import { manufacturingWorks } from "../modules/production/manufacturing/manufacturing-works/redux/reducers";
import { manufacturingMill } from "../modules/production/manufacturing/manufacturing-mill/redux/reducers";
import { purchasingRequest } from "../modules/production/manufacturing/purchasing-request/redux/reducers";
import { workSchedule } from "../modules/production/manufacturing/work-schedule/redux/reducers";
import { manufacturingPlan } from "../modules/production/manufacturing/manufacturing-plan/redux/reducers";
import { manufacturingCommand } from "../modules/production/manufacturing/manufacturing-command/redux/reducers";

// Transport
import { transportRequirements } from '../modules/production/transport/transport-requirements/redux/reducers'
import { transportPlan } from '../modules/production/transport/transport-plan/redux/reducers';
import { transportVehicle } from '../modules/production/transport/transport-vehicle/redux/reducers';
import { transportSchedule } from '../modules/production/transport/transport-schedule/redux/reducers';
import { transportDepartment } from '../modules/production/transport/transport-department/redux/reducers';

// Project
import { project } from "../modules/project/projects/redux/reducers";
import { changeRequest } from "../modules/project/change-requests/redux/reducers";
import { projectStatistic } from "../modules/project/statistic/redux/reducers";
import { schedulingProjects } from "../modules/project/scheduling-projects/redux/reducers";


import { newsFeeds } from "../modules/home/redux/reducers";

const appReducer = combineReducers({
    socket,
    //system
    systemSetting,
    company,
    systemLinks,
    systemApis,
    rootRoles,
    systemComponents,
    privilegeApis,

    //admin
    system,
    user,
    role,
    link,
    apis,
    apiRegistration,
    component,
    department,
    modelConfiguration,

    //---------------------------
    documents,
    notifications,
    auth,

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

    // hr-tranning
    education,
    course,

    // kpi-unit
    createKpiUnit,
    dashboardOrganizationalUnitKpi,
    managerKpiUnit,
    statisticsOfOrganizationalUnitKpi,

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

    // customer management
    crm: combineReducers({
        customers, groups, status, cares, careTypes,evaluations,loyalCustomers,customerRankPoints,crmUnits,crmUnitKPI
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
    project,
    projectStatistic,
    changeRequest,
    schedulingProjects,

    Intl,

    newsFeeds
});

const rootReducer = (state, action) => {
    if (action.type === 'RESET') {
        state = undefined;
        clearStorage();
    } else if (action.type === 'SWITCH_PAGE') {
        state = {
            auth: state.auth,
            socket: state.socket
        }
    }

    return appReducer(state, action);
}

export default rootReducer;
