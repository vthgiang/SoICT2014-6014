import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../config';

export const DepartmentServices = {
    get
};

function get() {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/department`,
        method: 'GET'
    };

    return axios(requestOptions);
}