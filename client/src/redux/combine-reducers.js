import { IntlReducer as Intl } from 'react-redux-multilingual';
import { clearStorage } from '../config';
import { combineReducers } from 'redux';
import { log } from '../modules/system-admin/log/redux/reducers';
import { auth } from '../modules/auth/redux/reducers';
import { company } from '../modules/system-admin/company/redux/reducers';
import { systemLinks } from '../modules/system-admin/system-link/redux/reducers';
import { user } from '../modules/super-admin/user/redux/reducers';
import { role } from '../modules/super-admin/role/redux/reducers';
import { link } from '../modules/super-admin/link/redux/reducers';
import { component } from '../modules/super-admin/component/redux/reducers';
import { department } from '../modules/super-admin/organizational-unit/redux/reducers';

import {employeesInfo} from '../modules/human-resource/profile/employee-info/redux/reducers';
import {employeesManager} from '../modules/human-resource/profile/employee-management/redux/reducers';
import {education} from '../modules/training/education-program/redux/reducers';
import {course} from '../modules/training/course/redux/reducers';
import {salary} from '../modules/human-resource/salary/redux/reducers';
import {discipline} from '../modules/human-resource/commendation-discipline/redux/reducers';
import {annualLeave} from '../modules/human-resource/annual-leave/redux/reducers';
import {holiday} from '../modules/human-resource/holiday/redux/reducers';
import {timesheets} from '../modules/human-resource/timesheets/redux/reducers';

import {notifications} from '../modules/notification/redux/reducers';
import {documents} from '../modules/document/redux/reducers';

import { createKpiUnit } from "../modules/kpi/organizational-unit/creation/redux/reducers";
import { dashboardOrganizationalUnitKpi } from "../modules/kpi/organizational-unit/dashboard/redux/reducers";
import { managerKpiUnit } from "../modules/kpi/organizational-unit/management/redux/reducers";

import {createEmployeeKpiSet} from "../modules/kpi/employee/creation/redux/reducers"
import {KPIPersonalManager} from "../modules/kpi/employee/management/redux/reducers"
import {dashboardEmployeeKpiSet} from "../modules/kpi/employee/dashboard/redux/reducers"

import {tasktemplates} from '../modules/task/task-template/redux/reducers';
import {kpimembers} from '../modules/kpi/evaluation/employee-evaluation/redux/reducers';

import {dashboardEvaluationEmployeeKpiSet} from '../modules/kpi/evaluation/dashboard/redux/reducers';

import { performtasks } from "../modules/task/task-perform/redux/reducers";
import { tasks } from "../modules/task/task-management/redux/reducers";
import { rootRoles } from "../modules/system-admin/root-role/redux/reducers";
import { systemComponents } from "../modules/system-admin/system-component/redux/reducers";
import { taskProcess } from "../modules/task/task-process/redux/reducers"

//asset
import { recommendProcure } from "../modules/assets-manager/recommend-procure/redux/reducers";
import { recommendDistribute } from "../modules/assets-manager/recommend-distribute/redux/reducers";
import { assetType } from "../modules/assets-manager/asset-type/redux/reducers";
import { assetsManager } from "../modules/assets-manager/asset-management/redux/reducers";


//report 
import {reports} from "../modules/report/task-report/redux/reducers";

//material
import { materials } from "../modules/warehouse-manager/material-manager/redux/reducers";

const appReducer = combineReducers(Object.assign({
    //system
    log,
    company,
    systemLinks,
    rootRoles,
    systemComponents,
    
    //admin
    user,
    role,
    link,
    component,
    department,

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
    holiday,
    timesheets,
    
    // hr-tranning
    education,
    course,

    // kpi-unit
    createKpiUnit,
    dashboardOrganizationalUnitKpi,
    managerKpiUnit,

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

    dashboardEvaluationEmployeeKpiSet,

    //report
    reports,

    //material
    materials,

    
}, { Intl }));

const rootReducer = (state, action) => {
    if (action.type === 'RESET') {
        state = undefined;
        clearStorage();
    }

    return appReducer(state, action);
}

export default rootReducer;