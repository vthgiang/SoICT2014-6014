import { IntlReducer as Intl } from 'react-redux-multilingual'
import { combineReducers } from 'redux';
import { auth } from '../modules/auth/redux/reducers';
import { company } from '../modules/manage-company/redux/reducers';
import { user } from '../modules/manage-user/redux/reducers';
import { role } from '../modules/manage-role/redux/reducers';
import { link } from '../modules/manage-link/redux/reducers';

const rootReducer = combineReducers(Object.assign({
    auth,
    company,
    user,
    role,
    link

}, { Intl }));

export default rootReducer;