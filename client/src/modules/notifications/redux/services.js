import axios from 'axios';
import { LOCAL_SERVER_API } from '../../../env';
import { AuthenticateHeader,getStorage } from '../../../config';

export const NotificationServices = {
    get,
    getNotificationReceivered,
    getNotificationSent,
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

function getNotificationReceivered(userId) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/notificatio/receivered/${userId}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function getNotificationSent(userId) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/notification/sent/${userId}`,
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