import { LOCAL_SERVER_API } from '../../../env';
import { sendRequest } from '../../../helpers/requestHelper';

export const DocumentServices = {
    getDocuments,
    createDocument,
    getDocumentCategories,
    createDocumentCategory,
    getDocumentDomains,
    createDocumentDomain
};

function getDocuments() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents`,
        method: 'GET',
    }, false, true, 'document');
}

function createDocument(data) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/documents`,
        method: 'POST',
        data,
    }, true, true, 'document');
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