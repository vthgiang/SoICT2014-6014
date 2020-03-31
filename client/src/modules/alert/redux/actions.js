import { AlertConstants } from "./constants";

export const AlertActions = {
    handleAlert,
    reset
}

function handleAlert(dispatch, err){ //bắt và xử lý các lỗi liên quan đến xác thực phân quyền, RBAC
    if(err.response !== undefined && err.response.data !== undefined && err.response.data.message !== undefined)
        switch(err.response.data.message){
            case 'access_denied':
                return dispatch({ type: AlertConstants.ACCESS_DENIED });

            case 'user_role_invalid':
                return dispatch({ type: AlertConstants.USER_ROLE_INVALID });

            case 'acc_log_out':
                return dispatch({ type: AlertConstants.ACC_LOGGED_OUT });

            case 'page_access_denied':
                return dispatch({ type: AlertConstants.PAGE_ACCESS_DENIED });
                
            case 'role_invalid':
                return dispatch({ type: AlertConstants.ROLE_INVALID });

            case 'fingerprint_invalid':
                return dispatch({ type: AlertConstants.FINGERPRINT_INVALID });

            case 'service_off':
                return dispatch({ type: AlertConstants.SERVICE_OFF });
        
            case 'service_permission_denied':
                return dispatch({ type: AlertConstants.SERVICE_PERMISSION_DENIED });
        }
}

function reset(){
    return dispatch => {
        dispatch({type: 'RESET'});
    }
}