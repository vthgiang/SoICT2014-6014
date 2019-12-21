import { UserServices } from "./services";
import { UserConstants } from "./constants";

export const get = () => {
    return dispatch => {
        UserServices.get()
            .then(res => {
                dispatch({
                    type: UserConstants.GET_USERS_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

export const edit = (data) => {
    return dispatch => {
        UserServices.edit(data)
            .then(res => {
                dispatch({
                    type: UserConstants.EDIT_USER_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

export const create = (data) => {
    return dispatch => {
        UserServices.create(data)
            .then(res => {
                dispatch({
                    type: UserConstants.CREATE_USER_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

export const destroy = (id) => {
    return dispatch => {
        UserServices.destroy(id)
            .then(res => {
                dispatch({
                    type: UserConstants.DELETE_USER_SUCCESS,
                    payload: id
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}