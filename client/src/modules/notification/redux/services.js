import axios from 'axios';
import { LOCAL_SERVER_API, TOKEN_SECRET } from '../../../env';
import { getStorage } from '../../../config';
import jwt from 'jsonwebtoken';
import { sendRequest } from '../../../helpers/requestHelper';

export const NotificationServices = {
    getNotificationReceivered,
    getNotificationSent,
    create,
    deleteNotificationReceivered,
    deleteNotificationSent
};

function getNotificationReceivered() {
    const token = getStorage();
    const verified = jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;

    return sendRequest({
        url: `${ LOCAL_SERVER_API }/notifications/receivered/${id}`,
        method: 'GET',
    }, false, true, 'notification');
}

function getNotificationSent() {
    const token = getStorage();
    const verified = jwt.verify(token, TOKEN_SECRET);
    var id = verified._id;

    return sendRequest({
        url: `${ LOCAL_SERVER_API }/notifications/sent/${id}`,
        method: 'GET',
    }, false, true, 'notification');
}

function create(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/notifications`,
        method: 'POST',
        data,
    }, true, true, 'notification');
}

function deleteNotificationReceivered(notificationId) {
    const token = getStorage();
    const verified = jwt.verify(token, TOKEN_SECRET);
    var userId = verified._id;

    return sendRequest({
        url: `${ LOCAL_SERVER_API }/notifications/receivered/${userId}/${notificationId}`,
        method: 'DELETE',
    }, true, true, 'notification');
}

function deleteNotificationSent(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/notifications/sent/${id}`,
        method: 'DELETE',
    }, true, true, 'notification');
}