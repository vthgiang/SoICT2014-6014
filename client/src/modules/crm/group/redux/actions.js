import { CrmGroupServices } from "./services";
import { CrmGroupConstants } from "./constants";

export const CrmGroupActions = {
    getGroups,
    createGroup,
    deleteGroup,
};

function getGroups(data=undefined){
    if(data !== undefined){
        return dispatch => {
            dispatch({ type: CrmGroupConstants.PAGINATE_CRM_GROUPS_REQUEST});
            CrmGroupServices.getGroups(data)
            .then(res => {
                dispatch({
                    type: CrmGroupConstants.PAGINATE_CRM_GROUPS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err=>{ dispatch({ type: CrmGroupConstants.PAGINATE_CRM_GROUPS_FAILE })})
        }
    }
    return dispatch => {
        dispatch({ type: CrmGroupConstants.GET_CRM_GROUPS_REQUEST});
        CrmGroupServices.getGroups()
        .then(res => {
            dispatch({
                type: CrmGroupConstants.GET_CRM_GROUPS_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err=>{ dispatch({ type: CrmGroupConstants.GET_CRM_GROUPS_FAILE })})
    }
}

function createGroup(data){
    return dispatch => {
        dispatch({ type: CrmGroupConstants.CREATE_CRM_GROUP_REQUEST});
        CrmGroupServices.createGroup(data)
        .then(res => {
            dispatch({
                type: CrmGroupConstants.CREATE_CRM_GROUP_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err=>{ dispatch({ type: CrmGroupConstants.CREATE_CRM_GROUP_FAILE })})
    }
}

function deleteGroup(id){
    return dispatch => {
        dispatch({ type: CrmGroupConstants.DELETE_CRM_GROUP_REQUEST});
        CrmGroupServices.deleteGroup(id)
        .then(res => {
            dispatch({
                type: CrmGroupConstants.DELETE_CRM_GROUP_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err=>{ dispatch({ type: CrmGroupConstants.DELETE_CRM_GROUP_FAILE })})
    }
}