import { DocumentServices } from "./services";
import { DocumentConstants } from "./constants";

export const DocumentActions = {
    getDocumentCategories,
    createDocumentCategory,
};

function getDocumentCategories(){
    return dispatch => {
        dispatch({ type: DocumentConstants.GET_DOCUMENT_CATEGORIES_REQUEST});
        DocumentServices.getDocumentCategories()
        .then(res => {
            dispatch({
                type: DocumentConstants.GET_DOCUMENT_CATEGORIES_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({ type: DocumentConstants.GET_DOCUMENT_CATEGORIES_FAILE});
            
        })
    }
}

function createDocumentCategory(data){
    return dispatch => {
        dispatch({ type: DocumentConstants.CREATE_DOCUMENT_CATEGORY_REQUEST});
        DocumentServices.createDocumentCategory(data)
            .then(res => {
                dispatch({
                    type: DocumentConstants.CREATE_DOCUMENT_CATEGORY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.CREATE_DOCUMENT_CATEGORY_FAILE});
            })
    }
}