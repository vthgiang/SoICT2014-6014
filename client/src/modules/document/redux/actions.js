import { DocumentServices } from "./services";
import { DocumentConstants } from "./constants";

export const DocumentActions = {
    getDocumentCategories,
    createDocumentCategory,

    getDocumentDomains,
    createDocumentDomain
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

function getDocumentDomains(){
    return dispatch => {
        dispatch({ type: DocumentConstants.GET_DOCUMENT_DOMAINS_REQUEST});
        DocumentServices.getDocumentDomains()
        .then(res => {
            dispatch({
                type: DocumentConstants.GET_DOCUMENT_DOMAINS_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({ type: DocumentConstants.GET_DOCUMENT_DOMAINS_FAILE});
            
        })
    }
}

function createDocumentDomain(data){
    return dispatch => {
        dispatch({ type: DocumentConstants.CREATE_DOCUMENT_DOMAIN_REQUEST});
        DocumentServices.createDocumentDomain(data)
            .then(res => {
                dispatch({
                    type: DocumentConstants.CREATE_DOCUMENT_DOMAIN_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.CREATE_DOCUMENT_DOMAIN_FAILE});
            })
    }
}