import { IntlReducer as Intl } from 'react-redux-multilingual';
import { combineReducers } from 'redux';
import { alert } from '../modules/alert/redux/reducers';
import { system } from '../modules/system/redux/reducers';
import { auth } from '../modules/auth/redux/reducers';
import { company } from '../modules/system-admin-management/manage-company/redux/reducers';
import { user } from '../modules/super-admin-management/manage-user/redux/reducers';
import { role } from '../modules/super-admin-management/manage-role/redux/reducers';
import { link } from '../modules/system-admin-management/manage-link/redux/reducers';
import { component } from '../modules/system-admin-management/manage-component/redux/reducers';
import { department } from '../modules/super-admin-management/manage-department/redux/reducers';
import {employeesInfo} from '../modules/employees-manager/employee-info/redux/reducers';
import {employeesManager} from '../modules/employees-manager/employee-manager/redux/reducers';
import {course} from '../modules/training-course/list-course/redux/reducers';
import {salary} from '../modules/employees-manager/salary-employee/redux/reducers';
import {discipline} from '../modules/employees-manager/discipline/redux/reducers';
import {sabbatical} from '../modules/employees-manager/sabbatical/redux/reducers';
import {holiday} from '../modules/employees-manager/holiday/redux/reducers';
import {notification} from '../modules/notifications/redux/reducers';


import { createKpiUnit } from "../modules/kpi-unit/kpi-unit-create/redux/reducers";
import { overviewKpiUnit } from "../modules/kpi-unit/kpi-unit-overview/redux/reducers";

import {createKpiPersonal} from "./../modules/kpi-personal/kpi-personal-create/redux/reducers"
import {overviewKpiPersonal} from "./../modules/kpi-personal/kpi-personal-overview/redux/reducers"

const appReducer = combineReducers(Object.assign({
    alert,
    system,
    auth,
    company,
    user,
    role,
    link,
    component,
    department,
    employeesInfo,
    employeesManager,
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

    notification

}, { Intl }));

const rootReducer = (state, action) => {
    if (action.type === 'RESET_ALERT') {
        state = undefined;
    }

    return appReducer(state, action);
}

export default rootReducer;