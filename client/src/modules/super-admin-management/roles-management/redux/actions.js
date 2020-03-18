import { RoleServices } from "./services";
import { RoleConstants } from "./constants";
import { AlertActions } from "../../../alert/redux/actions";

export const RoleActions = {
    get,
    getPaginate,
    edit,
    create,
    show,
    destroy
}

function get(){
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
                AlertActions.handleAlert(dispatch, err);
            })
    }
}

function getPaginate(data){
    return dispatch => {
        dispatch({ type: RoleConstants.GET_ROLES_PAGINATE_REQUEST});
        RoleServices.getPaginate(data)
            .then(res => {
                dispatch({
                    type: RoleConstants.GET_ROLES_PAGINATE_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                console.log("Error: ", err);
                AlertActions.handleAlert(dispatch, err);
            })
    }
}

function show(id){
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
                AlertActions.handleAlert(dispatch, err);
            })
    }
}

function create(role){
    return dispatch => {
        dispatch({ type: RoleConstants.CREATE_ROLE_REQUEST});
        return new Promise((resolve, reject) => {
            RoleServices
                .create(role)
                .then(res => {
                    dispatch({
                        type: RoleConstants.CREATE_ROLE_SUCCESS,
                        payload: res.data
                    });
                    resolve(res.data);
                })
                .catch(err => {
                    console.log("Error: ", err);
                    AlertActions.handleAlert(dispatch, err);
                    reject(err);
                })
        })
    }
}

function edit(role){
    return dispatch => {
        dispatch({ type: RoleConstants.EDIT_ROLE_REQUEST});
        return new Promise((resolve, reject) => {
            RoleServices.edit(role)
            .then(res => {
                dispatch({
                    type: RoleConstants.EDIT_ROLE_SUCCESS,
                    payload: res.data
                });
                resolve(res.data);
            })
            .catch(err => {
                console.log("Error: ", err);
                AlertActions.handleAlert(dispatch, err);
                reject(err);
            })
        })
    }
}

function destroy(roleId){
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
                AlertActions.handleAlert(dispatch, err);
            })
    }
}
