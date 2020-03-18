import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../../env';
import { AuthenticateHeader } from '../../../../config';

export const CompanyServices = {
    get,
    getPaginate,
    create,
    edit
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