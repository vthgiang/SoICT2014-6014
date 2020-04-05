import { IntlReducer as Intl } from 'react-redux-multilingual';
import { clearStorage } from '../config';
import { combineReducers } from 'redux';
import { alert } from '../modules/alert/redux/reducers';
import { log } from '../modules/system-admin-management/logs-management/redux/reducers';
import { auth } from '../modules/auth/redux/reducers';
import { company } from '../modules/system-admin-management/companies-management/redux/reducers';
import { linksDefault } from '../modules/system-admin-management/links-default-management/redux/reducers';
import { user } from '../modules/super-admin-management/users-management/redux/reducers';
import { role } from '../modules/super-admin-management/roles-management/redux/reducers';
import { link } from '../modules/super-admin-management/links-management/redux/reducers';
import { component } from '../modules/super-admin-management/components-management/redux/reducers';
import { department } from '../modules/super-admin-management/departments-management/redux/reducers';
import {employeesInfo} from '../modules/employees-manager/employee-info/redux/reducers';
import {employeesManager} from '../modules/employees-manager/employee-manager/redux/reducers';
import {education} from '../modules/training-course/list-education/redux/reducers';
import {course} from '../modules/training-course/training-plan/redux/reducers';
import {salary} from '../modules/employees-manager/salary-employee/redux/reducers';
import {discipline} from '../modules/employees-manager/discipline/redux/reducers';
import {sabbatical} from '../modules/employees-manager/sabbatical/redux/reducers';
import {holiday} from '../modules/employees-manager/holiday/redux/reducers';
import {notifications} from '../modules/notifications/redux/reducers';


import { createKpiUnit } from "../modules/kpi-unit/kpi-unit-create/redux/reducers";
import { overviewKpiUnit } from "../modules/kpi-unit/kpi-unit-overview/redux/reducers";

import {createKpiPersonal} from "./../modules/kpi-personal/kpi-personal-create/redux/reducers"
import {overviewKpiPersonal} from "./../modules/kpi-personal/kpi-personal-overview/redux/reducers"

import {tasktemplates} from '../modules/task-template-management/redux/reducers';
import {kpimembers} from '../modules/kpi-member/redux/reducers';

import { performtasks } from "./../modules/task-management/perform-task/redux/reducers";
import { tasks } from "./../modules/task-management/task-management/redux/reducers";
import { rolesDefault } from "./../modules/system-admin-management/roles-default-management/redux/reducers";
import { componentsDefault } from "../modules/system-admin-management/components-default-management/redux/reducers";

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
    overviewKpiUnit,

    //kpi-personal
    createKpiPersonal,
    overviewKpiPersonal,

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
        clearStorage();
        state = undefined;
    }

    return appReducer(state, action);
}

export default rootReducer;