import { LOCAL_SERVER_API } from '../../../env';
import { sendRequest } from '../../../helpers/requestHelper';

export const DocumentServices = {
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
    editDocumentDomain,
    deleteDocumentDomain,
    deleteManyDocumentDomain,

    getDocumentsUserCanView,
    getUserDocumentStatistics,
};

function getDocuments(params) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents`,
        method: 'GET',
        params,
    }, false, true, 'document');
}

function createDocument(data) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents`,
        method: 'POST',
        data,
    }, true, true, 'document');
}

function deleteDocument(id) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents/${id}`,
        method: 'DELETE'
    }, true, true, 'document');
}

function increaseNumberView(id) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents/${id}/increase-number-view`,
        method: 'PATCH',
    }, false, false, 'document');
}

function editDocument(id, data, option=undefined) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents/${id}`,
        method: 'PATCH',
        data,
        params: { option },
    }, true, true, 'document');
}

function downloadDocumentFile(id, numberVersion) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents/download-file/${id}/${numberVersion}`,
        method: 'GET',
        responseType: 'blob',
    }, false, true, 'document');
}

function downloadDocumentFileScan(id, numberVersion) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents/download-file-scan/${id}/${numberVersion}`,
        method: 'GET',
        responseType: 'blob',
    }, false, true, 'document');
}

function getDocumentCategories(params) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents/categories`,
        method: 'GET',
        params
    }, false, true, 'document');
}

function createDocumentCategory(data) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents/categories`,
        method: 'POST',
        data,
    }, true, true, 'document');
}

function editDocumentCategory(id, data) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents/categories/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'document');
}

function deleteDocumentCategory(id) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents/categories/${id}`,
        method: 'DELETE'
    }, true, true, 'document');
}

// Danh mục văn bản - domain
function getDocumentDomains() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents/domains`,
        method: 'GET',
    }, false, true, 'document');
}

function createDocumentDomain(data) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents/domains`,
        method: 'POST',
        data,
    }, true, true, 'document');
}

function editDocumentDomain(id, data) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents/domains/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'document');
}

function deleteDocumentDomain(id) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents/domains/${id}`,
        method: 'DELETE',
    }, true, true, 'document');
}

function deleteManyDocumentDomain(array) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents/domains/delete-many`,
        method: 'POST',
        data: {array}
    }, true, true, 'document');
}

function getDocumentsUserCanView(roleId, params) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents/permission-view/${roleId}`,
        method: 'GET',
        params,
    }, false, true, 'document');
}

function getUserDocumentStatistics(params) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents/user-statistical`,
        method: 'GET',
        params,
    }, false, true, 'document');
}

