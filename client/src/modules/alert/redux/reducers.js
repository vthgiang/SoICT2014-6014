import { AlertConstants } from "./constants";

const initState = {
    display: false,
    msg: null
}

export function alert(state = initState, action) {

    switch (action.type) {
        case AlertConstants.ACCESS_DENIED:
            return {
                ...state,
                display: true,
                msg: 'access_denied'
            };
        case AlertConstants.USER_ROLE_INVALID:
            return {
                ...state,
                display: true,
                msg: 'user_role_invalid'
            };
        case AlertConstants.ACC_LOGGED_OUT:
            return {
                ...state,
                display: true,
                msg: 'acc_logged_out'
            };
        case AlertConstants.PAGE_ACCESS_DENIED:
            return {
                ...state,
                display: true,
                msg: 'page_access_denied'
            };
        case AlertConstants.ROLE_INVALID:
            return {
                ...state,
                display: true,
                msg: 'role_invalid'
            };

        default:
            return {
                ...state
            };
    }
}