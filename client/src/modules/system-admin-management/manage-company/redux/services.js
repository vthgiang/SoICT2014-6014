import axios from 'axios';
import { LOCAL_SERVER_API, AuthenticateHeader } from '../../../../config';

export const companyServices = {
    get,
    create
};

function get() {
    const requestOptions = {
        url: `${LOCAL_SERVER_API}/company`,
        method: 'GET',
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