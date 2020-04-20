import { IntlReducer as Intl } from 'react-redux-multilingual';
import { clearStorage } from '../config';
import { combineReducers } from 'redux';
import { alert } from '../modules/alert/redux/reducers';
import { log } from '../modules/system-admin-management/log/redux/reducers';
import { auth } from '../modules/auth/redux/reducers';
import { company } from '../modules/system-admin-management/company/redux/reducers';
import { linksDefault } from '../modules/system-admin-management/providing-link/redux/reducers';
import { user } from '../modules/super-admin-management/user/redux/reducers';
import { role } from '../modules/super-admin-management/role/redux/reducers';
import { link } from '../modules/super-admin-management/link/redux/reducers';
import { component } from '../modules/super-admin-management/component/redux/reducers';
import { department } from '../modules/super-admin-management/organizational-unit/redux/reducers';
import {employeesInfo} from '../modules/human-resource/profile/employee-info/redux/reducers';
import {employeesManager} from '../modules/human-resource/profile/employee-management/redux/reducers';
import {education} from '../modules/training/education-program/redux/reducers';
import {course} from '../modules/training/course/redux/reducers';
import {salary} from '../modules/human-resource/salary/redux/reducers';
import {discipline} from '../modules/human-resource/commendation-discipline/redux/reducers';
import {sabbatical} from '../modules/human-resource/annual-leave/redux/reducers';
import {holiday} from '../modules/human-resource/holiday/redux/reducers';
import {notifications} from '../modules/notification/redux/reducers';


import { createKpiUnit } from "../modules/kpi/organizational-unit/creation/redux/reducers";
import { dashboardKpiUnit } from "../modules/kpi/organizational-unit/dashboard/redux/reducers";
import { managerKpiUnit } from "../modules/kpi/organizational-unit/management/redux/reducers";

import {createKpiPersonal} from "../modules/kpi/kpi-personal/kpi-personal-create/redux/reducers"
import {KPIPersonalManager} from "../modules/kpi/kpi-personal/kpi-personal-manager/redux/reducers"
import {dashboardKPIPersonal} from "../modules/kpi/kpi-personal/kpi-personal-dashboard/redux/reducers"

import {tasktemplates} from '../modules/task-template-man/redux/reducers';
import {kpimembers} from '../modules/kpi/evaluation/employee-evaluation/redux/reducers';

import { performtasks } from "../modules/task/task-perform/redux/reducers";
import { tasks } from "../modules/task/task-management/redux/reducers";
import { rolesDefault } from "../modules/system-admin-management/root-role/redux/reducers";
import { componentsDefault } from "../modules/system-admin-management/providing-component/redux/reducers";

const appReducer = combineReducers(Object.assign({
    alert,

    //system
    log,
    company,
    linksDefault,
    rolesDefault,
    componentsDefault,
    //admin
    user,
    role,
    link,
    component,
    department,

    //---------------------------
    notifications,
    auth,
    employeesInfo,
    employeesManager,
    education,
    course,
    salary,
    discipline,
    sabbatical,
    holiday,

    // kpi-unit
    createKpiUnit,
    dashboardKpiUnit,
    managerKpiUnit,

    //kpi-personal
    createKpiPersonal,
    KPIPersonalManager,
    dashboardKPIPersonal,

    //tasktemplates
    tasktemplates,

    //task-managemnet
    tasks,
    performtasks,
    // kpi members
    kpimembers
}, { Intl }));

const rootReducer = (state, action) => {
    if (action.type === 'RESET') {
        state = undefined;
        clearStorage();
    }

    return appReducer(state, action);
}

export default rootReducer;