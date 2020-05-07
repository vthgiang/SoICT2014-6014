import { NotificationServices } from "./services";
import { NotificationConstants } from "./constants";

export const NotificationActions = {
    getAllManualNotifications,
    getAllNotifications,
    create,
    readedNotification
}

function getAllManualNotifications(){
    return dispatch => {
        dispatch({ type: NotificationConstants.GET_MANUAL_NOTIFICATIONS_REQUEST});
        NotificationServices
            .getAllManualNotifications()
            .then(res => {
                dispatch({
                    type: NotificationConstants.GET_MANUAL_NOTIFICATIONS_SUCCESS,
                    payload: res.data.content //danh sách các notification
                });
            })
            .catch(err => {
                dispatch({ type: NotificationConstants.GET_MANUAL_NOTIFICATIONS_FAILE});
            })
    }
}

function getAllNotifications(){
    return dispatch => {
        dispatch({ type: NotificationConstants.GET_NOTIFICATIONS_REQUEST});
        NotificationServices
            .getAllNotifications()
            .then(res => {
                dispatch({
                    type: NotificationConstants.GET_NOTIFICATIONS_SUCCESS,
                    payload: res.data.content //danh sách các notification
                });
            })
            .catch(err => {
                dispatch({ type: NotificationConstants.GET_NOTIFICATIONS_FAILE});
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
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ type: NotificationConstants.CREATE_NOTIFICATION_FAILE});
            })
    }
}

function readedNotification(id){
    return dispatch => {
        dispatch({ type: NotificationConstants.READED_NOTIFICATION_REQUEST});
        NotificationServices
            .readedNotification(id)
            .then(res => {
                dispatch({
                    type: NotificationConstants.READED_NOTIFICATION_SUCCESS,
                    payload: res.data.content
                });
            })
            .catch(err => {
                dispatch({ type: NotificationConstants.READED_NOTIFICATION_FAILE});
            })
    }
}