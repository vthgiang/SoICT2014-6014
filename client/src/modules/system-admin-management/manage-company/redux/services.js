import axios from 'axios';

export const companyServices = {
    get,
    create
};

function get() {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: 'http://localhost:8000/company',
        method: 'GET',
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}

function create(company) {
    const token = localStorage.getItem('token');
    const requestOptions = {
        url: 'http://localhost:8000/company',
        method: 'POST',
        data: company,
        headers: {'auth-token': token}
    };

    return axios(requestOptions);
}