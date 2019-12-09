import axios from 'axios';

export const companyServices = {
    get
};

function get() {
    const requestOptions = {
        url: 'http://localhost:8000/company',
        method: 'GET'
    };

    return axios(requestOptions);
}