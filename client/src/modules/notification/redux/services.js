import { LOCAL_SERVER_API, TOKEN_SECRET } from '../../../env';
import { getStorage } from '../../../config';
import jwt from 'jsonwebtoken';
import { sendRequest } from '../../../helpers/requestHelper';

export const NotificationServices = {
    getAllManualNotifications,
    getAllNotifications,
    create,
    readedNotification
};

function getAllManualNotifications() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/notifications/get`,
        method: 'GET',
    }, false, false, 'notification');
}

function getAllNotifications() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/notifications/get-notifications`,
        method: 'GET',
    }, false, false, 'notification');
}

function create(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/notifications/create`,
        method: 'POST',
        data,
    }, true, true, 'notification');
}

function readedNotification(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/notifications/readed/${id}`,
        method: 'PATCH',
    }, false, false, 'notification');
}