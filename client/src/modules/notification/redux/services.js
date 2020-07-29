import { LOCAL_SERVER_API } from '../../../env';
import { sendRequest } from '../../../helpers/requestHelper';

export const NotificationServices = {
    getAllManualNotifications,
    paginateManualNotifications,
    getAllNotifications,
    paginateNotifications,
    create,
    readedNotification,
    deleteManualNotification,
    deleteNotification
};

function getAllManualNotifications() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/notifications/get`,
        method: 'GET',
    }, false, false, 'notification');
}

function paginateManualNotifications(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/notifications/paginate`,
        method: 'POST',
        data
    }, false, false, 'notification');
}

function getAllNotifications() {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/notifications/get-notifications`,
        method: 'GET',
    }, false, false, 'notification');
}

function paginateNotifications(data) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/notifications/paginate-notifications`,
        method: 'POST',
        data
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

function deleteManualNotification(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/notifications/delete-manual-notification/${id}`,
        method: 'DELETE',
    }, true, true, 'notification');
}

function deleteNotification(id) {
    return sendRequest({
        url: `${ LOCAL_SERVER_API }/notifications/delete-notification/${id}`,
        method: 'DELETE',
    }, true, true, 'notification');
}