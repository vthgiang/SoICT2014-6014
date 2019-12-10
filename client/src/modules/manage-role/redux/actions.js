import { RoleServices } from "./services";
import { RoleConstants } from "./constants";

export const get = () => {
    return dispatch => {
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