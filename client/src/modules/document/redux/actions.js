import { DocumentServices } from "./services";
import { DocumentConstants } from "./constants";
const FileDownload = require('js-file-download');

export const DocumentActions = {

    getDocuments,
    createDocument,
    editDocument,
    downloadDocumentFile,
    downloadDocumentFileScan,
    increaseNumberView,

    getDocumentCategories,
    createDocumentCategory,

    getDocumentDomains,
    createDocumentDomain
};

function getDocuments(data=undefined){
    if(data !== undefined){
        return dispatch => {
            dispatch({ type: DocumentConstants.PAGINATE_DOCUMENTS_REQUEST});
            DocumentServices.getDocuments(data)
            .then(res => {
                dispatch({
                    type: DocumentConstants.PAGINATE_DOCUMENTS_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.PAGINATE_DOCUMENTS_FAILE});
                
            })
        }
    }
    return dispatch => {
        dispatch({ type: DocumentConstants.GET_DOCUMENTS_REQUEST});
        DocumentServices.getDocuments()
        .then(res => {
            dispatch({
                type: DocumentConstants.GET_DOCUMENTS_SUCCESS,
                payload: res.data.content
            })
        })
        .catch(err => {
            dispatch({ type: DocumentConstants.GET_DOCUMENTS_FAILE});
            
        })
    }
}

function createDocument(data){
    return dispatch => {
        dispatch({ type: DocumentConstants.CREATE_DOCUMENT_REQUEST});
        DocumentServices.createDocument(data)
            .then(res => {
                dispatch({
                    type: DocumentConstants.CREATE_DOCUMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.CREATE_DOCUMENT_FAILE});
            })
    }
}

function increaseNumberView(id){
    return dispatch => {
        dispatch({ type: DocumentConstants.INCREASE_NUMBER_VIEW_DOCUMENT_REQUEST});
        DocumentServices.increaseNumberView(id)
            .then(res => {
                dispatch({
                    type: DocumentConstants.INCREASE_NUMBER_VIEW_DOCUMENT_SUCCESS,
                    payload: id
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.INCREASE_NUMBER_VIEW_DOCUMENT_FAILE});
            })
    }
}

function editDocument(id, data, option = undefined){
    return dispatch => {
        dispatch({ type: DocumentConstants.EDIT_DOCUMENT_REQUEST});
        switch(option){
            case 'ADD_VERSION':
                DocumentServices.editDocument(id, data, option)
                .then(res => {
                    dispatch({
                        type: DocumentConstants.ADD_VERSION_DOCUMENT_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(err => {
                    dispatch({ type: DocumentConstants.ADD_VERSION_DOCUMENT_FAILE});
                });
                break;

            default:
                DocumentServices.editDocument(id, data)
                .then(res => {
                    dispatch({
                        type: DocumentConstants.EDIT_DOCUMENT_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(err => {
                    dispatch({ type: DocumentConstants.EDIT_DOCUMENT_FAILE});
                });
        }
    }
}

function downloadDocumentFile(id, fileName, numberVersion){
    return dispatch => {
        dispatch({ type: DocumentConstants.DOWNLOAD_DOCUMENT_FILE_REQUEST});
        DocumentServices.downloadDocumentFile(id, numberVersion)
            .then(res => { 
                dispatch({ type: DocumentConstants.DOWNLOAD_DOCUMENT_FILE_SUCCESS });
                const content = res.headers['content-type'];
                FileDownload(res.data, fileName, content)
            })
            .catch(err => { dispatch({ type: DocumentConstants.DOWNLOAD_DOCUMENT_FILE_FAILE})})
    }
}

function downloadDocumentFileScan(id, fileName, numberVersion){
    return dispatch => {
        dispatch({ type: DocumentConstants.DOWNLOAD_DOCUMENT_FILE_SCAN_REQUEST});
        DocumentServices.downloadDocumentFileScan(id, numberVersion)
            .then(res => { 
                dispatch({ type: DocumentConstants.DOWNLOAD_DOCUMENT_FILE_SCAN_SUCCESS });
                const content = res.headers['content-type'];
                FileDownload(res.data, fileName, content)
            })
            .catch(err => { dispatch({ type: DocumentConstants.DOWNLOAD_DOCUMENT_FILE_SCAN_FAILE})})
    }
}

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