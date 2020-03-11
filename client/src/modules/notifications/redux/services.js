import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../env';
import { AuthenticateHeader,getStorage } from '../../../config';

export const NotificationServices = {
    get,
    create
};

function get() {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/notification`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function create(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/notification`,
        method: 'POST',
        data,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}