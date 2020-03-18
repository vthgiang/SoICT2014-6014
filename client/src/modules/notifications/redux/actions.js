import { NotificationServices } from "./services";
import { NotificationConstants } from "./constants";
import { AlertActions } from '../../alert/redux/actions';

export const NotificationActions = {
    get,
    getNotificationReceivered,
    getNotificationSent,
    create
}

function get(){
    return dispatch => {
        dispatch({ type: NotificationConstants.GET_NOTIFICATIONS_REQUEST});
        return new Promise((resolve, reject) => {
            NotificationServices
                .get()
                .then(res => {
                    dispatch({
                        type: NotificationConstants.GET_NOTIFICATIONS_SUCCESS,
                        payload: res.data //danh sách các notification
                    });
                    resolve(res.data);
                })
                .catch(err => {
                    AlertActions.handleAlert(dispatch, err);
                    console.log("Error: ", err);
                    reject(err);
                })
        })
    }
}

function getNotificationReceivered(){
    return dispatch => {
        dispatch({ type: NotificationConstants.GET_NOTIFICATIONS_RECEIVERED_REQUEST});
        return new Promise((resolve, reject) => {
            NotificationServices
                .getNotificationReceivered()
                .then(res => {
                    dispatch({
                        type: NotificationConstants.GET_NOTIFICATIONS_RECEIVERED_SUCCESS,
                        payload: res.data //danh sách các notification
                    });
                    resolve(res.data);
                })
                .catch(err => {
                    AlertActions.handleAlert(dispatch, err);
                    console.log("Error: ", err);
                    reject(err);
                })
        })
    }
}

function getNotificationSent(){
    return dispatch => {
        dispatch({ type: NotificationConstants.GET_NOTIFICATIONS_SENT_REQUEST});
        return new Promise((resolve, reject) => {
            NotificationServices
                .getNotificationSent()
                .then(res => {
                    dispatch({
                        type: NotificationConstants.GET_NOTIFICATIONS_SENT_SUCCESS,
                        payload: res.data //danh sách các notification
                    });
                    resolve(res.data);
                })
                .catch(err => {
                    AlertActions.handleAlert(dispatch, err);
                    console.log("Error: ", err);
                    reject(err);
                })
        })
    }
}

function create(data){
    return dispatch => {
        dispatch({ type: NotificationConstants.CREATE_NOTIFICATION_REQUEST});
        return new Promise((resolve, reject) => {
            NotificationServices
                .create(data)
                .then(res => {
                    dispatch({
                        type: NotificationConstants.CREATE_NOTIFICATION_SUCCESS,
                        payload: res.data
                    });
                    resolve(res.data);
                })
                .catch(err => {
                    AlertActions.handleAlert(dispatch, err);
                    console.log("Error: ", err);
                    reject(err);
                })
        })
    }
}