import axios from 'axios';
import { LOCAL_SERVER_API, TOKEN_SECRET } from '../../../env';
import { getStorage } from '../../../config';
import jwt from 'jsonwebtoken';
import { sendRequest } from '../../../helpers/requestHelper';

export const NotificationServices = {
    get,
    getNotificationReceivered,
    getNotificationSent,
    create,
    deleteNotificationReceivered,
    deleteNotificationSent
};

function get() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/notifications`,
        method: 'GET',
    }, false, 'notification');
}

function getNotificationReceivered() {
    const token = getStorage();
    const verified = jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;

    return sendRequest({
        url: `${ LOCAL_SERVER_API }/notifications/receivered/${id}`,
        method: 'GET',
    }, false, 'notification');
}

function getNotificationSent() {
    const token = getStorage();
    const verified = jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;

    return sendRequest({
        url: `${ LOCAL_SERVER_API }/notifications/sent/${id}`,
        method: 'GET',
    }, false, 'notification');
}

function create(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/notifications`,
        method: 'POST',
        data,
    }, true, 'notification');
}

function deleteNotificationReceivered(notificationId) {
    const token = getStorage();
    const verified = jwt.verify(token, TOKEN_SECRET);
    var userId = verified._id;

    return sendRequest({
        url: `${ LOCAL_SERVER_API }/notifications/receivered/${userId}/${notificationId}`,
        method: 'DELETE',
    }, true, 'notification');
}

function deleteNotificationSent(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/notifications/sent/${id}`,
        method: 'DELETE',
    }, true, 'notification');
}