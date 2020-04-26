import { NotificationServices } from "./services";
import { NotificationConstants } from "./constants";

export const NotificationActions = {
    get,
    getNotificationReceivered,
    getNotificationSent,
    create,
    deleteNotificationReceiverd,
    deleteNotificationSent
}

function get(){
    return dispatch => {
        dispatch({ type: NotificationConstants.GET_NOTIFICATIONS_REQUEST});
        NotificationServices
            .get()
            .then(res => {
                dispatch({
                    type: NotificationConstants.GET_NOTIFICATIONS_SUCCESS,
                    payload: res.data //danh sách các notification
                });
            })
            .catch(err => {
            })
    }
}

function getNotificationReceivered(){
    return dispatch => {
        dispatch({ type: NotificationConstants.GET_NOTIFICATIONS_RECEIVERED_REQUEST});
        NotificationServices
            .getNotificationReceivered()
            .then(res => {
                dispatch({
                    type: NotificationConstants.GET_NOTIFICATIONS_RECEIVERED_SUCCESS,
                    payload: res.data //danh sách các notification
                });
            })
            .catch(err => {
            })
    }
}

function getNotificationSent(){
    return dispatch => {
        dispatch({ type: NotificationConstants.GET_NOTIFICATIONS_SENT_REQUEST});
        NotificationServices
            .getNotificationSent()
            .then(res => {
                dispatch({
                    type: NotificationConstants.GET_NOTIFICATIONS_SENT_SUCCESS,
                    payload: res.data //danh sách các notification
                });
            })
            .catch(err => {
            })
    }
}

function create(data){
    return dispatch => {
        dispatch({ type: NotificationConstants.CREATE_NOTIFICATION_REQUEST});
        NotificationServices
            .create(data)
            .then(res => {
                dispatch({
                    type: NotificationConstants.CREATE_NOTIFICATION_SUCCESS,
                    payload: res.data
                });
            })
            .catch(err => {
            })
    }
}

function deleteNotificationReceiverd(notificationId){
    return dispatch => {
        dispatch({ type: NotificationConstants.DELETE_NOTIFICATION_RECEIVERED_REQUEST});
        NotificationServices
            .deleteNotificationReceiverd(notificationId)
            .then(res => {
                dispatch({
                    type: NotificationConstants.DELETE_NOTIFICATION_RECEIVERED_SUCCESS,
                    payload: notificationId
                });
            })
            .catch(err => {
                dispatch({ type: NotificationConstants.DELETE_NOTIFICATION_RECEIVERED_FAILE});
            })
    }
}

function deleteNotificationSent(id){
    return dispatch => {
        dispatch({ type: NotificationConstants.DELETE_NOTIFICATION_SENT_REQUEST});
        NotificationServices
            .deleteNotificationSent(id)
            .then(res => {
                dispatch({
                    type: NotificationConstants.DELETE_NOTIFICATION_SENT_SUCCESS,
                    payload: id
                });
            })
            .catch(err => {
                dispatch({ type: NotificationConstants.DELETE_NOTIFICATION_SENT_FAILE});
            })
    }
}