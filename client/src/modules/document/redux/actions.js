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
    deleteDocument,

    getDocumentCategories,
    createDocumentCategory,
    editDocumentCategory,
    deleteDocumentCategory,

    getDocumentDomains,
    createDocumentDomain,

    getDocumentsUserCanView,
    getUserDocumentStatistics,
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

function deleteDocument(id){
    return dispatch => {
        dispatch({ type: DocumentConstants.DELETE_DOCUMENT_REQUEST});
        DocumentServices.deleteDocument(id)
            .then(res => {
                dispatch({
                    type: DocumentConstants.DELETE_DOCUMENT_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.DELETE_DOCUMENT_FAILE});
            });
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

function getDocumentCategories(data){
    if(data !== undefined){
        return dispatch => {
            dispatch({ type: DocumentConstants.PAGINATE_DOCUMENT_CATEGORIES_REQUEST});
            DocumentServices.getDocumentCategories(data)
            .then(res => {
                dispatch({
                    type: DocumentConstants.PAGINATE_DOCUMENT_CATEGORIES_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.PAGINATE_DOCUMENT_CATEGORIES_FAILE});
            })
        }
    }
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

function editDocumentCategory(id, data){
    return dispatch => {
        dispatch({ type: DocumentConstants.EDIT_DOCUMENT_CATEGORY_REQUEST});
        DocumentServices.editDocumentCategory(id, data)
            .then(res => {
                dispatch({
                    type: DocumentConstants.EDIT_DOCUMENT_CATEGORY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.EDIT_DOCUMENT_CATEGORY_FAILE});
            })
    }
}

function deleteDocumentCategory(id){
    return dispatch => {
        dispatch({ type: DocumentConstants.DELETE_DOCUMENT_CATEGORY_REQUEST});
        DocumentServices.deleteDocumentCategory(id)
            .then(res => {
                dispatch({
                    type: DocumentConstants.DELETE_DOCUMENT_CATEGORY_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.DELETE_DOCUMENT_CATEGORY_FAILE});
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

function getDocumentsUserCanView(roleId, data=undefined){
    if(data !== undefined){
        return dispatch => {
            dispatch({ type: DocumentConstants.PAGINATE_DOCUMENTS_USER_CAN_VIEW_REQUEST});
            DocumentServices.getDocumentsUserCanView(roleId, data)
                .then(res => {
                    dispatch({
                        type: DocumentConstants.PAGINATE_DOCUMENTS_USER_CAN_VIEW_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(err => {
                    dispatch({ type: DocumentConstants.PAGINATE_DOCUMENTS_USER_CAN_VIEW_FAILE});
                })
        }
    }
    return dispatch => {
        dispatch({ type: DocumentConstants.GET_DOCUMENTS_USER_CAN_VIEW_REQUEST});
        DocumentServices.getDocumentsUserCanView(roleId)
            .then(res => {
                dispatch({
                    type: DocumentConstants.GET_DOCUMENTS_USER_CAN_VIEW_SUCCESS,
                    payload: res.data.content
                })
            })
            .catch(err => {
                dispatch({ type: DocumentConstants.GET_DOCUMENTS_USER_CAN_VIEW_FAILE});
            })
    }
}

function getUserDocumentStatistics(option){
    switch(option){
        case 'downloaded':
            return dispatch => {
                dispatch({ type: DocumentConstants.GET_DOCUMENT_STATISTICS_DOWNLOADED_REQUEST});
                DocumentServices.getUserDocumentStatistics({option})
                .then(res => {
                    dispatch({
                        type: DocumentConstants.GET_DOCUMENT_STATISTICS_DOWNLOADED_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(err => {
                    dispatch({ type: DocumentConstants.GET_DOCUMENT_STATISTICS_DOWNLOADED_FAILE});
                    
                })
            }
        case 'common':
            return dispatch => {
                dispatch({ type: DocumentConstants.GET_DOCUMENT_STATISTICS_COMMON_REQUEST});
                DocumentServices.getUserDocumentStatistics({option})
                .then(res => {
                    dispatch({
                        type: DocumentConstants.GET_DOCUMENT_STATISTICS_COMMON_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(err => {
                    dispatch({ type: DocumentConstants.GET_DOCUMENT_STATISTICS_COMMON_FAILE});
                    
                })
            }
        case 'latest':
            return dispatch => {
                dispatch({ type: DocumentConstants.GET_DOCUMENT_STATISTICS_LATEST_REQUEST});
                DocumentServices.getUserDocumentStatistics({option})
                .then(res => {
                    dispatch({
                        type: DocumentConstants.GET_DOCUMENT_STATISTICS_LATEST_SUCCESS,
                        payload: res.data.content
                    })
                })
                .catch(err => {
                    dispatch({ type: DocumentConstants.GET_DOCUMENT_STATISTICS_LATEST_FAILE});
                    
                })
            }
    }

}