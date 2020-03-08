import { NotificationServices } from "./services";
import { NotificationConstants } from "./constants";

export const NotificationActions = {
    get,
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
                    console.log("Error: ", err);
                    reject(err);
                })
        })
    }
}