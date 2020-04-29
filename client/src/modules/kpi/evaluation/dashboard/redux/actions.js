import { kpiMemberConstants } from "./constants";
import { kpiMemberServices } from "./services";
export const kpiMemberActions = {
    getAllKPIMemberOfUnit,
    getAllKPIMemberByMember,
};

// Lấy tất cả KPI cá nhân
function getAllKPIMemberOfUnit(infosearch) {
    return dispatch => {
        dispatch({type: kpiMemberConstants.GETALL_KPIMEMBER_OfUNIT_REQUEST});
        kpiMemberServices.getAllKPIMemberOfUnit(infosearch)
            .then(res=>{
                dispatch({
                    type: kpiMemberConstants.GETALL_KPIMEMBER_OfUNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error=>{
                dispatch({
                    type: kpiMemberConstants.GETALL_KPIMEMBER_OfUNIT_FAILURE,
                    payload: error
                })
            })
    };
}
// Lấy tất cả KPI cá nhân
function getAllKPIMemberByMember() { //member
    return dispatch => {
        dispatch({type: kpiMemberConstants.GETALL_KPIMEMBER_REQUEST});
        kpiMemberServices.getAllKPIMemberByMember()
            .then(res=>{
                dispatch({
                    type: kpiMemberConstants.GETALL_KPIMEMBER_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(error =>{
                dispatch({
                    type: kpiMemberConstants.GETALL_KPIMEMBER_FAILURE,
                    payload: error
                })
            })
    };

}



