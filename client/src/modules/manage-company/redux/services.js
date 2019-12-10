import axios from 'axios';

export const companyServices = {
    get,
    create
};

function get() {
    const requestOptions = {
        url: 'http://localhost:8000/company',
        method: 'GET'
    };

    return axios(requestOptions);
}

function create(company) {
    const requestOptions = {
        url: 'http://localhost:8000/company',
        method: 'POST',
        data: company
    };

    return axios(requestOptions);
}