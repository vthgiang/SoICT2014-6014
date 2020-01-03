import { UserServices } from "./services";
import { UserConstants } from "./constants";
import { IntlActions } from "react-redux-multilingual";

export const get = () => {
    return dispatch => {
        dispatch({ type: UserConstants.GET_USERS_REQUEST});
        UserServices.get()
        .then(res => {
            dispatch({
                type: UserConstants.GET_USERS_SUCCESS,
                payload: res.data
            })
        })
        .catch(err => {
            console.log("Error: ", err.response);
        })
    }
}

export const edit = (data) => {
    return dispatch => {
        dispatch({ type: UserConstants.EDIT_USER_REQUEST});
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
        dispatch({ type: UserConstants.CREATE_USER_REQUEST});
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
        dispatch({ type: UserConstants.DELETE_USER_REQUEST});
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

export const searchByName = (name) => {
    return dispatch => {
        dispatch({ type: UserConstants.SEARCH_USER_BY_NAME_REQUEST});
        UserServices.searchByName(name)
            .then(res => {
                dispatch({
                    type: UserConstants.SEARCH_USER_BY_NAME_SUCCESS,
                    payload: action.payload
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}