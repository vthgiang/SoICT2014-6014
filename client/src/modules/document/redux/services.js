import { LOCAL_SERVER_API } from '../../../env';
import { sendRequest } from '../../../helpers/requestHelper';

export const DocumentServices = {
    getDocumentCategories,
    createDocumentCategory,
    getDocumentDomains,
    createDocumentDomain
};

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
    }, false, true, 'document');
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
    }, false, true, 'document');
}