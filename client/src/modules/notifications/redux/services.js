import axios from 'axios';
import { LOCAL_SERVER_API, TOKEN_SECRET } from '../../../env';
import { AuthenticateHeader,getStorage } from '../../../config';
import jwt from 'jsonwebtoken';

export const NotificationServices = {
    get,
    getNotificationReceivered,
    getNotificationSent,
    create
};

function get() {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/notifications`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function getNotificationReceivered() {
    const token = getStorage();
    const verified = jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;

    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/notifications/receivered/${id}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function getNotificationSent() {
    const token = getStorage();
    const verified = jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;

    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/notifications/sent/${id}`,
        method: 'GET',
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}

function create(data) {
    const requestOptions = {
        url: `${ LOCAL_SERVER_API }/notifications`,
        method: 'POST',
        data,
        headers: AuthenticateHeader()
    };

    return axios(requestOptions);
}