import { LOCAL_SERVER_API } from '../../../../env';
import { sendRequest } from '../../../../helpers/requestHelper';

export const CompanyServices = {
    get,
    getPaginate,
    create,
    edit,
    addNewLink,
    deleteLink,    
    addNewComponent,
    deleteComponent,
    linksList,
    linksPaginate,
    componentsList,
    componentsPaginate,

    getImportConfiguration,
    createImportConfiguration,
    editImportConfiguration,
};

function get() {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company`,
        method: 'GET',
    }, false, true, 'system_admin.company');
}

function getPaginate(data) {  
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/company/paginate`,
        method: 'POST',
        data,
    }, false, true, 'system_admin.company');
}

function create(company) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company`,
        method: 'POST',
        data: company,
    }, true, true, 'system_admin.company');
}


function edit(id, data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company/${id}`,
        method: 'PATCH',
        data,
    }, true, true, 'system_admin.company');
}

function addNewLink(id, data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company/${id}/add-new-link`,
        method: 'POST',
        data,
    }, true, true, 'system_admin.company');
}

function deleteLink(companyId, linkId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company/${companyId}/delete-link/${linkId}`,
        method: 'DELETE',
    }, true, true, 'system_admin.company');
}

function addNewComponent(id, data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company/${id}/add-new-component`,
        method: 'POST',
        data,
    }, true, true, 'system_admin.company');
}

function deleteComponent(companyId, componentId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company/${companyId}/delete-component/${componentId}`,
        method: 'DELETE',
    }, true, true, 'system_admin.company');
}

function linksList(companyId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company/${companyId}/links-list`,
        method: 'GET',
    }, false, true, 'system_admin.company');
}

function linksPaginate(companyId, page, limit, data={}) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company/${companyId}/links-paginate/${page}/${limit}`,
        method: 'POST',
        data,
    }, false, true, 'system_admin.company');
}

function componentsList(companyId) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company/${companyId}/components-list`,
        method: 'GET',
    }, false, true, 'system_admin.company');
}

function componentsPaginate(companyId, page, limit, data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company/${companyId}/components-paginate/${page}/${limit}`,
        method: 'POST',
        data,
    }, false, true, 'system_admin.company');
}

function getImportConfiguration(data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company/import-file/${data.type}`,
        method: 'GET',
    }, false, false, 'system_admin.company');
}

function createImportConfiguration(data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company/import-file/`,
        method: 'POST',
        data,
    }, true, true, 'system_admin.company');
}

function editImportConfiguration(data) {
    return sendRequest({
        url: `${LOCAL_SERVER_API}/company/import-file/${data.id}`,
        method: 'PATCH',
        data,
    }, true, true, 'system_admin.company');
}