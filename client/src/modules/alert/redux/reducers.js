import { AlertConstants } from "./constants";

const initState = {
    display: false,
    msg: null
}

export function alert(state = initState, action) {
    if(action.type !== undefined){
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
            case AlertConstants.SERVICE_PERMISSION_DENIED:
                return {
                    ...state,
                    msg: 'service_permission_denied'
                };
            
            case AlertConstants.SERVICE_OFF:
                return {
                    ...state,
                    display: true,
                    msg: 'service_off'
                };
    
            case AlertConstants.FINGERPRINT_INVALID:
                return {
                    ...state,
                    display: true,
                    msg: 'fingerprint_invalid'
                };
    
            default:
                return {
                    ...state
                };
        }
    }
}