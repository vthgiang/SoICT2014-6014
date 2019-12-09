import { AuthConstants } from "./constants";
import {reactLocalStorage} from 'reactjs-localstorage';

const token = localStorage.getItem('token');
const _id = localStorage.getItem('_id');
const name = localStorage.getItem('name');
const email = localStorage.getItem('email');
const roles = reactLocalStorage.getObject('roles');
const company = reactLocalStorage.getObject('company');

const initAuth = {
    logged: token ? true : false,
    user: {
        _id: _id ? _id : null,
        name: name ? name : null,
        email: email ? email : null,
        roles: roles ? roles : null,
        company: company ? company : null,
    },
    error: null
}

export function auth(state = initAuth, action) {

    switch (action.type) {
        case AuthConstants.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
                logged: true,
                error: null
            };

        case AuthConstants.LOGIN_FAILE:
            return {
                ...state,
                user: {
                    _id: null,
                    name: null,
                    email: null,
                    roles: null,
                    company: null
                },
                logged: false,
                error: action.payload.msg
            };

        case AuthConstants.LOGOUT:
            return {
                ...state,
                logged: false,
                user: {
                    _id: null,
                    name: null,
                    email: null,
                    roles: null,
                    company: null
                },
                error: null
            };

        default:
            return state;
    }
}