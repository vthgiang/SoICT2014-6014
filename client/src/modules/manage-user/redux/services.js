import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../config';

export const UserServices = {
    get
};

function get() {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/user`,
        method: 'GET'
    };

    return axios(requestOptions);
}