import { AlertConstants } from "./constants";

export const AlertActions = {
    handleAlert,
    reset
}

function handleAlert(dispatch, err){ //bắt và xử lý các lỗi liên quan đến xác thực phân quyền, RBAC
    if(err.response !== undefined && err.response.data !== undefined && err.response.data.msg !== undefined)
        return dispatch({
            type: err.response.data.msg
        });
    else   
        return dispatch({
            type: AlertConstants.AUTH_OK
        });
}

function reset(){
    return {
        type: 'RESET'
    }
}