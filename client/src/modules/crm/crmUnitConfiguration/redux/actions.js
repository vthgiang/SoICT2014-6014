import { CrmUnitServices } from "./services";
import { CrmUnitConstants } from "./constants";

export const CrmUnitActions = {
    getCrmUnits,
    createCrmUnit,
    deleteCrmUnit,
};

function getCrmUnits(data) {
    return dispatch => {
        dispatch({ type: CrmUnitConstants.GET_CRM_UNIT_REQUEST });
        CrmUnitServices.getCrmUnits(data)
            .then(res => {
                dispatch({
                  
                    type: CrmUnitConstants.GET_CRM_UNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmUnitConstants.GET_CRM_UNIT_FAILE}) })
    }
}



function createCrmUnit(data) {
    return dispatch => {
        dispatch({ type: CrmUnitConstants.CREATE_CRM_UNIT_REQUEST });
        CrmUnitServices.createCrmUnit(data)
            .then(res => {
                dispatch({
                    type: CrmUnitConstants.CREATE_CRM_UNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmUnitConstants.CREATE_CRM_UNIT_FAILE }) })
    }
}


function deleteCrmUnit(id) {
    return dispatch => {
        dispatch({ type: CrmUnitConstants.DELETE_CRM_UNIT_REQUEST });
        CrmUnitServices.deleteCrmUnit(id)
            .then(res => {
                dispatch({
                    type: CrmUnitConstants.DELETE_CRM_UNIT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => { dispatch({ type: CrmUnitConstants.DELETE_CRM_UNIT_FAILE }) })
    }
}