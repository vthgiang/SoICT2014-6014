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

    getDocumentArchives,
    createDocumentArchives,
    editDocumentArchives,
    deleteDocumentArchives,
    deleteManyDocumentArchives,
};

function getDocuments(params) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/documents`,
        method: 'GET',
        params,
    }, false, true, 'document');
}

function createDocument(data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/documents`,
        method: 'POST',
        data,
    }, true, true, 'document');
}

function deleteDocument(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/documents/${id}`,
        method: 'DELETE'
    }, true, true, 'document');
}

function increaseNumberView(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/documents/${id}/increase-number-view`,
        method: 'PATCH',
    }, false, false, 'document');
}

function editDocument(id, data, option = undefined) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/documents/${id}`,
        method: 'PATCH',
        data,
        params: { option },
    }, true, true, 'document');
}

function downloadDocumentFile(id, numberVersion) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/documents/${id}/download-file`,
        method: 'GET',
        responseType: 'blob',
        params: {
            numberVersion: numberVersion
        }
    }, false, true, 'document');
}

function downloadDocumentFileScan(id, numberVersion) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/documents/${id}/download-file-scan`,
        method: 'GET',
        responseType: 'blob',
        params: {
            numberVersion: numberVersion
        }
    }, false, true, 'document');
}

function getDocumentCategories(params) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/document-categories`,
        method: 'GET',
        params
    }, false, true, 'document');
}

function createDocumentCategory(data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/document-categories`,
        method: 'POST',
        data,
    }, true, true, 'document');
}

function editDocumentCategory(id, data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/document-categories/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'document');
}

function deleteDocumentCategory(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/document-categories/${id}`,
        method: 'DELETE'
    }, true, true, 'document');
}

// Danh mục văn bản - domain
function getDocumentDomains() {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/document-domains`,
        method: 'GET',
    }, false, true, 'document');
}

function createDocumentDomain(data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/document-domains`,
        method: 'POST',
        data,
    }, true, true, 'document');
}

function editDocumentDomain(id, data) {

    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/document-domains/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'document');
}

function deleteDocumentDomain(id) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/document-domains/${id}`,
        method: 'DELETE',
    }, true, true, 'document');
}

function deleteManyDocumentDomain(array) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/document-domains/delete-many`,
        method: 'POST',
        data: { array }
    }, true, true, 'document');
}

function getDocumentsUserCanView(roleId, params) {
    console.log('ttt', params)
    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/documents/permission-view`,
        method: 'GET',
        params: {
            ...params,
            roleId: roleId,
        },
    }, false, true, 'document');
}

function getUserDocumentStatistics(params) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/documents/user-statistical`,
        method: 'GET',
        params,
    }, false, true, 'document');
}

// Lưu trữ
function getDocumentArchives() {

    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/document-archives`,
        method: 'GET',
    }, false, false, 'document')
};

function createDocumentArchives(data) {

    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/document-archives`,
        method: 'POST',
        data,
    }, true, true, 'document');
}

function editDocumentArchives(id, data) {

    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/document-archives/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'document');
}

function deleteDocumentArchives(id) {

    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/document-archives/${id}`,
        method: 'DELETE',
    }, true, true, 'document');
}

function deleteManyDocumentArchives(array) {

    return sendRequest({
        url: `${LOCAL_SERVER_API}/documents/document-archives/delete-many`,
        method: 'POST',
        data: { array }
    }, true, true, 'document');
}
