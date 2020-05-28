import { LOCAL_SERVER_API } from '../../../env';
import { sendRequest } from '../../../helpers/requestHelper';

export const DocumentServices = {
    getDocuments,
    createDocument,
    editDocument,
    downloadDocumentFile,
    downloadDocumentFileScan,

    getDocumentCategories,
    createDocumentCategory,
    getDocumentDomains,
    createDocumentDomain
};

function getDocuments(data=undefined) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents`,
        method: 'GET',
        params: data !== undefined ? {page: data.page, limit: data.limit, query: data.query} : undefined,
    }, false, true, 'document');
}

function createDocument(data) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents`,
        method: 'POST',
        data,
    }, true, true, 'document');
}

function editDocument(id, data) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents/${id}`,
        method: 'PATCH',
        data,
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

function getDocumentCategories() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents/categories`,
        method: 'GET',
    }, false, true, 'document');
}

function createDocumentCategory(data) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents/categories`,
        method: 'POST',
        data,
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