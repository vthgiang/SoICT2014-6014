import { RoleServices } from "./services";
import { RoleConstants } from "./constants";

export const get = () => {
    return dispatch => {
        dispatch({ type: RoleConstants.GET_ROLES_REQUEST});
        RoleServices.get()
            .then(res => {
                dispatch({
                    type: RoleConstants.GET_ROLES_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

export const show = (id) => {
    return dispatch => {
        dispatch({ type: RoleConstants.SHOW_ROLE_REQUEST});
        RoleServices.show(id)
            .then(res => {
                dispatch({
                    type: RoleConstants.SHOW_ROLE_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

export const create = (role) => {
    return dispatch => {
        dispatch({ type: RoleConstants.CREATE_ROLE_REQUEST});
        RoleServices.create(role)
            .then(res => {
                dispatch({
                    type: RoleConstants.CREATE_ROLE_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

export const edit = (role) => {
    return dispatch => {
        dispatch({ type: RoleConstants.EDIT_ROLE_REQUEST});
        RoleServices.edit(role)
            .then(res => {
                dispatch({
                    type: RoleConstants.EDIT_ROLE_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}

export const destroy = (roleId) => {
    return dispatch => {
        dispatch({ type: RoleConstants.DELETE_ROLE_REQUEST});
        RoleServices.destroy(roleId)
            .then(res => {
                dispatch({
                    type: RoleConstants.DELETE_ROLE_SUCCESS,
                    payload: roleId
                })
            })
            .catch(err => {
                console.log("Error: ", err);
            })
    }
}