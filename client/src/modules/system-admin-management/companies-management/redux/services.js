import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../env';
import { AuthenticateHeader } from '../../../../config';

export const CompanyServices = {
    get,
    getPaginate,
    create,
    edit,
    addNewLink,
    deleteLink,
    linksList,
    linksPaginate,
    componentsList,
    componentsPaginate
};

function get() {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/company`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function getPaginate(data) {  
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/company/paginate`,
        method: 'POST',
        data,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function create(company) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/company`,
        method: 'POST',
        data: company,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}


function edit(id, data) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/company/${id}`,
        method: 'PATCH',
        data,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function addNewLink(id, data) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/company/${id}/add-new-link`,
        method: 'POST',
        data,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function deleteLink(companyId, linkId) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/company/${companyId}/delete-link/${linkId}`,
        method: 'DELETE',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function linksList(companyId) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/company/${companyId}/links-list`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function linksPaginate(companyId, page, limit, data={}) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/company/${companyId}/links-paginate/${page}/${limit}`,
        method: 'POST',
        data,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function componentsList(companyId) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/company/${companyId}/components-list`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function componentsPaginate(companyId, page, limit, data) {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/company/${companyId}/components-paginate/${page}/${limit}`,
        method: 'POST',
        data,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}