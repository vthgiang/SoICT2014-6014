import { DocumentServices } from "./services";
import { DocumentConstants } from "./constants";

export const DocumentActions = {
    getDocumentTypes,
    createDocumentType,
};

function getDocumentTypes(){
    return dispatch => {
        dispatch({ type: DocumentConstants.GET_DOCUMENT_TYPES_REQUEST});
        DocumentServices.getDocumentTypes()
        .then(res => {
            dispatch({
                type: DocumentConstants.GET_DOCUMENT_TYPES_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({ type: DocumentConstants.GET_DOCUMENT_TYPES_FAILE});
            
        })
    }
}

function createDocumentType(data){
    return dispatch => {
        dispatch({ type: DocumentConstants.CREATE_DOCUMENT_TYPE_REQUEST});
        DocumentServices.createDocumentType(data)
            .then(res => {
                dispatch({
                    type: DocumentConstants.CREATE_DOCUMENT_TYPE_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.CREATE_DOCUMENT_TYPE_FAILE});
            })
    }
}