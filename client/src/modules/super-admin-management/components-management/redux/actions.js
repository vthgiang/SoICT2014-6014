import { ComponentServices } from "./services";
import { ComponentConstants } from "./constants";
import { AlertActions } from '../../../alert/redux/actions';

export const ComponentActions = {
    get,
    getPaginate,
    edit,
    create,
    show,
    destroy
}


function get(){
    return dispatch => {
        dispatch({ type: ComponentConstants.GET_COMPONENTS_REQUEST});
        ComponentServices.get()
            .then(res => {
                dispatch({
                    type: ComponentConstants.GET_COMPONENTS_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err);
            })
    }
}

function getPaginate(data){
    return dispatch => {
        dispatch({ type: ComponentConstants.GET_COMPONENTS_PAGINATE_REQUEST});
        ComponentServices.getPaginate(data)
            .then(res => {
                dispatch({
                    type: ComponentConstants.GET_COMPONENTS_PAGINATE_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err);
            })
    }
}

function show(id){
    return dispatch => {
        dispatch({ type: ComponentConstants.SHOW_COMPONENT_REQUEST});
        ComponentServices.show(id)
            .then(res => {
                dispatch({
                    type: ComponentConstants.SHOW_COMPONENT_SUCCESS,
                    payload: res.data
                })
            })
            .catch(err => {
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err);
            })
    }
}

function create(component){
    return dispatch => {
        dispatch({ type: ComponentConstants.CREATE_COMPONENT_REQUEST});
        return new Promise((resolve, reject) => {
            ComponentServices.create(component)
            .then(res => {
                dispatch({
                    type: ComponentConstants.CREATE_COMPONENT_SUCCESS,
                    payload: res.data
                })
                resolve(res);
            })
            .catch(err => {
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err);
                reject(err);
            })
        })
        
    }
}

function edit(id, component){
    return dispatch => {
        dispatch({ type: ComponentConstants.EDIT_COMPONENT_REQUEST});
        return new Promise((resolve, reject) => {
            ComponentServices.edit(id, component)
            .then(res => {
                dispatch({
                    type: ComponentConstants.EDIT_COMPONENT_SUCCESS,
                    payload: res.data
                });
                resolve(res);
            })
            .catch(err => {
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err);
                reject(err);
            })
        })
    }
}

function destroy(id, component){
    return dispatch => {
        dispatch({ type: ComponentConstants.DELETE_COMPONENT_REQUEST});
        ComponentServices.destroy(id, component)
            .then(res => {
                dispatch({
                    type: ComponentConstants.DELETE_COMPONENT_SUCCESS,
                    payload: id
                })
            })
            .catch(err => {
                AlertActions.handleAlert(dispatch, err);
                console.log("Error: ", err);
            })
    }
}


