import { IntlReducer as Intl } from 'react-redux-multilingual'
import { combineReducers } from 'redux';
import { auth } from '../modules/auth/redux/reducers';
import { company } from '../modules/system-admin-management/manage-company/redux/reducers';
import { user } from '../modules/super-admin-management/manage-user/redux/reducers';
import { role } from '../modules/super-admin-management/manage-role/redux/reducers';
import { link } from '../modules/system-admin-management/manage-link/redux/reducers';
import { component } from '../modules/system-admin-management/manage-component/redux/reducers';
import { department } from '../modules/super-admin-management/manage-department/redux/reducers';
import {employeesInfo} from '../modules/employees-manager/employee-info/redux/reducers';
import {employeesManager} from '../modules/employees-manager/employee-manager/redux/reducers';
import {Course} from '../modules/training-course/list-course/redux/reducers';
import {Salary} from '../modules/employees-manager/salary-employee/redux/reducers';
import {Discipline} from '../modules/employees-manager/discipline/redux/reducers';
import {Sabbatical} from '../modules/employees-manager/sabbatical/redux/reducers';

const rootReducer = combineReducers(Object.assign({
    auth,
    company,
    user,
    role,
    link,
    component,
    department,
    employeesInfo,
    employeesManager,
    Course,
    Salary,
    Discipline,
    Sabbatical

}, { Intl }));

export default rootReducer;