import { managerKPIConstants } from "./constants";
import { managerKPIPerService } from "./services";
export const managerKpiActions = {
    getAllKPIPersonalByMember,
    getAllKPIPersonalOfResponsible,
    getAllKPIPersonalByUserID
};

// Lấy tất cả KPI cá nhân
function getAllKPIPersonalByMember() {
    return dispatch => {
        dispatch({type: managerKPIConstants.GETALL_KPIPERSONAL_REQUEST});//member

        managerKPIPerService.getAllKPIPersonalByMember()
            .then(res =>{
                dispatch({
                    type: managerKPIConstants.GETALL_KPIPERSONAL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error =>{
                dispatch({
                    type:  managerKPIConstants.GETALL_KPIPERSONAL_FAILURE,
                    payload:error,
                })
            })
    }
}

// Lấy tất cả KPI cá nhân
function getAllKPIPersonalByUserID(member) {
    return dispatch => {
        dispatch({type: managerKPIConstants.GETALL_KPIPERSONAL_REQUEST});

        managerKPIPerService.getAllKPIPersonalByUserID(member)
            .then(res =>{
                dispatch({
                    type: managerKPIConstants.GETALL_KPIPERSONAL_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error =>{
                dispatch({
                    type: managerKPIConstants.GETALL_KPIPERSONAL_FAILURE,
                    payload: error
                })
            })
    };

}

// Lấy tất cả KPI cá nhân
function getAllKPIPersonalOfResponsible(member) {
    return dispatch => {
        dispatch({ type: managerKPIConstants.GETALL_KPIPERSONAL_OFTASK_REQUEST});

        managerKPIPerService.getAllKPIPersonalOfTask(member)
            .then(res=>{
                dispatch({
                    type: managerKPIConstants.GETALL_KPIPERSONAL_OFTASK_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error =>{
                dispatch({
                    type: managerKPIConstants.GETALL_KPIPERSONAL_OFTASK_FAILURE,
                    payload: error
                })
            })
    };

}
